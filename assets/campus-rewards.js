'use strict';
let campusRewardClient=null,campusRewardRequest=null;
function rewardClientId(){
 if(campusRewardClient)return campusRewardClient;
 try{const saved=localStorage.getItem('caotun-reward-client-v1');if(/^[a-zA-Z0-9-]{20,80}$/.test(saved||''))campusRewardClient=saved;}catch{}
 if(!campusRewardClient){campusRewardClient=crypto.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join('');try{localStorage.setItem('caotun-reward-client-v1',campusRewardClient);}catch{}}
 return campusRewardClient;
}
function rewardAPI(){
 const value=window.CAMPUS_REWARD_API||'';if(!value)return null;
 try{const u=new URL(value);if(u.protocol==='https:'&&u.hostname==='script.google.com'&&/^\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(u.pathname)&&!u.search&&!u.hash&&!u.username&&!u.password)return u.href;}catch{}
 return null;
}
async function stableRewardClientId(){
 if(navigator.locks?.request)try{return await navigator.locks.request('caotun-reward-client-id',()=>{campusRewardClient=null;return rewardClientId();});}catch{}
 return rewardClientId();
}
function registerCampusCompletion(){
 if(campusRewardRequest)return campusRewardRequest;
 const url=rewardAPI();if(!url)return Promise.reject(new Error('NOT_CONFIGURED'));
 campusRewardRequest=(async()=>{
  let timeout;
  try{
   const clientId=await stableRewardClientId(),controller=new AbortController();timeout=setTimeout(()=>controller.abort(),12000);
   const response=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({clientId,completed:[...questState.completed]}),credentials:'omit',signal:controller.signal});
   if(!response.ok)throw Error('UNAVAILABLE');const r=await response.json();
   if(!r.ok||!Number.isSafeInteger(r.rank)||r.rank<1||!Number.isSafeInteger(r.total)||r.total<r.rank||r.limit!==15||r.eligible!==(r.rank<=15)||!/^CS-\d{3,}-[A-F0-9]{8}$/.test(r.receiptCode||'')||!Number.isFinite(Date.parse(r.completedAt)))throw Error('INVALID_RECEIPT');
   // Only a server response can assign a rank. There is no browser-only counter.
   return r;
  }finally{clearTimeout(timeout);campusRewardRequest=null;}
 })();return campusRewardRequest;
}
async function openCompletionReward(){
 if(questCoins()!==8)return;
 openModal(`<div class="completion-reward"><div class="completion-npc">${npcPortrait()}</div><h2 id="dialog-title">校園客服-中鼎文</h2><div id="completion-reward-content" aria-live="polite"><p>八科探索完成！正在登記完成名次…</p></div><div class="form-actions"><button class="primary-btn" id="continue-exploring">返回校園</button></div></div>`);
 const content=$('#completion-reward-content');$('#continue-exploring').onclick=()=>{closeModal();showView('map');};
 try{
  const receipt=await registerCampusCompletion();if(!content.isConnected)return;
  content.innerHTML=receipt.eligible?`<div class="completion-rank" aria-label="第 ${receipt.rank} 位完成">第 <strong>${receipt.rank}</strong> 位</div><p class="completion-message">恭喜！你是第 <strong>${receipt.rank}</strong> 位完成遊戲！<br>記得截圖，出示本畫面可以到校長室領小獎品唷！</p><div class="completion-ticket"><b>領獎編號</b><span>${esc(receipt.receiptCode)}</span><small>八科探索完成 · 金幣 8 枚</small></div>`:`<div class="completion-rank">探索完成 ✓</div><p class="completion-message">恭喜完成！<br>不好意思，獎品已發送完畢！</p><p class="completion-total">你是第 ${receipt.rank} 位完成遊戲的探索者。</p>`;
 }catch(error){
  if(!content.isConnected)return;
  content.innerHTML=`<p class="completion-message">八科探索完成！</p><p>${error.message==='NOT_CONFIGURED'?'完成名次登記尚未開放，請稍後再試。':'暫時無法登記完成名次，請重試。'}</p><p>你的八枚金幣與護照進度不受影響。</p><button class="secondary-btn" id="retry-completion-reward">重新登記</button>`;
  $('#retry-completion-reward').onclick=openCompletionReward;
 }
}
