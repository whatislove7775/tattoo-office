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
export async function mountGallery(root, api, notify, onChange = async () => {}, kind = 'portfolio') {
  const isDraft = kind === 'drafts';
  const title = isDraft ? 'Эскизы' : 'Работы';
  const other = isDraft ? 'portfolio' : 'drafts';
  const otherLabel = isDraft ? 'работы' : 'эскизы';
  let items = [], busy = false, dragged = null, feedback = '', failed = false;
  const visible = () => items.filter(item => item.kind === kind);
  const reload = async () => { items = (await api('/me/gallery')).items; paint(); };
  const save = async () => {
    await api('/me/gallery', 'PATCH', {items: items.map(({id, kind, caption}) => ({id, kind, caption}))});
    feedback = 'Портфолио сохранено'; notify(feedback);
  };
  const run = async action => {
    if (busy) return;
    busy = true; root.setAttribute('aria-busy', 'true');
    root.querySelectorAll('button,input').forEach(el => el.disabled = true);
    try { failed = false; await action(); await onChange(); }
    catch (error) { feedback = error.message; failed = true; notify(error.message); }
    finally {
      busy = false; root.removeAttribute('aria-busy');
      try { await reload(); } catch (error) { notify(error.message); }
    }
  };
  const move = (id, target) => {
    const section = visible();
    const from = section.findIndex(item => item.id === id);
    if (from < 0 || target < 0 || target >= section.length || from === target) return;
    const [item] = section.splice(from, 1);
    section.splice(target, 0, item);
    let index = 0;
    items = items.map(item => item.kind === kind ? section[index++] : item);
    paint();
  };
  function paint() {
    const section = visible();
    root.innerHTML = `<div class="gallery-heading"><div><h3>${title}</h3><p class="small muted">${section.length} в разделе · всего ${items.length} из 24${isDraft ? '' : ' · первая работа — обложка портфолио'}</p></div></div>
      <div class="gallery-dropzone file-upload-zone"><svg class="upload-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m-4 4 4-4M4 15v5h16v-5"/></svg><span><b>Добавить ${isDraft ? 'эскизы' : 'работы'}</b><small>JPG, PNG, WebP до 12 МБ · выберите файлы или перетащите сюда</small></span><button class="chrome" id="gallery-choose" type="button">Выбрать фотографии</button><input type="file" id="gallery-files" accept="image/jpeg,image/png,image/webp" multiple hidden></div>
      <p class="small muted">Меняйте порядок перетаскиванием или стрелками. Подписи и порядок сохраняются кнопкой ниже.</p><p class="gallery-status small ${failed ? 'is-error' : ''}" role="status" aria-live="polite">${esc(feedback)}</p>
      <div class="gallery-grid">${section.map((item, i) => `<article class="gallery-item" draggable="true" data-gallery-id="${item.id}"><img src="${esc(item.thumb)}" alt="${esc(item.caption || title + ' ' + (i + 1))}" loading="lazy" decoding="async" width="320" height="320"><label class="field"><span>Подпись</span><input data-caption="${item.id}" value="${esc(item.caption)}" maxlength="150" placeholder="Без подписи"></label><div class="gallery-actions"><button class="chrome" type="button" data-move="${item.id}" data-offset="-1" aria-label="Переместить выше" ${i === 0 ? 'disabled' : ''}>↑</button><button class="chrome" type="button" data-move="${item.id}" data-offset="1" aria-label="Переместить ниже" ${i === section.length - 1 ? 'disabled' : ''}>↓</button><button type="button" class="gallery-transfer" data-transfer="${item.id}">В ${otherLabel}</button><button type="button" class="gallery-delete" data-delete="${item.id}">Удалить</button></div></article>`).join('')}</div>
      ${section.length ? '' : `<div class="empty">${isDraft ? 'Добавьте первый эскиз.' : 'Добавьте первую работу.'}</div>`}<button class="chrome" type="button" id="gallery-save" ${section.length ? '' : 'disabled'}>Сохранить ${isDraft ? 'эскизы' : 'работы'}</button>`;
    root.querySelectorAll('[data-caption]').forEach(el => el.oninput = () => { items.find(item => item.id === el.dataset.caption).caption = el.value; });
    root.querySelectorAll('[data-move]').forEach(el => el.onclick = () => move(el.dataset.move, visible().findIndex(item => item.id === el.dataset.move) + Number(el.dataset.offset)));
    root.querySelectorAll('[data-transfer]').forEach(el => el.onclick = () => run(async () => {
      items.find(item => item.id === el.dataset.transfer).kind = other;
      await save(); feedback = `Перенесено в раздел «${isDraft ? 'Работы' : 'Эскизы'}»`; notify(feedback);
    }));
    root.querySelectorAll('[data-delete]').forEach(el => el.onclick = () => run(async () => {
      await save(); await api('/me/gallery/' + el.dataset.delete, 'DELETE'); notify('Фотография удалена');
    }));
    root.querySelector('#gallery-save').onclick = () => run(save);
    root.querySelectorAll('[data-gallery-id]').forEach(el => {
      el.ondragstart = event => {
        if (event.target.closest('input,button')) { event.preventDefault(); return; }
        dragged = el.dataset.galleryId;
        event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', dragged);
      };
      el.ondragover = event => event.preventDefault();
      el.ondrop = event => { event.preventDefault(); if (dragged) move(dragged, visible().findIndex(item => item.id === el.dataset.galleryId)); dragged = null; };
    });
    bindFileUpload(root.querySelector('.gallery-dropzone'), root.querySelector('#gallery-files'), root.querySelector('#gallery-choose'), files => {
      if (!files.length) return;
      if (files.length + items.length > 24) { feedback = 'В портфолио помещается до 24 фотографий'; failed = true; paint(); return; }
      if (files.some(file => !['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024)) { feedback = 'Выберите JPG, PNG или WebP до 12 МБ'; failed = true; paint(); return; }
      run(async () => {
        await save();
        for (const [index, file] of files.entries()) {
          feedback = `Загрузка ${index + 1} из ${files.length}…`; root.querySelector('.gallery-status').textContent = feedback;
          const image = await compressed(file, 300000, 1280), thumbnail = await compressed(file, 50000, 320);
          await api('/me/gallery', 'POST', {kind, caption: '', image, thumbnail});
        }
        feedback = `Добавлено фотографий: ${files.length}`; notify(feedback);
      });
    });
  }
  await reload();
}
