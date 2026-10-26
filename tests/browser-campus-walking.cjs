const assert=require('node:assert/strict');
const{chromium}=require('playwright');
const base=process.env.CAMPUS_BASE_URL||'http://127.0.0.1:8012/115/';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const errors=[];
 async function seededPage(seed,options={}){const context=await browser.newContext({viewport:{width:1440,height:1100},reducedMotion:'reduce',...options});await context.addInitScript(seed=>{let state=seed;Math.random=()=>((state=(state*1664525+1013904223)>>>0)/4294967296)},seed);const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base);return{context,page};}
 const{context,page}=await seededPage(73);
 assert.equal(await page.locator('.walking-resident').count(),20);
 assert.equal(await page.locator('#campus-route-debug').isVisible(),false);
 assert.deepEqual(await page.evaluate(()=>validateCampusNavigation()),[]);
 const geometry=await page.evaluate(()=>{
  let curves=0,samples=0;const invalid=[];
  for(const from of CAMPUS_WALK_NODES)for(const to of CAMPUS_WALK_NODES){
   const path=campusRoute(from,to),zone=CAMPUS_NODE_ZONES[from];
   if(zone!==CAMPUS_NODE_ZONES[to]){if(path.length)invalid.push(['disconnected',from,to]);continue;}
   if(from===to)continue;
   if(path.at(-1)!==to){invalid.push(['unreachable',from,to]);continue;}
   const curve=residentCurve(path,2.6);curves++;
   for(let i=1;i<curve.points.length;i++){samples++;if(!campusWalkSegmentSafe(curve.points[i-1],curve.points[i],CAMPUS_WALK_RADIUS,zone))invalid.push(['corner/width',from,to,i]);}
   // Any trip between the forecourt/road and classrooms uses the open gate.
   const inside=i=>i<=8||i>=19&&i<=28||i>=54;
   if(zone==='courtyard'&&inside(from)!==inside(to)&&!path.some((n,i)=>i&&([8,9].includes(n)&&[8,9].includes(path[i-1]))))invalid.push(['gate',from,to]);
  }
  return{curves,samples,invalid};
 });
 assert.deepEqual(geometry.invalid,[]);console.log('Geometry:',geometry.curves,'ordered route pairs,',geometry.samples,'swept curve segments, radius',await page.evaluate(()=>CAMPUS_WALK_RADIUS));
 for(const seed of [7,42,73]){
  const scene=seed===73?{page,context}:await seededPage(seed),p=scene.page;
  const result=await p.evaluate(()=>{
   let unsafe=0,jump=0,overlap=0,closest=Infinity,arrivals=0;const actors=walkingController.actors;
   for(let f=0;f<18000;f++){
    const old=actors.map(a=>[a.x,a.y]),done=actors.map(a=>a.completedRoutes);walkingController.step(1/60,false);
    for(let i=0;i<actors.length;i++){
     const a=actors[i];jump=Math.max(jump,Math.hypot(a.x-old[i][0],a.y-old[i][1]));if(!campusWalkPointSafe(a.x,a.y,CAMPUS_WALK_RADIUS,a.zone))unsafe++;
     if(a.completedRoutes>done[i]){const node=CAMPUS_NODES[a.node];if(Math.hypot(a.x-node[0],a.y-node[1])>1e-7)throw Error('endpoint teleported');arrivals++;}
     if(a.curve&&a.path.some(n=>CAMPUS_NODE_ZONES[n]!==a.zone))throw Error('unreachable destination');
     if(Math.abs(a.dx)>.06&&Math.sign(a.dx)!==a.heading)throw Error('wrong facing');
     closest=Math.min(closest,Math.hypot(a.x-npcController.actor.x,a.y-npcController.actor.y));
     for(let j=i+1;j<actors.length;j++)if(Math.hypot(a.x-actors[j].x,a.y-actors[j].y)<1)overlap++;
    }
   }
   walkingController.paint();return{unsafe,jump,overlap,closest,arrivals,completed:actors.map(a=>a.completedRoutes)};
  });
  console.log('300-second simulation:',seed,result);
  assert.equal(result.unsafe,0);assert(result.jump<.3);assert(result.completed.every(n=>n>=5));assert(result.closest>38);assert(result.overlap<180,'near-exact overlap must remain rare');
  if(seed!==73)await scene.context.close();
 }
 // The same simulation must not depend on the screen refresh rate.
 let reference;
 for(const hz of [30,60,144]){
  const scene=await seededPage(915),state=await scene.page.evaluate(hz=>{for(let i=0;i<hz*30;i++)walkingController.step(1/hz,false);return walkingController.actors.map(a=>[a.x,a.y,a.travelled,a.completedRoutes])},hz);
  if(!reference)reference=state;else for(let i=0;i<20;i++)for(let j=0;j<4;j++)assert(Math.abs(reference[i][j]-state[i][j])<1e-6,`refresh rate ${hz}, actor ${i}`);
  await scene.context.close();
 }
 // Rendering uses a fixed sole, stable ground shadow, and independently moving feet.
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.locator('#toggle-walk').click(); // manual pause for deterministic posing
 await page.evaluate(()=>{const a=walkingController.actors.find(a=>a.curve);window.poseActor=a;a.poseWeight=1;});
 const pose=await page.evaluate(()=>{walkingController.paint();const a=window.poseActor,leg=a.parts.legs[0],first=[leg.shoe.getAttribute('cx'),leg.shoe.getAttribute('cy')];a.gaitPhase+=.25;walkingController.paint();const ground=a.element.querySelector('.resident-ground-shadow').transform.baseVal.numberOfItems;return{first,second:[leg.shoe.getAttribute('cx'),leg.shoe.getAttribute('cy')],legParent:leg.el.parentNode.classList.contains('animal-friend'),ground,sole:STUDENT_SOLE*STUDENT_SCALE,figure:a.parts.figure.getAttribute('transform')};});
 // Inactive posing is neutral; activate briefly and observe the actual moving feet.
 assert(pose.legParent);assert.equal(pose.ground,0);assert.match(pose.figure,/translate\(0 -5\.828/);
 await page.locator('#toggle-walk').click();await page.waitForFunction(()=>walkingController.actors.some(a=>a.moving));
 const moving=await page.evaluate(()=>walkingController.actors.find(a=>a.moving).id),feet=page.locator(`[data-resident="${moving}"] .step-left ellipse`);
 const foot=await feet.getAttribute('cx');await page.waitForTimeout(180);assert.notEqual(await feet.getAttribute('cx'),foot);
 await page.locator('#toggle-walk').click();const stopped=await page.locator(`[data-resident="${moving}"]`).getAttribute('transform'),idleFoot=await feet.getAttribute('cy');await page.waitForTimeout(180);assert.equal(await feet.getAttribute('cy'),idleFoot);assert.equal(await page.locator(`[data-resident="${moving}"]`).getAttribute('transform'),stopped);assert.equal(await page.evaluate(()=>walkingController.frame),null);
 await page.locator('#toggle-walk').click();await page.waitForTimeout(20);const resumed=await page.evaluate(id=>{const a=walkingController.actors[id];return[a.x,a.y]},moving);const before=stopped.match(/translate\(([^ ]+) ([^)]+)\)/).slice(1).map(Number);assert(Math.hypot(resumed[0]-before[0],resumed[1]-before[1])<1);
 // Hide/show dispatch exercises the same lifecycle event as switching tabs.
 await page.evaluate(()=>{window.walkHidden=true;Object.defineProperty(document,'hidden',{configurable:true,get:()=>window.walkHidden});document.dispatchEvent(new Event('visibilitychange'));});
 const hidden=await page.evaluate(()=>walkingController.actors.map(a=>[a.x,a.y]));assert.equal(await page.evaluate(()=>walkingController.frame),null);await page.waitForTimeout(250);assert.deepEqual(await page.evaluate(()=>walkingController.actors.map(a=>[a.x,a.y])),hidden);
 await page.evaluate(()=>{window.walkHidden=false;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(25);const returned=await page.evaluate(()=>walkingController.actors.map(a=>[a.x,a.y]));for(let i=0;i<20;i++)assert(Math.hypot(hidden[i][0]-returned[i][0],hidden[i][1]-returned[i][1])<1);
 // Real-time observation: multiple students finish short trips while rendered.
 let completed=await page.evaluate(()=>walkingController.actors.map(a=>a.completedRoutes));
 for(let second=0;second<32;second+=8){await page.waitForTimeout(8000);await page.screenshot({path:`/tmp/campus-walk-observation-${second+8}.png`});}
 const observed=await page.evaluate(()=>walkingController.actors.map(a=>a.completedRoutes));const finished=observed.filter((n,i)=>n>completed[i]).length;console.log('Real-time observed route finishers:',finished,'/ 20');assert(finished>=8);
 await page.locator('#toggle-walk').click();
 // Camera changes act on the world parent, never on the simulation's coordinates.
 const locations=await page.evaluate(()=>walkingController.actors.map(a=>[a.x,a.y]));await page.locator('#zoom-in').click();
 const map=await page.locator('#map-viewport').boundingBox();await page.mouse.move(map.x+map.width/2,map.y+map.height/2);await page.mouse.down();await page.mouse.move(map.x+map.width/2+40,map.y+map.height/2+12,{steps:6});await page.mouse.up();await page.locator('#reset-map').click();assert.deepEqual(await page.evaluate(()=>walkingController.actors.map(a=>[a.x,a.y])),locations);
 await page.evaluate(()=>setCampusRouteDebug(true));assert(await page.locator('#campus-route-debug').isVisible());assert.equal(await page.locator('[data-debug-actor]').count(),20);await page.screenshot({path:'/tmp/campus-walk-final-debug.png'});await page.evaluate(()=>setCampusRouteDebug(false));
 assert(await page.locator('.walking-resident,.resident-ground-shadow').evaluateAll(els=>els.every(el=>getComputedStyle(el).pointerEvents==='none')));
 // Local foreground copies must pass behind/in front of students with their feet.
 const depth=await page.evaluate(()=>{const a=walkingController.actors[0],saved=[a.x,a.y],tree=document.querySelector('#walk-occluder-east-tree-1'),[x,y]=campusPoint(952,525);a.x=x;a.y=y-20;walkingController.paint();const behind=Boolean(a.element.compareDocumentPosition(tree)&Node.DOCUMENT_POSITION_FOLLOWING);a.y=y+20;walkingController.paint();const front=Boolean(tree.compareDocumentPosition(a.element)&Node.DOCUMENT_POSITION_FOLLOWING);[a.x,a.y]=saved;walkingController.paint();return{behind,front,sameArt:tree.querySelector('image').getAttribute('href')===CAMPUS_ART}});assert(depth.behind&&depth.front&&depth.sameArt);
 // Reinitialization cleans up the previous loop and all listeners.
 await page.evaluate(()=>{window.oldWalking=walkingController;initCampusResidents();});assert.equal(await page.evaluate(()=>window.oldWalking.frame),null);assert.equal(await page.locator('.walking-resident').count(),20);await page.locator('#toggle-walk').click();assert.equal(await page.evaluate(()=>walkingController.frame),null);
 await page.setViewportSize({width:390,height:844});await page.locator('#map-fit').click();assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));await page.screenshot({path:'/tmp/campus-walk-final-mobile.png',fullPage:true});
 await page.locator('[data-passport="data"]').click();await page.locator('.data-department-dialog').waitFor({state:'visible'});assert.equal(await page.locator('.data-photo-card').count(),7);await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>questCoins()),0);
 await page.locator('[data-passport="english"]').click();await page.locator('#start-campus-mission').click();await page.locator('[data-english="welcome"]').click();assert.equal(await page.evaluate(()=>questCoins()),1);
 assert.deepEqual(errors,[]);console.log('PASS: swept route geometry, gate topology, three seeds / 300 seconds, 30/60/144 Hz equality, independent grounded feet, pause/resume, tab lifecycle, real-time walking, camera transforms, single RAF, debug off, mobile and existing photo/game/coin flow.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
