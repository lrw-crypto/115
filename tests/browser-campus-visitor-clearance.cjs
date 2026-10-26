const assert=require('node:assert/strict');const{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const url=process.env.CAMPUS_BASE_URL||'http://127.0.0.1:8012/115/',errors=[];
 for(const seed of [7,42,915]){
  const context=await browser.newContext({viewport:{width:1440,height:1100},reducedMotion:'reduce'});await context.addInitScript(seed=>{let state=seed;Math.random=()=>((state=(state*1664525+1013904223)>>>0)/4294967296)},seed);
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
  assert.deepEqual(await page.evaluate(()=>validateCampusNavigation()),[]);
  const result=await page.evaluate(()=>{
   const visitor=campusVisitorController.actor,home=[visitor.x,visitor.y],bounds=campusFixedResidentBounds();let forbidden=0,jump=0,minGap=Infinity,overlappingBodies=0;
   function inspect(){for(const a of walkingController.actors){if(!campusFixedResidentClear(a.x,a.y))forbidden++;minGap=Math.min(minGap,Math.max(Math.abs(a.x-visitor.x)-bounds.halfWidth,Math.abs(a.y-visitor.y)-bounds.halfDepth));}}
   inspect();
   for(let f=0;f<18000;f++){
    const before=walkingController.actors.map(a=>[a.x,a.y]);walkingController.step(1/60,false);inspect();
    for(let i=0;i<20;i++){const a=walkingController.actors[i];jump=Math.max(jump,Math.hypot(a.x-before[i][0],a.y-before[i][1]));if(a.curve&&!campusFixedResidentClear(...CAMPUS_NODES[a.target]))throw Error('occupied destination');}
    if(f%120===0){walkingController.paint();for(const v of [visitor.parts.figure.getBoundingClientRect(),document.querySelector('.supporter-figure').getBoundingClientRect()])for(const a of walkingController.actors){const b=a.parts.figure.getBoundingClientRect();if(Math.min(b.right,v.right)>Math.max(b.left,v.left)&&Math.min(b.bottom,v.bottom)>Math.max(b.top,v.top))overlappingBodies++;}}
   }
   // Exercise the per-substep guard even if a future bad curve is supplied.
   const start=[visitor.x-bounds.halfWidth-1,visitor.y],probe={...walkingController.actors[0],x:start[0],y:start[1],offset:0,velocity:1000,speed:1000,waiting:0,curve:residentSampledCurve([start,[visitor.x,visitor.y]])};walkingController.advance(probe,.1);
   walkingController.paint();return{forbidden,jump,minGap,overlappingBodies,completed:walkingController.actors.map(a=>a.completedRoutes),home,after:[visitor.x,visitor.y],guardStopped:probe.x===start[0]&&probe.offset===0&&probe.yielding,blockedNodeRoutes:campusRoute(0,CAMPUS_NODE_INDEX[CAMPUS_VISITOR_HOME_NODE]).length};
  });
  console.log('300-second fixed visitor clearance:',seed,result);
  assert.equal(result.forbidden,0);assert.equal(result.overlappingBodies,0);assert(result.minGap>=0);assert(result.jump<.3);assert(result.completed.every(n=>n>=3),'students must keep completing trips');assert.deepEqual(result.after,result.home);assert(result.guardStopped);assert.equal(result.blockedNodeRoutes,0);
  await page.evaluate(()=>setCampusRouteDebug(true));assert.equal(await page.locator('.fixed-resident-clearance').count(),2);assert(await page.locator('.fixed-resident-clearance').first().isVisible());await page.evaluate(()=>setCampusRouteDebug(false));
  if(seed===915){await page.screenshot({path:'/tmp/visitor-clearance-desktop.png'});await page.setViewportSize({width:390,height:844});await page.locator('#map-fit').click();await page.screenshot({path:'/tmp/visitor-clearance-mobile.png',fullPage:true});await page.locator('#campus-visitor').click();assert.equal(await page.locator('#dialog-title').innerText(),'我沒吃鳳梨跟芒果呀!');await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>questCoins()),0);}
  await context.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS: no student body overlap or keep-out entry in three 300-second seeds, safe spawns/destinations/turns, no blocked crowds, fixed position, runtime guard, debug buffer and mobile dialogue.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
