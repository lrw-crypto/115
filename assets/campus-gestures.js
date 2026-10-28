'use strict';
// Track every contact, including contacts beginning on interactive SVG children.
function initCampusGestures(el){
 const contacts=new Map();let previous=null,suppressUntil=0;
 const point=e=>{const m=$('#campus-map').getScreenCTM();return m?new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse()):new DOMPoint(e.clientX,e.clientY);};
 const pair=()=>{const [a,b]=[...contacts.values()];return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,d:Math.hypot(a.x-b.x,a.y-b.y)};};
 el.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  cancelDepartmentVisit(false);contacts.set(e.pointerId,point(e));
  if(contacts.size===1){drag.active=true;drag.moved=false;drag.x=e.clientX;drag.y=e.clientY;}
  if(contacts.size>=2){previous=pair();drag.moved=true;suppressUntil=Infinity;}
 },true);
 window.addEventListener('pointermove',e=>{
  if(!contacts.has(e.pointerId))return;const before=contacts.get(e.pointerId),next=point(e);contacts.set(e.pointerId,next);
  if(contacts.size>=2){
   const current=pair();if(previous&&previous.d>0){const scale=Math.max(.65,Math.min(2.8,camera.scale*current.d/previous.d)),ratio=scale/camera.scale;
    camera.x=current.x-580-(previous.x-580-camera.x)*ratio;camera.y=current.y-410-(previous.y-410-camera.y)*ratio;camera.scale=scale;updateCamera();}
   previous=current;drag.moved=true;
  }else{
   if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5)drag.moved=true;
   if(drag.moved){camera.x+=next.x-before.x;camera.y+=next.y-before.y;updateCamera();}
  }
  if(drag.moved){el.classList.add('dragging');if(e.cancelable)e.preventDefault();}
 },{passive:false});
 const release=e=>{if(!contacts.has(e.pointerId))return;contacts.delete(e.pointerId);previous=null;if(drag.moved)suppressUntil=Date.now()+400;
  drag.active=contacts.size>0;if(!drag.active)el.classList.remove('dragging');
  if(contacts.size>=2)previous=pair();
 };
 window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);
 window.addEventListener('blur',()=>{contacts.clear();previous=null;drag.active=false;el.classList.remove('dragging');suppressUntil=Date.now()+400;});
 el.addEventListener('click',e=>{if(Date.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
 el.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?.08:-.08);},{passive:false});
}
