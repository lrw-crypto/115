'use strict';
let walkingController=null,npcController=null;
function initCampusResidents(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,manualPaused=false,frame=null,lastTime=null,npcHovered=false;
 const actors=[],layer=$('#campus-students'),starts=[...CAMPUS_WALK_NODES];
 for(let i=starts.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[starts[i],starts[j]]=[starts[j],starts[i]];}
 function actorAt(node,element,speed){const [x,y]=CAMPUS_NODES[node];return {node,target:node,x,y,element,speed,path:[],segment:0,offset:0,waiting:Math.random()*2,heading:1};}
 for(let i=0;i<20;i++){
  const el=document.createElementNS('http://www.w3.org/2000/svg','g');el.setAttribute('class','walking-resident');el.dataset.resident=String(i);el.dataset.expression=STUDENT_EXPRESSIONS[i%STUDENT_EXPRESSIONS.length];el.innerHTML=animal(0,0,'',i%3===0?'rabbit':i%3===1?'bear':'cat',el.dataset.expression);layer.append(el);actors.push(actorAt(starts[i%starts.length],el,13+(i%4)*2));
 }
 const npc=actorAt(13,$('#reward-npc'),40);npc.waiting=0;const patrol=[13,11,9,3,8,10,12,14,17,19,20,19,18,15,13,16,12];let patrolIndex=0;
 function choose(actor){let target;if(actor===npc){patrolIndex=(patrolIndex+1)%patrol.length;target=patrol[patrolIndex];}else{do{target=CAMPUS_WALK_NODES[Math.floor(Math.random()*CAMPUS_WALK_NODES.length)];}while(target===actor.node);const expression=STUDENT_EXPRESSIONS[Math.floor(Math.random()*STUDENT_EXPRESSIONS.length)],face=actor.element.querySelector('.student-face');face.innerHTML=studentFace(expression);face.dataset.expression=expression;actor.element.dataset.expression=expression;}actor.target=target;actor.path=campusRoute(actor.node,target);actor.segment=0;actor.offset=0;}
 function advance(actor,seconds){
  if(actor===npc&&npcHovered)return;
  if(actor.waiting>0){actor.waiting-=seconds;return;}if(actor.path.length<2)choose(actor);
  let distance=actor.speed*seconds;
  while(distance>0&&actor.segment<actor.path.length-1){
   const a=CAMPUS_NODES[actor.path[actor.segment]],b=CAMPUS_NODES[actor.path[actor.segment+1]],len=Math.hypot(b[0]-a[0],b[1]-a[1]),remaining=len-actor.offset;
   if(distance>=remaining){distance-=remaining;actor.segment++;actor.offset=0;actor.x=b[0];actor.y=b[1];}
   else{actor.offset+=distance;distance=0;const t=len?actor.offset/len:1;actor.x=a[0]+(b[0]-a[0])*t;actor.y=a[1]+(b[1]-a[1])*t;actor.heading=b[0]<a[0]?-1:1;}
  }
  if(actor.segment>=actor.path.length-1){actor.node=actor.target;actor.path=[];actor.waiting=actor===npc?.7:1+Math.random()*3;}
 }
 function placeDepth(actor){
  const blockers=Object.entries(CAMPUS_PLACES).filter(([id,place])=>id!=='sports'&&place.occlusion.some(p=>campusContains([actor.x,actor.y],p))).sort((a,b)=>b[1].anchor[1]-a[1].anchor[1]);
  if(blockers.length){const building=$(`#occluder-${blockers[0][0]}`);if(actor.element.nextSibling!==building)$('#map-world').insertBefore(actor.element,building);}
  else if(actor.element.parentNode!==layer)layer.append(actor.element);
 }
 function paint(){
  const active=!paused&&!$('#map-page').hidden&&$('#modal-backdrop').hidden;document.body.classList.toggle('residents-inactive',!active);
  for(const actor of actors){placeDepth(actor);actor.element.setAttribute('transform',`translate(${actor.x.toFixed(2)} ${actor.y.toFixed(2)}) scale(.62)`);actor.element.classList.toggle('is-walking',active&&actor.waiting<=0);actor.element.dataset.node=actor.node;}
  placeDepth(npc);npc.element.setAttribute('transform',`translate(${npc.x.toFixed(2)} ${npc.y.toFixed(2)})`);npc.element.querySelector('.npc-scooter').setAttribute('transform',`scale(${npc.heading*.8} .8)`);npc.element.querySelector('.npc-headband').setAttribute('transform',`scale(${npc.heading} 1)`);npc.element.dataset.campusX=npc.x.toFixed(2);npc.element.dataset.campusY=npc.y.toFixed(2);
 }
 function tick(time){frame=null;if(paused){lastTime=null;return;}const delta=lastTime===null?0:Math.min((time-lastTime)/1000,.06);lastTime=time;if(!$('#map-page').hidden&&$('#modal-backdrop').hidden){actors.forEach(a=>advance(a,delta));advance(npc,delta);}paint();frame=requestAnimationFrame(tick);}
 function updateControl(){document.body.classList.toggle('residents-paused',paused);$('#toggle-walk').setAttribute('aria-pressed',String(paused));$('#toggle-walk').disabled=reduced.matches;$('#toggle-walk').textContent=reduced.matches?'已減少動態':paused?'▶ 繼續逛校園':'Ⅱ 暫停動態';paint();if(paused&&frame!==null){cancelAnimationFrame(frame);frame=null;lastTime=null;}if(!paused&&frame===null)frame=requestAnimationFrame(tick);}
 $('#toggle-walk').onclick=()=>{manualPaused=!paused;paused=manualPaused||reduced.matches;updateControl();};reduced.addEventListener('change',()=>{paused=manualPaused||reduced.matches;updateControl();});
 document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('scene-hidden',document.hidden);lastTime=null;if(document.hidden&&frame!==null){cancelAnimationFrame(frame);frame=null;}if(!document.hidden&&!paused&&frame===null)frame=requestAnimationFrame(tick);});
 const el=npc.element;el.onpointerenter=()=>npcHovered=true;el.onpointerleave=()=>npcHovered=false;el.onfocus=()=>npcHovered=true;el.onblur=()=>npcHovered=false;
 walkingController={get paused(){return paused;},actors,advance,paint};npcController={actor:npc,advance:seconds=>advance(npc,seconds),get paused(){return paused;}};updateControl();
}
