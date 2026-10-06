/* Shared, keyboard-accessible controls in the studio's visual language. */
(() => {
  let active;
  function close() { if (!active) return; const {popup,button}=active; popup.hidePopover(); popup.remove(); button.setAttribute('aria-expanded','false'); active=null; }
  function open(button, build) {
    if(active?.button===button){close();return;}
    close();
    const popup=document.createElement('div');popup.className='office-picker';popup.setAttribute('popover','manual');
    // Keep the popup in its dialog's top layer when a modal form is open.
    (button.closest('dialog')||document.body).append(popup);build(popup);
    popup.showPopover();button.setAttribute('aria-expanded','true');active={popup,button};
    const r=button.getBoundingClientRect(),width=Math.min(Math.max(r.width,260),innerWidth-24);
    popup.style.width=width+'px';popup.style.left=Math.max(12,Math.min(r.left,innerWidth-width-12))+'px';
    const height=Math.min(popup.scrollHeight,320,innerHeight-24);
    popup.style.maxHeight=height+'px';popup.style.top=Math.max(12,r.bottom+height+8<innerHeight?r.bottom+6:r.top-height-6)+'px';
    popup.querySelector('[aria-selected="true"],button:not(:disabled)')?.focus({preventScroll:true});
  }
  function enhance(root=document) {
    root.querySelectorAll('select:not([data-styled])').forEach(select=>{
      select.dataset.styled='true';select.classList.add('native-select');select.tabIndex=-1;select.setAttribute('aria-hidden','true');
      const button=document.createElement('button');button.type='button';button.className='office-select';button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');
      const label=select.closest('label')?.querySelector('span')?.textContent||select.name;
      const sync=()=>{button.textContent=select.selectedOptions[0]?.textContent||'Выбрать';button.setAttribute('aria-label',label+': '+button.textContent);button.disabled=select.disabled;};sync();select.after(button);select.addEventListener('change',sync);
      button.addEventListener('click',()=>open(button,popup=>{popup.setAttribute('role','listbox');popup.setAttribute('aria-label',label);
        [...select.options].forEach(option=>{const item=document.createElement('button');item.type='button';item.setAttribute('role','option');item.setAttribute('aria-selected',String(option.selected));item.textContent=option.textContent;item.disabled=option.disabled;popup.append(item);item.onclick=()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));close();button.focus();};});
      }));
      select.form?.addEventListener('reset',()=>setTimeout(sync));
    });
    root.querySelectorAll('input[type="date"]:not([data-styled])').forEach(input=>{
      input.dataset.styled='true';const button=document.createElement('button');button.type='button';button.className='date-open';button.textContent='▦';button.setAttribute('aria-label','Открыть календарь');input.after(button);
      button.onclick=()=>open(button,popup=>{let month=new Date((input.value||new Date().toISOString().slice(0,10))+'T12:00:00');
        const draw=()=>{popup.replaceChildren();const bar=document.createElement('div');bar.className='picker-month';
          const prev=document.createElement('button'),next=document.createElement('button'),title=document.createElement('span');prev.type=next.type='button';prev.textContent='‹';next.textContent='›';prev.setAttribute('aria-label','Предыдущий месяц');next.setAttribute('aria-label','Следующий месяц');title.textContent=month.toLocaleDateString('ru-RU',{month:'long',year:'numeric'});bar.append(prev,title,next);popup.append(bar);
          prev.onclick=()=>{month.setMonth(month.getMonth()-1,1);draw();};next.onclick=()=>{month.setMonth(month.getMonth()+1,1);draw();};
          const grid=document.createElement('div');grid.className='picker-days';['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(x=>{const e=document.createElement('small');e.textContent=x;grid.append(e);});
          const y=month.getFullYear(),m=month.getMonth();for(let i=0;i<(new Date(y,m,1).getDay()+6)%7;i++)grid.append(document.createElement('span'));
          for(let day=1;day<=new Date(y,m+1,0).getDate();day++){const value=`${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`,b=document.createElement('button');b.type='button';b.textContent=day;b.disabled=Boolean(input.min&&value<input.min||input.max&&value>input.max);b.setAttribute('aria-selected',String(input.value===value));b.onclick=()=>{input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));close();input.focus();};grid.append(b);}popup.append(grid);
        };draw();
      });
    });
  }
  document.addEventListener('pointerdown',e=>{if(active&&!active.popup.contains(e.target)&&!active.button.contains(e.target))close();});
  document.addEventListener('keydown',e=>{if(!active)return;if(e.key==='Escape'){const b=active.button;close();b.focus();e.preventDefault();}else if(e.key==='Tab')close();else if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){const items=[...active.popup.querySelectorAll('button:not(:disabled)')],i=items.indexOf(document.activeElement);items[e.key==='Home'?0:e.key==='End'?items.length-1:(i+(e.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus({preventScroll:true});e.preventDefault();}});
  window.addEventListener('resize',close);window.addEventListener('hashchange',close);
  document.addEventListener('wheel',e=>{if(active&&!active.popup.contains(e.target))close();},{passive:true});
  document.addEventListener('touchmove',e=>{if(active&&!active.popup.contains(e.target))close();},{passive:true});
  new MutationObserver(()=>enhance()).observe(document.body,{childList:true,subtree:true});enhance();
})();
