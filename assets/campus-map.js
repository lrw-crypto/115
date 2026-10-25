'use strict';
// A playful interpretation of the supplied school photos; department locations
// are navigation assignments, not claims about actual classroom locations.
const CAMPUS_ORIGIN={x:430,y:70};
const campusPoint=(u,v,z=0)=>[CAMPUS_ORIGIN.x+(u-v)*.866,CAMPUS_ORIGIN.y+(u+v)*.5-z];
const CAMPUS_NODE_UV=[[290,127],[465,127],[390,392],[550,392],[640,127],[710,392],[780,267],[180,430],[220,145],[290,145],[465,145],[640,145],[820,145],[220,270],[550,270],[740,270],[820,270],[220,420],[390,420],[550,420],[710,420],[820,420],[850,450]];
const CAMPUS_NODES=CAMPUS_NODE_UV.map(([u,v])=>campusPoint(u,v));
const CAMPUS_EDGES=[[0,9],[1,10],[2,18],[3,19],[4,11],[5,20],[6,15],[7,17],[8,9],[9,10],[10,11],[11,12],[13,14],[14,15],[15,16],[17,18],[18,19],[19,20],[20,21],[8,13],[13,17],[12,16],[16,21],[21,22]];
function campusRoute(from,to){const queue=[[from]],seen=new Set([from]);while(queue.length){const path=queue.shift(),last=path.at(-1);if(last===to)return path;for(const [a,b] of CAMPUS_EDGES){const next=a===last?b:b===last?a:null;if(next!==null&&!seen.has(next)){seen.add(next);queue.push([...path,next]);}}}return [from];}
function schoolBlock(u,v,w=116,d=40,h=54,roof='#3e647a'){
 const color='#fff0d2';let art=box(u,v,w,d,h,color);
 // Brick piers and two levels of windows on the long, cream-colored facade.
 for(let i=0;i<Math.floor(w/22);i++){
  const x=u+3+i*22;
  art+=poly([pt(x,v+d,0),pt(x+6,v+d,0),pt(x+6,v+d,h),pt(x,v+d,h)],'#e47650');
  for(const z of [h-11,h-34])art+=poly([pt(x+8,v+d+.1,z),pt(x+18,v+d+.1,z),pt(x+18,v+d+.1,z-13),pt(x+8,v+d+.1,z-13)],'#7fcbce','stroke="#fff5dc" stroke-width="1.5"');
 }
 const a=pt(u,v,h),b=pt(u+w,v,h),c=pt(u+w,v+d,h),e=pt(u,v+d,h),ra=w>=d?pt(u,v+d/2,h+18):pt(u+w/2,v,h+18),rb=w>=d?pt(u+w,v+d/2,h+18):pt(u+w/2,v+d,h+18);
 art+=w>=d?poly([a,b,rb,ra],shade(roof,15),'stroke="#f3ebd6" stroke-width="1"')+poly([ra,rb,c,e],roof,'stroke="#d4e0d4" stroke-width="1"'):poly([a,e,rb,ra],shade(roof,15),'stroke="#f3ebd6" stroke-width="1"')+poly([ra,rb,c,b],roof,'stroke="#d4e0d4" stroke-width="1"');
 for(let i=8;i<w&&w>=d;i+=11)art+=`<path d="M${pt(u+i,v+d/2,h+18)}L${pt(u+i,v+d,h)}" stroke="#adc1c0" opacity=".28" stroke-width="1"/>`;
 return art;
}
function courtyardSchool(id){
 const w=132,l=98,arm=25,h=46;
 let art=poly([pt(-70,-54),pt(70,-54),pt(70,58),pt(-70,58)],'#f0cc86','stroke="#ffebad" stroke-width="4"');
 art+=poly([pt(-37,-17),pt(37,-17),pt(37,49),pt(-37,49)],'#9bd046','stroke="#d3e697" stroke-width="3"');
 art+=`<g class="courtyard-wing" data-wing="main">${schoolBlock(-w/2,-l/2,w,arm,h,'#285b83')}</g>`;
 art+=`<g class="courtyard-wing" data-wing="left">${schoolBlock(-w/2,-l/2+arm,arm,l-arm,h,'#2d668a')}</g>`;
 art+=`<g class="courtyard-wing" data-wing="right">${schoolBlock(w/2-arm,-l/2+arm,arm,l-arm,h,'#285b83')}</g>`;
 art+=`<g class="courtyard-garden" transform="translate(-7 18) scale(.23)">${departmentLandmark(id)}</g>`;
 art+=`<path d="M${pt(-12,31)}L${pt(-12,68)}M${pt(12,31)}L${pt(12,68)}" stroke="#fff0d2" stroke-width="4"/>`;
 return `<g class="courtyard-complex" data-courtyard="${id}">${art}</g>`;
}
function schoolBuilding(d){
 const sports=d.id==='sports';
 const art=sports?`<g transform="rotate(23)"><ellipse cy="-5" rx="112" ry="64" fill="#c4593d"/><ellipse cy="-5" rx="106" ry="58" fill="#ec9864"/><ellipse cy="-5" rx="86" ry="43" fill="#8acb36"/><ellipse cy="-5" rx="110" ry="62" fill="none" stroke="#ffeec2" stroke-width="1.5"/><ellipse cy="-5" rx="101" ry="53" fill="none" stroke="#ffeec2" stroke-width="1.5"/><path d="M-72-25v40H72v-40Z" fill="none" stroke="#eef4b9" stroke-width="1.5"/></g><g transform="translate(2 -2) scale(.5)">${departmentLandmark(d.id)}</g>`:courtyardSchool(d.id);
 return `<g class="campus-building" data-department="${d.id}" role="button" tabindex="0" aria-label="探索${d.name}，體驗小任務" transform="translate(${d.x} ${d.y}) scale(${d.scale})"><ellipse cy="20" rx="92" ry="28" fill="#426a4f30" filter="url(#shadow)"/><g filter="url(#soft-shadow)">${art}</g><g class="building-sign" transform="translate(${d.id==='data'?45:-12} ${sports?84:d.id==='english'?65:d.id==='data'?-86:91})">${d.id==='data'?'<path d="M0 23L-34 64" stroke="#bcab6c" stroke-width="1.5" fill="none"/>':''}<rect class="label-bg" x="-91" y="-12" width="182" height="34" rx="13"/><circle cx="-69" cy="5" r="5" fill="${d.accent}"/><text text-anchor="middle" x="6" y="11" fill="#245a64" font-size="17" font-weight="700">${d.name}</text></g></g>`;
}
function schoolLibrary(){return `<g transform="translate(529.6 337.5) scale(.9)">${box(-39,-36,76,49,72,'#f5d4b3')}<path d="M-54-8 12 30v-62l-66-38Z" fill="#a2c8bd" stroke="#ebdfc7" stroke-width="4"/><path d="M-54-50 12-12m-66-19 66 38m-46-65V4m20-50V17M-54-8 12 30" fill="none" stroke="#779d99" stroke-width="2"/><path d="m-49-72 31-27 44 36-35 12Z" fill="#b8d5c5" stroke="#f8eed8" stroke-width="2"/><path d="m-18-99 9 48m-40-21 75 9" fill="none" stroke="#789996" stroke-width="1.5"/><text x="-7" y="51" text-anchor="middle" fill="#66816c" font-size="11">學習中庭</text></g>`;}
function campusShops(){
 // Use the original shop art without the former shore/sea: recreate a small block.
 const hilife=`<g class="hilife-store" transform="translate(923 723)"><path d="M-50-24H55l27-17v55L55 32-50 12Z" fill="#fff2d3" stroke="#dacfb0" stroke-width="2"/><path d="m55-24 27-17v55L55 32Z" fill="#d0d9c0"/><path d="m-56-30 111 0 36-20H-20Z" fill="#f7efd6"/><path d="M-51-27H57v22H-51Z" fill="#269bab"/><path d="M-51-27H57v5H-51Z" fill="#d94e52"/><text x="2" y="-11" text-anchor="middle" fill="white" font-size="12" font-weight="700">萊爾富 Hi-Life</text><path d="M-42 0h35v15h-35Zm48-1h26v26H6Z" fill="#9dc8b8" stroke="#e7dfbf" stroke-width="2"/></g>`;
 return `<g class="campus-shops" aria-label="校外店家">${hilife}${foodShopScenery().replace('translate(1002 108)','translate(1100 744)')}<text x="1020" y="807" fill="#8b8e73" font-size="10">校外散步・店家想像場景</text></g>`;
}
function scooterArt(){return `<g class="scooter-model"><ellipse cy="13" rx="37" ry="8" fill="#4d6c5920"/><circle cx="-24" cy="10" r="7" fill="#526d70" stroke="#d3dfd1" stroke-width="2"/><circle cx="25" cy="10" r="7" fill="#526d70" stroke="#d3dfd1" stroke-width="2"/><path d="M-24 8h42L25-27h-11" fill="none" stroke="#e7b44e" stroke-width="5" stroke-linecap="round"/><path d="M17 6 6-14" stroke="#5c8c90" stroke-width="4"/><g transform="translate(-2 -3) scale(.72)">${animal(0,0,'','rabbit')}</g><g class="npc-headband"><path d="M-14-41q12-12 25 0" stroke="#e2aa48" stroke-width="3" fill="none"/><rect x="-14" y="-50" width="28" height="13" rx="5" fill="#fff1a5" stroke="#d9ac51" stroke-width="1"/><text x="0" y="-40" text-anchor="middle" fill="#8a6e34" font-size="9" font-weight="800">客服</text></g></g>`;}
function campusNpc(){return `<g class="reward-npc campus-npc" id="reward-npc" role="button" tabindex="0" aria-label="呼叫中鼎文，校園客服" transform="translate(540 530)"><g class="npc-scooter">${scooterArt()}</g><g transform="translate(0 31)"><rect x="-67" y="-9" width="134" height="25" rx="12" fill="#fff5cc" stroke="#e7d9a7"/><text x="0" y="8" text-anchor="middle" fill="#8e794a" font-size="11">中鼎文・校園客服</text></g></g>`;}
function renderCampusMap(){
 const corners=[[0,0],[850,0],[850,460],[0,460]].map(([u,v])=>campusPoint(u,v));
 let art=poly(corners.map(([x,y])=>[x,y+13]),'#85a849')+poly(corners,'#b4d96e','stroke="#fff0be" stroke-width="12" stroke-linejoin="round"');
 const frontGate=campusPoint(850,450);art+=`<path d="M${campusPoint(900,495)}Q${frontGate[0]+130} ${frontGate[1]+73} 1250 790" fill="none" stroke="#97aca2" stroke-width="48"/><path d="M${campusPoint(900,495)}Q${frontGate[0]+130} ${frontGate[1]+73} 1250 790" fill="none" stroke="#fff4c8" stroke-width="2" stroke-dasharray="13 12"/>`;
 const lawn=[[400,165],[745,165],[745,242],[400,242]].map(([u,v])=>campusPoint(u,v));art+=poly(lawn,'#78c439','stroke="#f2d195" stroke-width="9"');
 art+=poly([[410,176],[732,176],[732,230],[410,230]].map(([u,v])=>campusPoint(u,v)),'#98d64c');
 for(const [a,b] of CAMPUS_EDGES){const p=CAMPUS_NODES[a],q=CAMPUS_NODES[b];art+=`<path d="M${p}L${q}" fill="none" stroke="#efd59d" stroke-width="21" stroke-linecap="round"/><path d="M${p}L${q}" fill="none" stroke="#fff4d4" stroke-width="1"/>`;}
 for(const [u,v] of [[60,150],[135,150]]){const outer=[[u,v],[u+65,v],[u+65,v+47],[u,v+47]].map(([a,b])=>campusPoint(a,b));art+=poly(outer,'#f4a85e','stroke="#ffdeb0" stroke-width="3"');art+=poly([[u+5,v+5],[u+60,v+5],[u+60,v+42],[u+5,v+42]].map(([a,b])=>campusPoint(a,b)),'#79be5b','stroke="#eaf0bd" stroke-width="1"');art+=`<path d="M${campusPoint(u+32,v+5)}L${campusPoint(u+32,v+42)}" stroke="#eaf0bd" stroke-width="1"/>`;}
 const [ax,ay]=campusPoint(170,30);art+=`<g id="activity-center" transform="translate(${ax} ${ay}) scale(.83)">${schoolBlock(-80,-35,154,66,67,'#315a75')}<text x="0" y="53" text-anchor="middle" fill="#3e7959" font-size="13">漾采樓・活動中心</text></g>${schoolLibrary()}`;
 const [lx,ly]=campusPoint(580,205);art+=`<text x="${lx}" y="${ly}" text-anchor="middle" fill="#518e39" font-size="12" font-weight="600">中央草地</text>`;
 const treeUV=[[25,50],[25,110],[25,180],[25,250],[25,320],[25,390],[105,440],[265,440],[440,440],[610,440],[785,440],[820,55],[820,110],[820,200],[820,300],[60,25],[215,25],[375,25],[545,25],[710,25],[430,247],[505,247],[590,247],[675,247],[760,247],[330,180],[330,250]];
 for(const [u,v] of treeUV){const [x,y]=campusPoint(u,v);art+=`<g transform="translate(${x} ${y}) scale(.62)">${tree(0,0,1)}</g>`;}
 art+=[...departments].sort((a,b)=>a.y-b.y).map(schoolBuilding).join('');
 const [mx,my]=campusPoint(785,274);art+=`<g transform="translate(${mx} ${my})"><ellipse cy="7" rx="20" ry="9" fill="#8da978"/><path d="M-10 0q-9-20 9-25 20-4 18 17Q15 3 6-4q-6-5 2-10" fill="none" stroke="#fff3c7" stroke-width="5"/></g>`;
 art+=`<g id="campus-main-gate" transform="translate(${frontGate})"><path d="M-45-36V0m90-36V0" stroke="#e47448" stroke-width="12"/><path d="M-55-43H55l12 12H-67Z" fill="#236787"/><text y="-23" text-anchor="middle" fill="#fff8d1" font-size="12" font-weight="700">國立草屯商工</text><path d="M-42 6h84" stroke="#fff7d9" stroke-width="5"/><text y="30" text-anchor="middle" fill="#5d8064" font-size="12">正門・芬草路</text></g><g transform="translate(284 146)"><path d="M-42-14H42" stroke="#366b80" stroke-width="8"/><text y="8" text-anchor="middle" fill="#517954" font-size="11">北門・中投公路下</text></g>`;
 art+=`<g transform="translate(1060 570) scale(.65)">${schoolBlock(-40,-30,78,44,59,'#42566e')}</g>`;
 art+=campusShops()+`<g id="campus-students" aria-hidden="true"></g>`+campusNpc();
 $('#map-world').innerHTML=art;
 const labels=document.createElementNS('http://www.w3.org/2000/svg','g');labels.id='campus-labels';
 for(const d of departments){const building=$(`[data-department="${d.id}"]`),sign=building.querySelector('.building-sign');const wrapper=document.createElementNS('http://www.w3.org/2000/svg','g');wrapper.setAttribute('class','campus-map-label');wrapper.setAttribute('aria-hidden','true');wrapper.setAttribute('transform',`translate(${d.x} ${d.y}) scale(${d.scale})`);wrapper.dataset.labelFor=d.id;wrapper.append(sign);wrapper.onclick=()=>{if(!drag.moved)openDepartment(d.id);};labels.append(wrapper);}
 $('#map-world').append(labels);
 $$('[data-department]').forEach(el=>{el.onclick=()=>{if(!drag.moved)openDepartment(el.dataset.department);};el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDepartment(el.dataset.department);}};});
}
