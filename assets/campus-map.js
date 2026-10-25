'use strict';
// Original macaron illustration follows the supplied oblique campus reference.
// Art coordinates are 1536 × 1024; every hit area and route uses this same space.
const campusPoint=(u,v,z=0)=>[u*1240/1536,v*815/1024-z];
const CAMPUS_BUILDINGS={
 mechanical:{side:'left',anchor:[420,394],label:[419,350],polygons:[[[264,329],[491,283],[533,321],[305,375]],[[265,330],[306,346],[418,416],[371,439]],[[370,439],[551,392],[603,426],[419,492]]]},
 piping:{side:'right',anchor:[794,192],label:[802,176],polygons:[[[665,174],[872,119],[922,158],[718,222],[670,221]]]},
 business:{side:'left',anchor:[591,558],label:[586,556],polygons:[[[421,488],[627,438],[687,474],[478,534]],[[421,488],[477,506],[559,570],[511,611]],[[512,611],[706,542],[762,579],[564,661]]]},
 accounting:{side:'rear',anchor:[660,305],label:[652,277],canopies:[[[747,287],[770,294],[852,366],[833,384]]],polygons:[[[547,282],[586,270],[586,230],[655,211],[719,245],[745,347],[681,390],[600,362],[552,331]]]},
 data:{side:'right',anchor:[1030,358],label:[1030,353],polygons:[[[957,377],[1180,316],[1241,356],[1014,442],[961,421]],[[854,302],[1069,247],[1130,281],[910,355],[860,350]]]},
 english:{side:'rear-left',anchor:[280,90],label:[279,82],polygons:[[[171,83],[270,49],[271,24],[323,1],[387,34],[387,77],[319,106],[186,133]]]},
 service:{side:'right',anchor:[1230,520],label:[1224,534],polygons:[[[1050,468],[1251,415],[1302,455],[1107,518]],[[1047,467],[1107,488],[1204,552],[1154,589]],[[1153,589],[1340,512],[1396,554],[1205,650]]]},
 sports:{side:'field',anchor:[292,222],label:[280,224],polygons:[[[90,168],[206,116],[350,120],[495,221],[514,271],[400,320],[253,325],[109,239]]]}
};
const CAMPUS_NODE_UV=[[708,450],[820,436],[808,562],[700,399],[925,540],[280,129],[1061,673],[340,226],[709,454],[836,453],[787,536],[900,518],[858,623],[1006,606],[936,712],[1094,695],[852,519],[953,737],[1050,720],[1006,738],[1000,790],[480,300],[550,232],[480,172],[375,129],[680,413],[580,208],[754,302]];
const CAMPUS_NODES=CAMPUS_NODE_UV.map(([u,v])=>campusPoint(u,v));
const CAMPUS_EDGES=[[0,8],[1,9],[2,10],[3,8],[4,11],[5,24],[6,15],[7,21],[21,22],[22,23],[23,24],[22,26],[26,27],[27,9],[8,10],[9,11],[10,12],[11,13],[12,14],[13,15],[10,16],[16,11],[14,17],[15,18],[17,19],[19,18],[19,20],[3,25],[25,8]];
function campusRoute(from,to){const queue=[[from]],seen=new Set([from]);while(queue.length){const path=queue.shift(),last=path.at(-1);if(last===to)return path;for(const [a,b] of CAMPUS_EDGES){const next=a===last?b:b===last?a:null;if(next!==null&&!seen.has(next)){seen.add(next);queue.push([...path,next]);}}}return [from];}
function campusContains(point,polygon){let inside=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const a=polygon[i],b=polygon[j];if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
function schoolBuilding(d){
 const regions=d.polygons.map(p=>p.map(([u,v])=>campusPoint(u,v))),local=p=>p.map(([x,y])=>[x-d.x,y-d.y]);
 const paths=regions.map(p=>`M${local(p).map(q=>q.join(',')).join('L')}Z`).join('');
 const vertices=regions.flat(),minX=Math.min(...vertices.map(p=>p[0]))-d.x,minY=Math.min(...vertices.map(p=>p[1]))-d.y,maxX=Math.max(...vertices.map(p=>p[0]))-d.x,maxY=Math.max(...vertices.map(p=>p[1]))-d.y;
 // Background fragments act as occluders when a resident goes behind a building.
 const maskRegions=[...regions,...(d.canopies||[]).map(p=>p.map(([u,v])=>campusPoint(u,v)))];
 const worldPaths=maskRegions.map(p=>`M${p.map(q=>q.join(',')).join('L')}Z`).join('');
 const occluder=d.id==='sports'?'':`<g id="occluder-${d.id}" class="campus-occluder" aria-hidden="true"><defs><clipPath id="building-mask-${d.id}" clipPathUnits="userSpaceOnUse"><path d="${worldPaths}"/></clipPath></defs><image href="assets/campus-macaron.png" width="1240" height="815" preserveAspectRatio="none" clip-path="url(#building-mask-${d.id})"/></g>`;
 return `${occluder}<g class="campus-building" data-department="${d.id}" data-campus-side="${d.side}" role="button" tabindex="0" aria-label="探索${d.name}，體驗小任務" transform="translate(${d.x} ${d.y})"><rect class="building-click-box" x="${minX}" y="${minY}" width="${maxX-minX}" height="${maxY-minY}" fill="transparent"/><path class="building-hit-area" d="${paths}"/><g class="building-sign" transform="translate(${d.labelX-d.x} ${d.labelY-d.y})"><rect class="label-bg" x="-76" y="-15" width="152" height="30" rx="13"/><circle cx="-60" cy="0" r="4" fill="${d.accent}"/><text text-anchor="middle" x="5" y="5" font-size="14" font-weight="800">${d.name}</text></g></g>`;
}
function campusShops(){
 const [fx,fy]=campusPoint(208,833),[hx,hy]=campusPoint(1361,896);
 return `<g class="campus-shops" aria-label="面向正門，左邊南臺灣土魠魚羹、右邊萊爾富"><g class="fish-soup-shop" role="button" tabindex="0" aria-label="查看南臺灣土魠魚羹商標" transform="translate(${fx} ${fy})"><path class="shop-hit-area" d="M-84-61 111-12 111 99-84 58Z"/><g transform="rotate(10)"><rect x="-75" y="-10" width="151" height="27" rx="2" fill="#d95165"/><image href="assets/nantaiwan-mark.svg" x="-71" y="-9" width="26" height="25"/><text x="14" y="8" text-anchor="middle" fill="#fffaf3" font-size="12" font-weight="800">南臺灣土魠魚羹</text></g></g><g class="hilife-store" transform="translate(${hx} ${hy})"><g transform="rotate(-8)"><text x="0" y="3" text-anchor="middle" fill="#ffffff" font-size="17" font-weight="800">萊爾富 Hi-Life</text></g></g></g>`;
}
function scooterArt(){return `<g class="scooter-model"><ellipse cy="13" rx="37" ry="8" fill="#4d6c5920"/><circle cx="-24" cy="10" r="7" fill="#526d70" stroke="#d3dfd1" stroke-width="2"/><circle cx="25" cy="10" r="7" fill="#526d70" stroke="#d3dfd1" stroke-width="2"/><path d="M-24 8h42L25-27h-11" fill="none" stroke="#e7b44e" stroke-width="5" stroke-linecap="round"/><path d="M17 6 6-14" stroke="#5c8c90" stroke-width="4"/><g transform="translate(-2 -3) scale(.72)">${animal(0,0,'','rabbit')}</g><g class="npc-headband"><path d="M-14-41q12-12 25 0" stroke="#e2aa48" stroke-width="3" fill="none"/><rect x="-14" y="-50" width="28" height="13" rx="5" fill="#fff1a5" stroke="#d9ac51" stroke-width="1"/><text x="0" y="-40" text-anchor="middle" fill="#8a6e34" font-size="9" font-weight="800">客服</text></g></g>`;}
function campusNpc(){return `<g class="reward-npc campus-npc" id="reward-npc" role="button" tabindex="0" aria-label="呼叫中鼎文，校園客服" transform="translate(540 530)"><g class="npc-scooter">${scooterArt()}</g><g transform="translate(0 31)"><rect x="-67" y="-9" width="134" height="25" rx="12" fill="#fff5cc" stroke="#e7d9a7"/><text x="0" y="8" text-anchor="middle" fill="#8e794a" font-size="11">中鼎文・校園客服</text></g></g>`;}
function renderCampusMap(){
 for(const d of departments){const s=CAMPUS_BUILDINGS[d.id];Object.assign(d,s);[d.x,d.y]=campusPoint(...s.anchor);[d.labelX,d.labelY]=campusPoint(...s.label);d.scale=1;d.occlusion=[...s.polygons,...(s.canopies||[])].map(p=>p.map(([u,v])=>campusPoint(u,v)));}
 let art=`<image id="campus-illustration" href="assets/campus-macaron.png" width="1240" height="815" preserveAspectRatio="none" aria-hidden="true"/><g id="central-courtyard" data-layout="oblique-reference" aria-hidden="true"></g>`;
 art+=[...departments].sort((a,b)=>a.y-b.y).map(schoolBuilding).join('');
 const [gx,gy]=campusPoint(865,790);
 art+=`<g id="campus-main-gate" transform="translate(${gx} ${gy}) rotate(12)"><rect x="-65" y="-12" width="130" height="25" rx="3" fill="#fff7e8" stroke="#d99ab1" stroke-width="2"/><text y="5" text-anchor="middle" fill="#825068" font-size="14" font-weight="800">國立草屯商工</text></g>`;
 art+=campusShops()+`<g id="campus-students" aria-hidden="true"></g>`+campusNpc();
 $('#map-world').innerHTML=art;
 const labels=document.createElementNS('http://www.w3.org/2000/svg','g');labels.id='campus-labels';
 for(const d of departments){const building=$(`[data-department="${d.id}"]`),sign=building.querySelector('.building-sign');const wrapper=document.createElementNS('http://www.w3.org/2000/svg','g');wrapper.setAttribute('class','campus-map-label');wrapper.setAttribute('aria-hidden','true');wrapper.setAttribute('transform',`translate(${d.x} ${d.y})`);wrapper.dataset.labelFor=d.id;wrapper.append(sign);wrapper.onclick=()=>{if(!drag.moved)openDepartment(d.id);};labels.append(wrapper);}
 $('#map-world').append(labels);
 $$('[data-department]').forEach(el=>{el.onclick=()=>{if(!drag.moved)openDepartment(el.dataset.department);};el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDepartment(el.dataset.department);}};});
}
