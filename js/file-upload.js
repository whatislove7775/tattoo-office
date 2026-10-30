export function bindFileUpload(zone,input,button,onFiles) {
  const open=()=>{if(button.disabled)return;zone.classList.add('is-choosing');input.click();window.addEventListener('focus',()=>setTimeout(()=>zone.classList.remove('is-choosing'),200),{once:true});};
  button.onclick=open;
  input.addEventListener('cancel',()=>zone.classList.remove('is-choosing'));
  input.onchange=()=>{zone.classList.remove('is-choosing');onFiles([...input.files]);input.value='';};
  zone.addEventListener('click',e=>{if(!e.target.closest('button,input,a,select,textarea'))open();});
  zone.addEventListener('dragover',e=>{if([...e.dataTransfer.types].includes('Files')){e.preventDefault();if(!button.disabled)zone.classList.add('is-dragover');}});
  zone.addEventListener('dragleave',e=>{if(!zone.contains(e.relatedTarget))zone.classList.remove('is-dragover');});
  zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('is-dragover');if(!button.disabled&&e.dataTransfer.files.length)onFiles([...e.dataTransfer.files]);});
}
