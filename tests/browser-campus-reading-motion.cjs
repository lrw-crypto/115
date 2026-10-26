const assert=require('node:assert/strict');
const{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.CAMPUS_BASE_URL||'http://127.0.0.1:8000/');
 assert(await page.locator('#campus-illustration').getAttribute('href').then(s=>s.includes('iron-roofs')));
 const guides=await page.evaluate(()=>Object.entries(DEPARTMENT_GUIDES).map(([id,guide])=>({id,topics:guide.topics.length,missing:guide.topics.flatMap(t=>t.courses.filter(name=>!CURRICULUM.programs.find(p=>p.id===id).courses.some(c=>c.name===name)))})));
 assert.equal(guides.length,8);for(const g of guides){assert.equal(g.topics,4);assert.deepEqual(g.missing,[],g.id)}
 await page.locator('[data-label-for="mechanical"] .label-bg').click();
 assert(await page.evaluate(()=>document.body.classList.contains('department-zooming')));
 assert(await page.locator('#modal-backdrop').isHidden());await page.waitForTimeout(160);assert(await page.evaluate(()=>camera.scale>1&&camera.scale<1.75));
 await page.locator('#start-campus-mission').waitFor({state:'visible'});assert.equal(await page.locator('#dialog-title').innerText(),'機械科');assert.equal(await page.evaluate(()=>camera.scale),1.75);
 assert.equal(await page.locator('.department-topic').count(),4);await page.locator('.department-topic summary').first().click();
 const desktopSizes=await page.evaluate(()=>['.department-welcome p','.topic-story p','.department-topic summary b'].map(s=>parseFloat(getComputedStyle(document.querySelector(s)).fontSize)));assert(desktopSizes.every(n=>n>=18));
 await page.locator('.full-course-plan>summary').click();assert(await page.locator('.full-course-plan .friendly-lesson').count()>15);
 await page.screenshot({path:'/tmp/caoshang-readable-department-desktop.png',fullPage:true});await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>camera.scale),1);
 // A new action or Escape must cancel the pending introduction.
 await page.locator('[data-label-for="piping"]').click();await page.keyboard.press('Escape');await page.waitForTimeout(700);assert(await page.locator('#modal-backdrop').isHidden());assert.equal(await page.evaluate(()=>camera.scale),1);
 await page.locator('[data-label-for="mechanical"]').click();await page.locator('.search-toggle').click();await page.waitForTimeout(700);assert.equal(await page.locator('#dialog-title').innerText(),'想體驗哪個科別？');await page.keyboard.press('Escape');
 await page.setViewportSize({width:390,height:844});await page.locator('[data-passport="data"]').click();await page.locator('#start-campus-mission').waitFor({state:'visible'});await page.locator('.data-learn-more summary').click();
 assert.equal(await page.locator('#dialog-title').innerText(),'資料處理科');assert(await page.locator('.data-intro-cover p').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=17));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:'/tmp/caoshang-readable-department-mobile.png',fullPage:true});await page.keyboard.press('Escape');
 // Distance-driven stepping and rolling are observable while the scene runs.
 await page.setViewportSize({width:1440,height:1100});await page.mouse.move(5,90);await page.waitForFunction(()=>walkingController.actors.some(a=>a.moving));
 const id=await page.evaluate(()=>walkingController.actors.findIndex(a=>a.moving)),leg=await page.locator(`[data-resident="${id}"] .step-left`).getAttribute('transform');await page.waitForTimeout(160);assert.notEqual(await page.locator(`[data-resident="${id}"] .step-left`).getAttribute('transform'),leg);
 await page.waitForFunction(()=>npcController.actor.travelled>3);assert.equal(await page.locator('.scooter-wheel').count(),2);assert.match(await page.locator('.scooter-wheel').first().getAttribute('transform'),/rotate\(/);
 const grounded=await page.evaluate(()=>{const a=walkingController.actors[0],shadow=a.element.querySelector('.resident-ground-shadow').getScreenCTM(),foot=new DOMPoint(0,0).matrixTransform(a.element.getScreenCTM()),npc=npcController.actor,wheel=npc.wheels[0],axle=new DOMPoint(0,0).matrixTransform(wheel.getScreenCTM()),radius=7*Math.hypot(wheel.getScreenCTM().a,wheel.getScreenCTM().b),ground=new DOMPoint(npc.x,npc.y).matrixTransform(document.querySelector('#map-world').getScreenCTM());return{shadow:Math.abs(shadow.f-foot.y),wheel:Math.abs(axle.y+radius-ground.y)}});
 assert(grounded.shadow<2); // The root shadow does not bounce with the student's body.
 assert(grounded.wheel<.1,'wheel bottom must touch its path ground plane');
 await page.locator('#toggle-walk').click();const stopped=await page.locator('.scooter-wheel').first().getAttribute('transform');await page.waitForTimeout(160);assert.equal(await page.locator('.scooter-wheel').first().getAttribute('transform'),stopped);
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-label-for="english"] .label-bg').click();await page.locator('#start-campus-mission').waitFor({state:'visible'});assert.equal(await page.evaluate(()=>departmentZoomFrame),null);await page.keyboard.press('Escape');
 assert.deepEqual(errors,[]);
 // Simulate 100 seconds at 60 Hz for each seed: continuity and pedestrian clearance.
 for(const seed of [7,42]){
  const context=await browser.newContext();await context.addInitScript(seed=>{let state=seed;Math.random=()=>((state=(state*1664525+1013904223)>>>0)/4294967296)},seed);
  const scene=await context.newPage();await scene.goto(process.env.CAMPUS_BASE_URL||'http://127.0.0.1:8000/');await scene.locator('#toggle-walk').click();
  const result=await scene.evaluate(()=>{const actors=walkingController.actors,npc=npcController.actor;let nearest=Infinity,jump=0,vehicleJump=0,yields=0;for(let f=0;f<6000;f++){const old=actors.map(a=>[a.x,a.y]),vehicle=[npc.x,npc.y];walkingController.step(1/60);for(let i=0;i<actors.length;i++){nearest=Math.min(nearest,Math.hypot(actors[i].x-npc.x,actors[i].y-npc.y));jump=Math.max(jump,Math.hypot(actors[i].x-old[i][0],actors[i].y-old[i][1]));}vehicleJump=Math.max(vehicleJump,Math.hypot(npc.x-vehicle[0],npc.y-vehicle[1]));if(npc.yielding)yields++;}return{nearest,jump,vehicleJump,yields,drive:npc.travelled}});
  assert(result.nearest>=37.9,JSON.stringify({seed,...result}));assert(result.jump<1.5,JSON.stringify({seed,...result}));assert(result.vehicleJump<.6);assert(result.yields>0&&result.drive>100);await context.close();
 }
 console.log('PASS: 8 sourced short guides, readable desktop/mobile text, zoom-before-intro and cancellation, distance-based steps and wheels, reduced motion, 60 Hz continuity and NPC yielding with pedestrian clearance.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
