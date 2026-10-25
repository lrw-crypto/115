'use strict';

function departmentLandmark(id) {
  const frame=(body)=>`<g class="department-landmark" data-landmark="${id}" stroke-linejoin="round">${vividMaterial(body)}</g>`;
  const plate=(text,x=-2,y=28)=>`<g transform="translate(${x} ${y})"><rect x="-51" y="-10" width="102" height="19" rx="7" fill="#fff7dc"/><text text-anchor="middle" y="3" fill="#60745b" font-size="9" font-weight="600">${text}</text></g>`;
  if(id==='mechanical')return frame(`<ellipse cy="25" rx="65" ry="22" fill="#b3c4b6"/><path d="m-65-5 112 18 22-14-111-18Z" fill="#cadcd2"/><path d="M-65-5v22L47 36V13Z" fill="#6e9d99"/><path d="m47 13 22-14v22L47 36Z" fill="#548e8d"/><path d="m-54-35 24 4v38l-24-3Z" fill="#7daeb0"/><path d="m-54-35 12-9 24 4-12 9Z" fill="#c0dcce"/><path d="m-30-31 12-9V0l-12 7Z" fill="#548e8d"/><ellipse cx="-14" cy="-18" rx="10" ry="14" fill="#c2cbc2" stroke="#718d86" stroke-width="3"/><path d="m-7-18 46 8" stroke="#c3b595" stroke-width="10" stroke-linecap="round"/><path d="m-7-21 46 8" stroke="#efe4c1" stroke-width="3"/><path d="m3-5 21 4v18l-21-3Z" fill="#f1cf83"/><circle cx="12" cy="7" r="7" fill="#688b83" stroke="#dbe7cd" stroke-width="2"/><path d="M12 1v12m-6-6h12" stroke="#dbe7cd" stroke-width="1.5"/><path d="m40-25 15 3v29l-15-2Z" fill="#81aa9b"/><path d="m39-25 8-8 15 3-7 8Z" fill="#d9e5c9"/><circle cx="-43" cy="-17" r="3" fill="#f4a47f"/>${plate('車床加工 · 動手做零件',0,54)}`);
  if(id==='piping')return frame(`<path d="M-61 24v-57q0-10 12-10h33v-18m0 18h39q12 0 12 12v54" fill="none" stroke="#539b9a" stroke-width="13" stroke-linecap="round"/><path d="M-61 24v-57q0-10 12-10h33v-18m0 18h39q12 0 12 12v54" fill="none" stroke="#a7d6c2" stroke-width="6"/><path d="M-14-42v53h37" fill="none" stroke="#e8bb70" stroke-width="11" stroke-linecap="round"/><circle cx="-14" cy="-12" r="11" fill="#d9786d" stroke="#f2dbc0" stroke-width="2"/><path d="M-14-20v16m-8-8h16" stroke="#fff0cb" stroke-width="2"/><ellipse cx="52" cy="-21" rx="16" ry="8" fill="#d2d9cf"/><path d="M36-21v47q16 14 32 0v-47" fill="#bccdc2"/><ellipse cx="52" cy="26" rx="16" ry="8" fill="#a6bcb3"/><path d="M47-30v-10h10v10" fill="#e6b66d"/><text x="52" y="10" fill="#607c70" font-size="10" text-anchor="middle">瓦斯</text>${plate('水管與瓦斯管線',0,53)}`);
  if(id==='business')return frame(`<path d="M-7-2v36m18-36v36m-34 0h56" stroke="#a98d68" stroke-width="6" stroke-linecap="round"/><rect x="-66" y="-77" width="132" height="84" rx="12" fill="#a9bca9"/><rect x="-60" y="-71" width="120" height="71" rx="8" fill="#345d5d"/><g stroke="#70908a" stroke-width=".7" opacity=".6"><path d="M-52-52H52m-104 15H52m-104 15H52M-25-64v57M0-64v57m25-57v57"/></g>${[-42,-25,-8,9,26,43].map((x,i)=>`<path d="M${x} ${-30-i*4}v${i%2?25:20}" stroke="${i%2?'#e9a58b':'#a8d5a2'}" stroke-width="2"/><rect x="${x-4}" y="${-26-i*4}" width="8" height="${i%2?13:8}" rx="1" fill="${i%2?'#e9a58b':'#a8d5a2'}"/>`).join('')}<text x="-49" y="-58" fill="#f8e5b3" font-size="8">市場觀察 · STOCK</text>${plate('看懂市場，認識投資風險',0,52)}`);
  if(id==='accounting')return frame(`<g transform="rotate(-8)"><rect x="-43" y="-82" width="88" height="113" rx="15" fill="#a399bb"/><rect x="-43" y="-85" width="84" height="109" rx="14" fill="#cdc0db" stroke="#e3d5df" stroke-width="2"/><rect x="-33" y="-74" width="64" height="24" rx="5" fill="#edf0c9"/><text x="23" y="-57" text-anchor="end" fill="#6d806a" font-size="15" font-family="monospace">123.45</text>${['7','8','9','÷','4','5','6','×','1','2','3','−','0','.','=','+'].map((n,i)=>`<rect x="${-32+i%4*17}" y="${-41+Math.floor(i/4)*15}" width="13" height="11" rx="3" fill="${i%4===3?'#eece94':'#fff4dd'}"/><text x="${-25+i%4*17}" y="${-33+Math.floor(i/4)*15}" text-anchor="middle" fill="#887e93" font-size="8">${n}</text>`).join('')}</g>${plate('計算機 · 把每筆帳算清楚',0,53)}`);
  if(id==='data')return frame(`<path d="M-65 19h129l-20 17H-80Z" fill="#b7c9ba"/><path d="M-65 19v10l-15 7V26m15 3H64V19" fill="#8eb1a4"/><rect x="-50" y="-79" width="103" height="70" rx="9" fill="#80aeb1"/><rect x="-44" y="-73" width="91" height="55" rx="5" fill="#365c66"/><path d="m-15-60-13 12 13 12m27-24 13 12-13 12M4-63l-8 31" stroke="#c3e0b7" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-4-9V9m-15 2h32" stroke="#6f999b" stroke-width="6" stroke-linecap="round"/><path d="m-44 16 65 0-11 11h-65Z" fill="#edf1d7" stroke="#a7bbac" stroke-width="1"/><path d="M-38 20h47m-51 4h45" stroke="#c0ccba" stroke-width="1.5"/><ellipse cx="42" cy="23" rx="8" ry="5" fill="#f4db9e"/>${plate('程式 × 資料 × 數位創作',0,53)}`);
  if(id==='english')return frame(`<path d="M0 10v24m-21 2h42" stroke="#ae966f" stroke-width="7" stroke-linecap="round"/><path d="M-17-78q61 10 40 66" stroke="#d2ba8b" stroke-width="6" fill="none"/><circle cx="0" cy="-36" r="36" fill="#92cacc" stroke="#c3e4d6" stroke-width="3"/><path d="m-29-57 15-6 11 9-5 13-10-2-9 7m37-33 17 14-7 12 9 13-9 20-9-2-5-18-11-5 4-13Z" fill="#b6d18f"/><ellipse cx="0" cy="-36" rx="15" ry="35" fill="none" stroke="#e2f0d1" stroke-width="1"/><path d="M-35-36h70m-64-17h58m-58 34h58" stroke="#e2f0d1" stroke-width="1" fill="none"/><g transform="translate(45 -57) rotate(22)"><path d="m0-20 5 15 15 7v5L5 4v12l6 5v3L0 21l-11 3v-3l6-5V4l-15 3V2l15-7Z" fill="#fff8e2" stroke="#b6c7bd" stroke-width="1"/></g><g><rect x="-73" y="-88" width="52" height="22" rx="10" fill="#fff1cb"/><text x="-47" y="-73" fill="#b08a66" text-anchor="middle" font-size="11">Hello!</text></g>${plate('語言，讓世界更靠近',0,53)}`);
  if(id==='service')return frame(`<g transform="translate(-29 -15)"><path d="m-37 4 69 10 21-14-67-10Z" fill="#e3d7b1"/><path d="M-37 4v28l69 12V14Z" fill="#adc196"/><path d="m32 14 21-14v30L32 44Z" fill="#7da78b"/><ellipse cx="-4" cy="1" rx="21" ry="10" fill="#7e8872"/><path d="M-22-17v15q18 15 36 0v-15" fill="#b8cbd0"/><ellipse cx="-4" cy="-17" rx="18" ry="7" fill="#dce2ca" stroke="#809b99" stroke-width="2"/><path d="M-10-31q-7-7 0-13m14 13q-7-7 0-13" stroke="#fff7dc" stroke-width="3" fill="none" stroke-linecap="round"/></g><g transform="translate(48 -21)"><path d="m-27-1 8-23h31L26-1v24h-53Z" fill="#90bcb9" stroke="#d0ddd1" stroke-width="2"/><path d="m-15-20-6 17h41l-10-17Z" fill="#dfebd9"/><rect x="-26" y="9" width="52" height="12" rx="6" fill="#78a5ac"/><circle cx="-16" cy="24" r="6" fill="#697b72"/><circle cx="16" cy="24" r="6" fill="#697b72"/><circle cx="-17" cy="10" r="4" fill="#f7e6ad"/><circle cx="17" cy="10" r="4" fill="#f7e6ad"/>${[[-26,-20],[-15,-28],[12,-26],[29,-5],[20,1],[-30,3]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="#f1f9ed" stroke="#d0e6dc" stroke-width="1"/>`).join('')}</g>${plate('烹飪 × 洗車 × 生活實作',0,53)}`);
  if(id==='sports')return frame(`<ellipse cy="-2" rx="75" ry="36" fill="#d59777"/><ellipse cy="-2" rx="62" ry="26" fill="#b7cc8d"/><ellipse cy="-2" rx="70" ry="31" stroke="#f9e8c7" fill="none" stroke-width="1.5"/><path d="M-31-48v-38m55 38v-38m-55 1h55" stroke="#d3b47b" stroke-width="3"/><path d="M-29-40H26l12 9H-37Z" fill="#91b7c2"/><path d="M-37-31v8h75v-8" fill="#72a1b1"/><path d="M-4-4Q-27-47-17-83" stroke="#e5c77d" stroke-width="2.5" fill="none"/><g transform="translate(-9 -64) rotate(-65) scale(.46)">${animal(0,0,'','bear')}</g><g transform="translate(39 -3) scale(.47)">${animal(0,0,'','rabbit')}</g><g transform="translate(-51 4) scale(.45)"><path d="m-8-10-14 13m27-12 17-10" stroke="#f9f0da" stroke-width="6" stroke-linecap="round"/><path d="M-8-29H8v19H-8Z" fill="#fff8e5"/><circle cy="-40" r="12" fill="#eac08d"/><path d="M-12-43q12-16 24 0" fill="#3b3d31"/><path d="M-8-16H8" stroke="#35415a" stroke-width="3"/></g>${plate('跆拳道 · 跑步 · 撐竿跳',0,53)}`);
  return '';
}

function foodShopScenery() {
 return `<g class="fish-soup-shop" role="button" tabindex="0" aria-label="查看南臺灣土魠魚羹商標" transform="translate(1002 108)">
 <ellipse cx="22" cy="34" rx="90" ry="31" fill="#ffe2a6" stroke="#fff3cf" stroke-width="6"/>
 <path d="M-56-18H64l31-20v64L64 48-56 29Z" fill="#fff3cb" stroke="#e6bd7b" stroke-width="2"/>
 <path d="m64-18 31-20v64L64 48Z" fill="#dba763"/>
 <path d="m-63-26 127 0 42-23H-21Z" fill="#ed993a" stroke="#ffcd73" stroke-width="3"/>
 <rect x="-56" y="-26" width="123" height="30" rx="3" fill="#d92e2e"/>
 <image href="assets/nantaiwan-mark.svg" x="-53" y="-25" width="30" height="27"/>
 <text x="20" y="-7" fill="#fff8d5" font-size="11" text-anchor="middle" font-weight="800">南臺灣土魠魚羹</text>
 <path d="M-56 5H65l12 13H-69Z" fill="#ffcb52"/>
 <rect x="-42" y="14" width="39" height="19" rx="2" fill="#5cbcb6"/><rect x="14" y="10" width="30" height="33" rx="3" fill="#a57b4b"/>
 <ellipse cx="-25" cy="21" rx="12" ry="5" fill="#fff1bf"/><path d="M-37 21q12 17 24 0Z" fill="#f28e36"/>
 <path d="M-28 13q-4-6 0-11m7 11q-4-6 0-11" stroke="#fffde5" stroke-width="2" fill="none"/>
 <text x="19" y="67" fill="#886e46" font-size="8" text-anchor="middle">萊爾富右側 · 想像場景</text>
 </g>`;
}
const QUEST_IDS=['mechanical','piping','business','accounting','data','english','service','sports'];
const QUEST_KEY='caotun-island-exploration-v1';
let questState={completed:[]};
let questStorageOK=true;
function parseQuestState(value) {
  if(!value||typeof value!=='object')return {completed:[]};
  const completed=Array.isArray(value.completed)?[...new Set(value.completed.filter(id=>QUEST_IDS.includes(id)))]:[];
  return {completed};
}
function syncQuestState() {
  try {
    const saved=parseQuestState(JSON.parse(localStorage.getItem(QUEST_KEY)||'null'));
    questState=parseQuestState({completed:[...questState.completed,...saved.completed]});
  } catch {questStorageOK=false;}
}
function saveQuestState(){try{localStorage.setItem(QUEST_KEY,JSON.stringify(questState));questStorageOK=true;}catch{questStorageOK=false;}}
const questCoins=()=>questState.completed.length;
function refreshQuestWallet() {
  const button=$('#quest-wallet');
  if(button){button.innerHTML=`<span>🪙</span> ${questCoins()}<small>/ 8</small>`;button.setAttribute('aria-label',`金幣 ${questCoins()} 枚，找中鼎文，校園客服`);}
  $$('[data-department]').forEach(el=>el.classList.toggle('quest-complete',questState.completed.includes(el.dataset.department)));renderPassport();
}
function questFooter(id){const info=MISSION_INFO[id],done=questState.completed.includes(id);return `<div class="mission-invitation"><span>${info.icon}</span><div><h3>${info.title}</h3><p>大約 1 分鐘，動手認識這個科別。</p></div><button class="primary-btn" id="start-campus-mission">${done?'再體驗一次 →':'開始小任務 →'}</button><small>${done?'護照已有這科的章，歡迎重玩，不會重複領幣。':'完成後蓋一個章，獲得 1 枚探索金幣。'}</small></div>`;}
function awardQuestCoin(id){
 if(!QUEST_IDS.includes(id))return;syncQuestState();const already=questState.completed.includes(id);
 if(!already){questState.completed.push(id);saveQuestState();}refreshQuestWallet();
 const info=MISSION_INFO[id],department=departments.find(d=>d.id===id);
 openModal(`<div class="mission-success"><span class="success-seal">${already?'✓':'🪙'}</span><div class="eyebrow">PASSPORT STAMPED · ${department.name}</div><h2 id="dialog-title">你認識了這個科別！</h2><p>${info.learn}</p><strong>${already?'已經有這一科的章了，重玩一樣很棒！':'探索金幣 ＋1，護照多了一個章！'}</strong><div class="quest-progress"><span style="width:${questState.completed.length/8*100}%"></span></div><p>已探索 ${questState.completed.length} / 8 科 · 目前 ${questCoins()} 枚金幣</p><div class="form-actions"><button class="primary-btn" id="continue-exploring">繼續逛校園 →</button><button class="secondary-btn" id="view-quest-wallet">看看探索護照</button></div></div>${questStorageNotice()}`);
 $('#continue-exploring').onclick=()=>{closeModal();showView('map');};$('#view-quest-wallet').onclick=openRewardNpc;
}

function npcPortrait(){return `<svg class="npc-portrait scooter-portrait" viewBox="-54 -76 108 115" aria-hidden="true">${scooterArt()}</svg>`;}

function questStorageNotice(){return `<p class="course-footnote">${questStorageOK?'進度保存在此瀏覽器，不會跨裝置同步；清除網站資料會重設進度。':'此瀏覽器無法保存進度，目前只保留在這次開啟的頁面；關閉後可能遺失。'}這是此瀏覽器的探索紀錄；正式兌換與領取資格，依校方之後公告的規則確認。</p>`;}
function openRewardNpc() {
  syncQuestState();refreshQuestWallet();
  const coins=questCoins();
  openModal(`<div class="npc-shop-heading">${npcPortrait()}<div class="eyebrow">ZHONG DING WEN · CAMPUS GUIDE</div><h2 id="dialog-title">中鼎文・校園客服</h2><p>${coins===8?'八個科別都探索過了，好厲害！你的八枚金幣已收集完成，小禮物的領取辦法正在準備中。':'每次完成一個科別小任務，就會在探索護照蓋一個章，並得到一枚金幣。集滿八枚，就可以來看看校方準備的小禮物！'}</p></div><div class="quest-balance"><span>🪙</span><strong>${coins}</strong><small>枚金幣 · 已探索 ${questState.completed.length} / 8 科</small></div><div class="quest-stamps">${departments.map(d=>`<span class="${questState.completed.includes(d.id)?'earned':''}">${questState.completed.includes(d.id)?'✓':'○'} ${d.name}</span>`).join('')}</div><div class="reward-card"><span>🎁</span><div><h3>校方準備的實體小禮物</h3><p>帶著好奇心完成八個科別的探索，再呼叫我吧！</p><small>獎品內容、領取時間、地點與確認方式，待校方公告。</small></div></div><button class="primary-btn redeem-button" id="redeem-quest-reward" disabled>${coins===8?'已集滿！領取辦法待公告':`還差 ${8-coins} 枚，再去逛逛吧`}</button><p class="reward-pending">${coins===8?'金幣先幫你保留，不會預先扣除。':'目前尚未開放正式兌換，先開心地探索吧！'}</p>${questStorageNotice()}`);
}

function initCampusQuests() {
  syncQuestState();refreshQuestWallet();
  $('#quest-wallet').onclick=openRewardNpc;
  const food=$('.fish-soup-shop');const openFood=()=>openModal(`<div class="eyebrow">校外散步 · 萊爾富右側</div><h2 id="dialog-title">南臺灣土魠魚羹</h2><img class="shop-logo-preview" src="assets/nantaiwan-mark.svg" alt="南臺灣土魠魚羹商標，依提供圖樣描繪"><p>逛完校園，也到校外的小吃店看看吧。</p><p class="course-footnote">商標依你提供的圖樣描繪為 SVG。店面為想像場景，非實際店址示意。</p>`);food.onclick=()=>{if(!drag.moved)openFood();};food.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openFood();}};
  const npc=$('#reward-npc');npc.onclick=()=>{if(!drag.moved)openRewardNpc();};npc.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openRewardNpc();}};
  window.addEventListener('storage',event=>{if(event.key===QUEST_KEY){syncQuestState();refreshQuestWallet();}});
}
