const assert=require('node:assert/strict');
const{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1536,height:1100},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.CAMPUS_BASE_URL||'http://127.0.0.1:8012/115/');
 await page.evaluate(()=>{walkingController.actors.slice(1).forEach(a=>a.element.style.visibility='hidden');document.querySelector('#reward-npc').style.visibility='hidden';});
 // These actual routes lie in front of the visible building silhouettes.
 // Compare rendered pixels, not just DOM order: no part of the student may vanish.
 const points=[
  ['track-west',[211,142],'rear-left'],['track-back',[292,135],'rear-left'],
  ['track-back-east',[326,144],'rear-left'],['track-turn',[361,154],'rear-left'],
  ['central-west',[664,415],'central'],['central-front',[695,405],'central'],
  ['central-middle',[720,406],'central'],['central-east',[742,406],'central']
 ];
 async function wholeStudent(label,point,building,viewport){
  await page.evaluate(point=>{const a=walkingController.actors[0];[a.x,a.y]=campusPoint(...point);walkingController.paint();},point);
  const actor=page.locator('[data-resident="0"]');
  const normal=await actor.screenshot({path:`/tmp/campus-occlusion-${viewport}-${label}.png`});
  assert(await actor.evaluate((el,id)=>Boolean(document.querySelector('#occluder-'+id).compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING),building),'student must be in front of this building');
  await page.locator('.campus-occluder').evaluateAll(els=>els.forEach(el=>el.style.visibility='hidden'));
  const reference=await actor.screenshot();
  assert(normal.equals(reference),`${viewport}/${label}: foreground copy erased part of student`);
  await page.locator('.campus-occluder').evaluateAll(els=>els.forEach(el=>el.style.visibility=''));
 }
 for(const args of points)await wholeStudent(...args,'desktop');
 // Retain true occlusion behind buildings; do not move everybody to the top layer.
 assert(await page.evaluate(()=>{const a=walkingController.actors[0];[a.x,a.y]=campusPoint(292,100);walkingController.paint();return Boolean(a.element.compareDocumentPosition(document.querySelector('#occluder-rear-left'))&Node.DOCUMENT_POSITION_FOLLOWING);}));
 await page.setViewportSize({width:390,height:844});await page.locator('#map-fit').click();
 for(const args of [points[0],points[1],points[5]])await wholeStudent(...args,'mobile');
 assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 assert(await page.locator('.walking-resident').evaluateAll(els=>els.every(el=>getComputedStyle(el).pointerEvents==='none')));
 assert.deepEqual(errors,[]);
 console.log('PASS: 11 desktop/mobile pixel comparisons at track and central-building routes show complete students, actual rear occlusion retained, no pointer blocking or page errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
