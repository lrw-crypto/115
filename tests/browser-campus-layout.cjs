const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.CAMPUS_BASE_URL||'http://127.0.0.1:8000/');
 assert.equal(await page.locator('#central-courtyard').count(),1);
 assert.equal(await page.locator('.courtyard-complex').count(),0);
 assert.equal(await page.locator('#rear-campus-wing .rear-connector').count(),2);
 for(const [left,right]of [['mechanical','piping'],['business','data'],['english','service']]){
  const pair=await page.evaluate(([a,b])=>[departments.find(d=>d.id===a),departments.find(d=>d.id===b)],[left,right]);
  assert.equal(pair[0].v,pair[1].v);
  assert.equal(pair[0].w,pair[1].w);
  assert.equal(pair[0].u+pair[0].w,-pair[1].u);
  assert(Math.abs(pair[0].x+pair[1].x-1240)<.01);
  assert.equal(await page.locator(`[data-department="${left}"] .inward-facade`).getAttribute('data-facing'),'right');
  assert.equal(await page.locator(`[data-department="${right}"] .inward-facade`).getAttribute('data-facing'),'left');
 }
 const layout=await page.evaluate(()=>{
  const pos=s=>{const m=document.querySelector(s).transform.baseVal.consolidate().matrix;return{x:m.e,y:m.f}};
  const collisions=[];
  for(const[a,b]of CAMPUS_EDGES)for(let t=0;t<=1;t+=.05){const u=CAMPUS_NODE_UV[a][0]*(1-t)+CAMPUS_NODE_UV[b][0]*t,v=CAMPUS_NODE_UV[a][1]*(1-t)+CAMPUS_NODE_UV[b][1]*t;for(const d of departments.filter(d=>d.side!=='field'))if(u>d.u&&u<d.u+d.w&&v>d.v&&v<d.v+d.d)collisions.push(d.id);}
  return{gate:pos('#campus-main-gate'),hi:pos('.hilife-store'),food:pos('.fish-soup-shop'),rear:departments.find(d=>d.id==='accounting'),front:departments.find(d=>d.id==='english'),collisions,routes:departments.map((_,i)=>campusRoute(i,20))};
 });
 assert(layout.food.x<layout.gate.x&&layout.gate.x<layout.hi.x);
 assert(layout.food.y>layout.gate.y&&layout.hi.y>layout.gate.y);
 assert(layout.rear.y<layout.front.y);
 assert.deepEqual(layout.collisions,[],'walking paths must avoid classroom footprints');
 layout.routes.forEach((r,i)=>{assert.equal(r[0],i);assert.equal(r.at(-1),20)});
 assert((await page.locator('#map-viewport').boundingBox()).width/1440>.82);
 for(const id of ['mechanical','piping','business','accounting','data','english','service','sports']){
  await page.locator(`[data-label-for="${id}"] .label-bg`).click();
  assert.equal(await page.locator('#start-campus-mission').count(),1);
  await page.keyboard.press('Escape');
 }
 await page.locator('.fish-soup-shop').focus();await page.keyboard.press('Enter');
 assert.match(await page.locator('#dialog-title').innerText(),/南臺灣/);await page.keyboard.press('Escape');
 await page.screenshot({path:'/tmp/caoshang-courtyard-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.locator('#campus-map').getAttribute('preserveAspectRatio'),'xMidYMid slice');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const map=await page.locator('#map-viewport').boundingBox();assert(map.width>=388);
 await page.mouse.move(map.x+map.width/2,map.y+map.height/2);await page.mouse.down();
 await page.mouse.move(map.x+map.width/2+45,map.y+map.height/2+12,{steps:6});await page.mouse.up();
 assert((await page.evaluate(()=>Math.abs(camera.x)))>20);
 await page.locator('#map-fit').click();
 assert.equal(await page.locator('#campus-map').getAttribute('preserveAspectRatio'),'xMidYMid meet');
 assert.equal(await page.evaluate(()=>camera.scale),1);assert.equal(await page.evaluate(()=>camera.x),0);
 await page.screenshot({path:'/tmp/caoshang-courtyard-mobile-panorama.png',fullPage:true});
 await page.locator('[data-passport="sports"]').click();assert.match(await page.locator('#dialog-title').innerText(),/普通體育班/);
 assert.deepEqual(errors,[]);
 console.log('PASS: one campus courtyard, three symmetric inward-facing building pairs, rear hall, left food/right Hi-Life from gate, unobstructed connected walking paths, eight entrances and mobile pan/full view.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
