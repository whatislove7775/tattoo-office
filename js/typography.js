/* Keep short Russian prepositions and conjunctions with the following word. */
(()=>{
  let queued=false;
  function apply(){
    queued=false;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){
      const node=walker.currentNode;
      if(node.parentElement.closest('script,style,svg,textarea,input,pre,code,[contenteditable]'))continue;
      const next=node.nodeValue.replace(/(^|[\s(])((?:в|во|на|с|со|к|ко|у|о|об|от|до|по|из|за|и|а|но|не|для|без)) +(?=\S)/giu,'$1$2\u00a0');
      if(next!==node.nodeValue)node.nodeValue=next;
    }
  }
  new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(apply);}}).observe(document.body,{childList:true,characterData:true,subtree:true});
  apply();
})();
