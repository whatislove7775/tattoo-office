import express from "express";
import {chromium} from '@playwright/test';import assert from 'node:assert/strict';import {mkdir} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {database} from '../server/db.js';import {createApp} from '../server/index.js';
process.env.DATA_DIR='memory://';process.env.NODE_ENV='test';delete process.env.DATABASE_URL;delete process.env.ADMIN_EMAIL;delete process.env.ADMIN_PASSWORD;
const db=await database(),app=await createApp(db),site=express();site.use((req,res,next)=>req.path.startsWith('/api/')?app(req,res,next):next());site.use(express.static('dist'));const server=site.listen(0,'127.0.0.1');await new Promise(r=>server.on('listening',r));
const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({channel:process.env.CI?undefined:'chrome',headless:true});
const output=join(tmpdir(),'tattoo-foundation-qa');await mkdir(output,{recursive:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().includes('/api/'))console.log('API failure',r.status(),r.url());});page.setDefaultTimeout(10000);
try{
  await page.goto(base+'/#/masters');await page.locator('.polaroid__img').first().waitFor();
  for(const width of [320,390,1440]) {
    await page.setViewportSize({width,height:900});await page.waitForTimeout(150);
    const cookie=page.locator('#cookieNotice');await cookie.waitFor({state:'visible'});
    const geometry=await cookie.evaluate(el=>{const r=el.getBoundingClientRect(),slider=document.querySelector('#rentSlider').getBoundingClientRect();return {center:r.x+r.width/2,left:r.left,right:r.right,bottom:r.bottom,sliderTop:slider.top};});
    assert.ok(Math.abs(geometry.center-width/2)<1);assert.ok(geometry.left>=0&&geometry.right<=width);
    if(width<=700)assert.ok(geometry.sliderTop-geometry.bottom>=13,'Cookie notice must sit above slider');
    for(const theme of ['light','dark']) {
      await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);await page.waitForTimeout(400);
      const textColor=await page.locator('#cookieNotice a').evaluate(a=>getComputedStyle(a).color);assert.equal(textColor,theme==='light'?'rgb(23, 23, 23)':'rgb(243, 243, 243)');
      await page.screenshot({path:`${output}/cookies-${width}-${theme}.png`});
    }
  }
  await page.evaluate(()=>document.documentElement.dataset.theme='light');
  const people=await page.locator('.ranking-users-path').getAttribute('d');await page.locator('.ranking-launch').hover();
  await page.waitForFunction(async()=>{const {canonicalD}=await import('/js/vendor/morphicons/dom.js');return document.querySelector('.ranking-users-path').getAttribute('d')===canonicalD('M5 12h14M12 5l7 7-7 7');});
  await page.mouse.move(700,300);await page.waitForFunction(d=>document.querySelector('.ranking-users-path').getAttribute('d')===d,people);
  await page.locator('#cookieNotice a').click();await page.waitForURL('**/#/legal/privacy');await page.locator('.prose').waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('to.cookieConsent')),null,'Opening policy must not accept cookies');
  const second=await context.newPage();await second.goto(base+'/#/masters');await second.locator('#cookieNotice').waitFor({state:'visible'});
  await page.locator('#cookieAccept').focus();await page.keyboard.press('Enter');
  await page.locator('#cookieNotice').waitFor({state:'hidden'});await second.locator('#cookieNotice').waitFor({state:'hidden'});await second.close();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('to.cookieConsent')).accepted),true);
  await page.reload();await page.locator('.prose').waitFor();assert.equal(await page.locator('#cookieNotice').isVisible(),false,'Consent must survive reload');
  await page.goto(base+'/#/signup/master');await page.locator('#auth-form').waitFor();
  await page.locator('[name=name]').fill('Тестовый Мастер');await page.locator('[name=email]').fill('ui-master@test.invalid');await page.locator('[name=password]').fill('Only-test-password-2026');await page.locator('[name=rules]').check();await page.locator('[name=consent]').check();await page.locator('#auth-form button[type=submit]').click();
  await page.waitForURL('**/#/cabinet');await page.locator('[data-cabtab=profile]').click();await page.locator('#profile-form').waitFor();
  await page.locator('#profile-form [name=city]').selectOption('СПБ',{force:true});await page.locator('#profile-form [name=birthDate]').fill((new Date().getUTCFullYear()-30)+'-01-01');await page.locator('#profile-form [name=experience]').fill('8 лет');await page.locator('#profile-form [name=bio]').fill('Описание из личного кабинета.');assert.equal(await page.locator('#profile-form [name=bookingLink],#profile-form [name=accent]').count(),0);const avatarChooser=await Promise.all([page.waitForEvent('filechooser'),page.locator('#avatar-choose').click()]);await avatarChooser[0].setFiles('assets/interior/4.jpg');await page.waitForFunction(()=>document.querySelector('#profile-form [name=avatar]').value.startsWith('data:image/jpeg'));await Promise.all([page.waitForResponse(r=>r.url().endsWith('/api/me')&&r.request().method()==='PATCH'),page.locator('#profile-form button[type=submit]').click()]);await page.waitForFunction(()=>document.querySelector('#notice').textContent==='Личное дело сохранено');
  assert.equal(await page.locator('#profile-gallery').count(),0,'Portfolio must not appear in personal details');
  const radius=await page.locator('#stage').evaluate(el=>getComputedStyle(el).borderTopRightRadius);await page.keyboard.press('Tab');await page.locator('#stage').focus();assert.equal(await page.locator('#stage').evaluate(el=>getComputedStyle(el).borderTopRightRadius),radius,'Focus must preserve panel corners');assert.ok(parseFloat(radius)>15);
  await page.locator('[data-cabtab=portfolio]').click();
  await page.locator('#gallery-files').waitFor({state:'attached'});const galleryChooser=await Promise.all([page.waitForEvent('filechooser'),page.locator('#gallery-choose').click()]);await galleryChooser[0].setFiles('assets/interior/4.jpg');await page.locator('.gallery-item').waitFor();
  await page.locator('[data-caption]').fill('Моя первая работа');await Promise.all([page.waitForResponse(r=>r.url().endsWith('/api/me/gallery')&&r.request().method()==='PATCH'),page.locator('#gallery-save').click()]);
  for(const [width,height] of [[390,844],[768,1024],[1440,1000]]) {
    await page.setViewportSize({width,height});await page.locator('[data-cabtab=profile]').click();await page.locator('#avatar-choose').waitFor();assert.match(await page.locator('.personal-ranking').innerText(),/Ваш рейтинг: 2 балла/);await page.screenshot({path:`${output}/profile-editor-${width}.png`});
    await page.locator('[data-cabtab=portfolio]').click();await page.locator('#gallery-choose').waitFor();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'Cabinet must fit screen');await page.screenshot({path:`${output}/portfolio-editor-${width}.png`});
  }
  const me=(await (await context.request.get(base+'/api/me')).json()).user;
  await page.goto(base+'/#/master/'+me.id);await page.locator('.master__name').waitFor();assert.match(await page.locator('.master__name').innerText(),/Тестовый Мастер/);assert.equal(await page.locator('.master-profile__action').count(),0,'Nonresident profile must have no booking action');assert.equal(await page.locator('.work').count(),1);await page.locator('.work').click();await page.locator('.photo-viewer').waitFor({state:'visible'}).catch(()=>{});await page.keyboard.press('Escape');
  await page.goto(base+'/#/ranking');await page.locator('#ranking-search').waitFor();await page.locator('#ranking-search').fill('Тестовый');assert.equal(await page.locator('[data-ranking-name]:visible').count(),1);assert.equal(await page.locator('[data-ranking-name]:visible .ranking-sessions').innerText(),'2\nбалла');assert.equal(await page.locator('.ranking-rules').count(),0);assert.equal(await page.locator('.ranking-crown linearGradient').count(),0);
  for(const [width,height] of [[390,844],[768,1024],[1024,768],[1366,1024],[1440,1000]]){
    await page.setViewportSize({width,height});await page.goto(base+'/#/ranking');await page.locator('#ranking-search').waitFor();await page.locator('#ranking-search').fill('');await page.locator('.ranking-row:visible').first().waitFor();
    const geometry=await page.evaluate(()=>{const back=document.querySelector('.window-head .back').getBoundingClientRect(),panel=document.querySelector('#stage').getBoundingClientRect();return {wide:document.documentElement.scrollWidth>innerWidth+1,backFits:back.right<=panel.right+1&&back.left>=panel.left-1,backClickable:!!document.elementFromPoint(back.x+back.width/2,back.y+back.height/2)?.closest('.back')};});assert.equal(geometry.wide,false,`Horizontal overflow at ${width}`);assert.equal(geometry.backFits,true,`Back outside panel at ${width}`);assert.equal(geometry.backClickable,true,`Back is obscured at ${width}`);
    await page.screenshot({path:`${output}/ranking-${width}.png`});
    for(const route of ['masters','master/mr-a']) {
      await page.goto(base+'/#/'+route);await page.locator(route==='masters'?'.polaroid__img':'.master__photo').first().waitFor();
      const stretched=await page.locator('.polaroid__img,.master__photo,.work__img').evaluateAll(images=>images.some(im=>{const r=im.getBoundingClientRect();return r.width>0&&r.height/r.width>1.6;}));
      assert.equal(stretched,false,`Stretched photo at ${width} on ${route}`);
      await page.screenshot({path:`${output}/${route.replace('/','-')}-${width}.png`});
    }
  }
  await page.goto(base+'/#/masters');await page.locator('.polaroid__img').first().waitFor();assert.equal(await page.locator(`.polaroid[data-id="${me.id}"]`).count(),0,'Guest with an avatar must not appear on resident homepage');assert.ok(await page.locator('.polaroid__img').first().evaluate(im=>im.getBoundingClientRect().height/im.getBoundingClientRect().width<1.6),'Homepage photo must retain card proportions');
  await page.setViewportSize({width:390,height:844});await page.goto(base+'/#/masters');await page.locator('#siteHeader>.ranking-launch').waitFor();
  const dock=await page.locator('#siteHeader>.ranking-launch').evaluate(el=>{const r=el.getBoundingClientRect(),header=document.querySelector('#siteHeader').getBoundingClientRect();return {top:r.top-header.top,bottom:r.bottom-header.top,right:r.right,clickable:!!document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('.ranking-launch')};});
  assert.ok(dock.top>=44&&dock.bottom<=390*.225);assert.ok(dock.right<390*.49);assert.ok(dock.clickable,'Top artist must be clickable in the header notch');assert.equal(await page.locator('.ranking-launch').innerText(),'Top artist');await page.screenshot({path:`${output}/mobile-top-artist-notch.png`});
  await page.locator('.ranking-launch').click();await page.waitForURL('**/#/ranking');await page.locator('#ranking-search').waitFor();assert.equal(await page.locator('#ranking-city,#ranking-period').count(),0);assert.equal(await page.locator('#ranking-search').getAttribute('placeholder'),'никнейм');
  await page.goto(base+'/#/masters');await page.locator('#siteHeader>.ranking-launch').waitFor();
  await page.setViewportSize({width:1440,height:1000});await page.locator('body > .ranking-launch').waitFor();assert.equal(await page.locator('body > .ranking-launch').count(),1,'Desktop badge must return to its fixed dock after resize');
  await page.goto(base+'/#/master/zinaida');await page.locator('.master__photo').waitFor();assert.equal(await page.locator('.master-profile__action').count(),1,'Resident profile must have a booking action');await page.waitForFunction(()=>document.querySelector('.master__photo')?.complete&&document.querySelector('.master__photo').naturalWidth>0);assert.ok((await page.locator('.master__photo').evaluate(im=>im.currentSrc)).includes('/assets/responsive/'));for(const image of await page.locator('.master__photo,.work__img').all())assert.ok(await image.evaluate(im=>im.getBoundingClientRect().height/im.getBoundingClientRect().width<1.6),'Profile images must retain card proportions');
  await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/#/find');await page.locator('.find-bottom').waitFor();assert.equal(await page.locator('.find-cards .find-bottom').count(),1);assert.equal(await page.locator('.find-bottom').evaluate(el=>getComputedStyle(el).borderTopWidth),'0px');
  await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/#/booking');await page.locator('[data-city=spb]').click();
  const tomorrow=new Date(Date.now()+86400000).toISOString().slice(0,10);await page.locator(`[data-day="${tomorrow}"]`).click();await page.locator('#booking-next').click();await page.locator('.time:not([disabled])').first().click();await page.locator('.resource-choice:not([disabled])').first().click();await page.locator('#booking-next').click();await page.locator('#booking-next').click();await page.locator('#booking-agree').check();await page.locator('#booking-next').click();await page.waitForURL('**/#/payment/*');await page.locator('.payment-booking').waitFor();await page.locator('#test-pay').click();await page.waitForURL('**/#/cabinet');await page.locator('.cabinet-next').waitFor();
  for (const key of ['info','privacy','data','offer']) {
    await page.goto(base+'/#/legal/'+key);await page.locator('.prose').waitFor();assert.match(await page.locator('.prose').innerText(),/Tattoo1office@gmail.com/);assert.match(await page.locator('.prose').innerText(),/183800043387/);
  }
  await page.goto(base+'/#/club');await page.locator('.club-join').waitFor();await page.locator('#stage').focus();assert.ok(await page.locator('#stage').evaluate(el=>parseFloat(getComputedStyle(el).borderTopLeftRadius)>15));
  const club=await page.evaluate(()=>{const join=document.querySelector('.club-join').getBoundingClientRect(),column=document.querySelector('.club-offer__prices').getBoundingClientRect();return Math.abs(join.bottom-column.bottom);});assert.ok(club<2,'Join action must align with column bottom');assert.ok(await page.locator('.club-join').evaluate(el=>document.querySelector('#stage').getBoundingClientRect().bottom-el.getBoundingClientRect().bottom<65),'Join action must be near the panel bottom'); await page.screenshot({path:`${output}/club.png`});
  await page.goto(base+'/#/safety');await page.locator('.rules-full summary').click();await page.waitForFunction(()=>{const el=document.querySelector('.rules-full__text');return el&&el.getBoundingClientRect().top<200;});assert.match(await page.locator('.rules-full__text').innerText(),/8. Поддержка/);assert.equal(await page.locator('.rules-full small').count(),0);
  await db.query("UPDATE users SET role='admin' WHERE id=$1",[me.id]);
  for(const [name,email,role,active] of [['Екатерина','ekaterina@test.invalid','guest',true],['Александра Никитична','resident-booking@long-example.test.invalid','resident',true],['Мастер без доступа','inactive@test.invalid','guest',false]])await db.query("INSERT INTO users(id,email,password,name,role,account_type,active) VALUES($1,$2,'test-only',$3,$4,'master',$5)",[crypto.randomUUID(),email,name,role,active]);

  await page.goto(base+'/#/admin');await page.reload();await page.locator('[data-admintab=workspaces]').first().click();await page.locator('[data-admintab=settings]').first().click();await page.locator('#settings-form').waitFor();
  assert.equal(await page.locator('[name=points_bookingPoints]').inputValue(),'70');
  assert.equal(await page.locator('[name=openHour]').getAttribute('type'),null);await page.locator('[name=openHour]').selectOption('23',{force:true});assert.equal(await page.locator('[name=closeHour]').inputValue(),'24');assert.match(await page.locator('#studio-hours-summary').innerText(),/1 ч/);
  await page.locator('[name=openHour]').selectOption('10',{force:true});await page.locator('[name=closeHour]').selectOption('22',{force:true});
  assert.equal(await page.locator('#menuList [data-admintab]').count(),5);
  assert.deepEqual((await page.locator('#menuList .menu__link').allTextContents()).map(s=>s.replace(/\s/g,' ')),['Main','Calendar','Пользователи','Деньги','Студия']);
  assert.equal(await page.locator('.admin-settings-section').count(),4);
  assert.equal(await page.locator('.admin-settings-section:not([open])').count(),3);
  await page.locator('.admin-settings-section').nth(2).locator('summary').click();
  await page.locator('[name=points_bookingPoints]').fill('71');
  await Promise.all([page.waitForResponse(r=>r.url().endsWith('/api/admin/settings')&&r.request().method()==='PATCH'),page.locator('#settings-form button[type=submit]').click()]);
  await page.waitForFunction(()=>document.querySelector('#notice').textContent==='Настройки студии сохранены');
  assert.equal((await (await context.request.get(base+'/api/public')).json()).settings.rankingRules.bookingPoints,71);
  await page.screenshot({path:`${output}/admin-settings.png`});
  await page.locator('#menuList [data-admintab=finance]').click();await page.locator('[data-admintab=pricing]').first().click();await page.locator('#pricing-form').waitFor();
  assert.equal(await page.locator('[name=resident_3]').evaluate(el=>!!el.closest('.quantity-control')),false);await page.locator('[name=resident_3]').fill('1800');
  await Promise.all([page.waitForResponse(r=>r.url().endsWith('/api/admin/settings')&&r.request().method()==='PATCH'),page.locator('#pricing-form button[type=submit]').click()]);
  await page.waitForFunction(()=>document.querySelector('#notice').textContent==='Цены сохранены');
  assert.equal((await (await context.request.get(base+'/api/public')).json()).settings.rates.resident[3],180000);
  for(const width of [390,1440]) {
    await page.setViewportSize({width,height:1000});
    for(const tab of ['home','schedule','finance','pricing','users','workspaces','catalog','settings']) {
      // Mobile primary navigation lives in the menu; reveal it when necessary.
      let target=page.locator(`[data-admintab=${tab}]`).first();
      if(!await target.count()) {await page.locator(`[data-admintab=${tab==='pricing'?'finance':'workspaces'}]`).first().evaluate(b=>b.click());target=page.locator(`[data-admintab=${tab}]`).first();}
      await target.evaluate(b=>b.click());
      await page.locator(`[data-admin-section=${tab}]`).waitFor();
      assert.equal(await page.locator('#menuList [data-admintab]').count(),5);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`Admin overflow: ${tab} at ${width}`);
      if(tab==='users') {
        assert.deepEqual((await page.locator('.admin-users-list th').allTextContents()).map(s=>s.replace(/\s/g,' ')),['Пользователь','Роль и доступ','Баллы','Баланс','Действия']);
        assert.equal(await page.locator('.admin-users-list tbody tr').count(),4);
        for(const theme of ['light','dark']) {
          await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);await page.waitForTimeout(400);
          await page.screenshot({path:`${output}/users-refined-${width}-${theme}.png`});
        }
        await page.evaluate(()=>document.documentElement.dataset.theme='light');
      }
      if(tab==='workspaces') {
        const edit=page.locator('.workspace-card__actions [data-edit-resource]').first();
        assert.notEqual(await edit.evaluate(b=>getComputedStyle(b).backgroundImage),'none');
        await edit.click();await page.locator('#workspace-photo-upload').waitFor();
        const gap=await page.evaluate(()=>document.querySelector('#workspace-photo-status').getBoundingClientRect().top-document.querySelector('#workspace-photo-upload').getBoundingClientRect().bottom);assert.ok(gap>=13);
        await page.screenshot({path:`${output}/workspace-editor-${width}.png`});await page.locator('#dialog .close').click();
      }
      if(tab==='home'||tab==='settings') await page.screenshot({path:`${output}/admin-${tab}-${width}.png`});
    }
  }
  await page.setViewportSize({width:1440,height:1000});
  await context.request.put(base+'/api/admin/content/master-2',{data:{title:'Mr.A',body:'',portfolio:[],drafts:[],published:true,featured:true}});
  await page.locator('[data-admintab=users]').first().click();await page.locator('[data-users-filter=master]').click();await page.locator('[data-edit-points="mr-a"]').click();await page.locator('#dialog [name=score]').fill('1731');await Promise.all([page.waitForResponse(r=>r.url().endsWith('/api/admin/masters/mr-a/points')&&r.request().method()==='PATCH'),page.locator('#dialog button[type=submit]').click()]);await page.locator('#dialog').waitFor({state:'hidden'});await page.waitForFunction(()=>document.querySelector('[data-edit-points="mr-a"]')?.textContent.replace(/\s/g,'').includes('1731'));await page.locator('[data-edit-master="2"]').click();await page.locator('#dialog[open]').waitFor();
  const beforeMaster=(await (await context.request.get(base+'/api/directory')).json()).masters.find(m=>m.id==='mr-a');
  assert.equal(await page.locator('#dialog [name=body]').inputValue(),beforeMaster.bio);
  assert.equal(await page.locator('#dialog [name=portfolio]').inputValue(),'tattoo-1, tattoo-2, tattoo-3, tattoo-4, tattoo-5, tattoo-6, tattoo-7, tattoo-8');
  assert.ok((await page.locator('#dialog [name=drafts]').inputValue()).startsWith('draft-1'));
  await page.locator('#dialog button[type=submit]').click();await page.locator('#dialog').waitFor({state:'hidden'});
  const afterMaster=(await (await context.request.get(base+'/api/directory')).json()).masters.find(m=>m.id==='mr-a');assert.equal(afterMaster.bio,beforeMaster.bio);assert.deepEqual(afterMaster.portfolio,beforeMaster.portfolio);assert.deepEqual(afterMaster.drafts,beforeMaster.drafts);assert.equal(afterMaster.featured,beforeMaster.featured);
  await page.locator('[data-edit-master="2"]').click();assert.equal(await page.locator('#dialog [name=body]').inputValue(),beforeMaster.bio);await page.keyboard.press('Escape');
  await page.locator('[data-admintab=home]').first().click();await page.locator('#add-user').click();await page.locator('#dialog [name=name]').fill('Новый мастер Telegram');await page.locator('#dialog [name=email]').fill('new-tg-master@test.invalid');await page.locator('#dialog [name=password]').fill('New-master-password-2026');await page.locator('#dialog [name=role]').selectOption('resident',{force:true});await page.locator('#dialog [name=bookingLink]').fill('https://t.me/test_manager');
  const [createdResponse]=await Promise.all([page.waitForResponse(r=>r.url().endsWith('/api/admin/users')&&r.request().method()==='POST'),page.locator('#dialog button[type=submit]').click()]);assert.equal(createdResponse.status(),201);const createdMaster=await createdResponse.json();await page.locator('#dialog').waitFor({state:'hidden'});
  await page.goto(base+'/#/master/'+createdMaster.id);await page.locator('.master-profile__action a').waitFor();assert.equal(new URL(await page.locator('.master-profile__action a').getAttribute('href')).pathname,'/test_manager');
  await page.goto(base+'/#/admin');await page.locator('[data-admintab=users]').first().click();await page.locator('[data-users-filter=master]').click();
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.locator('[data-copy-value="new-tg-master@test.invalid"]').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'new-tg-master@test.invalid');
  await page.locator('[data-copy-value="Новый мастер Telegram"]').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'Новый мастер Telegram');
  await page.locator(`[data-delete-user="${createdMaster.id}"]`).click();await page.locator('#cancel-delete-user').click();assert.equal(await page.locator(`[data-delete-user="${createdMaster.id}"]`).count(),1);
  await page.locator(`[data-delete-user="${createdMaster.id}"]`).click();await Promise.all([page.waitForResponse(r=>r.url().endsWith('/api/admin/users/'+createdMaster.id)&&r.request().method()==='DELETE'),page.locator('#confirm-delete-user').click()]);await page.locator('#dialog').waitFor({state:'hidden'});await page.waitForFunction(id=>!document.querySelector(`[data-delete-user="${id}"]`),createdMaster.id);
  assert.deepEqual(errors,[]);console.log('PASS: registration → profile → photo upload → public portfolio → ranking → booking → test payment → next booking; 5 viewport sizes without overflow.');
}catch(e){console.log('Notice:',await page.locator('#notice').textContent());console.log('Errors:',errors);await page.screenshot({path:join(output,'failure.png')});throw e;}finally{await browser.close();await new Promise(r=>server.close(r));await db.close();}
