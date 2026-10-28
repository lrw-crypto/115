'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const SCHOOL_URL='https://www.ttvs.ntct.edu.tw/ischool/publish_page/14/?cid=2855';
const CURRICULUM_SOURCES=CURRICULUM.documents;
const docHref=(id,page=1)=>`${CURRICULUM.documents.find(d=>d.id===id).url}#page=${page}`;
function curriculumLinks(){return `<div class="curriculum-sources"><h3>115 學年度課程計畫書</h3><p>依你提供的三份備查版文件整理，適用於 115 學年度入學學生。頁碼為 PDF 閱讀器頁序。</p><ul>${CURRICULUM_SOURCES.map(d=>`<li><a href="${d.url}" target="_blank" rel="noopener noreferrer">${d.title} · ${d.pages} 頁 ↗</a></li>`).join('')}</ul></div>`;}
const departments=[
  {
    "id": "mechanical",
    "name": "機械科",
    "en": "MECHANICAL ENGINEERING",
    "type": "engineering",
    "icon": "⚙️",
    "color": "#fff1bf",
    "accent": "#ff9847",
    "subtitle": "從機械製圖、加工到數值控制，親手實現想法。",
    "description": "從機械製圖、加工到數值控制，親手實現想法。",
    "departments": [
      "機械科"
    ],
    "programIds": [
      "mechanical"
    ]
  },
  {
    "id": "piping",
    "name": "配管科",
    "en": "PIPING TECHNOLOGY",
    "type": "engineering",
    "icon": "🔧",
    "color": "#baf0dd",
    "accent": "#10b9ba",
    "subtitle": "認識金屬管線、銲接與建築配管的實作世界。",
    "description": "認識金屬管線、銲接與建築配管的實作世界。",
    "departments": [
      "配管科"
    ],
    "programIds": [
      "piping"
    ]
  },
  {
    "id": "business",
    "name": "商業經營科",
    "en": "BUSINESS MANAGEMENT",
    "type": "business",
    "icon": "🛒",
    "color": "#ffe4b5",
    "accent": "#ff6656",
    "subtitle": "用門市經營、行銷與專題，探索商業的可能。",
    "description": "用門市經營、行銷與專題，探索商業的可能。",
    "departments": [
      "商業經營科"
    ],
    "programIds": [
      "business"
    ]
  },
  {
    "id": "accounting",
    "name": "會計事務科",
    "en": "ACCOUNTING",
    "type": "business",
    "icon": "📒",
    "color": "#e3ccff",
    "accent": "#a46bea",
    "subtitle": "從會計學到帳務實作，學習看懂數字的語言。",
    "description": "從會計學到帳務實作，學習看懂數字的語言。",
    "departments": [
      "會計事務科"
    ],
    "programIds": [
      "accounting"
    ]
  },
  {
    "id": "data",
    "name": "資料處理科",
    "en": "DATA PROCESSING",
    "type": "business",
    "icon": "💻",
    "color": "#bcecfb",
    "accent": "#289fdd",
    "subtitle": "以程式、多媒體與資料庫，把點子做成作品。",
    "description": "以程式、多媒體與資料庫，把點子做成作品。",
    "departments": [
      "資料處理科"
    ],
    "programIds": [
      "data"
    ]
  },
  {
    "id": "english",
    "name": "應用英語科",
    "en": "APPLIED ENGLISH",
    "type": "community",
    "icon": "🌍",
    "color": "#ffe0df",
    "accent": "#ed7bb1",
    "subtitle": "從聽講、閱讀到簡報，讓你的想法走向世界。",
    "description": "從聽講、閱讀到簡報，讓你的想法走向世界。",
    "departments": [
      "應用英語科"
    ],
    "programIds": [
      "english"
    ],
    "aliases": [
      "應用英文科"
    ]
  },
  {
    "id": "service",
    "name": "綜合職能科",
    "en": "VOCATIONAL SKILLS",
    "type": "community",
    "icon": "🌼",
    "color": "#e3f7ac",
    "accent": "#8fbd25",
    "subtitle": "在餐飲、清潔與服務實作中，累積生活的自信。",
    "description": "在餐飲、清潔與服務實作中，累積生活的自信。",
    "departments": [
      "綜合職能科"
    ],
    "programIds": [
      "service"
    ]
  },
  {
    "id": "sports",
    "name": "普通體育班",
    "en": "SPORTS & ATHLETICS",
    "type": "community",
    "icon": "🏅",
    "color": "#c7f2de",
    "accent": "#1aa886",
    "subtitle": "以專項體能、技術訓練與運動防護，超越自己。",
    "description": "以專項體能、技術訓練與運動防護，超越自己。",
    "departments": [
      "普通體育班"
    ],
    "programIds": [
      "sports"
    ]
  }
];
const programName=p=>departments.find(d=>d.id===p.id).name;
function isSpecialistCourse(c){return (c.credits>0||c.semesters.some(v=>v.startsWith('(')))&&(c.kind==='專業科目'||c.kind==='實習科目'||c.kind.includes('體育專')||c.name==='運動傷害防護');}
const demoFeed=[
{id:'f1',islandId:'data',type:'learning',icon:'💻',bg:'#e4eddf',title:'第一個程式完成，把想法變成小工具！',category:'實作日常',time:'示範 · 5 分鐘前',body:'資料處理科的夥伴們一起完成程式練習，從設計到除錯，記錄每一次試錯與發現。此為介面展示情境，並非真實 Discord 貼文。'},
{id:'f2',islandId:'business',type:'event',icon:'✦',bg:'#efe7d6',title:'從點子到提案，創意交流日',category:'活動消息',time:'示範 · 20 分鐘前',body:'帶著你的企劃在校園分享！練習將想法轉成一份有說服力的提案，與不同領域的夥伴交流。此為活動版型示例，沒有實際報名或舉辦時間。'},
{id:'f3',islandId:'mechanical',type:'milestone',icon:'🏅',bg:'#e8e5f0',title:'一起努力的證照路，又前進了一步',category:'學習里程碑',time:'示範 · 1 小時前',body:'把每天的加工練習累積成看得見的進步。此為證照學習里程碑的呈現示例，不代表實際通過人數或考試結果。'}
];
let feed=[...demoFeed],currentView='map',filter='all',feedFilter='all',selectedDepartment=null,modalOrigin=null,botEndpoint='',botTimer=null,polling=false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ico=name=>`<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
function shade(hex,n){const v=parseInt(hex.slice(1),16);return '#'+[v>>16,v>>8&255,v&255].map(x=>Math.max(0,Math.min(255,x+n)).toString(16).padStart(2,'0')).join('');}
const pt=(u,v,z=0)=>[(u-v)*.866,(u+v)*.5-z];
const points=a=>a.map(p=>p.join(',')).join(' ');
const poly=(p,fill,extra='')=>`<polygon points="${points(p)}" fill="${fill}" ${extra}/>`;
function box(u,v,w,d,h,color,roof){let a=pt(u,v),b=pt(u+w,v),c=pt(u+w,v+d),e=pt(u,v+d),A=pt(u,v,h),B=pt(u+w,v,h),C=pt(u+w,v+d,h),E=pt(u,v+d,h);let out=poly([e,c,C,E],shade(color,-12))+poly([b,c,C,B],shade(color,-29))+poly([A,B,C,E],color);if(roof){let peak=pt(u+w/2,v+d/2,h+18);out+=poly([A,B,peak],shade(roof,12))+poly([B,C,peak],shade(roof,-12))+poly([C,E,peak],roof)+poly([E,A,peak],shade(roof,18));}for(let i=0;i<Math.floor(w/17);i++){let t=u+7+i*17;out+=poly([pt(t,v+d+.1,h-10),pt(t+7,v+d+.1,h-10),pt(t+7,v+d+.1,h-23),pt(t,v+d+.1,h-23)],'#709b98');}for(let i=0;i<Math.floor(d/17);i++){let t=v+6+i*17;out+=poly([pt(u+w+.1,t,h-10),pt(u+w+.1,t+6,h-10),pt(u+w+.1,t+6,h-23),pt(u+w+.1,t,h-23)],'#577e7c');}return out;}
function tree(u,v,size=1,kind='round'){let [x,y]=pt(u,v);return `<g transform="translate(${x} ${y}) scale(${size})"><ellipse cy="4" rx="16" ry="7" fill="#6b8d5420"/><path d="M0 0V-25" stroke="#947557" stroke-width="5"/>${kind==='pine'?`<path d="m0-66-19 34h8l-14 23h50L11-32h8Z" fill="#719d6c"/><path d="M0-66v57h25L11-32h8Z" fill="#5d8c60"/>`:`<circle cy="-36" r="20" fill="url(#leaf-shadow)"/><circle cx="-10" cy="-29" r="15" fill="url(#leaf-light)"/><circle cx="9" cy="-35" r="15" fill="url(#leaf-shadow)"/><circle cx="-5" cy="-43" r="13" fill="url(#leaf-light)"/>`}</g>`;}
function person(u,v,c='#d99c69',species='bear'){const[x,y]=pt(u,v);return animal(x,y,c,species);}
const STUDENT_EXPRESSIONS=['happy','smile','wink','curious','laugh','excited'];
function studentFace(expression='happy'){
 const openEyes='<ellipse cx="-6" cy="-35" rx="2.3" ry="3.3" fill="#3b3932"/><ellipse cx="7" cy="-35" rx="2.3" ry="3.3" fill="#3b3932"/><circle cx="-6.5" cy="-36" r=".8" fill="#fff9e9"/><circle cx="6.5" cy="-36" r=".8" fill="#fff9e9"/>';
 if(expression==='smile')return openEyes+'<path d="M-5-28q5 6 10 0" fill="none" stroke="#80523c" stroke-width="1.7" stroke-linecap="round"/>';
 if(expression==='wink')return '<path d="m-10-36 6 2-6 2" fill="none" stroke="#3f3c30" stroke-width="2" stroke-linecap="round"/><ellipse cx="7" cy="-35" rx="2.3" ry="3.2" fill="#3f3c30"/><circle cx="6.5" cy="-36" r=".8" fill="#fff9e9"/><path d="M-5-28q6 6 11-1" fill="none" stroke="#80523c" stroke-width="1.8" stroke-linecap="round"/>';
 if(expression==='curious')return openEyes+'<path d="M-10-41q4-4 8-1m5-1q4-2 8 1" stroke="#514533" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cy="-27" rx="2.7" ry="3.1" fill="#80523c"/>';
 if(expression==='laugh')return '<path d="m-10-34 4-3 4 3m5 0 4-3 4 3" fill="none" stroke="#3f3c30" stroke-width="2" stroke-linecap="round"/><path d="M-7-29H7Q5-18 0-20q-5 0-7-9Z" fill="#74452d"/><path d="M-6-28H6" stroke="#fff9e8" stroke-width="2"/><ellipse cy="-22" rx="3" ry="1.2" fill="#d98c7f"/>';
 if(expression==='excited')return openEyes+'<path d="M-6-29Q0-25 6-29Q5-20 0-21q-5 0-6-8Z" fill="#74452d"/><path d="m-7-37 2 3m-2 0 2-3m11 0 2 3m-2 0 2-3" stroke="#fff9e8" stroke-width="1"/><path d="M-5-29q5 2 10 0" stroke="#fff6d5" stroke-width="1.6" fill="none"/>';
 return '<path d="M-9-35q4-6 7 0m4 0q4-6 7 0" fill="none" stroke="#3f3c30" stroke-width="2.2" stroke-linecap="round"/><path d="M-6-29Q0-25 6-29Q5-21 0-22q-5 0-6-7Z" fill="#74452d"/><path d="M-5-29q5 2 10 0" stroke="#fff6d5" stroke-width="1.6" fill="none"/>';
}
function animal(x,y,c='#246b96',look='bear',expression='happy'){const glasses=look==='rabbit',ponytail=look==='rabbit'||look==='cat';return `<g class="animal-friend chibi-resident school-resident" transform="translate(${x} ${y})"><ellipse cy="4" rx="12" ry="4" fill="#38655226"/><g class="friend-bob">${ponytail?'<path d="M9-30q17 8 6 29 1-16-10-18Z" fill="#33372e"/>':''}<g class="step-left"><path d="M-5-5v7" stroke="#edc08a" stroke-width="5" stroke-linecap="round"/><path d="M-5 0v5" stroke="#f6efdc" stroke-width="5"/><ellipse cx="-6" cy="6" rx="5" ry="3" fill="#fff8e6" stroke="#d9d3c0" stroke-width=".8"/></g><g class="step-right"><path d="M5-5v7" stroke="#edc08a" stroke-width="5" stroke-linecap="round"/><path d="M5 0v5" stroke="#f6efdc" stroke-width="5"/><ellipse cx="5" cy="6" rx="5" ry="3" fill="#fff8e6" stroke="#d9d3c0" stroke-width=".8"/></g><path d="M-8-8h16l1 9H1L0-4-1 1h-8Z" fill="url(#uniform-blue)"/><path d="M-7-6v7m14-7v7" stroke="#efc9ac" stroke-width="1"/><path class="arm-left" d="m-9-17-3 10" stroke="#f1c48f" stroke-width="5" stroke-linecap="round"/><path class="arm-right" d="m9-17 3 10" stroke="#f1c48f" stroke-width="5" stroke-linecap="round"/><path d="M-8-23Q0-27 8-23l5 8-6 3H-7l-6-3Z" fill="url(#uniform-blue)"/><path d="M-5-23q5 4 10 0l3 16q-8 3-16 0Z" fill="url(#shirt-material)"/><path d="M-5-23q5 5 10 0" stroke="#28688b" stroke-width="2" fill="none"/><circle cx="4" cy="-15" r="2.5" fill="#276a92"/><path d="m4-17 .5 1.2 1.3.2-1 .9.3 1.2-1.1-.6-1.2.6.3-1.2-1-.9 1.4-.2Z" fill="#f7d568"/><circle cx="-13" cy="-34" r="4" fill="#e5b37d"/><circle cx="13" cy="-34" r="4" fill="#e5b37d"/><ellipse cy="-37" rx="15" ry="15" fill="url(#student-skin)"/><path d="M-15-35q-5-24 14-22 21-2 17 24l-5-10-4-5-2 9-7-9-4 9-6 4 2-10Z" fill="url(#student-hair)"/><path d="M-12-47q6-8 14-6" fill="none" stroke="#62614c" stroke-width="1.3" opacity=".5"/><g class="student-face" data-expression="${expression}">${studentFace(expression)}</g><ellipse cx="-10" cy="-30" rx="2.5" ry="1.4" fill="#e8aa83"/><ellipse cx="10" cy="-30" rx="2.5" ry="1.4" fill="#e8aa83"/>${glasses?'<g fill="none" stroke="#34372d" stroke-width="2"><circle cx="-7" cy="-35" r="7"/><circle cx="7" cy="-35" r="7"/><path d="M-1-36h2m-15-2-3-1m31 1 3-1"/></g>':''}</g></g>`;}

function flowers(u,v){let[x,y]=pt(u,v);return `<g transform="translate(${x} ${y})"><ellipse rx="15" ry="7" fill="#9db579"/>${[-8,0,8].map((n,i)=>`<circle cx="${n}" cy="${i===1?-5:-1}" r="3" fill="${i===1?'#edc884':'#e3a59a'}"/>`).join('')}</g>`;}
function bench(u,v){return box(u,v,26,8,8,'#bea37c')+poly([pt(u,v,18),pt(u+26,v,18),pt(u+26,v,11),pt(u,v,11)],'#cbb48c');}
function car(u,v,color='#e2ad78'){return box(u,v,35,16,10,color)+box(u+8,v+2,18,12,19,shade(color,10))+[pt(u+7,v+16),pt(u+28,v+16)].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="4" ry="5" fill="#606b61"/><circle cx="${x}" cy="${y}" r="2" fill="#d8d4c0"/>`).join('');}
function pond(){return `<ellipse cx="15" cy="30" rx="34" ry="17" fill="#d3d3ba"/><ellipse cx="15" cy="26" rx="28" ry="13" fill="#8fbeb5"/><ellipse cx="15" cy="24" rx="20" ry="8" fill="#aed5c8"/><path d="M15 21V2" stroke="#d7dcc3" stroke-width="5"/><ellipse cx="15" cy="1" rx="10" ry="4" fill="#c5d4ba"/><path d="M6 11q9-14 18 0" fill="none" stroke="#bfdfd0" stroke-width="2"/>`;}
function renderMap(){renderCampusMap();}

function feedHTML(items){if(!items.length)return '<p style="padding:20px;color:#8c9b80;font-size:12px">目前沒有這類動態，再去校園走走吧。</p>';return items.map(f=>`<button class="feed-item" data-feed-id="${esc(f.id)}"><span class="feed-icon" style="background:${f.bg||'#e5eddd'}">${esc(f.icon||'✦')}</span><span><h3>${esc(f.title)}</h3><span class="feed-meta">${esc(f.time)}<b>${esc(f.category)}</b></span></span></button>`).join('');}
function bindFeed(root){root.querySelectorAll('[data-feed-id]').forEach(el=>el.addEventListener('click',()=>openFeed(el.dataset.feedId)));}
function renderFeed(){const list=feedFilter==='event'?feed.filter(f=>f.type==='event'):feed;$('#feed-list').innerHTML=feedHTML(list.slice(0,3));bindFeed($('#feed-list'));if(currentView==='activity')renderActivity();}
function openModal(html,{department=false}={}){closeDataPhoto(false);$('#dialog').classList.remove('data-department-dialog','business-department-dialog');if(!department)cancelDepartmentVisit();$('#dialog').classList.toggle('department-dialog',department);if($('#modal-backdrop').hidden)modalOrigin=document.activeElement;$('#dialog').innerHTML=`<button class="icon-btn dialog-close" aria-label="關閉視窗">${ico('close')}</button>${html}`;$('#dialog').scrollTop=0;$('#modal-backdrop').hidden=false;document.body.style.overflow='hidden';$('.dialog-close').onclick=closeModal;$('#dialog').focus();}
function closeModal(){closeDataPhoto(false);cancelDepartmentVisit();$('#modal-backdrop').hidden=true;document.body.style.overflow='';modalOrigin?.focus({preventScroll:true});}
function programSource(p){return `<a href="${docHref(p.doc,p.pages[0])}" target="_blank" rel="noopener noreferrer">${CURRICULUM.documents.find(d=>d.id===p.doc).title} · PDF 第 ${p.pages.join('、')} 頁 ↗</a>`;}
const COURSE_EXPLAINERS={
  "機械製造": "認識生活中的零件，是怎麼一步步做出來的。",
  "機件原理": "齒輪、皮帶怎麼帶動機器？一起拆解運作的道理。",
  "機械力學": "了解力量怎麼影響機器，學著讓結構更穩固。",
  "機械材料": "金屬各有什麼脾氣？認識材料，選對用途。",
  "機械基礎實習": "從基本工具開始，練習量測、加工與安全操作。",
  "基礎電學實習": "動手接線與量測，認識電路怎麼運作。",
  "機械製圖實習": "練習把零件畫清楚，讓別人看圖就能製作。",
  "電腦輔助製圖與實習": "把紙上的線條搬進電腦，練習繪製機械圖。",
  "機械加工實習": "把材料慢慢加工成形，練習掌握尺寸與精度。",
  "電腦輔助設計實習": "用電腦畫出零件，試著把設計想法具體呈現。",
  "數值控制機械實習": "把加工步驟寫成指令，練習讓機台照著做。",
  "電腦輔助製造實習": "讓電腦協助規劃加工，連接設計與製作。",
  "綜合機械加工實習": "把不同加工方法串起來，完成一個零件。",
  "車床實習": "練習車削加工，把材料做成需要的形狀。",
  "專題實作": "從一個小問題出發，和同學把想法做成成果。",
  "電腦輔助製造進階實習": "進一步練習電腦輔助加工，把製作流程想得更周全。",
  "電腦繪圖實習": "用繪圖工具整理線條、尺寸，讓設計更清楚。",
  "精密加工實習": "多一點細心，練習把加工尺寸做得更準確。",
  "銑床與磨床實習": "認識銑削與研磨，練習不同的加工方式。",
  "數值控制機械進階實習": "進一步練習機台指令與加工操作。",
  "機械進階實習": "延伸基礎操作，挑戰更完整的機械實作。",
  "機電整合實習": "讓機械動作配合電路控制，練習整合系統。",
  "工模夾具": "認識固定工件的小幫手，讓加工更穩定。",
  "自動化概論": "了解機器如何配合感測與控制，自動完成工作。",
  "機械設計大意": "從用途與結構出發，認識機械設計的基本想法。",
  "機械高階實習": "整合學過的工具與方法，累積進階操作經驗。",
  "機械設計製圖實習": "把機械結構轉成圖面，練習表達設計細節。",
  "金屬成形實習": "試著改變金屬的形狀，認識材料成形的過程。",
  "銲接實習": "練習把金屬接合起來，也學會保護自己。",
  "金屬管線實習": "從辨識管材到接合，練習組裝金屬管線。",
  "工程材料": "認識工程常用材料，了解各自適合的用途。",
  "測量學": "學習量距離與位置，讓施工有可靠的依據。",
  "工業配管實習": "認識工業管線，練習配管與裝配工作。",
  "多元管材裝配實習": "接觸不同管材，練習選用合適的連接方法。",
  "自來水管配管實習": "練習配置水管，讓水流順利到達需要的地方。",
  "建築配管實習": "了解建築裡的管線，練習規劃與裝配。",
  "配管基礎實習": "從認識管材、工具到基本操作，慢慢上手。",
  "配管綜合實習": "把配管技巧連起來，練習完成較完整的工作。",
  "機械工作圖實習": "練習讀懂與繪製工作圖，掌握製作資訊。",
  "測量實習": "把課堂上的測量方法，拿到實際操作中練習。",
  "電工實習": "認識電工工具與線路，練習安全操作。",
  "機電應用實習": "把機械與電學知識，用在實際的小任務裡。",
  "建築製圖實習": "練習用圖面表達建築空間與配置。",
  "電腦輔助繪圖應用實習": "用電腦繪圖處理實際需求，讓圖面更有效率。",
  "商業概論": "一家店怎麼運作？從買賣與企業的日常開始認識。",
  "數位科技概論": "認識身邊的數位工具，以及它們如何改變工作。",
  "會計學": "學著記下每筆收支，讀懂一家公司的帳。",
  "經濟學": "價格為什麼變動？從生活中的選擇認識經濟。",
  "數位科技應用": "練習用數位工具整理資料、完成日常工作。",
  "商業溝通": "把想法說清楚，也學會聽懂合作夥伴的需求。",
  "門市經營實務": "從店內服務與營運，認識經營門市的日常。",
  "行銷實務": "練習想一想：怎麼讓需要的人認識好產品？",
  "會計軟體應用": "用軟體處理帳務，讓收支紀錄更有條理。",
  "金融與證券投資實務": "認識金融與投資工具，也學習留意風險。",
  "經濟實務": "把經濟觀念帶回生活，分析身邊的商業現象。",
  "資料彙整與分析": "把零散資料整理好，再找出有用的線索。",
  "計算機應用": "認識電腦的運作與應用，建立數位工作的基礎。",
  "記帳實務": "練習把交易記成帳，整理收支與帳務資料。",
  "會計資訊分析與應用": "從會計資料找線索，練習理解經營狀況。",
  "會計實務": "把會計觀念用在實際的帳務練習裡。",
  "企業管理實務": "認識企業如何分工、規劃與一起完成目標。",
  "商業經營實務": "把商業知識用在情境練習，思考經營的選擇。",
  "小資理財課": "從日常收支開始，認識理財與規劃的觀念。",
  "巴菲特都推薦的指數型投資法": "認識指數型投資的想法，學習比較工具與風險。",
  "股神巴菲特的財報分析": "練習從財務報表，了解一家公司的經營資訊。",
  "財會軟體應用": "用財會軟體練習處理資料與帳務。",
  "商業簡報實務": "把資料變成清楚的簡報，練習說出重點。",
  "商業攝影": "練習用影像表達商品特色與商業訊息。",
  "從影片學商業": "透過影片情境，觀察商業活動與經營想法。",
  "會計與管理專題初探": "從會計與管理的小題目出發，練習整理與探究。",
  "租稅規劃與申報實務": "認識稅務與申報流程，練習處理相關資料。",
  "程式語言與設計": "把想做的事拆成步驟，寫成電腦看得懂的程式。",
  "多媒體製作與應用": "把文字、圖片與影音組合起來，做出數位作品。",
  "資料庫應用": "讓資料有自己的家，練習整理、查找與使用。",
  "行動裝置應用設計": "從手機上的小需求出發，練習設計應用。",
  "電子商務實務": "認識線上買賣，練習思考網路商店怎麼經營。",
  "電腦軟體應用進階": "進一步運用軟體，處理更完整的工作需求。",
  "數位影像設計": "練習編修與設計影像，讓畫面說出你的想法。",
  "軟體應用實務": "把軟體工具用在實際任務，練習解決問題。",
  "網頁設計實務": "把內容排成網頁，練習讓資訊清楚又好用。",
  "數位邏輯設計實務": "認識數位訊號的基本規則，練習邏輯設計。",
  "外語簡報實務": "用外語整理重點，練習把一個主題介紹清楚。",
  "外語文書處理實務": "練習整理外語文件，讓內容與格式更清楚。",
  "英文商業書信寫作": "練習寫出禮貌、清楚的英文工作書信。",
  "基礎英文文法與句型": "掌握常見句型，讓英文表達更有把握。",
  "英文寫作": "從想法到段落，練習寫出有條理的英文。",
  "新聞英文導讀": "跟著新聞讀英文，一起認識時事與常用表達。",
  "中英翻譯": "在中文與英文之間，練習把意思傳達到位。",
  "商用英文導讀": "認識商務情境常見的英文用字與表達。",
  "面試英文應用": "練習用英文介紹自己，回答面試常見問題。",
  "英語口語練習": "多開口、多互動，讓英文慢慢變成日常。",
  "觀光英文應用": "在旅遊與接待情境中，練習用英文溝通。",
  "服務導論": "認識服務工作的日常，學著理解別人的需要。",
  "衛生與安全概論": "認識衛生與安全習慣，保護自己也照顧他人。",
  "事務機器與電腦應用概論": "認識常見辦公設備，練習基本電腦應用。",
  "生活保健實作": "練習日常健康照顧，建立照顧自己的習慣。",
  "居家照顧實作": "從居家情境出發，練習照顧與協助的技巧。",
  "飲食調理實作": "練習準備與調理餐點，建立飲食製作的基本功。",
  "食材處理實作": "認識食材，練習清洗、整理與處理。",
  "基礎速食實作": "認識速食製作流程，練習基本操作。",
  "飲料調製實作": "認識材料與工具，動手練習調製飲品。",
  "居家車輛清潔概論": "認識車輛清潔的工具、流程與安全觀念。",
  "居家照護美髮概論": "認識日常美髮照護，了解基本工具與方法。",
  "居家電腦應用實務": "從生活需求出發，練習使用電腦工具。",
  "生活交通能力實務": "練習交通生活技能，讓日常出行更有把握。",
  "餐飲烘焙實作": "動手練習烘焙，熟悉材料、步驟與安全習慣。",
  "餐飲烘焙實務": "認識烘焙的材料與流程，練習製作基本功。",
  "居家烹飪實習": "從家常料理出發，練習準備與烹調餐點。",
  "餐飲門巿服務實習": "練習接待顧客與餐飲門市的服務流程。",
  "作業安全實習": "練習在工作情境中辨認風險、安全操作。",
  "工作社會技巧實習": "練習工作中的溝通與合作，和夥伴好好相處。",
  "居家安全照護實習": "練習注意居家環境與照護安全。",
  "居家照護美髮實作": "練習日常美髮照護的基本操作。",
  "運動學概論": "認識身體與運動的關係，理解訓練背後的道理。",
  "專項體能訓練": "練習力量、速度與耐力，打好運動表現的基礎。",
  "專項技術訓練": "跟著專項練習動作，把技巧一步步磨得更好。",
  "運動傷害防護": "認識運動傷害與防護，練習安全地照顧身體。",
  "初階英語聽講練習": "從聽懂到開口，循序練習英文對話與表達。",
  "中階英語聽講練習": "從聽懂到開口，循序練習英文對話與表達。",
  "高階英語聽講練習": "從聽懂到開口，循序練習英文對話與表達。",
  "初階英文閱讀與寫作練習": "邊讀邊寫，循序練習讀懂文章、表達想法。",
  "中階英文閱讀與寫作練習": "邊讀邊寫，循序練習讀懂文章、表達想法。",
  "高階英文閱讀與寫作練習": "邊讀邊寫，循序練習讀懂文章、表達想法。",
  "基礎清潔實務": "認識清潔工具與方法，練習把生活、工作環境整理好。",
  "基礎清潔實作": "認識清潔工具與方法，練習把生活、工作環境整理好。",
  "職場清潔實作": "認識清潔工具與方法，練習把生活、工作環境整理好。",
  "顧客服務實務": "從招呼到協助顧客，練習有禮貌又清楚的服務。",
  "顧客服務實作": "從招呼到協助顧客，練習有禮貌又清楚的服務。",
  "清潔技能實習": "認識清潔工具與方法，練習把生活、工作環境整理好。",
  "居家車輛清潔實務": "練習車輛清潔流程，學會選用工具與安全操作。",
  "居家車輛清潔實作": "練習車輛清潔流程，學會選用工具與安全操作。",
  "選手培訓一-田徑": "跟著田徑專項練習，逐步累積技術與比賽準備能力。",
  "選手培訓一-跆拳道": "跟著跆拳道專項練習，逐步累積技術與比賽準備能力。",
  "選手培訓二-田徑": "跟著田徑專項練習，逐步累積技術與比賽準備能力。",
  "選手培訓二-跆拳道": "跟著跆拳道專項練習，逐步累積技術與比賽準備能力。",
  "選手培訓三-田徑": "跟著田徑專項練習，逐步累積技術與比賽準備能力。",
  "選手培訓三-跆拳道": "跟著跆拳道專項練習，逐步累積技術與比賽準備能力。"
};
function courseCard(c,p){return `<article class="specialist-course friendly-lesson"><h4>${esc(c.name)}</h4><p class="lesson-story">${esc(COURSE_EXPLAINERS[c.name]||'從課堂到實作，練習把學到的方法用在生活與工作裡。')}</p><details class="lesson-facts"><summary>查看課程資料</summary><p>${esc(c.requirement)} · ${c.credits} 學分<br>${c.semesters.map((v,i)=>v!=='0'?`${['一上','一下','二上','二下','三上','三下'][i]} ${v}`:'').filter(Boolean).join(' / ')}</p><a href="${docHref(p.doc,c.page)}" target="_blank" rel="noopener noreferrer">原始課程計畫 p.${c.page} ↗</a></details></article>`;}
function programDetail(p){
 const guide=DEPARTMENT_GUIDES[p.id],courses=p.courses.filter(isSpecialistCourse),practical=c=>c.kind==='實習科目'||c.kind.includes('體育專項')||c.kind.includes('體育專長')||c.name==='運動傷害防護';
 return `<section class="department-overview"><h3>在這裡，你會做什麼？</h3><p class="overview-invite">先挑一個有興趣的重點，點開看看。</p><div class="department-topics">${guide.topics.map(t=>`<details class="department-topic"><summary><span class="topic-icon">${t.icon}</span><span><b>${t.title}</b></span><span class="topic-expand">＋</span></summary><div class="topic-story"><p>${t.description}</p><span class="topic-source-label">相關課程</span><div class="topic-course-links">${t.courses.map(name=>{const c=courses.find(c=>c.name===name);return c?`<a href="${docHref(p.doc,c.page)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`:''}).join('')}</div></div></details>`).join('')}</div><h3>你可能會喜歡這裡，如果你……</h3><div class="interest-chips">${guide.interests.map(t=>`<span>${t}</span>`).join('')}</div></section>${questFooter(p.id)}<details class="full-course-plan"><summary>完整專業與實習課程 <span>${courses.length} 門 ＋</span></summary><div class="lesson-groups">${[{name:'專業科目',list:courses.filter(c=>!practical(c))},{name:'實習與專項課程',list:courses.filter(practical)}].map(g=>`<section><h3>${g.name}</h3><div class="specialist-list">${g.list.map(c=>courseCard(c,p)).join('')}</div></section>`).join('')}</div></details><p class="course-footnote">依 115 學年度入學課程計畫白話整理；選修與實際安排以原始計畫為準。${p.id==='sports'?'運動傷害防護課表為 2 學分、大綱為 1，保留原件差異。':''}</p>`;
}
let departmentVisitSerial=0,departmentZoomFrame=null,departmentCameraHome=null;
function cancelDepartmentVisit(restore=true){
 cancelCampusPlayerWalk();departmentVisitSerial++;if(departmentZoomFrame!==null)cancelAnimationFrame(departmentZoomFrame);departmentZoomFrame=null;document.body.classList.remove('department-zooming');
 if(departmentCameraHome){const home=departmentCameraHome;departmentCameraHome=null;if(restore){Object.assign(camera,{x:home.x,y:home.y,scale:home.scale});const sameMode=home.mobile===(innerWidth<=800);$('#campus-map').setAttribute('preserveAspectRatio',sameMode?home.par:innerWidth<=800?'xMidYMid slice':'xMidYMid meet');$('#map-page').classList.toggle('map-panorama',sameMode&&home.panorama);updateCamera();}}
}
function renderDepartmentDialog(d,origin){
 selectedDepartment=d;if(d.id==='data'){renderDataProcessingIntro(origin);return;}if(d.id==='business'){renderDepartmentPhotoIntro(BUSINESS_MANAGEMENT_INTRO,origin);return;}const p=CURRICULUM.programs.find(p=>p.id===d.id),guide=DEPARTMENT_GUIDES[d.id];
 openModal(`<div class="department-welcome" style="--department-color:${d.color}"><svg class="department-mascot chibi-portrait" viewBox="-27 -57 54 68" aria-hidden="true">${animal(0,0,d.accent,d.id==='english'||d.id==='piping'?'rabbit':d.id==='accounting'?'cat':'bear')}</svg><div class="eyebrow">草商科別探索</div><h2 id="dialog-title">${d.name}</h2><p>${guide.intro}</p></div>${programDetail(p)}`,{department:true});
 modalOrigin=origin;$('#dialog').scrollTop=0;$('#start-campus-mission').onclick=()=>startMission(d.id);
}
function openDepartment(id){
 if(!campusPlayerProfile){chooseCampusPlayer(()=>openDepartment(id));return;}
 walkCampusPlayer(id);
}
function showDepartmentAfterWalk(id,originOverride){
 const d=departments.find(d=>d.id===id);if(!d)return;
 const origin=originOverride||($('#modal-backdrop').hidden?document.activeElement:modalOrigin);
 cancelDepartmentVisit();const token=++departmentVisitSerial;
 if($('#map-page').hidden||matchMedia('(prefers-reduced-motion: reduce)').matches){renderDepartmentDialog(d,origin);return;}
 departmentCameraHome={...camera,mobile:innerWidth<=800,par:$('#campus-map').getAttribute('preserveAspectRatio'),panorama:$('#map-page').classList.contains('map-panorama')};
 $('#modal-backdrop').hidden=true;document.body.style.overflow='';$('#map-page').classList.remove('map-panorama');$('#campus-map').setAttribute('preserveAspectRatio',innerWidth<=800?'xMidYMid slice':'xMidYMid meet');
 if(innerWidth<=800)$('#map-viewport').scrollIntoView({behavior:'smooth',block:'center'});
 const start={...camera},scale=Math.min(2.1,Math.max(1.75,camera.scale+.3)),target={scale,x:40-(d.x-580)*scale,y:-2.5-(d.y-410)*scale};let began=null;
 document.body.classList.add('department-zooming');
 function step(now){if(token!==departmentVisitSerial)return;if(began===null)began=now;const t=Math.min(1,(now-began)/620),ease=t*t*(3-2*t);for(const k of ['x','y','scale'])camera[k]=start[k]+(target[k]-start[k])*ease;updateCamera();if(t<1)departmentZoomFrame=requestAnimationFrame(step);else{departmentZoomFrame=null;document.body.classList.remove('department-zooming');renderDepartmentDialog(d,origin);}}
 departmentZoomFrame=requestAnimationFrame(step);
}

function openFeed(id){const f=feed.find(x=>x.id===id);if(!f)return;const d=departments.find(x=>x.id===f.islandId);openModal(`<div class="eyebrow">${esc(f.category)} · ${esc(f.time)}</div><h2 id="dialog-title">${esc(f.title)}</h2><div class="dialog-hero" style="background:${f.bg||'#e5eddd'}">${esc(f.icon||'✦')}</div><p>${esc(f.body)}</p>${botEndpoint?'':'<div class="notice">這是示範動態，並非校方公告或真實 Discord 訊息。</div>'}<div class="dialog-footer"><span>${d?esc(d.name):'校園觀測站'}</span>${d?'<button id="feed-department">認識這個科別 →</button>':''}</div>`);if(d)$('#feed-department').onclick=()=>openDepartment(d.id);}
function catalogHTML(){return `<section class="curriculum-catalog" id="curriculum-catalog"><div class="page-eyebrow">YOUR LEARNING MAP · 115</div><h2>每一門課，都有下一步。</h2><p class="page-description">六個技術型科別、綜合職能科與體育班，依三份計畫書課表整理。僅顯示專業科目、實習課程與體育專項課程。<br>選修含互斥項目，不可將所有選項學分加總。括號數值保留原表標示。</p><div class="catalog-filters"><label>科別與班別<select id="catalog-program">${CURRICULUM.programs.map(p=>`<option value="${p.id}">${programName(p)}</option>`).join('')}</select></label><label>授課學年<select id="catalog-year"><option value="all">全部學年</option><option value="0">一年級</option><option value="1">二年級</option><option value="2">三年級</option></select></label><label>課程類別<select id="catalog-kind"><option value="all">全部類別</option><option value="required">必修課程</option><option value="elective">選修／其他安排</option><option value="practice">實習科目</option></select></label><label class="catalog-keyword">找一門課<input id="catalog-search" type="search" placeholder="課程名稱，例如：數值控制" autocomplete="off"></label></div><div id="catalog-results" aria-live="polite"></div></section>`;}
function renderCatalog(){const p=CURRICULUM.programs.find(x=>x.id===$('#catalog-program').value);const year=$('#catalog-year').value,kind=$('#catalog-kind').value,q=$('#catalog-search').value.trim().toLowerCase();const list=p.courses.filter(isSpecialistCourse).filter(c=>c.name.toLowerCase().includes(q)&&(year==='all'||c.semesters.slice(Number(year)*2,Number(year)*2+2).some(s=>s!=='0'))&&(kind==='all'||kind==='required'&&c.requirement.includes('必修')||kind==='elective'&&!c.requirement.includes('必修')||kind==='practice'&&(c.kind==='實習科目'||c.kind.includes('體育專項')||c.kind.includes('體育專長')||c.name==='運動傷害防護')));$('#catalog-results').innerHTML=`<div class="catalog-summary"><div><strong>${programName(p)}</strong><span>${p.group} · 專業科目與實習課程</span></div><span>顯示 ${list.length} / ${p.courses.filter(isSpecialistCourse).length} 筆專業／實習課程</span></div><div class="catalog-source">${programSource(p)}</div>${p.id==='sports'?'<div class="notice">運動傷害防護課表列 2 學分、大綱列 1，待校方確認。田徑／跆拳道的括號為原表安排，非所有項目均須修習。</div>':''}<div class="table-scroll" tabindex="0" role="region" aria-label="${programName(p)}各學期課程學分表"><table class="course-table"><caption>${programName(p)}・115 學年度入學課程規劃</caption><thead><tr><th scope="col">課程名稱</th><th scope="col">類別</th><th scope="col">學分</th>${['一上','一下','二上','二下','三上','三下'].map(x=>`<th scope="col">${x}</th>`).join('')}<th scope="col">來源</th></tr></thead><tbody>${list.length?list.map(c=>`<tr><th scope="row">${esc(c.name)}${c.notes?`<small>${esc(c.notes.replace(/\n/g,' · '))}</small>`:''}</th><td><span class="course-kind">${esc(c.requirement)}</span><small>${esc(c.kind)}</small></td><td class="total-credit">${c.credits}</td>${c.semesters.map(x=>`<td class="${x==='0'?'zero-credit':''}">${x==='0'?'—':x}</td>`).join('')}<td><a href="${docHref(p.doc,c.page)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(c.name)}來源 PDF 第 ${c.page} 頁">p.${c.page} ↗</a></td></tr>`).join(''):'<tr><td colspan="10" class="catalog-empty">找不到符合條件的課程，試試其他學年或關鍵字。</td></tr>'}</tbody></table></div><p class="catalog-footnote">「—」表示原表空白或 0；括號照錄原表，表示替代或特殊安排，非直接計入一般學分。原始文件另含課程大綱、選課規則與特殊需求說明，請點來源查看。</p>`;}
function renderCourses(){return `<div class="page-eyebrow">FIND YOUR OWN PATH</div><h1>讓好奇心，帶你找到方向。</h1><p class="page-description">從一棟建築開始，認識草屯商工的正式科班與學習路徑。<br>八個科班，八種可能。點選科別，認識專業科目與實習課程。</p><div class="curriculum-badge">${ico('book')} 115 入學適用 <span>3 份備查計畫 · 8 個科班</span><a href="#curriculum-catalog">查閱課表 ↓</a></div><div class="course-grid">${departments.map(d=>`<button class="course-card" data-course="${d.id}"><span class="card-icon">${d.icon}</span><span class="eyebrow">${d.en}</span><h2>${d.name}</h2><p>${DEPARTMENT_GUIDES[d.id].intro}<br>${d.departments.join(' · ')}</p><span class="tag">${d.type==='engineering'?'機械群':d.type==='business'?'商業與管理群':d.id==='english'?'外語群':d.id==='service'?'服務群':'校園與體育'}</span><span class="card-bottom">探索課程與學習路徑 ${ico('arrow')}</span></button>`).join('')}</div>${catalogHTML()}`;}

function renderActivity(id){const d=departments.find(x=>x.id===id);$('#content-page').innerHTML=`<div class="page-eyebrow">LITTLE MOMENTS, BIG POSSIBILITIES</div><h1>${d?esc(d.name)+'的日常':'校園裡的每一刻，都值得記錄。'}</h1><p class="page-description">${botEndpoint?'來自 TA bot 唯讀接口的彙整動態。':'示範校園動態 · 連接 TA bot 後，這裡將呈現匿名彙整的真實學習訊號。'}</p><div class="detail-tags"><button class="secondary-btn" id="activity-all">全部動態</button><button class="secondary-btn" id="activity-event">活動消息</button><button class="secondary-btn" id="activity-connect">${botEndpoint?'資料來源設定':'連接 TA bot'}</button></div><div class="activity-list">${feedHTML(feed.filter(f=>(!id||f.islandId===id)&&(feedFilter!=='event'||f.type==='event')))}</div>`;bindFeed($('#content-page'));$('#activity-all').onclick=()=>{feedFilter='all';renderActivity();};$('#activity-event').onclick=()=>{feedFilter='event';renderActivity(id);};$('#activity-connect').onclick=openBot;}
function showView(view){cancelDepartmentVisit();currentView=view;$$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===view));$('#map-page').hidden=view!=='map';$('#content-page').hidden=view==='map';if(view==='courses'){$('#content-page').innerHTML=renderCourses();$$('[data-course]').forEach(b=>b.onclick=()=>openDepartment(b.dataset.course));['#catalog-program','#catalog-year','#catalog-kind'].forEach(s=>$(s).onchange=renderCatalog);$('#catalog-search').oninput=renderCatalog;renderCatalog();}if(view==='activity')renderActivity();window.scrollTo({top:0,behavior:'smooth'});}
function openSearch(){openModal(`<div class="eyebrow">FOLLOW YOUR CURIOSITY</div><h2 id="dialog-title">想體驗哪個科別？</h2><label for="campus-search">搜尋科別或專業課程</label><input id="campus-search" placeholder="試試「配管」、「商業」或「製圖」" autocomplete="off"><div id="search-results" class="search-results"></div>`);function search(){const q=$('#campus-search').value.trim().toLowerCase();const list=departments.filter(d=>(JSON.stringify(d)+JSON.stringify(CURRICULUM.programs.filter(p=>p.id===d.id).map(p=>p.courses.filter(isSpecialistCourse)))).toLowerCase().includes(q));$('#search-results').innerHTML=list.length?list.map(d=>`<button class="search-result" data-result="${d.id}"><span>${d.icon}</span><div>${d.name}<small>${d.departments.join(' · ')}</small></div></button>`).join(''):'<p>沒有找到相關科別，換個關鍵字試試。</p>';$$('[data-result]').forEach(b=>b.onclick=()=>openDepartment(b.dataset.result));}$('#campus-search').oninput=search;search();setTimeout(()=>$('#campus-search')?.focus(),50);}
function sourceInfo(){openModal(`<div class="eyebrow">CAOTUN CAMPUS ADVENTURE</div><h2 id="dialog-title">關於草商探索趣</h2><p>這是一個「探索學校、體驗科別、發現興趣」的校園探索遊戲。場景參考你提供的草屯商工校景：紅磚與米白立面、鐵深灰色屋頂、玻璃中庭、中央草地、走廊與操場。科別位置是遊戲導覽配置，並非實際教室位置圖；訪客直接點科別名稱方塊即可互動，不需操控角色走到門口。</p><h3>課程與小任務</h3><p>課程依三份 115 學年度入學適用計畫整理。任務是為認識科別設計的簡化情境，不是專業操作考試、資格認證或實際施工指引。應用英語科與普通體育班依原計畫中的應用英語科、體育班呈現。運動傷害防護課表列 2 學分、大綱列 1，資料仍保留此差異。</p>${curriculumLinks()}<h3>探索護照與金幣</h3><p>完成任務後，每科首次可得一枚金幣；探索進度保存在此瀏覽器，不記名、不傳送選擇內容、不跨裝置同步。舊版已取得的金幣保留；每科都可以再次體驗，不會重複發幣。實體獎品領取辦法待校方公告，目前不扣幣或發放資格。</p><h3>校園角色與校外店家</h3><p>學生走動與中鼎文騎滑板車都是情境動畫，並非真實人員定位。中鼎文戴「客服」髮箍，可透過角色或頁首護照呼叫。正門外左側保留南臺灣土魠魚羹，右側保留萊爾富，為遊戲場景；魚羹店商標依提供圖樣重繪為 SVG。</p><h3>校園動態</h3><p>動態預設為示範資料，尚未接入真實 Discord。可接入授權公開的 TA bot 匿名彙整資料，不收集 Discord token 或私訊。</p><a href="${SCHOOL_URL}" target="_blank" rel="noopener noreferrer">學校官網 ↗</a><p><button class="primary-btn" id="source-connect">TA bot 資料設定</button></p>`);$('#source-connect').onclick=openBot;}

function toast(s){$('#toast').textContent=s;$('#toast').hidden=false;setTimeout(()=>$('#toast').hidden=true,3500);}
function openBot(){openModal(`<div class="eyebrow">TA BOT OBSERVATORY</div><h2 id="dialog-title">讓校園的日常，被大家看見。</h2><p>連接課程 TA bot 的公開唯讀 JSON 接口。學校網頁並非 JSON 接口，目前只作為公開資訊來源。</p><label for="bot-url">TA bot 資料網址（HTTPS）</label><input id="bot-url" type="url" placeholder="https://your-ta-bot.example/api/campus" value="${esc(botEndpoint)}"><div class="notice">只使用你有權公開的匿名彙整資料。不要輸入 Discord token、Webhook 密鑰、私人訊息或含憑證的網址。接口需允許此網站的跨來源存取（CORS）。每 60 秒更新一次。</div><details><summary>查看接口資料格式</summary><pre class="code-block">${esc(JSON.stringify({updatedAt:'2026-10-24T09:00:00Z',stats:{interactions:1286,activities:12,milestones:38},events:[{id:'event-1',islandId:'data',type:'learning',title:'公開的學習動態摘要',category:'實作日常',time:'今天',body:'不包含個人資料的內容摘要'}]},null,2))}</pre><p>islandId：mechanical / piping / business / accounting / data / english / service / sports<br>type：learning / event / milestone<br>最多顯示最近 50 筆；只接受純文字，不執行接口中的 HTML。</p></details><div class="form-actions"><button class="primary-btn" id="save-bot">測試並連接</button><button class="secondary-btn" id="demo-mode">使用示範資料</button></div><div class="form-status" id="bot-status" role="status"></div>`);$('#save-bot').onclick=async()=>{const input=$('#bot-url').value.trim();let url;try{url=new URL(input);if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw Error();}catch{$('#bot-status').textContent='請輸入不含帳密、查詢參數或片段的 HTTPS JSON 接口網址。';return;}const button=$('#save-bot');button.disabled=true;button.textContent='正在驗證接口…';try{const data=await fetchBot(url.href);applyBot(data,url.href);try{localStorage.setItem('caotun-bot-endpoint',url.href);}catch{}closeModal();toast('已連接 TA bot，將每 60 秒更新資料。');}catch(e){if($('#bot-status'))$('#bot-status').textContent='連接失敗：'+e.message+'。已保留原本的資料模式。';}finally{if(button.isConnected){button.disabled=false;button.textContent='測試並連接';}}};$('#demo-mode').onclick=()=>{clearInterval(botTimer);botEndpoint='';try{localStorage.removeItem('caotun-bot-endpoint');}catch{}feed=[...demoFeed];feedFilter='all';$$('[data-feed]').forEach(b=>b.classList.toggle('active',b.dataset.feed==='all'));setStats({interactions:1286,activities:12,milestones:38});$('#data-mode').textContent='示範動態模式';$('#live-label').textContent='DEMO';$('#bot-note').textContent='示範動態 · 尚未連接 Discord';$('#stats-label').textContent='校園動態為示範數據';renderFeed();closeModal();toast('已切換為示範資料。');};}
function canonicalDepartmentId(id){return ({campus:'sports',digital:'data',language:'english',electrical:'data',maker:'english',automotive:'service'})[id]||id;}
async function fetchBot(url){const response=await fetch(url,{signal:AbortSignal.timeout(10000),credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'});if(!response.ok)throw Error('HTTP '+response.status);let d;try{d=await response.json();}catch{throw Error('回應不是有效的 JSON');}if(!d||!d.stats||!Array.isArray(d.events)||typeof d.updatedAt!=='string'||!Number.isFinite(Date.parse(d.updatedAt)))throw Error('缺少有效的 stats、events 或 updatedAt');for(const k of ['interactions','activities','milestones'])if(!Number.isSafeInteger(d.stats[k])||d.stats[k]<0)throw Error('統計數據必須為非負整數');if(d.events.length>50)throw Error('events 最多接受 50 筆');const ids=new Set();for(const e of d.events){if(!e||typeof e.id!=='string'||!e.id||ids.has(e.id)||!departments.some(i=>i.id===canonicalDepartmentId(e.islandId))||!['event','learning','milestone'].includes(e.type)||['title','category','time','body'].some(k=>typeof e[k]!=='string'||e[k].length>3000))throw Error('動態欄位格式不符或 id 重複');ids.add(e.id);}return d;}
function setStats(stats){for(const k of ['interactions','activities','milestones'])$('#stat-'+k).innerHTML=stats[k].toLocaleString('zh-TW')+`<small>${k==='interactions'?'次':k==='activities'?'項':'筆'}</small>`;}
function applyBot(data,url){botEndpoint=url;feed=data.events.map(e=>({id:e.id,islandId:canonicalDepartmentId(e.islandId),type:e.type,title:e.title,category:e.category,time:e.time,body:e.body,icon:e.type==='milestone'?'🏅':e.type==='event'?'✦':'🌱',bg:'#e7eddd'}));setStats(data.stats);$('#data-mode').textContent='TA bot 已連接';$('#live-label').textContent='SYNC';$('#bot-note').textContent='資料更新 '+new Date(data.updatedAt).toLocaleString('zh-TW',{timeZone:'Asia/Taipei',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})+'（台北）';$('#stats-label').textContent='TA bot 彙整資料 · 每 60 秒同步';renderFeed();clearInterval(botTimer);botTimer=setInterval(async()=>{if(polling)return;polling=true;try{applyBot(await fetchBot(botEndpoint),botEndpoint);}catch{$('#data-mode').textContent='同步中斷 · 保留上次資料';$('#live-label').textContent='STALE';$('#bot-note').textContent='連線失敗，顯示上次同步資料';$('#stats-label').textContent='同步中斷 · 統計為上次成功同步結果';}finally{polling=false;}},60000);}
const camera={x:0,y:0,scale:1};const drag={active:false,moved:false,x:0,y:0,lastX:0,lastY:0};
function updateCamera(){$('#map-world').setAttribute('transform',`translate(${camera.x} ${camera.y}) translate(580 410) scale(${camera.scale}) translate(-580 -410)`);}
function zoom(delta){if(departmentZoomFrame!==null)cancelDepartmentVisit(false);if($('#map-page').classList.contains('map-panorama')){$('#map-page').classList.remove('map-panorama');$('#campus-map').setAttribute('preserveAspectRatio',innerWidth<=800?'xMidYMid slice':'xMidYMid meet');}camera.scale=Math.max(.65,Math.min(2.8,camera.scale+delta));updateCamera();}
function initMapInteraction(){const el=$('#map-viewport');initCampusGestures(el);$('#map-fit').onclick=()=>{cancelDepartmentVisit(false);$('#map-page').classList.add('map-panorama');$('#campus-map').setAttribute('preserveAspectRatio','xMidYMid meet');Object.assign(camera,{x:0,y:0,scale:1});updateCamera();};$('#zoom-in').onclick=()=>zoom(.15);$('#zoom-out').onclick=()=>zoom(-.15);$('#reset-map').onclick=()=>{cancelDepartmentVisit(false);$('#map-page').classList.remove('map-panorama');$('#campus-map').setAttribute('preserveAspectRatio',innerWidth<=800?'xMidYMid slice':'xMidYMid meet');Object.assign(camera,{x:0,y:0,scale:1});updateCamera();};}
function init(){installVividSceneDefs();renderMap();initCampusResidents();initCampusQuests();renderFeed();initMapInteraction();initCampusPlayer();let mapMobileMode=null;function resizeMap(){const mobile=window.innerWidth<=800;$('#campus-map').setAttribute('viewBox','0 0 1240 815');if(mapMobileMode!==mobile){$('#map-page').classList.remove('map-panorama');$('#campus-map').setAttribute('preserveAspectRatio',mobile?'xMidYMid slice':'xMidYMid meet');}mapMobileMode=mobile;}resizeMap();window.addEventListener('resize',resizeMap);$('#year').textContent=new Date().getFullYear();$$('[data-view]').forEach(b=>b.onclick=()=>showView(b.dataset.view));$$('[data-feed]').forEach(b=>b.onclick=()=>{feedFilter=b.dataset.feed;$$('[data-feed]').forEach(x=>x.classList.toggle('active',x===b));renderFeed();});$('#visit').onclick=()=>{showView('map');openDepartment('mechanical');};$('#random-department').onclick=()=>openDepartment(departments[Math.floor(Math.random()*departments.length)].id);$('.search-toggle').onclick=openSearch;$('#connect-bot').onclick=openBot;$('#source-info').onclick=sourceInfo;$('#modal-backdrop').addEventListener('click',e=>{if(e.target===$('#modal-backdrop'))closeModal();});document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('#modal-backdrop').hidden)closeModal();else cancelDepartmentVisit();}if(e.key==='Tab'&&!$('#modal-backdrop').hidden){const els=[...$('#dialog').querySelectorAll('button:not([disabled]),a[href],input,summary')].filter(el=>el.getClientRects().length);const first=els[0],last=els.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===$('#dialog'))){e.preventDefault();last?.focus();}else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===$('#dialog'))){e.preventDefault();first?.focus();}}});let saved;try{saved=localStorage.getItem('caotun-bot-endpoint');}catch{}if(saved){try{const u=new URL(saved);if(u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash)fetchBot(u.href).then(d=>applyBot(d,u.href)).catch(()=>toast('TA bot 連線未成功，目前顯示示範資料。'));}catch{}}}
init();
