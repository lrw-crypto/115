const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs');
const {createHash}=require('node:crypto');
const digest=s=>createHash('sha256').update(s).digest('hex');
// The scooter/uniform materials are preserved; students may now vary expressions.

assert.equal(digest(fs.readFileSync('assets/campus-art.js')),'b60da51c33057cc795450241fee7ee92b888b2a498fa33b492f6f870b42df3a6');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.CAMPUS_BASE_URL||'http://127.0.0.1:8000/');
 for(const selector of ['#campus-illustration','#groundskeeper-cat image']){
  const loaded=await page.locator(selector).evaluate(el=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i.naturalWidth>100);i.onerror=reject;i.src=el.getAttribute('href')}));assert(loaded);
 }
 assert.equal(await page.locator('.campus-building').count(),0);
 assert.equal(await page.locator('.campus-map-label').count(),8);
 const placements=await page.evaluate(()=>Object.fromEntries(departments.map(d=>[d.id,d.buildingId])));
 assert.deepEqual(placements,{mechanical:'mechanical-hall',piping:'rear-right',business:'left-2',accounting:'left-2',data:'left-2',english:'right-2',service:'left-1',sports:'sports'});
 assert.equal(await page.locator('[data-building="central"],[data-building="right-1"],[data-building-id="central"],[data-building-id="right-1"]').count(),0);
 assert.equal(await page.locator('#campus-main-gate').getAttribute('data-open'),'true');
 const gate=await page.evaluate(()=>{const a=document.querySelector('#campus-main-gate').transform.baseVal.consolidate().matrix,b=document.querySelector('#campus-side-school-name').transform.baseVal.consolidate().matrix;return{front:a.e,side:b.e,rotation:Math.atan2(b.b,b.a)}});
 assert(gate.side>gate.front&&gate.rotation<0);
 assert.equal(await page.locator('#reward-npc>g:last-child text').textContent(),'中鼎文');
 assert.equal(await page.locator('.npc-headband text').textContent(),'客服');
 await page.locator('#reward-npc').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#dialog-title').innerText(),'校園客服-中鼎文');await page.keyboard.press('Escape');
 const clickArt=async(x,y)=>{const p=await page.evaluate(([u,v])=>{const [x,y]=campusPoint(u,v),q=new DOMPoint(x,y).matrixTransform(document.querySelector('#map-world').getScreenCTM());return{x:q.x,y:q.y}},[x,y]);await page.mouse.click(p.x,p.y);};
 for(const point of [[350,320],[690,573],[1015,225],[890,160],[1200,355],[280,200]]){await clickArt(...point);assert(await page.locator('#modal-backdrop').isHidden());}
 for(const id of Object.keys(placements)){await page.locator(`[data-label-for="${id}"] .label-bg`).click();await page.locator('#start-campus-mission').waitFor({state:'visible'});assert.equal(await page.locator('#start-campus-mission').count(),1);await page.keyboard.press('Escape')}
 assert.equal(await page.locator('.map-toolbar,[data-filter]').count(),0);assert.equal(await page.locator('.campus-map-label:not(.dim)').count(),8);
 assert.equal(await page.locator('.walking-resident').count(),20);
 assert(await page.locator('.walking-resident .student-face').evaluateAll(els=>new Set(els.map(e=>e.innerHTML)).size>=4));
 const routes=await page.evaluate(()=>{for(const from of CAMPUS_WALK_NODES)for(const to of CAMPUS_WALK_NODES){const path=campusRoute(from,to),reachable=campusReachableNodes(from).includes(to);if(reachable&&path.at(-1)!==to)throw Error(`disconnected path ${from} → ${to}`);if(!reachable&&path.length)throw Error('crossed disconnected or occupied route');}return campusRoute(0,18).at(-1)===18&&validateCampusNavigation().length===0;});assert(routes,'verified roads are reachable, hidden exits are not invented');
 const cat=page.locator('#groundskeeper-cat'),broom=page.locator('#groundskeeper-cat .cat-broom');
 const catFoot=await cat.getAttribute('transform');assert(await page.evaluate(()=>campusContains(CAMPUS_CAT_POINT,CENTRAL_LAWN)));
 const firstSweep=await broom.evaluate(el=>getComputedStyle(el).transform);await page.waitForTimeout(160);assert.notEqual(await broom.evaluate(el=>getComputedStyle(el).transform),firstSweep);
 await cat.click();assert.equal(await page.locator('#dialog-title').innerText(),'阿樺大哥又割草了');assert.equal(await page.locator('.sweeping-cat-portrait .cat-broom').count(),1);assert.equal(await page.locator('.sweeping-cat-portrait image').count(),1);await page.waitForFunction(()=>document.body.classList.contains('residents-inactive'));assert.equal(await broom.evaluate(el=>getComputedStyle(el).animationPlayState),'paused');await page.keyboard.press('Escape');
 assert.equal(await cat.getAttribute('transform'),catFoot,'cat stays on the lawn');
 await page.locator('#toggle-walk').click();await page.waitForTimeout(60);const stopped=await broom.evaluate(el=>getComputedStyle(el).transform);await page.waitForTimeout(130);assert.equal(await broom.evaluate(el=>getComputedStyle(el).transform),stopped);await page.locator('#toggle-walk').click();
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await broom.evaluate(el=>getComputedStyle(el).animationName),'none');await page.emulateMedia({reducedMotion:'no-preference'});
 await page.locator('.fish-soup-shop').focus();await page.keyboard.press('Enter');assert.match(await page.locator('#dialog-title').innerText(),/南臺灣/);await page.keyboard.press('Escape');await page.locator('.fish-soup-shop').evaluate(el=>el.blur());
 await page.mouse.move(5,90);await page.screenshot({path:'/tmp/caoshang-living-campus-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await cat.click();assert.equal(await page.locator('#dialog-title').innerText(),'阿樺大哥又割草了');await page.keyboard.press('Escape');
 const map=await page.locator('#map-viewport').boundingBox();await page.mouse.move(map.x+map.width/2,map.y+map.height/2);await page.mouse.down();await page.mouse.move(map.x+map.width/2+45,map.y+map.height/2+12,{steps:6});await page.mouse.up();assert((await page.evaluate(()=>Math.abs(camera.x)))>20);
 await page.locator('#map-fit').click();assert.equal(await page.locator('#campus-map').getAttribute('preserveAspectRatio'),'xMidYMid meet');
 await page.setViewportSize({width:390,height:760});assert.equal(await page.locator('#campus-map').getAttribute('preserveAspectRatio'),'xMidYMid meet');assert((await page.locator('#map-viewport').boundingBox()).height<300);await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'/tmp/caoshang-living-campus-mobile.png',fullPage:true});
 await page.locator('[data-passport="sports"]').click();await page.locator('#start-campus-mission').waitFor({state:'visible'});assert.match(await page.locator('#dialog-title').innerText(),/普通體育班/);
 assert.deepEqual(errors,[]);console.log('PASS: requested shared-classroom placements, no markers on central/right-1, open gate/side sign, NPC naming, diverse student faces and road destinations, lawn-only sweeping cat/dialog/pause, department labels only and mobile controls.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
