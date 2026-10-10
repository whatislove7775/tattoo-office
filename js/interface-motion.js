import {createMorph} from './vendor/morphicons/dom.js';
const button=document.getElementById('mobileMenuToggle');
const path=document.getElementById('menuMorphPath');
const menu='M4 6h16M4 12h16M4 18h16';
const close='M6 6l12 12M12 12h0M6 18L18 6';
const morph=createMorph(path,menu,{reducedMotion:'user'});
const sync=()=>morph.morphTo(button.getAttribute('aria-expanded')==='true'?close:menu,'snappy');
new MutationObserver(sync).observe(button,{attributes:true,attributeFilter:['aria-expanded']});
sync();

const logoutButton=document.getElementById('menuLogout');
const logoutPath=document.getElementById('logoutMorphPath');
const logoutIdle='M9 4H4v16h5M9 12h11m-4-4 4 4-4 4';
const logoutActive='M9 4H4v16h5M11 12h11m-4-4 4 4-4 4';
const logoutMorph=createMorph(logoutPath,logoutIdle,{reducedMotion:'user'});
logoutButton.addEventListener('pointerenter',()=>logoutMorph.morphTo(logoutActive,'snappy'));
logoutButton.addEventListener('pointerleave',()=>logoutMorph.morphTo(logoutIdle,'snappy'));
logoutButton.addEventListener('focus',()=>logoutMorph.morphTo(logoutActive,'snappy'));
logoutButton.addEventListener('blur',()=>logoutMorph.morphTo(logoutIdle,'snappy'));

// Reveal content only when it enters the viewport; never hide waiting content.
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const revealed=new WeakSet();
const revealSelector='.find-card,.interior-dossier,.archive-card,.safety-card,.booking-resource,.booking-item,.admin-card,.note-paper,.shortcut';
const revealObserver=new IntersectionObserver(entries=>{
  let stagger=0;
  for(const entry of entries) if(entry.isIntersecting){
    revealObserver.unobserve(entry.target);
    if(reducedMotion.matches) continue;
    entry.target.animate([{opacity:0,translate:'0 8px'},{opacity:1,translate:'0 0'}],{
      duration:240,delay:Math.min(stagger++*35,105),easing:'cubic-bezier(.2,.75,.25,1)',fill:'backwards'
    });
  }
},{threshold:.08});
function observeCards(root){
  if(root.nodeType!==1) return;
  const cards=[...(root.matches(revealSelector)?[root]:[]),...root.querySelectorAll(revealSelector)];
  for(const card of cards) if(!revealed.has(card)){
    revealed.add(card);
    revealObserver.observe(card);
  }
}
observeCards(document.body);
new MutationObserver(records=>{
  for(const record of records) for(const node of record.removedNodes)
    if(node.nodeType===1){revealObserver.unobserve(node);node.querySelectorAll(revealSelector).forEach(card=>revealObserver.unobserve(card));}
  for(const record of records) for(const node of record.addedNodes) observeCards(node);
}).observe(document.body,{childList:true,subtree:true});
reducedMotion.addEventListener('change',()=>{
  if(reducedMotion.matches) document.getAnimations().forEach(animation=>{try{animation.finish();}catch{animation.cancel();}});
});

// The footer follows the studio's calendar year, including a page left open overnight.
function updateCopyrightYear(){
  const year=new Intl.DateTimeFormat('en',{year:'numeric',timeZone:'Europe/Moscow'}).format(new Date());
  document.getElementById('copyrightYear').textContent=year+' ©';
}
updateCopyrightYear();
// Reserve real space for the account, rent control and footer after every route change.
let railLayoutFrame;
function scheduleRailLayout(){
  if(railLayoutFrame) return;
  railLayoutFrame=requestAnimationFrame(()=>{
    railLayoutFrame=0;
    if(innerWidth<=900) return;
    const rail=document.querySelector('.rail'),footer=document.querySelector('.site-bottom .foot'),rent=document.querySelector('.site-bottom .rent-slider');
    if(!rail || !footer) return;
    const rentVisible=rent && getComputedStyle(rent).display!=='none';
    const reserve=rentVisible ? rent.offsetHeight+36 : 18;
    const top=Math.max(innerHeight-24-footer.offsetHeight,rail.getBoundingClientRect().bottom+scrollY+reserve);
    document.body.style.setProperty('--desktop-footer-top',top+'px');
    document.body.style.setProperty('--desktop-footer-bottom',(top+footer.offsetHeight)+'px');
  });
}
const railLayoutObserver=new ResizeObserver(scheduleRailLayout);
document.querySelectorAll('.rail,.site-bottom .foot,.site-bottom .rent-slider').forEach(el=>railLayoutObserver.observe(el));
new MutationObserver(scheduleRailLayout).observe(document.body,{attributes:true,attributeFilter:['class','data-page']});
addEventListener('resize',scheduleRailLayout);
scheduleRailLayout();
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateCopyrightYear();});
setInterval(updateCopyrightYear,60000);
