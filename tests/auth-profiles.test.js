import {test} from 'node:test';
import assert from 'node:assert/strict';
import {database} from '../server/db.js';
import {createApp} from '../server/index.js';
import {hashToken,hashPassword} from '../server/domain.js';
import {workerTick} from '../server/worker.js';
import {randomUUID} from 'node:crypto';
test('profiles share an email without shared privileges; recovery expires, runs once and revokes sessions',async()=>{
  process.env.DATA_DIR='memory://';process.env.APP_ORIGIN='https://office.test';process.env.EMAIL_API_URL='https://mail.test/send';process.env.EMAIL_API_TOKEN='test-only';
  const db=await database(),app=await createApp(db),server=app.listen(0,'127.0.0.1');await new Promise(r=>server.on('listening',r));
  const url='http://127.0.0.1:'+server.address().port,password='Office-profile-test-2026',emails=[];
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async(url,options)=>url==='https://mail.test/send'?(emails.push(JSON.parse(options.body)),new Response('{}',{status:200})):originalFetch(url,options);
  const req=async(path,data,cookie)=>{const r=await fetch(url+'/api'+path,{method:'POST',headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:JSON.stringify(data)});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};};
  try {
    const data={name:'Test',email:'profiles@test.invalid',password,rules:true,consent:true};
    const master=await req('/auth/register',{...data,accountType:'master'});assert.equal(master.status,201);
    assert.equal((await req('/auth/register',{...data,accountType:'customer',password:'Wrong-password-2026'})).status,409);
    const customer=await req('/auth/register',{...data,accountType:'customer'});assert.equal(customer.status,201);assert.notEqual(customer.data.user.id,master.data.user.id);assert.equal(customer.data.user.accountType,'customer');
    assert.equal((await req('/auth/register',{...data,accountType:'admin'})).status,403);
    const adminId=randomUUID();await db.query("INSERT INTO users(id,email,password,name,role,account_type) VALUES($1,$2,$3,'Admin','admin','admin')",[adminId,data.email,hashPassword(password)]);
    assert.equal((await req('/auth/login',{email:data.email,password,accountType:'admin'})).data.user.role,'admin');
    assert.equal((await req('/auth/login',{email:data.email,password,accountType:'customer'})).data.user.role,'guest');
    assert.equal((await req('/auth/forgot-password',{email:data.email,accountType:'customer'})).status,200);
    assert.equal((await req('/auth/forgot-password',{email:'unknown@test.invalid',accountType:'customer'})).status,200);
    await workerTick(db);assert.equal(emails.length,1);assert.equal(emails[0].to,data.email);
    const token=emails[0].text.match(/token=([a-f0-9]{64})/)[1];assert.ok((await db.query('SELECT token FROM password_resets')).rows.some(r=>r.token===hashToken(token)));assert.equal((await db.query("SELECT payload FROM outbox WHERE kind='email.auth'")).rows[0].payload.text,undefined);
    const newPassword='New-profile-password-2026';assert.equal((await req('/auth/reset-password',{token,password:newPassword})).status,200);assert.equal((await req('/auth/reset-password',{token,password:newPassword})).status,400);
    assert.equal((await req('/auth/login',{email:data.email,password:newPassword,accountType:'customer'})).status,200);assert.equal((await req('/auth/login',{email:data.email,password,accountType:'master'})).status,200);
    assert.equal((await db.query('SELECT * FROM sessions WHERE user_id=$1',[customer.data.user.id])).rows.length,1);
    const expired='f'.repeat(64);await db.query("INSERT INTO password_resets VALUES($1,$2,now()-interval '1 minute')",[hashToken(expired),master.data.user.id]);assert.equal((await req('/auth/reset-password',{token:expired,password:newPassword})).status,400);
  } finally {globalThis.fetch=originalFetch;await new Promise(r=>server.close(r));await db.close();}
});
