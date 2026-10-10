import {createMorph} from './vendor/morphicons/dom.js';
const button=document.getElementById('mobileMenuToggle');
const path=document.getElementById('menuMorphPath');
const menu='M4 6h16M4 12h16M4 18h16';
const close='M6 6l12 12M12 12h0M6 18L18 6';
const morph=createMorph(path,menu,{reducedMotion:'user'});
const sync=()=>morph.morphTo(button.getAttribute('aria-expanded')==='true'?close:menu,'snappy');
new MutationObserver(sync).observe(button,{attributes:true,attributeFilter:['aria-expanded']});
sync();
