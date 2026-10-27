const assert=require('node:assert/strict');const{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto(process.env.CAMPUS_BASE_URL||'http://127.0.0.1:8012/115/');
 const progress=await page.evaluate(()=>JSON.stringify(questState)),position=await page.locator('#campus-supporter').getAttribute('transform');
 assert.equal(await page.locator('#campus-supporter').count(),1);
 assert.equal(await page.locator('.intro,.map-toolbar,[data-filter]').count(),0);
 assert.match(await page.locator('.header .header-slogan').innerText(),/今天，換你當草商新生！/);
 const header=await page.evaluate(()=>{const a=document.querySelector('.brand').getBoundingClientRect(),b=document.querySelector('.header-slogan').getBoundingClientRect();return{brandRight:a.right,sloganLeft:b.left,top:a.top,sloganTop:b.top}});assert(header.sloganLeft>=header.brandRight);assert(Math.abs(header.top-header.sloganTop)<25);
 assert((await page.locator('#campus-supporter .supporter-figure').getAttribute('href')).endsWith('campus-supporter-original.jpg'));
 await page.locator('#campus-supporter').click();assert.equal(await page.locator('#dialog-title').innerText(),'加油!加油!');await page.locator('.supporter-portrait').evaluate(el=>el.decode());
 const checkPortrait=async()=>{const r=await page.locator('.supporter-portrait').evaluate(el=>{const b=el.getBoundingClientRect();return{width:el.naturalWidth,height:el.naturalHeight,natural:el.naturalWidth/el.naturalHeight,shown:b.width/b.height,fit:getComputedStyle(el).objectFit,source:el.getAttribute('src')}});assert.equal(r.width,157);assert.equal(r.height,400);assert(Math.abs(r.natural-r.shown)<.001);assert.equal(r.fit,'contain');assert(r.source.endsWith('campus-supporter-original.jpg'));};await checkPortrait();await page.screenshot({path:'/tmp/supporter-dialog-desktop.png'});
 await page.keyboard.press('Escape');assert(await page.locator('#campus-supporter').evaluate(el=>el===document.activeElement));await page.keyboard.press('Enter');assert.equal(await page.locator('#dialog-title').innerText(),'加油!加油!');await page.keyboard.press('Escape');
 // Read actual computed colours, including the stamped state, and require WCAG AA.
 const contrast=await page.evaluate(()=>{
  function luminance(rgb){const c=rgb.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
  function check(el,bg){const a=luminance(getComputedStyle(el).color),b=luminance(getComputedStyle(bg).backgroundColor);return(Math.max(a,b)+.05)/(Math.min(a,b)+.05);}
  const b=document.querySelector('[data-passport]'),normal=[check(b.querySelector('b'),b),check(b.querySelector('small'),b)];b.classList.add('stamped');const stamped=[check(b.querySelector('b'),b),check(b.querySelector('small'),b)];b.classList.remove('stamped');
  return{ratios:[...normal,...stamped,check(document.querySelector('.passport-heading p'),document.querySelector('.passport-panel')),check(document.querySelector('.passport-save'),document.querySelector('.passport-panel'))],name:parseFloat(getComputedStyle(b.querySelector('b')).fontSize),status:parseFloat(getComputedStyle(b.querySelector('small')).fontSize)};
 });assert(contrast.ratios.every(n=>n>=4.5));assert(contrast.name>=16);assert(contrast.status>=13);console.log('Passport contrast:',contrast);
 assert.equal(await page.locator('.campus-building,.building-hit-area,.building-click-box').count(),0);
 const clickArt=async(u,v)=>{const p=await page.evaluate(([u,v])=>{const[x,y]=campusPoint(u,v),p=new DOMPoint(x,y).matrixTransform(document.querySelector('#map-world').getScreenCTM());return{x:p.x,y:p.y}},[u,v]);await page.mouse.click(p.x,p.y);};
 for(const p of [[350,320],[690,573],[1015,225],[890,160],[1200,355],[280,200],[660,300]]){const cam=await page.evaluate(()=>({...camera}));await clickArt(...p);assert(await page.locator('#modal-backdrop').isHidden());assert.deepEqual(await page.evaluate(()=>({...camera})),cam);}
 for(const id of ['mechanical','piping','accounting','business','data','english','service','sports']){await page.locator(`[data-label-for="${id}"]`).focus();await page.keyboard.press('Enter');await page.locator('#start-campus-mission').waitFor({state:'visible'});await page.keyboard.press('Escape');assert(await page.locator(`[data-label-for="${id}"]`).evaluate(el=>el===document.activeElement));}
 await page.locator('[data-passport="data"]').click();assert.equal(await page.locator('.data-photo-card').count(),7);await page.keyboard.press('Escape');
 await page.locator('[data-view="courses"]').first().click();await page.locator('[data-course="data"]').click();assert.equal(await page.locator('.data-photo-card').count(),7);await page.keyboard.press('Escape');await page.locator('[data-view="map"]').first().click();
 await page.screenshot({path:'/tmp/supporter-passport-desktop.png',fullPage:true});
 for(const width of [1280,1024,801,800,480,390,320]){
  await page.setViewportSize({width,height:844});await page.locator('#map-fit').click();
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
  const layout=await page.locator('#passport-panel').evaluate(el=>{const last=el.querySelector('.passport-save').getBoundingClientRect(),panel=el.getBoundingClientRect(),promise=document.querySelector('.adventure-promise').getBoundingClientRect();return{last:last.bottom,panel:panel.bottom,next:promise.top,scroll:el.scrollWidth,client:el.clientWidth,font:parseFloat(getComputedStyle(el.querySelector('.passport-departments b')).fontSize)}});
  if(width<=800){assert(layout.last<=layout.panel);assert(layout.panel<=layout.next);}assert(layout.scroll<=layout.client);assert(layout.font>=16);
  await page.locator('#campus-supporter').click();assert.equal(await page.locator('#dialog-title').innerText(),'加油!加油!');await checkPortrait();assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));await page.keyboard.press('Escape');
  if(width===390){await page.screenshot({path:'/tmp/supporter-passport-mobile.png',fullPage:true});}
 }
 await page.evaluate(()=>{for(let i=0;i<1200;i++)walkingController.step(.1,false);walkingController.paint()});assert.equal(await page.locator('#campus-supporter').getAttribute('transform'),position);
 await page.evaluate(()=>initCampusResidents());assert.equal(await page.locator('#campus-supporter').count(),1);assert.equal(await page.locator('#campus-visitor').count(),1);assert.equal(await page.locator('.walking-resident').count(),20);assert.equal(await page.evaluate(()=>JSON.stringify(questState)),progress);
 assert.deepEqual(errors,[]);console.log('PASS: supporter fixed/art/dialogue/focus, readable high-contrast passport, all eight label entrances, inert buildings/track, original photo intro, 1280/1024/801/800/480/390/320 layouts, header welcome and no filters, original uploaded portrait aspect ratio, progress and reinit.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
