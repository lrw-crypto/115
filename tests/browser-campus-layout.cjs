const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs');
const {createHash}=require('node:crypto');
const digest=s=>createHash('sha256').update(s).digest('hex');
// Preserve the pre-redesign character artwork without relying on Git history.
const originalArt={
 "assets/campus-app.js": {
  "animal": "b4a094093333035b6bed2e85de6de5a3ee0f35a15080f8ac6ef24a5ab471fc42"
 },
 "assets/campus-map.js": {
  "scooterArt": "a79a9d8b7f12646330e903e37d88862abe33e7e4345309cf3f9e076aa5369816",
  "campusNpc": "0c16feb6ebba55016ad7b25b9b85fc747c534350e20ef0315950f83c79fd0810"
 }
};
for(const[file,names]of Object.entries(originalArt)){const current=fs.readFileSync(file,'utf8');for(const[name,hash]of Object.entries(names))assert.equal(digest(current.split('\n').find(l=>l.startsWith(`function ${name}(`))),hash,`${name} original artwork`)}
assert.equal(digest(fs.readFileSync('assets/campus-art.js')),'b60da51c33057cc795450241fee7ee92b888b2a498fa33b492f6f870b42df3a6','original character materials');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.CAMPUS_BASE_URL||'http://127.0.0.1:8000/');
 const loaded=await page.locator('#campus-illustration').evaluate(el=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve([i.naturalWidth,i.naturalHeight]);i.onerror=reject;i.src=el.getAttribute('href')}));
 assert.deepEqual(loaded,[1536,1024]);assert.equal(await page.locator('#central-courtyard').getAttribute('data-layout'),'oblique-reference');
 assert.equal(await page.locator('.walking-resident').count(),20);
 assert.equal(await page.locator('.npc-scooter .npc-headband text').textContent(),'客服');
 const layout=await page.evaluate(()=>{
  const pos=s=>{const m=document.querySelector(s).transform.baseVal.consolidate().matrix;return{x:m.e,y:m.f}};
  return{gate:pos('#campus-main-gate'),hi:pos('.hilife-store'),food:pos('.fish-soup-shop'),sports:departments.find(d=>d.id==='sports'),service:departments.find(d=>d.id==='service'),routes:departments.map((_,i)=>campusRoute(i,20))};
 });
 assert(layout.food.x<layout.gate.x&&layout.gate.x<layout.hi.x);
 assert(layout.sports.x<layout.service.x&&layout.sports.y<layout.service.y);
 layout.routes.forEach((r,i)=>{assert.equal(r[0],i);assert.equal(r.at(-1),20)});
 assert((await page.locator('#map-viewport').boundingBox()).width/1440>.82);
 for(const id of ['mechanical','piping','business','accounting','data','english','service','sports']){
  // Click the illustrated roof, separately from the floating label and passport.
  const target=await page.evaluate(id=>{const d=departments.find(x=>x.id===id),p=d.polygons[0],x=p.reduce((s,q)=>s+q[0],0)/p.length,y=p.reduce((s,q)=>s+q[1],0)/p.length;const [sx,sy]=campusPoint(x,y);const point=new DOMPoint(sx,sy).matrixTransform(document.querySelector('#map-world').getScreenCTM());return{x:point.x,y:point.y}},id);
  await page.mouse.click(target.x,target.y);
  assert.equal(await page.locator('#dialog-title').innerText(),await page.evaluate(id=>departments.find(d=>d.id===id).name,id));
  await page.keyboard.press('Escape');
  await page.locator(`[data-label-for="${id}"] .label-bg`).click();assert.equal(await page.locator('#start-campus-mission').count(),1);await page.keyboard.press('Escape');
 }
 await page.locator('[data-department="piping"]').focus();await page.keyboard.press('Enter');assert.match(await page.locator('#dialog-title').innerText(),/配管科/);await page.keyboard.press('Escape');
 await page.locator('[data-filter="engineering"]').click();assert.equal(await page.locator('.campus-map-label.dim').count(),6);await page.locator('[data-filter="all"]').click();
 await page.locator('.fish-soup-shop').focus();await page.keyboard.press('Enter');assert.match(await page.locator('#dialog-title').innerText(),/南臺灣/);await page.keyboard.press('Escape');
 await page.locator('.fish-soup-shop').evaluate(el=>el.blur());
 await page.screenshot({path:'/tmp/caoshang-macaron-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const map=await page.locator('#map-viewport').boundingBox();assert(map.width>=388);
 await page.mouse.move(map.x+map.width/2,map.y+map.height/2);await page.mouse.down();await page.mouse.move(map.x+map.width/2+45,map.y+map.height/2+12,{steps:6});await page.mouse.up();assert((await page.evaluate(()=>Math.abs(camera.x)))>20);
 await page.locator('#map-fit').click();assert.equal(await page.locator('#campus-map').getAttribute('preserveAspectRatio'),'xMidYMid meet');assert.equal(await page.evaluate(()=>camera.x),0);
 await page.setViewportSize({width:390,height:760});assert.equal(await page.locator('#campus-map').getAttribute('preserveAspectRatio'),'xMidYMid meet');assert((await page.locator('#map-viewport').boundingBox()).height<300);await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'/tmp/caoshang-macaron-mobile.png',fullPage:true});
 await page.locator('[data-passport="sports"]').click();assert.match(await page.locator('#dialog-title').innerText(),/普通體育班/);
 assert.deepEqual(errors,[]);console.log('PASS: macaron reference illustration, original student/NPC art and materials, 8 actual building/label entrances, keyboard access, filters, shops, connected routes and mobile pan/full view.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
