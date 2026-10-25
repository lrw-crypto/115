'use strict';
let walkingController=null,npcController=null;
const NPC_SCALE=.72;
// Arc-length sampling gives constant ground speed through rounded corners.
function residentCurve(nodes){
 const points=nodes.map(i=>CAMPUS_NODES[i]),out=[points[0]];
 for(let i=1;i<points.length-1;i++){
  const a=points[i-1],b=points[i],c=points[i+1],ab=Math.hypot(a[0]-b[0],a[1]-b[1]),bc=Math.hypot(c[0]-b[0],c[1]-b[1]);
  if(ab<.01||bc<.01)continue;
  const radius=Math.min(9,ab*.22,bc*.22),enter=[b[0]+(a[0]-b[0])*radius/ab,b[1]+(a[1]-b[1])*radius/ab],leave=[b[0]+(c[0]-b[0])*radius/bc,b[1]+(c[1]-b[1])*radius/bc];out.push(enter);
  for(let k=1;k<=8;k++){const t=k/8;out.push([(1-t)**2*enter[0]+2*(1-t)*t*b[0]+t*t*leave[0],(1-t)**2*enter[1]+2*(1-t)*t*b[1]+t*t*leave[1]])}
 }
 out.push(points.at(-1));const lengths=[0];for(let i=1;i<out.length;i++)lengths.push(lengths.at(-1)+Math.hypot(out[i][0]-out[i-1][0],out[i][1]-out[i-1][1]));return{points:out,lengths,total:lengths.at(-1)};
}
function residentCurvePoint(curve,distance){
 const at=Math.max(0,Math.min(curve.total,distance));let low=1,high=curve.lengths.length-1;
 while(low<high){const mid=(low+high)>>1;if(curve.lengths[mid]<at)low=mid+1;else high=mid;}
 const a=curve.points[low-1],b=curve.points[low],len=curve.lengths[low]-curve.lengths[low-1],t=len?(at-curve.lengths[low-1])/len:0;return{x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t,dx:len?(b[0]-a[0])/len:1,dy:len?(b[1]-a[1])/len:0};
}
function initCampusResidents(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,manualPaused=false,frame=null,lastTime=null,npcHovered=false;
 const actors=[],layer=$('#campus-students'),npcStart=31,npcStartPoint=CAMPUS_NODES[npcStart];
 const starts=CAMPUS_WALK_NODES.filter(i=>Math.hypot(CAMPUS_NODES[i][0]-npcStartPoint[0],CAMPUS_NODES[i][1]-npcStartPoint[1])>55);
 for(let i=starts.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[starts[i],starts[j]]=[starts[j],starts[i]];}
 function actorAt(node,element,speed){const[x,y]=CAMPUS_NODES[node];return{node,target:node,x,y,baseX:x,baseY:y,element,speed,velocity:0,path:[],curve:null,offset:0,travelled:0,waiting:Math.random()*1.8,heading:1,dx:1,dy:0,lateral:0,sideX:0,sideY:0,avoidSide:0,yielding:false,moving:false};}
 for(let i=0;i<20;i++){
  const el=document.createElementNS('http://www.w3.org/2000/svg','g');el.setAttribute('class','walking-resident');el.dataset.resident=String(i);el.dataset.expression=STUDENT_EXPRESSIONS[i%STUDENT_EXPRESSIONS.length];
  el.innerHTML=`<ellipse class="resident-ground-shadow" cy="1" rx="9" ry="3" fill="#43684c28"/><g class="walker-figure">${animal(0,0,'',i%3===0?'rabbit':i%3===1?'bear':'cat',el.dataset.expression)}</g>`;
  el.querySelector('.animal-friend>ellipse')?.remove();layer.append(el);const actor=actorAt(starts[i%starts.length],el,15+(i%4)*1.5);
  actor.parts={figure:el.querySelector('.walker-figure'),body:el.querySelector('.friend-bob'),left:el.querySelector('.step-left'),right:el.querySelector('.step-right'),armLeft:el.querySelector('.arm-left'),armRight:el.querySelector('.arm-right'),face:el.querySelector('.student-face')};actors.push(actor);
 }
 const npc=actorAt(npcStart,$('#reward-npc'),32);npc.waiting=0;const patrol=[31,35,31,30];let patrolIndex=0;
 npc.wheels=[...npc.element.querySelectorAll('.scooter-wheel')];npc.scooter=npc.element.querySelector('.npc-scooter');npc.headband=npc.element.querySelector('.npc-headband');
 function choose(actor){
  let target;if(actor===npc){patrolIndex=(patrolIndex+1)%patrol.length;target=patrol[patrolIndex];}
  else{do{target=CAMPUS_WALK_NODES[Math.floor(Math.random()*CAMPUS_WALK_NODES.length)];}while(target===actor.node);const expression=STUDENT_EXPRESSIONS[Math.floor(Math.random()*STUDENT_EXPRESSIONS.length)];actor.parts.face.innerHTML=studentFace(expression);actor.parts.face.dataset.expression=expression;actor.element.dataset.expression=expression;}
  actor.target=target;actor.path=campusRoute(actor.node,target);actor.curve=residentCurve(actor.path);actor.offset=0;
 }
 function pointSafe(x,y){return !Object.entries(CAMPUS_PLACES).some(([id,p])=>id!=='sports'&&p.occlusion.some(poly=>campusContains([x,y],poly)));}
 function advance(actor,seconds){
  actor.moving=false;if(actor===npc&&npcHovered){actor.velocity=0;return;}
  if(actor.waiting>0){actor.waiting=Math.max(0,actor.waiting-seconds);actor.velocity=0;return;}
  if(actor.path.length<2)choose(actor);if(!actor.curve||actor.curve.total<.01)return;
  const remaining=actor.curve.total-actor.offset,routePoint=residentCurvePoint(actor.curve,actor.offset);let desired=Math.min(actor.speed,Math.sqrt(Math.max(0,remaining)*32));actor.yielding=false;
  if(actor===npc){
   const ahead=residentCurvePoint(actor.curve,actor.offset+Math.min(40,remaining));
   for(const student of actors){const vx=student.x-actor.x,vy=student.y-actor.y,forward=vx*routePoint.dx+vy*routePoint.dy,near=Math.hypot(vx,vy),future=Math.hypot(student.x-ahead.x,student.y-ahead.y);if(near<48||forward>-12&&(near<80||future<48)){const factor=Math.max(0,Math.min(1,(near-40)/32));desired=Math.min(desired,actor.speed*factor);actor.yielding=true;}}
  }
  actor.velocity+=(desired-actor.velocity)*(1-Math.exp(-seconds*9));if(desired===0&&actor.velocity<.3)actor.velocity=0;
  const before={x:actor.x,y:actor.y,offset:actor.offset,sideX:actor.sideX,sideY:actor.sideY};let delta=Math.min(remaining,actor.velocity*seconds);actor.offset+=delta;const p=residentCurvePoint(actor.curve,actor.offset);actor.dx=p.dx;actor.dy=p.dy;if(Math.abs(p.dx)>.18)actor.heading=p.dx<0?-1:1;
  actor.baseX=p.x;actor.baseY=p.y;let lateral=0;
  if(actor!==npc){
   const near=Math.hypot(p.x-npc.x,p.y-npc.y);
   if(near<100){const normal={x:-p.dy,y:p.dx};if(!actor.avoidSide)actor.avoidSide=(p.x-npc.x)*normal.x+(p.y-npc.y)*normal.y>=0?1:-1;const side=actor.avoidSide,amount=Math.min(46,Math.max(0,100-near)*.95);
    for(const sign of [side,-side]){const x=p.x+normal.x*sign*amount,y=p.y+normal.y*sign*amount;if(pointSafe(x,y)){actor.avoidSide=sign;lateral=sign*amount;break;}}
   }else actor.avoidSide=0;
  }
  actor.lateral+=(lateral-actor.lateral)*(1-Math.exp(-seconds*7));const goalX=-p.dy*actor.lateral,goalY=p.dx*actor.lateral,k=1-Math.exp(-seconds*9);let ox=(goalX-actor.sideX)*k,oy=(goalY-actor.sideY)*k;const length=Math.hypot(ox,oy),limit=seconds*45;if(length>limit){ox*=limit/length;oy*=limit/length;}actor.sideX+=ox;actor.sideY+=oy;actor.x=p.x+actor.sideX;actor.y=p.y+actor.sideY;
  if(actor===npc){if(actors.some(a=>Math.hypot(a.x-actor.x,a.y-actor.y)<38&&Math.hypot(a.x-actor.x,a.y-actor.y)<Math.hypot(a.x-before.x,a.y-before.y))){actor.offset=before.offset;actor.x=before.x;actor.y=before.y;actor.velocity=0;actor.yielding=true;delta=0;}}
  else if(Math.hypot(actor.x-npc.x,actor.y-npc.y)<38&&Math.hypot(actor.x-npc.x,actor.y-npc.y)<Math.hypot(before.x-npc.x,before.y-npc.y)){
   actor.offset=before.offset;const previous=residentCurvePoint(actor.curve,actor.offset);actor.x=previous.x+actor.sideX;actor.y=previous.y+actor.sideY;
   if(Math.hypot(actor.x-npc.x,actor.y-npc.y)<Math.min(38,Math.hypot(before.x-npc.x,before.y-npc.y))){actor.sideX=before.sideX;actor.sideY=before.sideY;actor.x=before.x;actor.y=before.y;}actor.velocity=0;actor.yielding=true;delta=0;
  }
  const moved=Math.hypot(actor.x-before.x,actor.y-before.y);actor.travelled+=moved;actor.moving=moved>.015;
  if(delta>0&&remaining-delta<.08){actor.node=actor.target;actor.path=[];actor.curve=null;actor.velocity=0;actor.waiting=actor===npc?.65:.5+Math.random()*1.8;}
 }
 function placeDepth(actor){const blockers=Object.entries(CAMPUS_PLACES).filter(([id,place])=>id!=='sports'&&place.occlusion.some(p=>campusContains([actor.x,actor.y],p))).sort((a,b)=>b[1].anchor[1]-a[1].anchor[1]);if(blockers.length){const building=$(`#occluder-${blockers[0][0]}`);if(actor.element.nextSibling!==building)$('#map-world').insertBefore(actor.element,building);return false;}return true;}
 function paint(){
  const active=!paused&&!document.hidden&&!$('#map-page').hidden&&$('#modal-backdrop').hidden&&!document.body.classList.contains('department-zooming');document.body.classList.toggle('residents-inactive',!active);
  for(const actor of actors){
   actor.element.setAttribute('transform',`translate(${actor.x.toFixed(3)} ${actor.y.toFixed(3)})`);actor.parts.figure.setAttribute('transform',`translate(0 -5.6) scale(${actor.heading*.62} .62)`);
   const phase=actor.travelled/3.2,step=active&&actor.moving?Math.sin(phase):0;
   actor.parts.left.setAttribute('transform',`translate(${step*1.7} ${-Math.max(0,step)*2.8}) rotate(${step*16} -5 -5)`);actor.parts.right.setAttribute('transform',`translate(${-step*1.7} ${-Math.max(0,-step)*2.8}) rotate(${-step*16} 5 -5)`);
   actor.parts.body.setAttribute('transform',`translate(0 ${-Math.abs(step)*.45})`);actor.parts.armLeft.setAttribute('transform',`rotate(${-step*12} -9 -17)`);actor.parts.armRight.setAttribute('transform',`rotate(${step*12} 9 -17)`);actor.element.classList.toggle('is-walking',active&&actor.moving);actor.element.dataset.node=actor.node;
  }
  npc.element.setAttribute('transform',`translate(${npc.x.toFixed(3)} ${npc.y.toFixed(3)})`);npc.scooter.setAttribute('transform',`translate(0 ${-17*NPC_SCALE}) scale(${npc.heading*NPC_SCALE} ${NPC_SCALE})`);npc.headband.setAttribute('transform',`scale(${npc.heading} 1)`);for(const wheel of npc.wheels)wheel.setAttribute('transform',`rotate(${npc.travelled/(7*NPC_SCALE)*180/Math.PI%360})`);npc.element.dataset.yielding=String(npc.yielding);npc.element.dataset.campusX=npc.x.toFixed(3);npc.element.dataset.campusY=npc.y.toFixed(3);
  const visible=[...actors,npc].sort((a,b)=>a.y-b.y).filter(placeDepth);let cursor=layer.firstChild;for(const actor of visible){if(actor.element===cursor)cursor=cursor.nextSibling;else layer.insertBefore(actor.element,cursor);}
 }
 function step(seconds){actors.forEach(a=>advance(a,seconds));advance(npc,seconds);paint();}
 function tick(time){frame=null;if(paused){lastTime=null;return;}const delta=lastTime===null?0:Math.min((time-lastTime)/1000,.05);lastTime=time;if(!document.hidden&&!$('#map-page').hidden&&$('#modal-backdrop').hidden&&!document.body.classList.contains('department-zooming'))step(delta);else paint();frame=requestAnimationFrame(tick);}
 function updateControl(){document.body.classList.toggle('residents-paused',paused);$('#toggle-walk').setAttribute('aria-pressed',String(paused));$('#toggle-walk').disabled=reduced.matches;$('#toggle-walk').textContent=reduced.matches?'已減少動態':paused?'▶ 繼續逛校園':'Ⅱ 暫停動態';paint();if(paused&&frame!==null){cancelAnimationFrame(frame);frame=null;lastTime=null;}if(!paused&&frame===null)frame=requestAnimationFrame(tick);}
 $('#toggle-walk').onclick=()=>{manualPaused=!paused;paused=manualPaused||reduced.matches;updateControl();};reduced.addEventListener('change',()=>{paused=manualPaused||reduced.matches;updateControl();});
 document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('scene-hidden',document.hidden);lastTime=null;if(document.hidden&&frame!==null){cancelAnimationFrame(frame);frame=null;}if(!document.hidden&&!paused&&frame===null)frame=requestAnimationFrame(tick);});
 const el=npc.element;el.onpointerenter=()=>npcHovered=true;el.onpointerleave=()=>npcHovered=false;el.onfocus=()=>npcHovered=true;el.onblur=()=>npcHovered=false;
 walkingController={get paused(){return paused;},actors,advance,paint,step};npcController={actor:npc,advance:seconds=>advance(npc,seconds),get paused(){return paused;}};updateControl();
}
