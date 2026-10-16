import {bindFileUpload} from "./file-upload.js";
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function compressed(file,max,longest) {
  const bitmap=await createImageBitmap(file);
  try {
    const scale=Math.min(1,longest/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
    for(const quality of [.82,.72,.6,.45]){const value=canvas.toDataURL('image/jpeg',quality);if(value.length<=max)return value;}
    throw Error('Фотография слишком сложная. Попробуйте уменьшить её размер.');
  }finally{bitmap.close();}
}
export async function mountGallery(root,api,notify,onChange=async()=>{}) {
  let items=[],busy=false,dragged=null,feedback='',failed=false;
  const reload=async()=>{items=(await api('/me/gallery')).items;paint();};
  const save=async()=>{await api('/me/gallery','PATCH',{items:items.map(({id,kind,caption})=>({id,kind,caption}))});feedback='Портфолио сохранено';notify(feedback);};
  const run=async(action)=>{
    if(busy)return;busy=true;root.setAttribute('aria-busy','true');root.querySelectorAll('button,input,select').forEach(el=>el.disabled=true);
    try{failed=false;await action();await onChange();}catch(e){feedback=e.message;failed=true;notify(e.message);}finally{busy=false;root.removeAttribute('aria-busy');try{await reload();}catch(e){notify(e.message);}}
  };
  const move=(id,target)=>{const from=items.findIndex(i=>i.id===id);if(from<0||target<0||target>=items.length)return;const [item]=items.splice(from,1);items.splice(target,0,item);paint();};
  function paint(){
    root.innerHTML=`<div class="gallery-heading"><div><h3>Работы и эскизы</h3><p class="small muted">${items.length} из 24 · первая работа — обложка портфолио</p></div></div><div class="gallery-dropzone file-upload-zone"><svg class="upload-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m-4 4 4-4 4 4M4 15v5h16v-5"/></svg><span><b>Перетащите фотографии сюда</b><small>или выберите файлы кнопкой · JPG, PNG, WebP до 12 МБ</small></span><button class="chrome" id="gallery-choose" type="button">Выбрать фотографии</button><input type="file" id="gallery-files" accept="image/jpeg,image/png,image/webp" multiple hidden></div><p class="small muted">Меняйте порядок карточек перетаскиванием или стрелками. Подписи и порядок сохраняются кнопкой ниже.</p><p class="gallery-status small ${failed?'is-error':''}" role="status" aria-live="polite">${esc(feedback)}</p><div class="gallery-grid">${items.map((item,i)=>`<article class="gallery-item" draggable="true" data-gallery-id="${item.id}"><img src="${esc(item.thumb)}" alt="${esc(item.caption||'Фотография '+(i+1))}" loading="lazy" decoding="async" width="320" height="320"><label class="field"><span>Подпись</span><input data-caption="${item.id}" value="${esc(item.caption)}" maxlength="150" placeholder="Без подписи"></label><label class="field"><span>Раздел</span><select data-kind="${item.id}"><option value="portfolio" ${item.kind==='portfolio'?'selected':''}>Работа</option><option value="drafts" ${item.kind==='drafts'?'selected':''}>Эскиз</option></select></label><div class="gallery-actions"><button class="chrome" type="button" data-move="${item.id}" data-offset="-1" aria-label="Переместить выше" ${i===0?'disabled':''}>↑</button><button class="chrome" type="button" data-move="${item.id}" data-offset="1" aria-label="Переместить ниже" ${i===items.length-1?'disabled':''}>↓</button><button type="button" class="gallery-delete" data-delete="${item.id}">Удалить</button></div></article>`).join('')}</div>${!items.length?'<div class="empty">Добавьте первую работу или эскиз.</div>':''}<button class="chrome" type="button" id="gallery-save" ${!items.length?'disabled':''}>Сохранить портфолио</button>`;
    root.querySelectorAll('[data-caption]').forEach(el=>el.oninput=()=>{items.find(i=>i.id===el.dataset.caption).caption=el.value;});
    root.querySelectorAll('[data-kind]').forEach(el=>el.onchange=()=>{items.find(i=>i.id===el.dataset.kind).kind=el.value;});
    root.querySelectorAll('[data-move]').forEach(el=>el.onclick=()=>move(el.dataset.move,items.findIndex(i=>i.id===el.dataset.move)+Number(el.dataset.offset)));
    root.querySelectorAll('[data-delete]').forEach(el=>el.onclick=()=>run(async()=>{await save();await api('/me/gallery/'+el.dataset.delete,'DELETE');notify('Фотография удалена');}));
    root.querySelector('#gallery-save').onclick=()=>run(save);
    root.querySelectorAll('[data-gallery-id]').forEach(el=>{
      el.ondragstart=e=>{if(e.target.closest('input,select,button')){e.preventDefault();return;}dragged=el.dataset.galleryId;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',dragged);};
      el.ondragover=e=>e.preventDefault();el.ondrop=e=>{e.preventDefault();if(dragged)move(dragged,items.findIndex(i=>i.id===el.dataset.galleryId));dragged=null;};
    });
    bindFileUpload(root.querySelector('.gallery-dropzone'),root.querySelector('#gallery-files'),root.querySelector('#gallery-choose'),files=>{
      if(!files.length)return;
      if(files.length+items.length>24){feedback='В портфолио помещается до 24 фотографий';failed=true;paint();return;}
      if(files.some(f=>!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>12*1024*1024)){feedback='Выберите JPG, PNG или WebP до 12 МБ';failed=true;paint();return;}
      run(async()=>{
        await save();
        for(const [index,file] of files.entries()){
          feedback=`Загрузка ${index+1} из ${files.length}…`;root.querySelector('.gallery-status').textContent=feedback;
          const image=await compressed(file,300000,1280),thumbnail=await compressed(file,50000,320);
          await api('/me/gallery','POST',{kind:'portfolio',caption:'',image,thumbnail});
        }feedback=`Добавлено фотографий: ${files.length}`;notify(feedback);
      });
    });
  }
  await reload();
}
