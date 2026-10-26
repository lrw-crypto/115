const assert=require('node:assert/strict');const{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto(process.env.CAMPUS_BASE_URL||'http://127.0.0.1:8012/115/');
 assert.equal(await page.locator('#campus-visitor').count(),1);assert.equal(await page.locator('.walking-resident').count(),20);
 const saved=await page.evaluate(()=>JSON.stringify(questState));
 const route=await page.evaluate(()=>{let unsafe=0,jump=0,ends=new Set(),headings=new Set();const a=campusVisitorController.actor,allowed=campusVisitorController.route;for(let f=0;f<7200;f++){const[x,y]=[a.x,a.y],old=a.completedRoutes;walkingController.step(1/60,false);if(a.path.some(n=>!allowed.includes(n)))throw Error('visitor left right-side route');if(!campusWalkPointSafe(a.x,a.y,CAMPUS_WALK_RADIUS,a.zone))unsafe++;jump=Math.max(jump,Math.hypot(a.x-x,a.y-y));headings.add(a.heading);if(a.completedRoutes>old)ends.add(CAMPUS_NAV_POINTS[a.node][0]);}walkingController.paint();return{unsafe,jump,ends:[...ends],headings:[...headings],completed:a.completedRoutes,students:walkingController.actors.length,studentMinRoutes:Math.min(...walkingController.actors.map(s=>s.completedRoutes))}});
 assert.equal(route.unsafe,0);assert(route.jump<.24);assert(route.completed>=3);assert.deepEqual(route.ends.sort(),['east-1','east-end']);assert.equal(route.headings.length,2);assert.equal(route.students,20);assert(route.studentMinRoutes>=1);console.log('120-second right-side patrol:',route);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>campusVisitorController.actor.moving);await page.mouse.move(4,80);
 const left=page.locator('#campus-visitor .step-left ellipse'),leg=await left.getAttribute('cx');await page.waitForTimeout(180);assert.notEqual(await left.getAttribute('cx'),leg);
 await page.locator('#toggle-walk').click();const paused=await page.locator('#campus-visitor').getAttribute('transform');await page.waitForTimeout(150);assert.equal(await page.locator('#campus-visitor').getAttribute('transform'),paused);
 await page.locator('#campus-visitor').click();assert.equal(await page.locator('#dialog-title').innerText(),'我沒吃鳳梨跟芒果呀!');
 await page.locator('.crying-visitor-portrait').evaluate(el=>el.decode());assert(await page.locator('.crying-visitor-portrait').evaluate(el=>el.naturalWidth===1024&&el.naturalHeight===1536));await page.screenshot({path:'/tmp/crying-visitor-desktop.png'});
 await page.keyboard.press('Escape');assert(await page.locator('#campus-visitor').evaluate(el=>el===document.activeElement));assert.equal(await page.evaluate(()=>JSON.stringify(questState)),saved);
 await page.mouse.move(4,80);await page.locator('#toggle-walk').click();await page.waitForFunction(()=>campusVisitorController.actor.moving);await page.locator('#toggle-walk').click();
 // Keyboard entry and stationary focus also work without awarding coins.
 await page.locator('#campus-visitor').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#dialog-title').innerText(),'我沒吃鳳梨跟芒果呀!');await page.keyboard.press('Escape');
 await page.setViewportSize({width:390,height:844});await page.locator('#map-fit').click();await page.locator('#campus-visitor').click();await page.locator('.crying-visitor-portrait').evaluate(el=>el.decode());
 assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));await page.screenshot({path:'/tmp/crying-visitor-mobile.png'});await page.locator('.dialog-close').click();assert.equal(await page.evaluate(()=>questCoins()),0);
 await page.evaluate(()=>initCampusResidents());assert.equal(await page.locator('#campus-visitor').count(),1);assert.equal(await page.locator('.walking-resident').count(),20);
 await page.locator('[data-passport="data"]').click();await page.locator('.data-department-dialog').waitFor({state:'visible'});assert.equal(await page.locator('.data-photo-card').count(),7);await page.keyboard.press('Escape');
 assert.deepEqual(errors,[]);console.log('PASS: one new visitor, right-side-only safe patrol and turns, grounded leg motion, shared pause/resume, desktop/mobile click and keyboard, crying portrait and exact quote, no coin/progress change, reinitialization and original photo intro.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
