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
