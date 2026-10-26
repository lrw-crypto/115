const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1050}});
 await context.addInitScript(()=>{if(!localStorage.getItem('caotun-island-exploration-v1'))localStorage.setItem('caotun-island-exploration-v1',JSON.stringify({completed:['accounting']}));});
 const page=await context.newPage(),errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
 page.on('requestfailed',r=>failed.push(r.url()));
 await page.goto(process.env.CAMPUS_BASE_URL||'http://127.0.0.1:8011/115/');
 const progress=await page.evaluate(()=>localStorage.getItem('caotun-island-exploration-v1'));
 await page.evaluate(()=>{Object.assign(camera,{x:-20,y:12,scale:1.12});updateCamera();});
 const home=await page.evaluate(()=>({...camera}));
 // Actual map label entrance, with the existing zoom preceding the intro.
 await page.locator('[data-label-for="data"] .label-bg').click();
 await page.locator('.data-department-dialog').waitFor({state:'visible'});
 assert.equal(await page.locator('#dialog-title').innerText(),'資料處理科');
 assert.equal(await page.locator('.data-photo-card').count(),7);
 assert.equal(await page.locator('.data-skill-tags li').count(),4);
 assert.equal(await page.locator('.full-course-plan').count(),0);
 assert.equal(await page.locator('.data-learn-more').getAttribute('open'),null);
 assert.equal(await page.evaluate(()=>questCoins()),1);
 assert(await page.locator('#dialog').evaluate(el=>el.clientWidth>950));
 const originals=['smart-planter.jpg','smart-car.jpg','computer-classroom.jpg','3d-printer.jpg','laser-marker.jpg','award-01.jpg','award-02.jpg'];
 for(let i=0;i<7;i++){
  const img=page.locator('.data-photo-card img').nth(i);await img.scrollIntoViewIfNeeded();
  await img.evaluate(el=>el.decode());
  assert(await img.evaluate(el=>el.naturalWidth>0&&el.alt.length>3&&getComputedStyle(el).objectFit==='contain'));
  assert((await img.getAttribute('src')).endsWith(originals[i]));
  assert(!(await img.getAttribute('src')).startsWith('/'));
  assert.equal(await img.getAttribute('loading'),i<2?'eager':'lazy');
 }
 await page.locator('.data-learn-more summary').click();assert(await page.locator('.data-learn-more').evaluate(el=>el.open));
 assert.match(await page.locator('.data-learn-more').innerText(),/電腦軟體應用、會計人工/);
 const header=await page.locator('.data-intro-header').boundingBox(),dialog=await page.locator('#dialog').boundingBox();assert(Math.abs(header.y-dialog.y)<5);
 const scrollY=await page.evaluate(()=>scrollY);await page.mouse.wheel(0,700);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>window.scrollY),scrollY);
 await page.locator('#dialog').evaluate(el=>el.scrollTop=0);
 await page.screenshot({path:'/tmp/data-intro-desktop.png'});
 await page.locator('[data-data-photo="0"]').click();
 assert(await page.locator('#modal-backdrop').evaluate(el=>el.inert));
 for(let i=0;i<7;i++){
  const img=page.locator('.data-photo-viewer img');await img.evaluate(el=>el.decode());
  assert((await img.getAttribute('src')).endsWith(originals[i]));
  assert.equal(await page.locator('.data-viewer-count').innerText(),`${i+1} / 7`);
  if(i<6)await page.locator('.data-viewer-next').click();
 }
 await page.keyboard.press('ArrowRight');assert.equal(await page.locator('.data-viewer-count').innerText(),'1 / 7');
 await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('.data-viewer-count').innerText(),'7 / 7');
 await page.locator('.data-viewer-prev').click();assert.equal(await page.locator('.data-viewer-count').innerText(),'6 / 7');
 await page.locator('.data-viewer-close').focus();await page.keyboard.press('Shift+Tab');assert(await page.locator('.data-viewer-next').evaluate(el=>el===document.activeElement));
 await page.keyboard.press('Tab');assert(await page.locator('.data-viewer-close').evaluate(el=>el===document.activeElement));
 await page.keyboard.press('Escape');assert.equal(await page.locator('.data-photo-viewer').count(),0);assert(await page.locator('.data-department-dialog').isVisible());
 assert(await page.locator('[data-data-photo="0"]').evaluate(el=>el===document.activeElement));
 await page.keyboard.press('Escape');assert(await page.locator('#modal-backdrop').isHidden());
 assert.deepEqual(await page.evaluate(()=>({...camera})),home);
 assert(await page.locator('[data-label-for="data"]').evaluate(el=>el===document.activeElement));
 assert.equal(await page.evaluate(()=>localStorage.getItem('caotun-island-exploration-v1')),progress);
 // The course cards share the same intro; Escape returns focus to that card.
 await page.locator('[data-view="courses"]').click();await page.locator('[data-course="data"]').click();
 assert(await page.locator('.data-department-dialog').isVisible());
 await page.keyboard.press('Escape');assert(await page.locator('[data-course="data"]').evaluate(el=>el===document.activeElement));
 await page.locator('[data-course="data"]').click();await page.locator('#data-return-campus').click();
 assert(await page.locator('#map-page').isVisible());assert.deepEqual(await page.evaluate(()=>({...camera})),home);
 // Shared building chooser and passport also route to the same introduction.
 await page.evaluate(()=>openCampusBuilding('left-2'));await page.locator('[data-building-department="data"]').click();await page.locator('.data-department-dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');
 await page.setViewportSize({width:390,height:844});await page.locator('[data-passport="data"]').click();await page.locator('.data-department-dialog').waitFor({state:'visible'});
 assert(await page.locator('#dialog').evaluate(el=>el.clientHeight>innerHeight*.9));
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
  assert(await page.locator('#dialog').evaluate(el=>el.scrollWidth<=el.clientWidth));
  assert.equal(await page.locator('.data-projects').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1);
 }
 await page.setViewportSize({width:390,height:844});await page.locator('#dialog').evaluate(el=>el.scrollTop=0);
 await page.screenshot({path:'/tmp/data-intro-mobile.png'});
 await page.locator('[data-data-photo="4"]').click();await page.locator('.data-photo-viewer img').evaluate(el=>el.decode());
 assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));await page.screenshot({path:'/tmp/data-photo-mobile.png'});
 await page.locator('.data-viewer-close').click();
 await page.locator('.dialog-close').focus();await page.keyboard.press('Shift+Tab');assert(await page.locator('#data-return-campus').evaluate(el=>el===document.activeElement));
 // The button starts the existing command game. Reading never awards a coin.
 assert.equal(await page.evaluate(()=>questCoins()),1);
 await page.locator('#start-campus-mission').click();assert.equal(await page.locator('#dialog-title').innerText(),'指令小領航員');
 assert.equal(await page.locator('.data-department-dialog').count(),0);
 assert.deepEqual(await page.evaluate(()=>({...camera})),home);
 for(const command of ['right','right','right','up'])await page.locator(`[data-command="${command}"]`).click();
 await page.locator('#run-commands').click();await page.waitForFunction(()=>document.querySelector('#dialog-title').textContent==='你認識了這個科別！');
 assert.equal(await page.evaluate(()=>questCoins()),2);await page.locator('#continue-exploring').click();
 assert.equal(await page.locator('.passport-departments .stamped').count(),2);
 await page.reload();assert.equal(await page.locator('.passport-departments .stamped').count(),2);
 await page.locator('[data-passport="data"]').click();await page.locator('.data-department-dialog').waitFor({state:'visible'});await page.locator('#data-return-campus').click();assert.equal(await page.evaluate(()=>questCoins()),2);
 // Generic department rendering remains intact after this specialized dialog.
 await page.locator('[data-passport="english"]').click();await page.locator('#start-campus-mission').waitFor({state:'visible'});
 assert.equal(await page.locator('#dialog-title').innerText(),'應用英語科');assert.equal(await page.locator('.department-topic').count(),4);assert.equal(await page.locator('.data-department-dialog').count(),0);
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 console.log('PASS: /115/ relative paths, all 7 original photos, map/course/shared-building/passport entrances, responsive layout, sticky title, lightbox controls/keyboard/focus, scroll lock, collapsed details, camera restoration, original game and persisted coins, generic department compatibility; no console or resource errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
