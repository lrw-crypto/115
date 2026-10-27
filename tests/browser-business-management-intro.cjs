const assert=require('node:assert/strict');const{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1100}});
 await context.addInitScript(()=>{if(!localStorage.getItem('caotun-island-exploration-v1'))localStorage.setItem('caotun-island-exploration-v1',JSON.stringify({completed:['accounting']}));});
 const page=await context.newPage(),errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});page.on('requestfailed',r=>failed.push(r.url()));
 await page.goto(process.env.CAMPUS_BASE_URL||'http://127.0.0.1:8012/115/');
 const progress=await page.evaluate(()=>localStorage.getItem('caotun-island-exploration-v1'));
 await page.evaluate(()=>{Object.assign(camera,{x:-23,y:13,scale:1.12});updateCamera()});const cameraHome=await page.evaluate(()=>({...camera}));
 await page.locator('[data-label-for="business"] .label-bg').click();await page.locator('.business-department-dialog').waitFor({state:'visible'});
 assert.equal(await page.locator('#dialog-title').innerText(),'商業經營科');assert.equal(await page.locator('.data-intro-cover h3').innerText(),'解鎖你的商管超能力！');assert.equal(await page.locator('.data-skill-tags li').count(),4);
 assert.equal(await page.locator('.data-intro-section').count(),2);assert.equal(await page.locator('.data-classrooms .data-photo-card').count(),3);assert.equal(await page.locator('.data-experiences .data-photo-card').count(),3);assert.equal(await page.locator('.data-learn-more').getAttribute('open'),null);
 assert(await page.locator('#dialog').evaluate(el=>el.clientWidth>950));assert.equal(await page.locator('.data-classrooms').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),3);
 const files=['fintech-classroom.jpg','retail-classroom.jpg','marketing-classroom.jpg','competition-01.jpg','industry-visit.jpg','internship-01.jpg'];
 for(let i=0;i<6;i++){
  const img=page.locator('.data-photo-card img').nth(i);await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());
  assert(await img.evaluate(el=>el.naturalWidth>0&&el.alt.length>8&&getComputedStyle(el).objectFit==='contain'&&el.naturalWidth===Number(el.getAttribute('width'))&&el.naturalHeight===Number(el.getAttribute('height'))));
  assert.equal(await img.getAttribute('src'),`assets/departments/business-management/${files[i]}`);assert.equal(await img.getAttribute('loading'),i<2?'eager':'lazy');
  assert.equal(await page.locator('.data-photo-card').nth(i).locator('figcaption p').count(),1);
 }
 await page.locator('.data-learn-more summary').click();assert(await page.locator('.data-learn-more').evaluate(el=>el.open));
 for(const text of ['高一：商業、會計與門市服務，建立基礎。','高二：行銷、資料分析與專題，深化技能。','高三：企業經營、商業溝通與實務，準備升學。','可以挑戰的證照','會計事務資訊項丙／乙級','職涯方向：企業行政'])assert((await page.locator('.data-learn-more').innerText()).includes(text));
 const header=await page.locator('.data-intro-header').boundingBox(),dialog=await page.locator('#dialog').boundingBox();assert(Math.abs(header.y-dialog.y)<5);
 assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');const y=await page.evaluate(()=>scrollY);await page.mouse.wheel(0,500);await page.waitForTimeout(120);assert.equal(await page.evaluate(()=>scrollY),y);
 await page.locator('#dialog').evaluate(el=>el.scrollTop=0);await page.screenshot({path:'/tmp/business-intro-desktop.png'});
 await page.locator('[data-data-photo="0"]').click();assert(await page.locator('#modal-backdrop').evaluate(el=>el.inert));
 for(let i=0;i<6;i++){await page.locator('.data-photo-viewer img').evaluate(el=>el.decode());assert((await page.locator('.data-photo-viewer img').getAttribute('src')).endsWith(files[i]));assert.equal(await page.locator('.data-viewer-count').innerText(),`${i+1} / 6`);if(i<5)await page.locator('.data-viewer-next').click();}
 await page.keyboard.press('ArrowRight');assert.equal(await page.locator('.data-viewer-count').innerText(),'1 / 6');await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('.data-viewer-count').innerText(),'6 / 6');await page.locator('.data-viewer-prev').click();assert.equal(await page.locator('.data-viewer-count').innerText(),'5 / 6');
 await page.locator('.data-viewer-close').focus();await page.keyboard.press('Shift+Tab');assert(await page.locator('.data-viewer-next').evaluate(el=>el===document.activeElement));await page.keyboard.press('Tab');assert(await page.locator('.data-viewer-close').evaluate(el=>el===document.activeElement));
 await page.keyboard.press('Escape');assert.equal(await page.locator('.data-photo-viewer').count(),0);assert(await page.locator('.business-department-dialog').isVisible());assert(await page.locator('[data-data-photo="0"]').evaluate(el=>el===document.activeElement));
 await page.keyboard.press('Escape');assert(await page.locator('#modal-backdrop').isHidden());assert(await page.locator('[data-label-for="business"]').evaluate(el=>el===document.activeElement));assert.deepEqual(await page.evaluate(()=>({...camera})),cameraHome);assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
 assert.equal(await page.evaluate(()=>localStorage.getItem('caotun-island-exploration-v1')),progress);
 await page.locator('[data-view="courses"]').click();await page.locator('[data-course="business"]').click();assert(await page.locator('.business-department-dialog').isVisible());await page.keyboard.press('Escape');assert(await page.locator('[data-course="business"]').evaluate(el=>el===document.activeElement));
 await page.locator('[data-course="business"]').click();await page.locator('#business-return-campus').click();assert(await page.locator('#map-page').isVisible());assert.deepEqual(await page.evaluate(()=>({...camera})),cameraHome);
 // The album must switch back to data processing's own original seven photos.
 await page.locator('[data-passport="data"]').click();await page.locator('.data-department-dialog').waitFor({state:'visible'});assert.equal(await page.locator('.business-department-dialog').count(),0);assert.equal(await page.locator('.data-photo-card').count(),7);await page.locator('[data-data-photo="0"]').click();assert((await page.locator('.data-photo-viewer img').getAttribute('src')).endsWith('data-processing/smart-planter.jpg'));assert.equal(await page.locator('.data-viewer-count').innerText(),'1 / 7');await page.keyboard.press('Escape');await page.keyboard.press('Escape');
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});await page.locator('[data-passport="business"]').click();await page.locator('.business-department-dialog').waitFor({state:'visible'});
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));assert(await page.locator('#dialog').evaluate(el=>el.scrollWidth<=el.clientWidth&&el.clientHeight>innerHeight*.9));assert.equal(await page.locator('.data-classrooms').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1);
  await page.locator('#dialog').evaluate(el=>el.scrollTop=0);if(width===390)await page.screenshot({path:'/tmp/business-intro-mobile.png'});
  await page.locator('[data-data-photo="5"]').click();await page.locator('.data-photo-viewer img').evaluate(el=>el.decode());assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));if(width===390)await page.screenshot({path:'/tmp/business-photo-mobile.png'});await page.locator('.data-viewer-close').click();
  await page.locator('.dialog-close').focus();await page.keyboard.press('Shift+Tab');assert(await page.locator('#business-return-campus').evaluate(el=>el===document.activeElement));await page.locator('#business-return-campus').click();
 }
 assert.equal(await page.evaluate(()=>questCoins()),1);
 await page.locator('[data-passport="business"]').click();await page.locator('#start-campus-mission').waitFor({state:'visible'});await page.locator('#start-campus-mission').click();assert.equal(await page.locator('#dialog-title').innerText(),'小店陳列設計師');assert.equal(await page.locator('.business-department-dialog').count(),0);
 await page.locator('[data-display="1"]').click();assert.equal(await page.evaluate(()=>questCoins()),1);await page.locator('[data-display="0"]').click();await page.locator('#finish-display').click();assert.equal(await page.locator('#dialog-title').innerText(),'你認識了這個科別！');assert.equal(await page.evaluate(()=>questCoins()),2);await page.locator('#continue-exploring').click();
 await page.reload();assert.equal(await page.locator('.passport-departments .stamped').count(),2);await page.locator('[data-passport="business"]').click();await page.locator('#start-campus-mission').waitFor({state:'visible'});await page.locator('#start-campus-mission').click();await page.locator('[data-display="0"]').click();await page.locator('#finish-display').click();assert.equal(await page.evaluate(()=>questCoins()),2);await page.keyboard.press('Escape');
 await page.locator('[data-passport="english"]').click();await page.locator('#start-campus-mission').waitFor({state:'visible'});assert.equal(await page.locator('.department-topic').count(),4);await page.keyboard.press('Escape');
 const before=await page.evaluate(()=>walkingController.actors.map(a=>[a.x,a.y]));await page.waitForTimeout(1000);assert(await page.evaluate(before=>walkingController.actors.some((a,i)=>Math.hypot(a.x-before[i][0],a.y-before[i][1])>0),before));assert.equal(await page.locator('.walking-resident').count(),20);assert.equal(await page.locator('#campus-supporter,#campus-visitor,#reward-npc,#groundskeeper-cat').count(),4);
 // The shared renderer omits a start button if no matching game is available.
 await page.evaluate(()=>{const original=MISSION_INFO.business;delete MISSION_INFO.business;renderDepartmentPhotoIntro(BUSINESS_MANAGEMENT_INTRO,document.querySelector('[data-passport="business"]'));MISSION_INFO.business=original});assert.equal(await page.locator('#start-campus-mission').count(),0);assert(await page.locator('#business-return-campus').isVisible());await page.locator('#business-return-campus').click();
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS: six real JPEGs, two distinct groups, desktop/mobile layout, shared lightbox and focus, scroll lock, map/course/passport entrances, original business game, unique coins and saved progress, camera, data/generic compatibility, students and no resource/console errors.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
