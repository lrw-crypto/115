'use strict';
const CAMPUS_PRIZE_LIMIT=15;
const CAMPUS_CLEAR_KEY='ttvs_115_all_tasks_clear';
const CAMPUS_CLEAR_PENDING_KEY=CAMPUS_CLEAR_KEY+'_pending';
let campusRewardRequest=null,campusRewardRank=null;
function rewardAPI(){
 const value=window.CAMPUS_REWARD_API||'';if(!value)return null;
 try{const u=new URL(value);if(u.protocol==='https:'&&u.hostname==='script.google.com'&&/^\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(u.pathname)&&!u.search&&!u.hash&&!u.username&&!u.password)return u.href;}catch{}
 return null;
}
function validCompletionRank(value){return /^\d+$/.test(String(value))&&Number.isSafeInteger(Number(value))&&Number(value)>0;}
function savedCompletionRank(){
 if(campusRewardRank)return campusRewardRank;
 try{const saved=localStorage.getItem(CAMPUS_CLEAR_KEY);if(validCompletionRank(saved))campusRewardRank=Number(saved);}catch{}
 return campusRewardRank;
}
function completionReceipt(rank){return{rank,eligible:rank<=CAMPUS_PRIZE_LIMIT};}
async function allocateCompletionRank(){
 // Recheck after acquiring the cross-tab lock, not only before waiting for it.
 const saved=savedCompletionRank();if(saved)return completionReceipt(saved);
 const api=rewardAPI();if(!api)throw Error('NOT_CONFIGURED');
 try{if(localStorage.getItem(CAMPUS_CLEAR_PENDING_KEY))throw Error('PENDING_CONFIRMATION');localStorage.setItem(CAMPUS_CLEAR_PENDING_KEY,'1');}
 catch(error){if(error.message==='PENDING_CONFIRMATION')throw error;throw Error('STORAGE_UNAVAILABLE');}
 const url=new URL(api);url.searchParams.set('action','hit');url.searchParams.set('id',CAMPUS_CLEAR_KEY);
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
 try{
  const response=await fetch(url.href,{method:'GET',cache:'no-store',credentials:'omit',signal:controller.signal});
  if(!response.ok)throw Error('PENDING_CONFIRMATION');const data=await response.json();
  if(data.success===false){try{localStorage.removeItem(CAMPUS_CLEAR_PENDING_KEY);}catch{}throw Error('SERVICE_BUSY');}
  if(data.success!==true||!validCompletionRank(data.count))throw Error('PENDING_CONFIRMATION');
  const rank=Number(data.count);campusRewardRank=rank;
  try{localStorage.setItem(CAMPUS_CLEAR_KEY,String(rank));localStorage.removeItem(CAMPUS_CLEAR_PENDING_KEY);}catch{}
  return completionReceipt(rank);
 }catch(error){if(error.message==='SERVICE_BUSY')throw error;throw Error('PENDING_CONFIRMATION');}
 finally{clearTimeout(timeout);}
}
function registerCampusCompletion(){
 // Calling this from the console, entering the map, or reading a department
 // never bypasses the actual eight-department completion requirement.
 if(questCoins()!==8)return Promise.reject(Error('NOT_COMPLETED'));
 if(campusRewardRequest)return campusRewardRequest;
 campusRewardRequest=(async()=>{
  try{
   if(navigator.locks?.request){let entered=false;try{return await navigator.locks.request(CAMPUS_CLEAR_KEY,()=>{entered=true;return allocateCompletionRank();});}catch(error){if(entered)throw error;}}
   return await allocateCompletionRank();
  }finally{campusRewardRequest=null;}
 })();return campusRewardRequest;
}
function triggerEntranceMessage(){toast('前15名完成遊戲者可以領取小獎品唷！');}
function triggerAllTasksCompleted(){if(questCoins()===8)return openCompletionReward();}
async function openCompletionReward(){
 if(questCoins()!==8)return;
 openModal(`<div class="completion-reward"><div class="completion-npc">${npcPortrait()}</div><h2 id="dialog-title">校園客服-中鼎文</h2><div id="completion-reward-content" aria-live="polite"><p>任務全數達成！正在為你結算全站完成名次…</p></div><div class="form-actions"><button class="primary-btn" id="continue-exploring">返回校園</button></div></div>`);
 const content=$('#completion-reward-content');$('#continue-exploring').onclick=()=>{closeModal();showView('map');};
 try{
  const receipt=await registerCampusCompletion();if(!content.isConnected||$('#modal-backdrop').hidden)return;
  content.innerHTML=receipt.eligible?`<div class="completion-rank" aria-label="第 ${receipt.rank} 位完成">第 <strong>${receipt.rank}</strong> 位</div><p class="completion-message">恭喜！你是第 <strong>${receipt.rank}</strong> 位完成遊戲！<br>記得截圖，出示本畫面可以到校長室領小獎品唷！</p><div class="completion-ticket"><b>八科探索完成</b><span>金幣 8 枚</span><small>請截圖保存本畫面</small></div>`:`<div class="completion-rank">探索完成 ✓</div><p class="completion-message">恭喜完成！<br>不好意思，獎品已發送完畢！</p><p class="completion-total">你是第 ${receipt.rank} 位完成遊戲的探索者。</p>`;
 }catch(error){
  if(!content.isConnected||$('#modal-backdrop').hidden)return;
  const retry=error.message==='SERVICE_BUSY';
  const message=error.message==='NOT_CONFIGURED'?'完成名次登記尚未開放，請截圖洽工作人員。':error.message==='STORAGE_UNAVAILABLE'?'此瀏覽器無法保存完成名次，請截圖洽工作人員。':retry?'名次系統忙碌中，請稍後重試。':'名次結算狀態需要確認，請截圖洽工作人員。';
  content.innerHTML=`<p class="completion-message">恭喜完成所有任務！</p><p>${message}</p><p>你的八枚金幣與護照進度不受影響。</p>${retry?'<button class="secondary-btn" id="retry-completion-reward">重新結算</button>':''}`;
  if(retry)$('#retry-completion-reward').onclick=openCompletionReward;
 }
}
