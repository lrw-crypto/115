'use strict';
// Building numbers are counted from the main entrance toward the rear campus.
// All scenery, hit areas and resident paths share the 1536 × 1024 art coordinates.
const CAMPUS_ART='assets/campus-macaron.png?v=iron-roofs2-pavilion';
const campusPoint=(u,v,z=0)=>[u*1240/1536,v*815/1024-z];
const CAMPUS_PLACES={
 'left-1':{side:'left',order:1,name:'左邊第一棟',departments:['service'],anchor:[591,558],polygons:[[[421,488],[627,438],[687,474],[478,534]],[[421,488],[477,506],[559,570],[511,611]],[[512,611],[706,542],[762,579],[564,661]]]},
 'left-2':{side:'left',order:2,name:'左邊第二棟',departments:['accounting','business','data'],anchor:[420,394],polygons:[[[264,329],[491,283],[533,321],[305,375]],[[265,330],[306,346],[418,416],[371,439]],[[370,439],[551,392],[603,426],[419,492]]]},
 'right-1':{side:'right',order:1,departments:[],anchor:[1230,520],polygons:[[[1050,468],[1251,415],[1302,455],[1107,518]],[[1047,467],[1107,488],[1204,552],[1154,589]],[[1153,589],[1340,512],[1396,554],[1205,650]]]},
 'right-2':{side:'right',order:2,name:'右邊第二棟',departments:['english'],anchor:[1085,375],polygons:[[[957,377],[1180,316],[1241,356],[1014,442],[961,421]]]},
 'right-3':{side:'right',order:3,name:'右邊第三棟',departments:[],anchor:[990,292],polygons:[[[854,302],[1069,247],[1130,281],[910,355],[860,350]]]},
 'mechanical-hall':{side:'right',name:'機械科',departments:['mechanical'],anchor:[900,250],polygons:[[[769,238],[977,180],[1035,218],[1030,268],[826,321],[773,291]]]},
 'rear-right':{side:'right',name:'配管科',departments:['piping'],anchor:[794,192],polygons:[[[665,174],[872,119],[922,158],[718,222],[670,221]]]},
 'central':{side:'central',departments:[],anchor:[660,305],canopies:[[[747,287],[770,294],[852,366],[833,384]]],polygons:[[[547,282],[586,270],[586,230],[655,211],[719,245],[745,347],[681,390],[600,362],[552,331]]]},
 'rear-left':{side:'rear',departments:[],anchor:[280,90],polygons:[[[171,83],[270,49],[271,24],[323,1],[387,34],[387,77],[319,106],[186,133]]]},
 'gatehouse':{side:'entrance',departments:[],anchor:[1020,723],polygons:[[[964,671],[1030,646],[1085,681],[1085,749],[981,783],[964,735]]]},
 'sports':{side:'field',name:'操場',departments:['sports'],anchor:[292,222],polygons:[[[90,168],[206,116],[350,120],[495,221],[514,271],[400,320],[253,325],[109,239]]]}
};
const CAMPUS_BUILDINGS={
 accounting:{buildingId:'left-2',label:[431,343]},
 business:{buildingId:'left-2',label:[431,383]},
 data:{buildingId:'left-2',label:[431,423]},
 service:{buildingId:'left-1',label:[585,556]},
 mechanical:{buildingId:'mechanical-hall',label:[881,231]},
 piping:{buildingId:'rear-right',label:[767,167]},
 english:{buildingId:'right-2',label:[1090,362]},
 sports:{buildingId:'sports',label:[280,224]}
};
const CENTRAL_LAWN=[[706,447],[805,421],[1091,685],[931,729]];
const CAMPUS_CAT_POINT=[910,604];
function campusContains(point,polygon){let inside=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const a=polygon[i],b=polygon[j];if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
function schoolBuilding(id,place){
 const regions=place.polygons.map(p=>p.map(([u,v])=>campusPoint(u,v)));
 const maskRegions=[...regions,...(place.canopies||[]).map(p=>p.map(([u,v])=>campusPoint(u,v)))];
 const worldPaths=maskRegions.map(p=>`M${p.map(q=>q.join(',')).join('L')}Z`).join('');
 const occluder=id==='sports'?'':`<g id="occluder-${id}" class="campus-occluder" aria-hidden="true"><defs><clipPath id="building-mask-${id}" clipPathUnits="userSpaceOnUse"><path d="${worldPaths}"/></clipPath></defs><image href="${CAMPUS_ART}" width="1240" height="815" preserveAspectRatio="none" clip-path="url(#building-mask-${id})"/></g>`;
 return occluder;
}
function campusDepartmentLabel(d){return `<g class="campus-map-label" data-label-for="${d.id}" data-department="${d.id}" data-building-id="${d.buildingId}" role="button" tabindex="0" aria-label="探索${d.name}" transform="translate(${d.labelX} ${d.labelY})"><g class="building-sign"><rect class="label-bg" x="-68" y="-13" width="136" height="26" rx="11"/><circle cx="-54" cy="0" r="3.5" fill="${d.accent}"/><text text-anchor="middle" x="5" y="4" font-size="12.5" font-weight="800">${d.name}</text></g></g>`;}
function applyCampusFilter(){
 for(const d of departments)$(`[data-label-for="${d.id}"]`).classList.toggle('dim',filter!=='all'&&d.type!==filter);
}
function sweepingCatArt(){return `<g class="cat-sweep-body"><image href="assets/groundskeeper-cat.png" x="-27" y="-72" width="54" height="76" preserveAspectRatio="xMidYMax meet"/><g transform="translate(7 -28)"><g class="cat-broom"><path d="M-16-29 19 27" stroke="#8f6944" stroke-width="3.8" stroke-linecap="round"/><path d="M-16-29 19 27" stroke="#d5ad6e" stroke-width="1.4" stroke-linecap="round"/><path d="m17 22 8-4 13 18q-12 9-24 7Z" fill="#b5945c" stroke="#8f734c" stroke-width="1"/><path d="m19 25 3 15m1-17 4 15m0-17 6 15" stroke="#e7ca8c" stroke-width="1.3"/><path d="m17 24 10-5" stroke="#6f674e" stroke-width="3"/></g></g></g>`;}
function sweepingCat(){const [x,y]=campusPoint(...CAMPUS_CAT_POINT);return `<g id="groundskeeper-cat" class="sweeping-cat" data-zone="central-lawn" role="button" tabindex="0" aria-label="和草地掃地貓說話" transform="translate(${x} ${y})"><rect class="cat-motion-bounds" x="-44" y="-100" width="100" height="135" fill="transparent" pointer-events="none"/><ellipse cy="1" rx="23" ry="7" fill="#537b4c30"/>${sweepingCatArt()}<ellipse class="cat-click-area" cx="4" cy="-29" rx="36" ry="44" fill="transparent"/><g class="cat-talk-hint" transform="translate(10 -87)"><rect x="-24" y="-10" width="48" height="20" rx="10" fill="#fff5ef" stroke="#d7a6b8"/><text y="4" text-anchor="middle" font-size="10" fill="#976c84">喵～</text></g></g>`;}
function openSweepingCat(){openModal(`<div class="sweeping-cat-dialog"><svg class="sweeping-cat-portrait" viewBox="-44 -84 100 120" role="img" aria-label="拿著掃把的草商掃地貓">${sweepingCatArt()}</svg><div class="cat-speech"><h2 id="dialog-title">阿樺大哥又割草了</h2></div></div>`);}
function campusShops(){
 const [fx,fy]=campusPoint(208,833),[hx,hy]=campusPoint(1361,896);
 return `<g class="campus-shops" aria-label="面向正門，左邊南臺灣土魠魚羹、右邊萊爾富"><g class="fish-soup-shop" role="button" tabindex="0" aria-label="查看南臺灣土魠魚羹商標" transform="translate(${fx} ${fy})"><path class="shop-hit-area" d="M-84-61 111-12 111 99-84 58Z"/><g transform="rotate(10)"><rect x="-75" y="-10" width="151" height="27" rx="2" fill="#d95165"/><image href="assets/nantaiwan-mark.svg" x="-71" y="-9" width="26" height="25"/><text x="14" y="8" text-anchor="middle" fill="#fffaf3" font-size="12" font-weight="800">南臺灣土魠魚羹</text></g></g><g class="hilife-store" transform="translate(${hx} ${hy})"><g transform="rotate(-8)"><text x="0" y="3" text-anchor="middle" fill="#ffffff" font-size="17" font-weight="800">萊爾富 Hi-Life</text></g></g></g>`;
}
function scooterArt(){return `<g class="scooter-model"><ellipse cy="13" rx="37" ry="8" fill="#4d6c5920"/>${[-24,25].map(x=>`<g transform="translate(${x} 10)"><g class="scooter-wheel"><circle r="7" fill="#526d70" stroke="#d3dfd1" stroke-width="2"/><path d="M-5 0H5M0-5V5m-3.5-3.5 7 7m-7 0 7-7" stroke="#e3dbbb" stroke-width="1"/><circle r="1.5" fill="#f4e4b7"/></g></g>`).join('')}<path d="M-24 8h42L25-27h-11" fill="none" stroke="#e7b44e" stroke-width="5" stroke-linecap="round"/><path d="M17 6 6-14" stroke="#5c8c90" stroke-width="4"/><g transform="translate(-2 -3) scale(.72)">${animal(0,0,'','rabbit')}</g><g class="npc-headband"><path d="M-14-41q12-12 25 0" stroke="#e2aa48" stroke-width="3" fill="none"/><rect x="-14" y="-50" width="28" height="13" rx="5" fill="#fff1a5" stroke="#d9ac51" stroke-width="1"/><text x="0" y="-40" text-anchor="middle" fill="#8a6e34" font-size="9" font-weight="800">客服</text></g></g>`;}
function campusNpc(){return `<g class="reward-npc campus-npc" id="reward-npc" role="button" tabindex="0" aria-label="呼叫中鼎文，校園客服" transform="translate(540 530)"><g class="npc-scooter">${scooterArt()}</g><g transform="translate(0 17)"><rect x="-33" y="-9" width="66" height="25" rx="12" fill="#fff5cc" stroke="#e7d9a7"/><text x="0" y="8" text-anchor="middle" fill="#8e794a" font-size="11">中鼎文</text></g></g>`;}
function renderCampusMap(){
 for(const d of departments){const spec=CAMPUS_BUILDINGS[d.id],place=CAMPUS_PLACES[spec.buildingId];Object.assign(d,spec,{side:place.side,polygons:place.polygons});[d.x,d.y]=campusPoint(...place.anchor);[d.labelX,d.labelY]=campusPoint(...spec.label);d.scale=1;}
 for(const place of Object.values(CAMPUS_PLACES))place.occlusion=[...place.polygons,...(place.canopies||[])].map(p=>p.map(([u,v])=>campusPoint(u,v)));
 let art=`<image id="campus-illustration" href="${CAMPUS_ART}" width="1240" height="815" preserveAspectRatio="none" aria-hidden="true"/><g id="central-courtyard" data-layout="oblique-reference" aria-hidden="true"></g>`;
 art+=Object.entries(CAMPUS_PLACES).sort((a,b)=>a[1].anchor[1]-b[1].anchor[1]).map(([id,place])=>schoolBuilding(id,place)).join('');
 const [gx,gy]=campusPoint(875,802),[sx,sy]=campusPoint(1136,718);
 art+=`<g id="campus-main-gate" data-open="true" transform="translate(${gx} ${gy})" aria-label="開放式校門"><title>開放式正門</title></g><g id="campus-side-school-name" transform="translate(${sx} ${sy}) rotate(-17)"><text y="4" text-anchor="middle" fill="#fff2ce" stroke="#744d3f" stroke-width=".3" paint-order="stroke" font-size="12.5" font-weight="800" letter-spacing="1">國立草屯商工</text></g>`;
 art+=campusShops()+`<g id="campus-students" aria-hidden="true"></g>`+sweepingCat()+campusNpc()+`<g id="campus-labels">${departments.map(campusDepartmentLabel).join('')}</g>`;
 $('#map-world').innerHTML=art;
 $$('[data-label-for]').forEach(el=>{el.onclick=()=>{if(!drag.moved){el.focus({preventScroll:true});openDepartment(el.dataset.labelFor);}};el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDepartment(el.dataset.labelFor);}};});
 const cat=$('#groundskeeper-cat');cat.onclick=()=>{if(!drag.moved){cat.focus();openSweepingCat();}};cat.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openSweepingCat();}};
}
