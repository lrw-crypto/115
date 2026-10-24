const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1100}});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=process.env.CAMPUS_BASE_URL||'http://127.0.0.1:8000/';
 await page.goto(url);assert.equal(await page.locator('[data-landmark]').count(),8);assert.match(await page.locator('.fish-soup-shop').textContent(),/南台灣土魠魚羹/);assert.match(await page.locator('#quest-wallet').textContent(),/0/);
 await page.locator('#reward-npc').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#dialog-title').innerText(),'嗨，我是中鼎文！');assert(await page.locator('#redeem-quest-reward').isDisabled());await page.keyboard.press('Escape');
 const ids=['mechanical','piping','business','accounting','data','english','service','sports'];
 for(let i=0;i<ids.length;i++){
  await page.locator(`[data-island="${ids[i]}"]`).click();await page.locator('#start-island-question').click();assert.equal(await page.locator('[data-quest-answer]').count(),2);
  await page.locator(`[data-quest-answer="${i%2}"]`).click();assert.match(await page.locator('#dialog-title').innerText(),/金幣 ＋1/);assert.match(await page.locator('#dialog').innerText(),new RegExp(`已探索 ${i+1} / 8`));await page.keyboard.press('Escape');
  await page.locator(`[data-island="${ids[i]}"]`).click();assert.equal(await page.locator('#start-island-question').count(),0);assert.match(await page.locator('.quest-finish-note').innerText(),/已經拿到了/);await page.keyboard.press('Escape');
 }
 assert.equal(await page.locator('.island.quest-complete').count(),8);
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('caotun-island-exploration-v1')));assert.deepEqual(Object.keys(state),['completed']);assert.equal(state.completed.length,8);
 await page.reload();assert.match(await page.locator('#quest-wallet').innerText(),/8/);await page.locator('#quest-wallet').click();assert.equal(await page.locator('.quest-stamps .earned').count(),8);assert.match(await page.locator('.reward-card').innerText(),/實體小禮物/);assert.match(await page.locator('#redeem-quest-reward').innerText(),/領取辦法待公告/);assert(await page.locator('#redeem-quest-reward').isDisabled());assert.match(await page.locator('.reward-pending').innerText(),/不會預先扣除/);await page.screenshot({path:'/tmp/caotun-reward-npc.png'});await page.keyboard.press('Escape');
 const tab=await context.newPage();await tab.goto(url);assert.match(await tab.locator('#quest-wallet').innerText(),/8/);await tab.locator('[data-island="mechanical"]').click();assert.equal(await tab.locator('#start-island-question').count(),0);await tab.close();
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.locator('#quest-wallet').click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.keyboard.press('Escape');await page.screenshot({path:'/tmp/caotun-quests-mobile.png',fullPage:true});await page.setViewportSize({width:1440,height:1100});await page.screenshot({path:'/tmp/caotun-department-landmarks.png',fullPage:true});assert.deepEqual(errors,[]);
 const blocked=await browser.newContext();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage blocked');}}));const fallback=await blocked.newPage();await fallback.goto(url);await fallback.locator('[data-island="mechanical"]').click();await fallback.locator('#start-island-question').click();await fallback.locator('[data-quest-answer="1"]').click();assert.match(await fallback.locator('#dialog').innerText(),/無法保存進度/);assert.match(await fallback.locator('#dialog-title').innerText(),/金幣 ＋1/);
 console.log('PASS: 8 landmarks + food shop + keyboard NPC; both answer options award; 8 unique coins; duplicate prevention; reload/cross-tab persistence; pending physical prize retains coins; mobile; blocked-storage fallback.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
