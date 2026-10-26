'use strict';
let walkingController=null,npcController=null;
const NPC_SCALE=.72,STUDENT_SCALE=.62,STUDENT_SOLE=9.4;
const WALK_FIXED_STEP=1/120;
const residentAttribute=(el,key,value)=>{if(el.getAttribute(key)!==String(value))el.setAttribute(key,value);};
function residentSampledCurve(points){
 const lengths=[0];for(let i=1;i<points.length;i++)lengths.push(lengths.at(-1)+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));
 const turns=points.map((p,i)=>{const a=points[Math.max(0,i-5)],b=points[Math.min(points.length-1,i+5)],before=[p[0]-a[0],p[1]-a[1]],after=[b[0]-p[0],b[1]-p[1]],len=Math.hypot(...before)*Math.hypot(...after);return len?Math.max(.55,Math.sqrt(Math.max(0,(1+(before[0]*after[0]+before[1]*after[1])/len)/2))):1;});
 return{points,lengths,turns,total:lengths.at(-1)};
}
const residentCurveCache=new Map();
function residentCurve(nodes,lane=0){
 if(nodes.length<2)return null;
 const key=nodes.join(',')+':'+lane;if(residentCurveCache.has(key))return residentCurveCache.get(key);
 const points=nodes.map(i=>CAMPUS_NODES[i]),zone=CAMPUS_NODE_ZONES[nodes[0]],out=[points[0]];
 for(let i=1;i<points.length-1;i++){
  const a=points[i-1],b=points[i],c=points[i+1],ab=Math.hypot(a[0]-b[0],a[1]-b[1]),bc=Math.hypot(c[0]-b[0],c[1]-b[1]);let corner=[b];
  // Check the swept character radius, not just the centre of the interpolated bend.
  for(let radius=Math.min(7,ab*.2,bc*.2);radius>=.3;radius*=.5){
   const enter=[b[0]+(a[0]-b[0])*radius/ab,b[1]+(a[1]-b[1])*radius/ab],leave=[b[0]+(c[0]-b[0])*radius/bc,b[1]+(c[1]-b[1])*radius/bc],candidate=[enter];
   for(let k=1;k<=10;k++){const t=k/10;candidate.push([(1-t)**2*enter[0]+2*(1-t)*t*b[0]+t*t*leave[0],(1-t)**2*enter[1]+2*(1-t)*t*b[1]+t*t*leave[1]]);}
   if(candidate.every((p,j)=>j===0||campusWalkSegmentSafe(candidate[j-1],p,CAMPUS_WALK_RADIUS,zone))){corner=candidate;break;}
  }out.push(...corner);
 }
 out.push(points.at(-1));
 // Resample the straight portions as well, so bounded lanes and safety checks
 // have the same precision as corners. No per-frame geometry or route searches.
 const dense=[out[0]];for(let i=1;i<out.length;i++){const a=out[i-1],b=out[i],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2));for(let k=1;k<=n;k++)dense.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}
 const centre=residentSampledCurve(dense);let curve=centre;
 for(let amount=lane;Math.abs(amount)>=.3;amount*=.5){
  const candidate=dense.map((p,i)=>{const a=dense[Math.max(0,i-1)],b=dense[Math.min(dense.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy)||1,taper=Math.min(1,centre.lengths[i]/14,(centre.total-centre.lengths[i])/14),offset=amount*(taper*taper*(3-2*taper));return[p[0]-dy/length*offset,p[1]+dx/length*offset];});
  if(candidate.every((p,i)=>i===0||campusWalkSegmentSafe(candidate[i-1],p,CAMPUS_WALK_RADIUS,zone))){curve=residentSampledCurve(candidate);break;}
 }
 residentCurveCache.set(key,curve);return curve;
}
function residentCurvePoint(curve,distance){
 const at=Math.max(0,Math.min(curve.total,distance));let low=1,high=curve.lengths.length-1;
 while(low<high){const mid=(low+high)>>1;if(curve.lengths[mid]<at)low=mid+1;else high=mid;}
 const a=curve.points[low-1],b=curve.points[low],len=curve.lengths[low]-curve.lengths[low-1],t=len?(at-curve.lengths[low-1])/len:0;
 return{x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t,dx:len?(b[0]-a[0])/len:1,dy:len?(b[1]-a[1])/len:0,turn:curve.turns[low]};
}
// Only local foreground copies of the unchanged illustration are needed.
const CAMPUS_WALK_TREES=[
 {id:'west-lamp-tree',base:[754,551],polygon:[[718,516],[727,498],[753,494],[775,510],[779,531],[763,544],[762,553],[749,554],[744,539],[725,535]]},
 {id:'east-tree-1',base:[952,525],polygon:[[922,475],[927,455],[947,449],[974,458],[986,478],[979,502],[961,509],[960,523],[947,525],[947,505],[929,497],[916,487]]},
 {id:'east-tree-2',base:[1027,587],polygon:[[997,545],[1004,525],[1024,521],[1047,528],[1056,550],[1053,565],[1037,574],[1037,583],[1026,587],[1023,573],[1008,567],[998,558]]},
 {id:'track-south',base:[356,329],polygon:[[327,301],[333,280],[352,272],[376,278],[389,299],[379,315],[361,318],[360,331],[349,330],[347,317],[332,314]]}
];
function setCampusRouteDebug(enabled){walkingController?.setDebug(enabled);}
function initCampusResidents(){
 // Reinitialization must never leave a second RAF loop or duplicate listeners.
 walkingController?.destroy();
 const events=new AbortController(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches,manualPaused=false,frame=null,lastTime=null,accumulator=0,npcHovered=false,destroyed=false,debug=false,lastActive=null;
 const layer=$('#campus-students');layer.removeAttribute('aria-hidden');layer.querySelectorAll('.walking-resident').forEach(el=>el.remove());
 const actors=[],fixedDepth=[];let tickCount=0;
 function actorAt(node,element,speed,id){const[x,y]=CAMPUS_NODES[node];return{id,node,target:node,zone:CAMPUS_NODE_ZONES[node],x,y,baseX:x,baseY:y,element,speed,velocity:0,path:[],curve:null,offset:0,travelled:0,gaitPhase:Math.random(),poseWeight:0,waiting:.3+Math.random()*2.5,heading:1,dx:1,dy:0,moving:false,yielding:false,completedRoutes:0};}
 function shuffled(list){return list.map(n=>[Math.random(),n]).sort((a,b)=>a[0]-b[0]).map(p=>p[1]);}
 const mainStarts=shuffled(CAMPUS_STOP_NODES.filter(i=>CAMPUS_NODE_ZONES[i]==='courtyard')),trackStarts=shuffled([40,44,48,52]),starts=[...mainStarts.slice(0,16),...trackStarts];
 for(let i=0;i<20;i++){
  const el=document.createElementNS('http://www.w3.org/2000/svg','g');el.setAttribute('class','walking-resident');el.setAttribute('aria-hidden','true');el.dataset.resident=String(i);el.dataset.expression=STUDENT_EXPRESSIONS[i%STUDENT_EXPRESSIONS.length];
  el.innerHTML=`<ellipse class="resident-ground-shadow" cy=".4" rx="6.8" ry="2.2" fill="#43684c32"/><g class="walker-figure">${animal(0,0,'',i%3===0?'rabbit':i%3===1?'bear':'cat',el.dataset.expression)}</g>`;
  el.querySelector('.animal-friend>ellipse')?.remove();layer.append(el);const actor=actorAt(starts[i],el,14+(i%5)*.8,i);
  const body=el.querySelector('.friend-bob'),legs=[el.querySelector('.step-left'),el.querySelector('.step-right')];
  // Legs keep their ground anchor; only the torso gets a tiny breathing bob.
  for(const leg of legs)body.parentNode.insertBefore(leg,body);
  actor.parts={figure:el.querySelector('.walker-figure'),body,left:legs[0],right:legs[1],legs:legs.map(el=>({el,skin:el.children[0],sock:el.children[1],shoe:el.children[2]})),armLeft:el.querySelector('.arm-left'),armRight:el.querySelector('.arm-right'),face:el.querySelector('.student-face')};actors.push(actor);
 }
 const visitorElement=createCampusVisitor(layer),visitor=actorAt(CAMPUS_NODE_INDEX[CAMPUS_VISITOR_HOME_NODE],visitorElement,0,21);visitor.waiting=Infinity;visitor.headClock=0;
 visitor.parts={figure:visitorElement.querySelector('.walker-figure'),head:visitorElement.querySelector('.visitor-head')};
 const pedestrians=actors;
 campusVisitorController={actor:visitor,buildingId:CAMPUS_VISITOR_BUILDING,homeNode:CAMPUS_NODE_INDEX[CAMPUS_VISITOR_HOME_NODE]};
 const npc=actorAt(CAMPUS_NODE_INDEX['service-start'],$('#reward-npc'),32,20);npc.waiting=0;
 const patrol=['service-start','service-end','service-start','service-south'].map(n=>CAMPUS_NODE_INDEX[n]);let patrolIndex=0;
 npc.wheels=[...npc.element.querySelectorAll('.scooter-wheel')];npc.scooter=npc.element.querySelector('.npc-scooter');npc.headband=npc.element.querySelector('.npc-headband');
 // Static geometry is cached once, and depth ordering only mutates DOM when
 // objects actually pass each other. Neither students nor shadows intercept clicks.
 for(const[id,place]of Object.entries(CAMPUS_PLACES)){
  if(id==='sports')continue;const el=$(`#occluder-${id}`);if(!el)continue;
  // The mask already includes the visible building silhouette. Extending its
  // depth below that silhouette hid walkers on the track and entrance paving.
  const depth=campusPoint(0,Math.max(...place.polygons.flat().map(p=>p[1])))[1];fixedDepth.push({element:el,y:depth,id:'building-'+id});layer.append(el);
 }
 for(const tree of CAMPUS_WALK_TREES){
  let el=$('#walk-occluder-'+tree.id);if(!el){el=document.createElementNS('http://www.w3.org/2000/svg','g');el.id='walk-occluder-'+tree.id;el.setAttribute('class','campus-occluder');el.setAttribute('aria-hidden','true');const polygon=tree.polygon.map(p=>campusPoint(...p).join(',')).join(' ');el.innerHTML=`<defs><clipPath id="walk-mask-${tree.id}" clipPathUnits="userSpaceOnUse"><polygon points="${polygon}"/></clipPath></defs><image href="${CAMPUS_ART}" width="1240" height="815" preserveAspectRatio="none" clip-path="url(#walk-mask-${tree.id})"/>`;}
  fixedDepth.push({element:el,y:campusPoint(...tree.base)[1],id:'tree-'+tree.id});layer.append(el);
 }
 let debugLayer=$('#campus-route-debug');if(!debugLayer){debugLayer=document.createElementNS('http://www.w3.org/2000/svg','g');debugLayer.id='campus-route-debug';debugLayer.setAttribute('aria-hidden','true');debugLayer.style.pointerEvents='none';$('#map-world').append(debugLayer);}
 function setDebug(enabled){debug=Boolean(enabled);debugLayer.style.display=debug?'':'none';if(debug){debugLayer.innerHTML=`${Object.entries(CAMPUS_NAV_ZONES).map(([zone,g])=>g.areas.map(poly=>`<polygon points="${poly.map(p=>campusPoint(...p).join(',')).join(' ')}" fill="${g.color}" fill-opacity=".12" stroke="${g.color}" stroke-width="1"/>`).join('')+g.holes.map(poly=>`<polygon points="${poly.map(p=>campusPoint(...p).join(',')).join(' ')}" fill="#d11" fill-opacity=".18" stroke="#d11"/>`).join('')).join('')}${CAMPUS_EDGES.map(([a,b])=>`<path d="M${CAMPUS_NODES[a]}L${CAMPUS_NODES[b]}" fill="none" stroke="${CAMPUS_NAV_ZONES[CAMPUS_NODE_ZONES[a]].color}" stroke-width="2"/>`).join('')}${CAMPUS_NODES.map(([x,y],i)=>`<g><circle cx="${x}" cy="${y}" r="3" fill="white" stroke="#356b64"/><text x="${x+5}" y="${y-5}" fill="#194d45" stroke="white" stroke-width="2" paint-order="stroke" font-size="10">${i}</text><title>${CAMPUS_NAV_POINTS[i][0]}</title></g>`).join('')}${actors.map(a=>`<g data-debug-actor="${a.id}"><circle r="${CAMPUS_WALK_RADIUS}" fill="none" stroke="#a21576" stroke-width="1"/><path d="M-4 0h8M0-4v8" stroke="#c04"/></g>`).join('')}`;paint();}}
 function choose(actor){
  let target;if(actor===npc){patrolIndex=(patrolIndex+1)%patrol.length;target=patrol[patrolIndex];}
  else{
   let candidates=CAMPUS_STOP_NODES.filter(i=>i!==actor.node&&CAMPUS_NODE_ZONES[i]===actor.zone&&campusRoute(actor.node,i).length>1);
   // One visitor at a time in the cul-de-sac across the marked crosswalk.
   candidates=candidates.filter(i=>i!==14||!actors.some(a=>a!==actor&&(a.node===14||a.target===14||a.path.includes(13))));
   candidates=candidates.filter(node=>!actors.some(a=>a!==actor&&(a.target===node||!a.curve&&a.node===node)));
   const options=candidates.map(node=>{const path=campusRoute(actor.node,node),length=path.slice(1).reduce((sum,n,i)=>sum+Math.hypot(CAMPUS_NODES[n][0]-CAMPUS_NODES[path[i]][0],CAMPUS_NODES[n][1]-CAMPUS_NODES[path[i]][1]),0);return{node,path,length};});
   const nearby=options.filter(c=>c.length>=45&&c.length<=260);
   const ranked=(nearby.length?nearby:options).map(c=>{const[x,y]=CAMPUS_NODES[c.node],busy=actors.filter(a=>a!==actor&&(a.target===c.node||!a.curve&&Math.hypot(a.x-x,a.y-y)<22)).length,traffic=actors.filter(a=>a!==actor&&a.curve&&c.path.some(n=>a.path.includes(n))).length;return{node:c.node,score:Math.random()*80-busy*200-traffic*7};}).sort((a,b)=>b.score-a.score);
   if(!ranked.length){actor.waiting=1;return;}target=ranked[0].node;
   const expression=STUDENT_EXPRESSIONS[Math.floor(Math.random()*STUDENT_EXPRESSIONS.length)];actor.parts.face.innerHTML=studentFace(expression);actor.parts.face.dataset.expression=expression;actor.element.dataset.expression=expression;
  }
  actor.target=target;actor.path=campusRoute(actor.node,target);actor.curve=residentCurve(actor.path,actor===npc?0:2.6);actor.offset=0;
 }
 function advance(actor,seconds){
  actor.moving=false;actor.yielding=false;
  if(actor===npc&&npcHovered){actor.velocity=0;return;}
  if(actor.waiting>0){actor.waiting=Math.max(0,actor.waiting-seconds);actor.velocity=0;return;}
  if(!actor.curve)choose(actor);if(!actor.curve)return;
  const remaining=actor.curve.total-actor.offset,p=residentCurvePoint(actor.curve,actor.offset),look=residentCurvePoint(actor.curve,actor.offset+12);
  let desired=Math.min(actor.speed*Math.min(p.turn,look.turn),Math.sqrt(Math.max(0,remaining)*26));
  if(actor!==npc){
   for(const other of pedestrians){if(other===actor)continue;const vx=other.x-actor.x,vy=other.y-actor.y,forward=vx*p.dx+vy*p.dy,across=Math.abs(vx*p.dy-vy*p.dx),sameDirection=p.dx*other.dx+p.dy*other.dy>.35;
    // Follow the person ahead; opposing streams have bounded, prechecked lanes.
    if(forward>0&&forward<27&&across<7&&sameDirection){const factor=Math.max(0,Math.min(1,(forward-12)/15));desired=Math.min(desired,actor.speed*factor);actor.yielding=true;}
   }
  }else{
   for(const student of pedestrians){const near=Math.hypot(student.x-actor.x,student.y-actor.y);if(near<72){desired=Math.min(desired,actor.speed*Math.max(0,(near-38)/34));actor.yielding=true;}}
  }
  const acceleration=actor===npc?34:23;
  actor.velocity+=Math.max(-acceleration*seconds,Math.min(acceleration*seconds,desired-actor.velocity));
  const travel=Math.min(remaining,Math.max(0,actor.velocity*seconds));actor.offset+=travel;
  const next=residentCurvePoint(actor.curve,actor.offset);actor.x=actor.baseX=next.x;actor.y=actor.baseY=next.y;actor.dx=next.dx;actor.dy=next.dy;
  if(Math.abs(next.dx)>.06)actor.heading=next.dx<0?-1:1;
  actor.travelled+=travel;actor.gaitPhase+=travel/(12+4*Math.abs(next.dx));actor.moving=travel>0&&actor.velocity>.15;
  if(remaining-travel<1e-9){actor.node=actor.target;actor.path=[];actor.curve=null;actor.velocity=0;actor.moving=false;actor.completedRoutes++;actor.waiting=actor===npc?.65:1.2+Math.random()*2.8;}
 }
 function simulate(seconds){for(const actor of pedestrians)advance(actor,seconds);advance(npc,seconds);for(const actor of pedestrians)actor.poseWeight+=(Number(actor.moving)*Math.min(1,actor.velocity/4)-actor.poseWeight)*(1-Math.exp(-seconds*18));visitor.headClock+=seconds;tickCount++;}
 function legPose(actor,part,index,active){
  const hip=index?5:-5,shoeX=index?5:-6,phase=(actor.gaitPhase+index*.5)%1,stance=.55,stride=12+4*Math.abs(actor.dx),half=stride*stance/2;
  let along,lift=0;if(phase<stance)along=half-phase/stance*(2*half);else{const t=(phase-stance)/(1-stance),ease=t*t*(3-2*t);along=-half+2*half*ease;lift=Math.sin(t*Math.PI)*1.35;}
  const weight=active?actor.poseWeight:0,x=shoeX+along*actor.dx/(actor.heading*STUDENT_SCALE)*weight,y=6+(along*actor.dy-lift)/STUDENT_SCALE*weight;
  // Two-segment legs remain attached at the hip while the actual shoes move.
  const kneeX=hip+(x-hip)*.48,kneeY=-5+(y+3)*.46;
  residentAttribute(part.skin,'d',`M${hip} -5Q${kneeX.toFixed(2)} ${kneeY.toFixed(2)} ${x.toFixed(2)} ${(y-3).toFixed(2)}`);
  residentAttribute(part.sock,'d',`M${x.toFixed(2)} ${(y-4).toFixed(2)}v4`);residentAttribute(part.shoe,'cx',x.toFixed(2));residentAttribute(part.shoe,'cy',y.toFixed(2));
  residentAttribute(part.el,'transform','translate(0 0)');
 }
 function paint(){
  const active=!paused&&!document.hidden&&!$('#map-page').hidden&&$('#modal-backdrop').hidden&&!document.body.classList.contains('department-zooming');
  if(active!==lastActive){document.body.classList.toggle('residents-inactive',!active);lastActive=active;}
  for(const actor of pedestrians){
   residentAttribute(actor.element,'transform',`translate(${actor.x.toFixed(3)} ${actor.y.toFixed(3)})`);
   residentAttribute(actor.parts.figure,'transform',`translate(0 ${-STUDENT_SOLE*STUDENT_SCALE}) scale(${actor.heading*STUDENT_SCALE} ${STUDENT_SCALE})`);
   const weight=active?actor.poseWeight:0,swing=Math.sin(actor.gaitPhase*Math.PI*2)*weight;
   legPose(actor,actor.parts.legs[0],0,active);legPose(actor,actor.parts.legs[1],1,active);
   residentAttribute(actor.parts.body,'transform',`translate(0 ${(-Math.abs(swing)*.18).toFixed(2)})`);
   residentAttribute(actor.parts.armLeft,'transform',`rotate(${(-swing*13).toFixed(2)} -9 -17)`);residentAttribute(actor.parts.armRight,'transform',`rotate(${(swing*13).toFixed(2)} 9 -17)`);
   actor.element.classList.toggle('is-walking',active&&actor.moving);if(actor.element.dataset.node!==String(actor.node))actor.element.dataset.node=actor.node;
   if(debug)residentAttribute(debugLayer.querySelector(`[data-debug-actor="${actor.id}"]`),'transform',`translate(${actor.x} ${actor.y})`);
  }
  residentAttribute(visitor.element,'transform',`translate(${visitor.x.toFixed(3)} ${visitor.y.toFixed(3)})`);
  residentAttribute(visitor.parts.figure,'transform',`translate(0 ${-STUDENT_SOLE*STUDENT_SCALE}) scale(${STUDENT_SCALE} ${STUDENT_SCALE})`);
  residentAttribute(visitor.parts.head,'transform',`rotate(${(active?campusVisitorHeadAngle(visitor.headClock):0).toFixed(3)} 0 -25)`);
  residentAttribute(npc.element,'transform',`translate(${npc.x.toFixed(3)} ${npc.y.toFixed(3)})`);residentAttribute(npc.scooter,'transform',`translate(0 ${-17*NPC_SCALE}) scale(${npc.heading*NPC_SCALE} ${NPC_SCALE})`);residentAttribute(npc.headband,'transform',`scale(${npc.heading} 1)`);
  for(const wheel of npc.wheels)residentAttribute(wheel,'transform',`rotate(${npc.travelled/(7*NPC_SCALE)*180/Math.PI%360})`);
  npc.element.dataset.yielding=String(npc.yielding);npc.element.dataset.campusX=npc.x.toFixed(3);npc.element.dataset.campusY=npc.y.toFixed(3);
  const depth=[...fixedDepth,...pedestrians,visitor,npc].sort((a,b)=>a.y-b.y||String(a.id).localeCompare(String(b.id)));let cursor=layer.firstChild;
  for(const item of depth){if(item.element===cursor)cursor=cursor.nextSibling;else layer.insertBefore(item.element,cursor);}
 }
 function step(seconds,render=true){accumulator+=Math.max(0,Math.min(.1,seconds));while(accumulator+1e-9>=WALK_FIXED_STEP){simulate(WALK_FIXED_STEP);accumulator-=WALK_FIXED_STEP;}if(render)paint();}
 function running(){return!paused&&!document.hidden;}
 function tick(time){frame=null;if(!running()||destroyed){lastTime=null;return;}const delta=lastTime===null?0:Math.max(0,Math.min((time-lastTime)/1000,.1));lastTime=time;
  if(!$('#map-page').hidden&&$('#modal-backdrop').hidden&&!document.body.classList.contains('department-zooming'))step(delta);else{accumulator=0;paint();}
  if(running())frame=requestAnimationFrame(tick);
 }
 function schedule(){if(running()&&frame===null){lastTime=null;frame=requestAnimationFrame(tick);}}
 function updateControl(){document.body.classList.toggle('residents-paused',paused);$('#toggle-walk').setAttribute('aria-pressed',String(paused));$('#toggle-walk').disabled=reduced.matches;$('#toggle-walk').textContent=reduced.matches?'已減少動態':paused?'▶ 繼續逛校園':'Ⅱ 暫停動態';
  if(paused&&frame!==null){cancelAnimationFrame(frame);frame=null;}lastTime=null;accumulator=0;paint();schedule();
 }
 $('#toggle-walk').onclick=()=>{manualPaused=!paused;paused=manualPaused||reduced.matches;updateControl();};
 reduced.addEventListener('change',()=>{paused=manualPaused||reduced.matches;updateControl();},{signal:events.signal});
 document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('scene-hidden',document.hidden);lastTime=null;accumulator=0;if(document.hidden&&frame!==null){cancelAnimationFrame(frame);frame=null;}paint();schedule();},{signal:events.signal});
 const el=npc.element;el.onpointerenter=()=>npcHovered=true;el.onpointerleave=()=>npcHovered=false;el.onfocus=()=>npcHovered=true;el.onblur=()=>npcHovered=false;
 walkingController={get paused(){return paused;},get frame(){return frame;},get tickCount(){return tickCount;},get debug(){return debug;},actors,advance,paint,step,setDebug,destroy(){destroyed=true;events.abort();if(frame!==null)cancelAnimationFrame(frame);frame=null;}};
 npcController={actor:npc,advance:seconds=>advance(npc,seconds),get paused(){return paused;}};
 setDebug(new URLSearchParams(location.search).get('routes')==='1');updateControl();
}
