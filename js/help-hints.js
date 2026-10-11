import {createMorph} from './vendor/morphicons/dom.js';
// Lucide CircleAlert from the icon sets supported by the Morphicons playground.
const alertPath='M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M12 8v4M12 16h.01';
const activePath='M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M12 7v5M12 16h.01';
const popup=document.createElement('div');
popup.className='help-tooltip';popup.id='help-tooltip';popup.role='tooltip';popup.hidden=true;
let current=null,closeTimer;
function hide(){
  clearTimeout(closeTimer);
  if(current){current.button.setAttribute('aria-expanded','false');current.morph.morphTo(alertPath,'smooth');}
  current=null;popup.hidden=true;
}
function place(){
  if(!current?.button.isConnected)return hide();
  const r=current.button.getBoundingClientRect(),p=popup.getBoundingClientRect();
  popup.style.left=Math.max(12,Math.min(r.left+r.width/2-p.width/2,innerWidth-p.width-12))+'px';
  popup.style.top=Math.max(12,r.bottom+p.height+10<innerHeight?r.bottom+8:r.top-p.height-8)+'px';
}
function show(item){
  clearTimeout(closeTimer);
  if(current!==item)hide();
  current=item;
  (item.button.closest('dialog')||document.body).append(popup);
  popup.textContent=item.text;popup.hidden=false;
  item.button.setAttribute('aria-expanded','true');
  item.morph.morphTo(activePath,'smooth');place();
}
function later(){clearTimeout(closeTimer);closeTimer=setTimeout(hide,160);}
popup.addEventListener('pointerenter',()=>clearTimeout(closeTimer));
popup.addEventListener('pointerleave',later);
function enhance(root){
  if(root.nodeType!==1)return;
  const helpers=[...(root.matches('[data-help]')?[root]:[]),...root.querySelectorAll('[data-help]')];
  for(const helper of helpers){
    const text=helper.textContent.trim();
    if(!text){helper.remove();continue;}
    const button=document.createElement('button');
    button.type='button';button.className='help-alert';button.setAttribute('aria-label',helper.dataset.helpLabel?'Пояснение: '+helper.dataset.helpLabel:'Пояснение');
    button.setAttribute('aria-describedby',popup.id);button.setAttribute('aria-expanded','false');
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path/></svg>';
    const morph=createMorph(button.querySelector('path'),alertPath,{reducedMotion:'user'});
    const item={button,morph,text},clickOnly=helper.dataset.helpTrigger==='click';let touch=false;
    button.addEventListener('pointerdown',e=>{touch=e.pointerType==='touch';});
    button.addEventListener('pointerenter',e=>{if(!clickOnly&&e.pointerType!=='touch')show(item);});
    button.addEventListener('pointerleave',()=>{if(!clickOnly)later();});
    button.addEventListener('focus',()=>{if(!clickOnly&&!touch&&button.matches(':focus-visible'))show(item);});
    button.addEventListener('blur',hide);
    button.addEventListener('click',e=>{if(current===item&&(clickOnly||touch||e.detail===0))hide();else show(item);});
    const scope=helper.closest('form,.stamp-card,.window,.modal__body')||helper.parentElement;
    const prev=helper.previousElementSibling;
    let target=helper.dataset.helpFor ? scope.querySelector(helper.dataset.helpFor) : prev;
    if(target?.matches('input,select,textarea'))target=target.closest('.field');
    if(target?.matches('.field'))target=target.querySelector(':scope>span');
    else if(target?.matches('.check')){
      let label=target.querySelector(':scope>span');
      if(!label){label=document.createElement('span');for(const node of [...target.childNodes])if(node.nodeType===3)label.append(node);target.append(label);}
      target=label;
    } else if(target&&!target.matches('h1,h2,h3,h4,.tabs,span'))target=target.querySelector('h1,h2,h3,h4');
    if(!target&&helper.parentElement.matches('.admin-content'))target=helper.closest('.window')?.querySelector('.admin-section-title');
    if(!target)target=scope.querySelector('h2,h3,h1,.modal__title');
    // A hint belongs to its label, including labels outside a nested content wrapper.
    if(helper.hasAttribute('data-help-inline')){button.classList.add('help-alert--small');helper.replaceWith(button);}
    else if(target){if(!helper.dataset.helpLabel)button.setAttribute('aria-label','Пояснение: '+target.textContent.trim());target.classList.add('has-help');target.append(button);helper.remove();}
    else {const host=document.createElement('span');host.className='help-hint';host.append(button);helper.replaceWith(host);}
    button.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();});
  }
  if(current&&!current.button.isConnected)hide();
}
enhance(document.body);
new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)enhance(node);if(current&&!current.button.isConnected)hide();}).observe(document.body,{childList:true,subtree:true});
document.addEventListener('pointerdown',e=>{if(current&&!popup.contains(e.target)&&!current.button.contains(e.target))hide();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&current){e.preventDefault();hide();}});
window.addEventListener('hashchange',hide);
window.addEventListener('resize',hide);
document.addEventListener('scroll',e=>{if(e.target!==popup)hide();},true);
