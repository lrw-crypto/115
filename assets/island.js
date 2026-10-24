'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const SCHOOL_URL='https://www.ttvs.ntct.edu.tw/ischool/publish_page/14/?cid=2855';
const CURRICULUM_SOURCES=CURRICULUM.documents;
const docHref=(id,page=1)=>`${CURRICULUM.documents.find(d=>d.id===id).url}#page=${page}`;
function curriculumLinks(){return `<div class="curriculum-sources"><h3>115 學年度課程計畫書</h3><p>依你提供的三份備查版文件整理，適用於 115 學年度入學學生。頁碼為 PDF 閱讀器頁序。</p><ul>${CURRICULUM_SOURCES.map(d=>`<li><a href="${d.url}" target="_blank" rel="noopener noreferrer">${d.title} · ${d.pages} 頁 ↗</a></li>`).join('')}</ul></div>`;}
const islands=[
  {
    "id": "mechanical",
    "name": "機械科",
    "en": "MECHANICAL ENGINEERING",
    "type": "engineering",
    "icon": "⚙️",
    "color": "#e9edc5",
    "accent": "#d7a26f",
    "x": 560,
    "y": 225,
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
    "color": "#e0edc3",
    "accent": "#87bba4",
    "x": 810,
    "y": 225,
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
    "color": "#f2e5c4",
    "accent": "#dda080",
    "x": 300,
    "y": 407,
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
    "color": "#e8ddf2",
    "accent": "#b5a2cc",
    "x": 550,
    "y": 407,
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
    "color": "#d6eddf",
    "accent": "#7fbab5",
    "x": 800,
    "y": 407,
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
    "name": "應用英文科",
    "en": "APPLIED ENGLISH",
    "type": "community",
    "icon": "🌍",
    "color": "#f2e2d6",
    "accent": "#d5a090",
    "x": 300,
    "y": 589,
    "subtitle": "從聽講、閱讀到簡報，讓你的想法走向世界。",
    "description": "從聽講、閱讀到簡報，讓你的想法走向世界。",
    "departments": [
      "應用英文科"
    ],
    "programIds": [
      "english"
    ]
  },
  {
    "id": "service",
    "name": "綜合職能科",
    "en": "VOCATIONAL SKILLS",
    "type": "community",
    "icon": "🌼",
    "color": "#e3edc7",
    "accent": "#a1bd71",
    "x": 550,
    "y": 589,
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
    "color": "#dbe8d2",
    "accent": "#94b49a",
    "x": 800,
    "y": 589,
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
const programName=p=>islands.find(d=>d.id===p.id).name;
function isSpecialistCourse(c){return (c.credits>0||c.semesters.some(v=>v.startsWith('(')))&&(c.kind==='專業科目'||c.kind==='實習科目'||c.kind.includes('體育專')||c.name==='運動傷害防護');}
const demoFeed=[
{id:'f1',islandId:'data',type:'learning',icon:'💻',bg:'#e4eddf',title:'第一個程式完成，把想法變成小工具！',category:'實作日常',time:'示範 · 5 分鐘前',body:'資料處理科的夥伴們一起完成程式練習，從設計到除錯，記錄每一次試錯與發現。此為介面展示情境，並非真實 Discord 貼文。'},
{id:'f2',islandId:'business',type:'event',icon:'✦',bg:'#efe7d6',title:'從點子到提案，創意交流日',category:'活動消息',time:'示範 · 20 分鐘前',body:'帶著你的企劃來島上分享！練習將想法轉成一份有說服力的提案，與不同領域的夥伴交流。此為活動版型示例，沒有實際報名或舉辦時間。'},
{id:'f3',islandId:'mechanical',type:'milestone',icon:'🏅',bg:'#e8e5f0',title:'一起努力的證照路，又前進了一步',category:'學習里程碑',time:'示範 · 1 小時前',body:'把每天的加工練習累積成看得見的進步。此為證照學習里程碑的呈現示例，不代表實際通過人數或考試結果。'}
];
let feed=[...demoFeed],currentView='map',filter='all',feedFilter='all',selectedIsland=null,modalOrigin=null,botEndpoint='',botTimer=null,polling=false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ico=name=>`<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
function shade(hex,n){const v=parseInt(hex.slice(1),16);return '#'+[v>>16,v>>8&255,v&255].map(x=>Math.max(0,Math.min(255,x+n)).toString(16).padStart(2,'0')).join('');}
const pt=(u,v,z=0)=>[(u-v)*.866,(u+v)*.5-z];
const points=a=>a.map(p=>p.join(',')).join(' ');
const poly=(p,fill,extra='')=>`<polygon points="${points(p)}" fill="${fill}" ${extra}/>`;
function box(u,v,w,d,h,color,roof){let a=pt(u,v),b=pt(u+w,v),c=pt(u+w,v+d),e=pt(u,v+d),A=pt(u,v,h),B=pt(u+w,v,h),C=pt(u+w,v+d,h),E=pt(u,v+d,h);let out=poly([e,c,C,E],shade(color,-12))+poly([b,c,C,B],shade(color,-29))+poly([A,B,C,E],color);if(roof){let peak=pt(u+w/2,v+d/2,h+18);out+=poly([A,B,peak],shade(roof,12))+poly([B,C,peak],shade(roof,-12))+poly([C,E,peak],roof)+poly([E,A,peak],shade(roof,18));}for(let i=0;i<Math.floor(w/17);i++){let t=u+7+i*17;out+=poly([pt(t,v+d+.1,h-10),pt(t+7,v+d+.1,h-10),pt(t+7,v+d+.1,h-23),pt(t,v+d+.1,h-23)],'#709b98');}for(let i=0;i<Math.floor(d/17);i++){let t=v+6+i*17;out+=poly([pt(u+w+.1,t,h-10),pt(u+w+.1,t+6,h-10),pt(u+w+.1,t+6,h-23),pt(u+w+.1,t,h-23)],'#577e7c');}return out;}
function tree(u,v,size=1,kind='round'){let [x,y]=pt(u,v);return `<g transform="translate(${x} ${y}) scale(${size})"><ellipse cy="4" rx="16" ry="7" fill="#6b8d5420"/><path d="M0 0V-25" stroke="#947557" stroke-width="5"/>${kind==='pine'?`<path d="m0-66-19 34h8l-14 23h50L11-32h8Z" fill="#719d6c"/><path d="M0-66v57h25L11-32h8Z" fill="#5d8c60"/>`:`<circle cy="-36" r="20" fill="#88ad73"/><circle cx="-10" cy="-29" r="15" fill="#9bbb7b"/><circle cx="9" cy="-35" r="15" fill="#7ea06a"/><circle cx="-5" cy="-43" r="13" fill="#a2be83"/>`}</g>`;}
function person(u,v,c='#d99c69',species='bear'){const[x,y]=pt(u,v);return animal(x,y,c,species);}
function animal(x,y,c='#d6aa80',species='bear'){const ears=species==='rabbit'?'<ellipse cx="-6" cy="-36" rx="4" ry="11" fill="#f9edcd"/><ellipse cx="6" cy="-36" rx="4" ry="11" fill="#f9edcd"/><ellipse cx="-6" cy="-36" rx="1.5" ry="7" fill="#e8b6a4"/><ellipse cx="6" cy="-36" rx="1.5" ry="7" fill="#e8b6a4"/>':species==='cat'?'<path d="m-11-24 1-13 10 8 10-8 1 13" fill="#d4b286"/>':'<circle cx="-9" cy="-30" r="5" fill="#c69b73"/><circle cx="9" cy="-30" r="5" fill="#c69b73"/>';return `<g class="animal-friend" transform="translate(${x} ${y})"><ellipse cy="3" rx="13" ry="5" fill="#5e785224"/><g class="friend-bob"><path d="m-5 1 1-7m9 7-1-7" stroke="#8e7961" stroke-width="5" stroke-linecap="round"/><path d="M-8-7q8 6 16 0l-2-13H-6Z" fill="${c}" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>${ears}<ellipse cy="-25" rx="12" ry="11" fill="${species==='rabbit'?'#fff1d2':'#d4b286'}"/><ellipse cy="-21" rx="6" ry="4" fill="#f6e5c5"/><circle cx="-4.5" cy="-26" r="1.4" fill="#4e5847"/><circle cx="4.5" cy="-26" r="1.4" fill="#4e5847"/><path d="m-2-22 2 2 2-2" fill="none" stroke="#6b614e" stroke-width="1.1" stroke-linecap="round"/><ellipse cx="-9" cy="-23" rx="2.5" ry="1.5" fill="#e5a895"/><ellipse cx="9" cy="-23" rx="2.5" ry="1.5" fill="#e5a895"/><circle cy="-12" r="2" fill="#ffefc6"/></g></g>`;}

function flowers(u,v){let[x,y]=pt(u,v);return `<g transform="translate(${x} ${y})"><ellipse rx="15" ry="7" fill="#9db579"/>${[-8,0,8].map((n,i)=>`<circle cx="${n}" cy="${i===1?-5:-1}" r="3" fill="${i===1?'#edc884':'#e3a59a'}"/>`).join('')}</g>`;}
function bench(u,v){return box(u,v,26,8,8,'#bea37c')+poly([pt(u,v,18),pt(u+26,v,18),pt(u+26,v,11),pt(u,v,11)],'#cbb48c');}
function car(u,v,color='#e2ad78'){return box(u,v,35,16,10,color)+box(u+8,v+2,18,12,19,shade(color,10))+[pt(u+7,v+16),pt(u+28,v+16)].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="4" ry="5" fill="#606b61"/><circle cx="${x}" cy="${y}" r="2" fill="#d8d4c0"/>`).join('');}
function pond(){return `<ellipse cx="15" cy="30" rx="34" ry="17" fill="#d3d3ba"/><ellipse cx="15" cy="26" rx="28" ry="13" fill="#8fbeb5"/><ellipse cx="15" cy="24" rx="20" ry="8" fill="#aed5c8"/><path d="M15 21V2" stroke="#d7dcc3" stroke-width="5"/><ellipse cx="15" cy="1" rx="10" ry="4" fill="#c5d4ba"/><path d="M6 11q9-14 18 0" fill="none" stroke="#bfdfd0" stroke-width="2"/>`;}
function islandArt(id){const d=islands.find(x=>x.id===id);let a=poly([pt(-70,-45),pt(60,-45),pt(60,58),pt(-70,58)],'#e4d6ab','stroke="#ede4bf" stroke-width="4" stroke-linejoin="round"');a+=tree(-82,-14,.85)+tree(76,-1,.95)+tree(56,68,.60);a+=`<g class="storybook-cottage"><path d="M-58-49 27-30 60-49V11L27 33-58 12Z" fill="#f7edcd" stroke="#f7edcd" stroke-width="6" stroke-linejoin="round"/><path d="M27-30 60-49V11L27 33Z" fill="#dfdcb9"/><path d="M-66-48Q-48-77-15-102L37-86Q62-69 69-48L27-23Z" fill="${shade(d.accent,-5)}" stroke="${shade(d.accent,-5)}" stroke-width="6" stroke-linejoin="round"/><path d="M-66-48Q-48-77-15-102L27-23Z" fill="${shade(d.accent,15)}"/><path d="m-59-46 84 22" fill="none" stroke="${shade(d.accent,-22)}" stroke-width="5" stroke-linecap="round"/><path d="M-21 20v-27q0-16 14-13Q6-17 6-3v30Z" fill="#af9a70" stroke="#fff2cc" stroke-width="4"/><circle cx="-1" cy="7" r="2" fill="#f7deb0"/><rect x="-46" y="-25" width="17" height="20" rx="7" fill="#a4d4c2" stroke="#fff4cf" stroke-width="4"/><path d="M-38-23v17m-7-10 14 3" stroke="#fff3ce" stroke-width="2"/><path d="m39-15 12-7v19l-12 8Z" fill="#8fb9ac" stroke="#f6ebc6" stroke-width="3"/><ellipse cx="-4" cy="-55" rx="15" ry="13" fill="#fff1cc" stroke="#f5d99c" stroke-width="2"/><text x="-4" y="-49" text-anchor="middle" font-size="18" fill="#526d46">${d.icon}</text><path d="M-50-69q18-20 29-26" fill="none" stroke="#ffffff45" stroke-width="4" stroke-linecap="round"/></g>`;a+=flowers(-57,60)+flowers(9,77)+bench(38,43);a+=animal(-55,38,d.accent,id==='piping'||id==='english'?'rabbit':'bear')+animal(43,50,'#98bda5',id==='accounting'||id==='service'?'cat':'rabbit');if(id==='piping')a+=`<path d="M-75 1v-23q0-8 8-6l13 3" stroke="#94bdb1" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-75 1v-23q0-8 8-6l13 3" stroke="#b9d8c3" stroke-width="3" fill="none"/>`;if(id==='sports')a+=`<ellipse cx="-11" cy="49" rx="24" ry="12" fill="#a9c18b" stroke="#edf1ce" stroke-width="2"/><path d="M-35 49h48" stroke="#eff0cf" stroke-width="1.5"/><circle cx="-8" cy="49" r="5" fill="#f6deb1" stroke="#c2a773" stroke-width="1"/>`;if(id==='data')a+=box(-12,50,23,16,13,'#b7c8a3')+box(-9,52,17,5,27,'#91b7a8');return a;}

function hex(cx,cy,rx=142,ry=78){return [[cx,cy-ry],[cx+rx,cy-ry/2],[cx+rx,cy+ry/2],[cx,cy+ry],[cx-rx,cy+ry/2],[cx-rx,cy-ry/2]];}
function land(d){const p=hex(0,0);return `<g class="island" role="button" tabindex="0" aria-label="探索${esc(d.name)}" data-island="${d.id}" transform="translate(${d.x} ${d.y}) scale(.80)"><ellipse cy="32" rx="129" ry="60" fill="#52795e" opacity=".15" filter="url(#shadow)"/>${poly(p.map(([x,y])=>[x,y+19]),'#93aa80')}${poly([p[2],p[3],p[4],[p[4][0],p[4][1]+20],[p[3][0],p[3][1]+20],[p[2][0],p[2][1]+20]],shade(d.color,-47))}${poly(p,d.color,'class="island-top" stroke="#f4f5db" stroke-width="3" stroke-linejoin="round"')}${poly(hex(0,0,130,71),shade(d.color,6),'stroke="#f5f5dd" stroke-width="1"')}<g filter="url(#soft-shadow)">${islandArt(d.id)}</g><g class="island-label" transform="translate(0 85)"><path d="M0-9v-9" stroke="#a68e65" stroke-width="5"/><rect class="label-bg" x="-88" y="-9" width="176" height="36" rx="15" stroke="#e0d6ad" stroke-width="2"/><circle cx="-66" cy="9" r="4" fill="${d.accent}"/><text class="label-name" text-anchor="middle" x="5" y="14">${d.name}</text></g></g>`;}
function bridge(a,b){let dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy),nx=-dy/len*9,ny=dx/len*9;let s=.40,e=.60,p=[a.x+dx*s,a.y+dy*s],q=[a.x+dx*e,a.y+dy*e];return `<g>${poly([[p[0]+nx,p[1]+ny],[q[0]+nx,q[1]+ny],[q[0]-nx,q[1]-ny],[p[0]-nx,p[1]-ny]],'#bfaa82','stroke="#d9c9a7" stroke-width="2"')}${Array.from({length:6},(_,i)=>{let t=s+(e-s)*i/5;return `<path d="M${a.x+dx*t+nx} ${a.y+dy*t+ny}l${-2*nx} ${-2*ny}" stroke="#a99b75" stroke-width="1"/>`;}).join('')}</g>`;}
function renderMap(){const waterShape=[[575,119],[738,179],[852,233],[852,287],[971,359],[971,454],[1005,527],[1005,672],[779,777],[582,726],[370,777],[184,686],[184,569],[219,498],[184,402],[184,320],[375,220],[375,175]];let art=poly(waterShape,'url(#water)','stroke="#dcebe0" stroke-width="13" stroke-linejoin="round"')+poly(waterShape,'url(#water-grid)');art+=`<g opacity=".45" fill="none" stroke="#a6cabc" stroke-width="1.5"><path d="M195 446q-24 20 0 41m775 110q28 20 0 42M564 746q25 14 50 0M418 177q-15-15 0-27"/></g>`;
art+=`<g transform="translate(828 211) scale(.52)">${poly(hex(0,0,97,54),'#b9c9a2')}${poly(hex(0,-6,97,54),'#d5e0b8')}${tree(-20,-13,.9,'pine')}${tree(25,-10,1.1,'pine')}${tree(2,35,.7,'pine')}</g><g transform="translate(251 548) scale(.36)">${poly(hex(0,0,70,40),'#b4c9a4')}${tree(0,0,1.1,'pine')}${tree(30,4,.8,'pine')}</g>`;
for(const [a,b] of [[0,1],[0,3],[1,4],[2,3],[3,4],[2,5],[3,6],[4,7],[5,6],[6,7]])art+=bridge(islands[a],islands[b]);
art+=islands.map(land).join('');art+=`<g transform="translate(949 572) rotate(-22)"><ellipse cy="7" rx="22" ry="8" fill="#70a79b" opacity=".15"/><path d="M-19 0q18 22 38 0Z" fill="#e9d5ae"/><path d="M0-32v33" stroke="#c0a580" stroke-width="2"/><path d="m-2-30-15 23H-2Z" fill="#fff5da"/><path d="m2-24 11 17H2Z" fill="#d6a88c"/></g><g stroke="#789582" stroke-width="1.5" fill="none" opacity=".55"><path d="m859 138 5-3 5 3m7 0 4-2 4 2M275 264l5-3 5 3"/></g>`;$('#map-world').innerHTML=art;
$$('[data-island]').forEach(el=>{el.addEventListener('click',()=>{if(!drag.moved)openIsland(el.dataset.island);});el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openIsland(el.dataset.island);}});});}
function feedHTML(items){if(!items.length)return '<p style="padding:20px;color:#8c9b80;font-size:12px">目前沒有這類動態，再去島上走走吧。</p>';return items.map(f=>`<button class="feed-item" data-feed-id="${esc(f.id)}"><span class="feed-icon" style="background:${f.bg||'#e5eddd'}">${esc(f.icon||'✦')}</span><span><h3>${esc(f.title)}</h3><span class="feed-meta">${esc(f.time)}<b>${esc(f.category)}</b></span></span></button>`).join('');}
function bindFeed(root){root.querySelectorAll('[data-feed-id]').forEach(el=>el.addEventListener('click',()=>openFeed(el.dataset.feedId)));}
function renderFeed(){const list=feedFilter==='event'?feed.filter(f=>f.type==='event'):feed;$('#feed-list').innerHTML=feedHTML(list.slice(0,3));bindFeed($('#feed-list'));if(currentView==='activity')renderActivity();}
function openModal(html){if($('#modal-backdrop').hidden)modalOrigin=document.activeElement;$('#dialog').innerHTML=`<button class="icon-btn dialog-close" aria-label="關閉視窗">${ico('close')}</button>${html}`;$('#modal-backdrop').hidden=false;document.body.style.overflow='hidden';$('.dialog-close').onclick=closeModal;$('#dialog').focus();}
function closeModal(){$('#modal-backdrop').hidden=true;document.body.style.overflow='';modalOrigin?.focus();}
function programSource(p){return `<a href="${docHref(p.doc,p.pages[0])}" target="_blank" rel="noopener noreferrer">${CURRICULUM.documents.find(d=>d.id===p.doc).title} · PDF 第 ${p.pages.join('、')} 頁 ↗</a>`;}
function courseCard(c,p){return `<article class="specialist-course"><div><h4>${esc(c.name)}</h4><span>${esc(c.requirement)} · ${c.credits} 學分</span></div><p>${c.semesters.map((v,i)=>v!=='0'?`${['一上','一下','二上','二下','三上','三下'][i]} ${v}`:'').filter(Boolean).join(' / ')}</p><a href="${docHref(p.doc,c.page)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(c.name)}來源 PDF 第 ${c.page} 頁">課程計畫 p.${c.page} ↗</a></article>`;}
function programDetail(p){const courses=p.courses.filter(isSpecialistCourse);const practice=c=>c.kind==='實習科目'||(c.kind==='體育專項術科'||c.kind.includes('體育專長'))||c.name==='運動傷害防護';return `<div class="lesson-groups">${[{name:'專業科目',list:courses.filter(c=>!practice(c)),icon:'book'},{name:'實習與實作課程',list:courses.filter(practice),icon:'settings'}].map(g=>`<section><h3>${ico(g.icon)}${g.name}<span>${g.list.length} 門</span></h3><div class="specialist-list">${g.list.map(c=>courseCard(c,p)).join('')||'<p class="empty-courses">本計畫課表未列此類別。</p>'}</div></section>`).join('')}</div>${p.id==='sports'?'<p class="course-footnote">普通體育班依計畫中的體育專業學科、體育專項術科及運動防護呈現。「運動傷害防護」課表列 2 學分、大綱列 1，暫依課表顯示。</p>':''}<p class="course-footnote">115 學年度入學適用 · 選修與括號安排依原課表為準。</p>`;}
function openIsland(id){const d=islands.find(x=>x.id===id);if(!d)return;selectedIsland=d;const p=CURRICULUM.programs.find(x=>x.id===id);openModal(`<div class="department-welcome" style="--department-color:${d.color}"><span class="department-mascot">${d.icon}</span><div class="eyebrow">${d.en}</div><h2 id="dialog-title">${d.name}</h2><p>${d.description}</p></div>${programDetail(p)}`);}

function openFeed(id){const f=feed.find(x=>x.id===id);if(!f)return;const d=islands.find(x=>x.id===f.islandId);openModal(`<div class="eyebrow">${esc(f.category)} · ${esc(f.time)}</div><h2 id="dialog-title">${esc(f.title)}</h2><div class="dialog-hero" style="background:${f.bg||'#e5eddd'}">${esc(f.icon||'✦')}</div><p>${esc(f.body)}</p>${botEndpoint?'':'<div class="notice">這是示範動態，並非校方公告或真實 Discord 訊息。</div>'}<div class="dialog-footer"><span>${d?esc(d.name):'校園觀測站'}</span>${d?'<button id="feed-island">前往這座島 →</button>':''}</div>`);if(d)$('#feed-island').onclick=()=>openIsland(d.id);}
function catalogHTML(){return `<section class="curriculum-catalog" id="curriculum-catalog"><div class="page-eyebrow">YOUR LEARNING MAP · 115</div><h2>每一門課，都有下一步。</h2><p class="page-description">六個技術型科別、綜合職能科與體育班，依三份計畫書課表整理。僅顯示專業科目、實習課程與體育專項課程。<br>選修含互斥項目，不可將所有選項學分加總。括號數值保留原表標示。</p><div class="catalog-filters"><label>科別與班別<select id="catalog-program">${CURRICULUM.programs.map(p=>`<option value="${p.id}">${programName(p)}</option>`).join('')}</select></label><label>授課學年<select id="catalog-year"><option value="all">全部學年</option><option value="0">一年級</option><option value="1">二年級</option><option value="2">三年級</option></select></label><label>課程類別<select id="catalog-kind"><option value="all">全部類別</option><option value="required">必修課程</option><option value="elective">選修／其他安排</option><option value="practice">實習科目</option></select></label><label class="catalog-keyword">找一門課<input id="catalog-search" type="search" placeholder="課程名稱，例如：數值控制" autocomplete="off"></label></div><div id="catalog-results" aria-live="polite"></div></section>`;}
function renderCatalog(){const p=CURRICULUM.programs.find(x=>x.id===$('#catalog-program').value);const year=$('#catalog-year').value,kind=$('#catalog-kind').value,q=$('#catalog-search').value.trim().toLowerCase();const list=p.courses.filter(isSpecialistCourse).filter(c=>c.name.toLowerCase().includes(q)&&(year==='all'||c.semesters.slice(Number(year)*2,Number(year)*2+2).some(s=>s!=='0'))&&(kind==='all'||kind==='required'&&c.requirement.includes('必修')||kind==='elective'&&!c.requirement.includes('必修')||kind==='practice'&&(c.kind==='實習科目'||c.kind.includes('體育專項')||c.kind.includes('體育專長')||c.name==='運動傷害防護')));$('#catalog-results').innerHTML=`<div class="catalog-summary"><div><strong>${programName(p)}</strong><span>${p.group} · 專業科目與實習課程</span></div><span>顯示 ${list.length} / ${p.courses.filter(isSpecialistCourse).length} 筆專業／實習課程</span></div><div class="catalog-source">${programSource(p)}</div>${p.id==='sports'?'<div class="notice">運動傷害防護課表列 2 學分、大綱列 1，待校方確認。田徑／跆拳道的括號為原表安排，非所有項目均須修習。</div>':''}<div class="table-scroll" tabindex="0" role="region" aria-label="${programName(p)}各學期課程學分表"><table class="course-table"><caption>${programName(p)}・115 學年度入學課程規劃</caption><thead><tr><th scope="col">課程名稱</th><th scope="col">類別</th><th scope="col">學分</th>${['一上','一下','二上','二下','三上','三下'].map(x=>`<th scope="col">${x}</th>`).join('')}<th scope="col">來源</th></tr></thead><tbody>${list.length?list.map(c=>`<tr><th scope="row">${esc(c.name)}${c.notes?`<small>${esc(c.notes.replace(/\n/g,' · '))}</small>`:''}</th><td><span class="course-kind">${esc(c.requirement)}</span><small>${esc(c.kind)}</small></td><td class="total-credit">${c.credits}</td>${c.semesters.map(x=>`<td class="${x==='0'?'zero-credit':''}">${x==='0'?'—':x}</td>`).join('')}<td><a href="${docHref(p.doc,c.page)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(c.name)}來源 PDF 第 ${c.page} 頁">p.${c.page} ↗</a></td></tr>`).join(''):'<tr><td colspan="10" class="catalog-empty">找不到符合條件的課程，試試其他學年或關鍵字。</td></tr>'}</tbody></table></div><p class="catalog-footnote">「—」表示原表空白或 0；括號照錄原表，表示替代或特殊安排，非直接計入一般學分。原始文件另含課程大綱、選課規則與特殊需求說明，請點來源查看。</p>`;}
function renderCourses(){return `<div class="page-eyebrow">FIND YOUR OWN PATH</div><h1>讓好奇心，帶你找到方向。</h1><p class="page-description">從一座島開始，認識草屯商工的正式科班與學習路徑。<br>八個科班，八種可能。點選科別，認識專業科目與實習課程。</p><div class="curriculum-badge">${ico('book')} 115 入學適用 <span>3 份備查計畫 · 8 個科班</span><a href="#curriculum-catalog">查閱課表 ↓</a></div><div class="course-grid">${islands.map(d=>`<button class="course-card" data-course="${d.id}"><span class="card-icon">${d.icon}</span><span class="eyebrow">${d.en}</span><h2>${d.name}</h2><p>${d.subtitle}<br>${d.departments.join(' · ')}</p><span class="tag">${d.type==='engineering'?'機械群':d.type==='business'?'商業與管理群':d.id==='language'?'外語群':d.id==='service'?'服務群':'校園與體育'}</span><span class="card-bottom">探索課程與學習路徑 ${ico('arrow')}</span></button>`).join('')}</div>${catalogHTML()}`;}

function renderActivity(id){const d=islands.find(x=>x.id===id);$('#content-page').innerHTML=`<div class="page-eyebrow">LITTLE MOMENTS, BIG POSSIBILITIES</div><h1>${d?esc(d.name)+'的日常':'島上的每一刻，都值得記錄。'}</h1><p class="page-description">${botEndpoint?'來自 TA bot 唯讀接口的彙整動態。':'示範校園動態 · 連接 TA bot 後，這裡將呈現匿名彙整的真實學習訊號。'}</p><div class="detail-tags"><button class="secondary-btn" id="activity-all">全部動態</button><button class="secondary-btn" id="activity-event">活動消息</button><button class="secondary-btn" id="activity-connect">${botEndpoint?'資料來源設定':'連接 TA bot'}</button></div><div class="activity-list">${feedHTML(feed.filter(f=>(!id||f.islandId===id)&&(feedFilter!=='event'||f.type==='event')))}</div>`;bindFeed($('#content-page'));$('#activity-all').onclick=()=>{feedFilter='all';renderActivity();};$('#activity-event').onclick=()=>{feedFilter='event';renderActivity(id);};$('#activity-connect').onclick=openBot;}
function showView(view){currentView=view;$$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===view));$('#map-page').hidden=view!=='map';$('#content-page').hidden=view==='map';if(view==='courses'){$('#content-page').innerHTML=renderCourses();$$('[data-course]').forEach(b=>b.onclick=()=>openIsland(b.dataset.course));['#catalog-program','#catalog-year','#catalog-kind'].forEach(s=>$(s).onchange=renderCatalog);$('#catalog-search').oninput=renderCatalog;renderCatalog();}if(view==='activity')renderActivity();window.scrollTo({top:0,behavior:'smooth'});}
function openSearch(){openModal(`<div class="eyebrow">FOLLOW YOUR CURIOSITY</div><h2 id="dialog-title">想去什麼樣的島？</h2><label for="island-search">搜尋科別或專業課程</label><input id="island-search" placeholder="試試「配管」、「商業」或「製圖」" autocomplete="off"><div id="search-results" class="search-results"></div>`);function search(){const q=$('#island-search').value.trim().toLowerCase();const list=islands.filter(d=>(JSON.stringify(d)+JSON.stringify(CURRICULUM.programs.filter(p=>p.id===d.id).map(p=>p.courses.filter(isSpecialistCourse)))).toLowerCase().includes(q));$('#search-results').innerHTML=list.length?list.map(d=>`<button class="search-result" data-result="${d.id}"><span>${d.icon}</span><div>${d.name}<small>${d.departments.join(' · ')}</small></div></button>`).join(''):'<p>沒有找到相關小島，換個關鍵字試試。</p>';$$('[data-result]').forEach(b=>b.onclick=()=>openIsland(b.dataset.result));}$('#island-search').oninput=search;search();setTimeout(()=>$('#island-search')?.focus(),50);}
function sourceInfo(){openModal(`<div class="eyebrow">OPEN DATA, KINDER CONNECTIONS</div><h2 id="dialog-title">關於這座島的資料</h2><p>草屯商工島以八座獨立島嶼，以科班直接命名。應用英文科在原計畫中的名稱為「應用英語科」，普通體育班為原計畫中的「體育班」；原始課表保留文件用語。</p><h3>課程內容與學年度</h3><p>已讀取你上傳的三份 PDF，皆適用於 115 學年度入學學生。科班、課程名稱、學分與授課學期依文件課表整理，來源連結可直達 PDF 頁面；島嶼描述為摘要，不取代正式選課規定。</p>${curriculumLinks()}<h3>內容校對與差異</h3><p>技術型六科均規劃 188 學分，綜合職能科 187 學分，體育班 182 學分。這些是應修習總學分，並非畢業及格門檻。體育班「運動傷害防護」課表為 2 學分、大綱為 1，網站保留差異供校方確認；數學 A／B 合併呈現。選修互斥、括號與特殊需求安排以原件為準。</p><p>證照只列文件明載的教學目標或教材，不據此推定指定必考或考取成果。計畫書中的舊年度班級人數不作為即時校園數據。</p><h3>動態與數據</h3><p>預設活動與統計仍為示範。課程文件不提供真實 Discord 動態。接入 TA bot 後只讀取匿名彙整數據與公開活動摘要；不收集 Discord token、不讀取私訊、不呈現真名。互動次數不等於在線人數，學習里程碑不代表考照通過人數。</p><p><a href="${SCHOOL_URL}" target="_blank" rel="noopener noreferrer">校方原始公告頁 ↗</a></p><h3>設計說明</h3><p>依六角形島嶼與玩具模型城市方向原創繪製，以等角投影呈現立體視覺，支援拖曳、縮放與鍵盤選取。</p><button class="primary-btn" id="source-connect">設定 TA bot 資料來源</button>`);$('#source-connect').onclick=openBot;}

function toast(s){$('#toast').textContent=s;$('#toast').hidden=false;setTimeout(()=>$('#toast').hidden=true,3500);}
function openBot(){openModal(`<div class="eyebrow">TA BOT OBSERVATORY</div><h2 id="dialog-title">讓校園的日常，來到島上。</h2><p>連接課程 TA bot 的公開唯讀 JSON 接口。學校網頁並非 JSON 接口，目前只作為公開資訊來源。</p><label for="bot-url">TA bot 資料網址（HTTPS）</label><input id="bot-url" type="url" placeholder="https://your-ta-bot.example/api/island" value="${esc(botEndpoint)}"><div class="notice">只使用你有權公開的匿名彙整資料。不要輸入 Discord token、Webhook 密鑰、私人訊息或含憑證的網址。接口需允許此網站的跨來源存取（CORS）。每 60 秒更新一次。</div><details><summary>查看接口資料格式</summary><pre class="code-block">${esc(JSON.stringify({updatedAt:'2026-10-24T09:00:00Z',stats:{interactions:1286,activities:12,milestones:38},events:[{id:'event-1',islandId:'data',type:'learning',title:'公開的學習動態摘要',category:'實作日常',time:'今天',body:'不包含個人資料的內容摘要'}]},null,2))}</pre><p>islandId：mechanical / piping / business / accounting / data / english / service / sports<br>type：learning / event / milestone<br>最多顯示最近 50 筆；只接受純文字，不執行接口中的 HTML。</p></details><div class="form-actions"><button class="primary-btn" id="save-bot">測試並連接</button><button class="secondary-btn" id="demo-mode">使用示範資料</button></div><div class="form-status" id="bot-status" role="status"></div>`);$('#save-bot').onclick=async()=>{const input=$('#bot-url').value.trim();let url;try{url=new URL(input);if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw Error();}catch{$('#bot-status').textContent='請輸入不含帳密、查詢參數或片段的 HTTPS JSON 接口網址。';return;}const button=$('#save-bot');button.disabled=true;button.textContent='正在驗證接口…';try{const data=await fetchBot(url.href);applyBot(data,url.href);try{localStorage.setItem('caotun-bot-endpoint',url.href);}catch{}closeModal();toast('已連接 TA bot，將每 60 秒更新資料。');}catch(e){if($('#bot-status'))$('#bot-status').textContent='連接失敗：'+e.message+'。已保留原本的資料模式。';}finally{if(button.isConnected){button.disabled=false;button.textContent='測試並連接';}}};$('#demo-mode').onclick=()=>{clearInterval(botTimer);botEndpoint='';try{localStorage.removeItem('caotun-bot-endpoint');}catch{}feed=[...demoFeed];feedFilter='all';$$('[data-feed]').forEach(b=>b.classList.toggle('active',b.dataset.feed==='all'));setStats({interactions:1286,activities:12,milestones:38});$('#data-mode').textContent='示範動態模式';$('#live-label').textContent='DEMO';$('#bot-note').textContent='示範動態 · 尚未連接 Discord';$('#stats-label').textContent='除島數外皆為示範數據';renderFeed();closeModal();toast('已切換為示範資料。');};}
function canonicalIslandId(id){return ({campus:'sports',digital:'data',language:'english',electrical:'data',maker:'english',automotive:'service'})[id]||id;}
async function fetchBot(url){const response=await fetch(url,{signal:AbortSignal.timeout(10000),credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'});if(!response.ok)throw Error('HTTP '+response.status);let d;try{d=await response.json();}catch{throw Error('回應不是有效的 JSON');}if(!d||!d.stats||!Array.isArray(d.events)||typeof d.updatedAt!=='string'||!Number.isFinite(Date.parse(d.updatedAt)))throw Error('缺少有效的 stats、events 或 updatedAt');for(const k of ['interactions','activities','milestones'])if(!Number.isSafeInteger(d.stats[k])||d.stats[k]<0)throw Error('統計數據必須為非負整數');if(d.events.length>50)throw Error('events 最多接受 50 筆');const ids=new Set();for(const e of d.events){if(!e||typeof e.id!=='string'||!e.id||ids.has(e.id)||!islands.some(i=>i.id===canonicalIslandId(e.islandId))||!['event','learning','milestone'].includes(e.type)||['title','category','time','body'].some(k=>typeof e[k]!=='string'||e[k].length>3000))throw Error('動態欄位格式不符或 id 重複');ids.add(e.id);}return d;}
function setStats(stats){for(const k of ['interactions','activities','milestones'])$('#stat-'+k).innerHTML=stats[k].toLocaleString('zh-TW')+`<small>${k==='interactions'?'次':k==='activities'?'項':'筆'}</small>`;}
function applyBot(data,url){botEndpoint=url;feed=data.events.map(e=>({id:e.id,islandId:canonicalIslandId(e.islandId),type:e.type,title:e.title,category:e.category,time:e.time,body:e.body,icon:e.type==='milestone'?'🏅':e.type==='event'?'✦':'🌱',bg:'#e7eddd'}));setStats(data.stats);$('#data-mode').textContent='TA bot 已連接';$('#live-label').textContent='SYNC';$('#bot-note').textContent='資料更新 '+new Date(data.updatedAt).toLocaleString('zh-TW',{timeZone:'Asia/Taipei',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})+'（台北）';$('#stats-label').textContent='TA bot 彙整資料 · 每 60 秒同步';renderFeed();clearInterval(botTimer);botTimer=setInterval(async()=>{if(polling)return;polling=true;try{applyBot(await fetchBot(botEndpoint),botEndpoint);}catch{$('#data-mode').textContent='同步中斷 · 保留上次資料';$('#live-label').textContent='STALE';$('#bot-note').textContent='連線失敗，顯示上次同步資料';$('#stats-label').textContent='同步中斷 · 統計為上次成功同步結果';}finally{polling=false;}},60000);}
const camera={x:0,y:0,scale:1};const drag={active:false,moved:false,x:0,y:0,lastX:0,lastY:0};
function updateCamera(){$('#map-world').setAttribute('transform',`translate(${camera.x} ${camera.y}) translate(580 410) scale(${camera.scale}) translate(-580 -410)`);}
function zoom(delta){camera.scale=Math.max(.65,Math.min(1.8,camera.scale+delta));updateCamera();}
function initMapInteraction(){const el=$('#map-viewport');el.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag.active=true;drag.moved=false;drag.x=drag.lastX=e.clientX;drag.y=drag.lastY=e.clientY;});el.addEventListener('pointermove',e=>{if(!drag.active)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5){drag.moved=true;el.classList.add('dragging');}if(drag.moved){const ratio=1160/$('#island-map').getBoundingClientRect().width;camera.x=Math.max(-400,Math.min(400,camera.x+(e.clientX-drag.lastX)*ratio));camera.y=Math.max(-300,Math.min(300,camera.y+(e.clientY-drag.lastY)*ratio));updateCamera();}drag.lastX=e.clientX;drag.lastY=e.clientY;});window.addEventListener('pointerup',()=>{drag.active=false;el.classList.remove('dragging');});el.addEventListener('pointercancel',()=>{drag.active=false;el.classList.remove('dragging');});el.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?.08:-.08);},{passive:false});$('#zoom-in').onclick=()=>zoom(.15);$('#zoom-out').onclick=()=>zoom(-.15);$('#reset-map').onclick=()=>{Object.assign(camera,{x:0,y:0,scale:1});updateCamera();};}
function init(){renderMap();renderFeed();initMapInteraction();function resizeMap(){const mobile=window.innerWidth<=800;$('#island-map').setAttribute('viewBox',mobile?'100 100 1000 700':'0 0 1160 790');}resizeMap();window.addEventListener('resize',resizeMap);$('#year').textContent=new Date().getFullYear();$$('[data-view]').forEach(b=>b.onclick=()=>showView(b.dataset.view));$$('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));islands.forEach(d=>$(`[data-island="${d.id}"]`).classList.toggle('dim',filter!=='all'&&d.type!==filter));});$$('[data-feed]').forEach(b=>b.onclick=()=>{feedFilter=b.dataset.feed;$$('[data-feed]').forEach(x=>x.classList.toggle('active',x===b));renderFeed();});$('#visit').onclick=()=>{showView('map');openIsland('mechanical');};$('#random-island').onclick=()=>openIsland(islands[Math.floor(Math.random()*islands.length)].id);$('.search-toggle').onclick=openSearch;$('#connect-bot').onclick=openBot;$('#source-info').onclick=sourceInfo;$('#modal-backdrop').addEventListener('click',e=>{if(e.target===$('#modal-backdrop'))closeModal();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modal-backdrop').hidden)closeModal();if(e.key==='Tab'&&!$('#modal-backdrop').hidden){const els=[...$('#dialog').querySelectorAll('button:not([disabled]),a[href],input,summary')];const first=els[0],last=els.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===$('#dialog'))){e.preventDefault();last?.focus();}else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===$('#dialog'))){e.preventDefault();first?.focus();}}});let saved;try{saved=localStorage.getItem('caotun-bot-endpoint');}catch{}if(saved){try{const u=new URL(saved);if(u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash)fetchBot(u.href).then(d=>applyBot(d,u.href)).catch(()=>toast('TA bot 連線未成功，目前顯示示範資料。'));}catch{}}}
init();
