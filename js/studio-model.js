/* Interactive illustrative floor model. Replace its geometry with a measured scan later. */
window.StudioModel = (() => {
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  function mount(canvas) {
    if (!canvas) return () => {};
    const ctx = canvas.getContext('2d');
    let yaw = -.64, pitch = .61, zoom = 1, dragging = false, last = null, pinchDistance = 0;
    const pointers = new Map();
    let active = true, frame = 0, userMoved = false;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const faces = [];
    const add = (points, fill, stroke = '#72706b') => faces.push({points, fill, stroke});
    const box = (x, z, w, d, h, color, base = 0) => {
      const a=[x,base,z], b=[x+w,base,z], c=[x+w,base,z+d], e=[x,base,z+d];
      const A=[x,base+h,z], B=[x+w,base+h,z], C=[x+w,base+h,z+d], E=[x,base+h,z+d];
      add([a,b,B,A],color[1]); add([b,c,C,B],color[2]);
      add([c,e,E,C],color[1]); add([e,a,A,E],color[2]); add([A,B,C,E],color[0]);
    };
    function geometry() {
      faces.length=0;
      box(-5,-3.6,10,7.2,.16,['#aa7950','#7c5037','#986a48']);
      for(let x=-4.8;x<5;x+=.52)add([[x,.165,-3.52],[x+.025,.165,-3.52],[x+.025,.165,3.52],[x,.165,3.52]],'#815a40','#815a40');
      for(let z=-3.5;z<3.6;z+=.38)add([[-4.9,.17,z],[4.9,.17,z],[4.9,.17,z+.014],[-4.9,.17,z+.014]],'#6f4d38','#6f4d38');
      box(-5,-3.6,10,.14,1.55,['#eeeae3','#d5d0c7','#f7f5ef'],.16);
      box(-5,-3.6,.14,7.2,1.25,['#eeeae3','#d7d2ca','#f8f6f2'],.16);
      box(-.2,-3.4,.1,4.45,.65,['#eeeae3','#d4cfc6','#f4f1eb'],.16);
      box(2.85,.3,.1,3.1,.62,['#eeeae3','#d4cfc6','#f4f1eb'],.16);
      for(const [x,z,turn] of [[-3.8,-1.9,0],[-3.6,1.25,0],[.95,-1.75,1],[2.45,1.5,1]]) {
        const w=turn?.88:2.05,d=turn?2.05:.88;
        box(x,z,w,d,.16,['#343235','#111114','#252327'],.67);
        box(x+.08,z+.09,w-.16,d-.18,.1,['#28282b','#242326','#1a1a1d'],.83);
        box(x+.13,z+.12,turn?.62:.4,turn?.4:.62,.11,['#454448','#2b2a2e','#38373a'],.94);
        box(x+.18,z+.15,.09,.09,.52,['#454448','#333236','#3c3b3f'],.18);
        box(x+w-.27,z+d-.26,.09,.09,.52,['#454448','#333236','#3c3b3f'],.18);
        box(x+w+.12,z+.16,.34,.34,.72,['#d8d8d4','#7f7f7c','#aaaaa5'],.17);
        box(x+w+.16,z+.2,.26,.26,.1,['#1c1c1d','#303034','#212123'],.89);
      }
      box(-4.65,-3.17,1.35,.35,.7,['#e5dfd3','#c6bcae','#d1c7b9'],.16);
      box(-4.48,-3.06,.56,.21,.08,['#2d2d30','#222225','#262628'],.89);
      box(-.85,2.72,1.6,.65,.65,['#ddc5a4','#ae9472','#c3a883'],.16);
      box(4.14,-2.85,.38,1.15,.9,['#1d1d20','#17171a','#303034'],.16);
    }
    geometry();
    function draw() {
      if(!active) return;
      const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
      const w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
      ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,rect.width,rect.height);
      const scale=Math.min(rect.width/14,rect.height/11)*zoom;
      const project=([x,y,z])=>{
        const X=x*Math.cos(yaw)-z*Math.sin(yaw), Z=x*Math.sin(yaw)+z*Math.cos(yaw);
        return {x:rect.width*.5+X*scale,y:rect.height*.59+(Z*Math.sin(pitch)-y*Math.cos(pitch))*scale,depth:Z*Math.cos(pitch)+y*Math.sin(pitch)};
      };
      const projected=faces.map(f=>{const p=f.points.map(project);return {...f,p,depth:p.reduce((a,v)=>a+v.depth,0)/p.length};}).sort((a,b)=>b.depth-a.depth);
      ctx.lineJoin='round';
      projected.forEach(f=>{ctx.beginPath();ctx.moveTo(f.p[0].x,f.p[0].y);f.p.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();ctx.fillStyle=f.fill;ctx.fill();ctx.strokeStyle=f.stroke;ctx.lineWidth=.75;ctx.stroke();});
      if(!reduced&&!dragging&&!userMoved) yaw+=.0008;
      frame=requestAnimationFrame(draw);
    }
    const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active)draw();else cancelAnimationFrame(frame);});observer.observe(canvas);
    const distance=()=>{const [a,b]=[...pointers.values()];return Math.hypot(a.x-b.x,a.y-b.y);};
    const down=e=>{dragging=true;userMoved=true;last={x:e.clientX,y:e.clientY};pointers.set(e.pointerId,last);if(pointers.size===2)pinchDistance=distance();canvas.setPointerCapture(e.pointerId);};
    const move=e=>{if(!pointers.has(e.pointerId))return;const point={x:e.clientX,y:e.clientY};pointers.set(e.pointerId,point);if(pointers.size===2){const next=distance();if(pinchDistance)zoom=clamp(zoom*next/pinchDistance,.65,2.2);pinchDistance=next;return;}if(!dragging||!last)return;yaw+=(e.clientX-last.x)*.008;pitch=clamp(pitch+(e.clientY-last.y)*.006,.26,1.1);last=point;};
    const up=e=>{pointers.delete(e.pointerId);pinchDistance=0;dragging=pointers.size>0;last=dragging?[...pointers.values()][0]:null;};
    const wheel=e=>{e.preventDefault();userMoved=true;zoom=clamp(zoom*(e.deltaY>0?.9:1.1),.65,2.2);};
    canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('wheel',wheel,{passive:false});
    const controls=canvas.closest('.model-viewer');
    controls?.querySelectorAll('[data-model-control]').forEach(button=>button.onclick=()=>{userMoved=true;switch(button.dataset.modelControl){case 'left':yaw-=.28;break;case 'right':yaw+=.28;break;case 'in':zoom=clamp(zoom*1.18,.65,2.2);break;case 'out':zoom=clamp(zoom/1.18,.65,2.2);break;default:yaw=-.64;pitch=.61;zoom=1;userMoved=false;}});
    const onRoute=()=>cleanup();
    window.addEventListener('hashchange',onRoute,{once:true});
    function cleanup(){active=false;observer.disconnect();cancelAnimationFrame(frame);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('wheel',wheel);window.removeEventListener('hashchange',onRoute);}
    return cleanup;
  }
  return {mount};
})();
