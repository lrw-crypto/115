'use strict';
// One campus courtyard, viewed from outside the main gate toward the rear hall.
// Department assignments are game navigation, not verified classroom locations.
const campusPoint=(u,v,z=0)=>[620+u*(.62+v*.00048+z*.0003),85+v*.9-z];
const CAMPUS_BUILDINGS={
 mechanical:{side:'left',row:0,u:-490,v:200,w:305,d:68},
 piping:{side:'right',row:0,u:185,v:200,w:305,d:68},
 business:{side:'left',row:1,u:-490,v:370,w:305,d:68},
 data:{side:'right',row:1,u:185,v:370,w:305,d:68},
 english:{side:'left',row:2,u:-490,v:540,w:305,d:68},
 service:{side:'right',row:2,u:185,v:540,w:305,d:68},
 accounting:{side:'rear',u:-82,v:75,w:164,d:65},
 sports:{side:'field',u:-625,v:15,w:0,d:0}
};
const CAMPUS_NODE_UV=[[-165,245],[165,245],[-165,415],[0,155],[165,415],[-165,585],[165,585],[-625,120],[-155,155],[155,155],[-155,245],[155,245],[-155,415],[155,415],[-155,585],[155,585],[0,415],[-155,650],[155,650],[0,650],[0,690],[-625,155],[-540,155]];
const CAMPUS_NODES=CAMPUS_NODE_UV.map(([u,v])=>campusPoint(u,v));
const CAMPUS_EDGES=[[0,10],[1,11],[2,12],[3,8],[3,9],[4,13],[5,14],[6,15],[7,21],[21,22],[22,8],[8,10],[9,11],[10,12],[11,13],[12,14],[13,15],[12,16],[16,13],[14,17],[15,18],[17,19],[19,18],[19,20]];
function campusRoute(from,to){const queue=[[from]],seen=new Set([from]);while(queue.length){const path=queue.shift(),last=path.at(-1);if(last===to)return path;for(const [a,b] of CAMPUS_EDGES){const next=a===last?b:b===last?a:null;if(next!==null&&!seen.has(next)){seen.add(next);queue.push([...path,next]);}}}return [from];}
// Both wings share world coordinates. Their inward gables are built separately,
// rather than flipping an SVG (which would also reverse doors, logos and text).
function campusBlock(s,{glass=false,decorative=false}={}){
 const {u,v,w,d,side}=s,h=glass?98:74,P=campusPoint;
 const face=(a,b,c,e,color,attrs='')=>poly([P(...a),P(...b),P(...c),P(...e)],color,attrs);
 let art=face([u,v+d,0],[u+w,v+d,0],[u+w,v+d,h],[u,v+d,h],'#ffe8bc');
 const inner=side==='left'?u+w:u,outer=side==='left'?u:u+w;
 art+=face([outer,v,0],[outer,v+d,0],[outer,v+d,h],[outer,v,h],'#c56c59');
 art+=`<g class="inward-facade" data-facing="${side==='left'?'right':side==='right'?'left':'front'}">`;
 art+=face([inner,v,0],[inner,v+d,0],[inner,v+d,h],[inner,v,h],'#ed9a7c');
 if(!glass){
  // Two bright window bands and a sheltered ground-floor corridor.
  for(let x=u+7;x<u+w-10;x+=32){
   art+=face([x,v+d,0],[x+7,v+d,0],[x+7,v+d,h],[x,v+d,h],'#e6795b');
   for(const z of [h-8,h-30])art+=face([x+9,v+d+.1,z],[x+27,v+d+.1,z],[x+27,v+d+.1,z-13],[x+9,v+d+.1,z-13],'#78c9db','stroke="#fff6d8" stroke-width="1.5"');
   art+=face([x+9,v+d+.2,18],[x+27,v+d+.2,18],[x+27,v+d+.2,0],[x+9,v+d+.2,0],'#688e96');
  }
  for(const z of [21,43])art+=`<path d="M${P(u,v+d+.3,z)}L${P(u+w,v+d+.3,z)}" stroke="#fff5d7" stroke-width="3"/>`;
  // The entrance and upper window are on the end facing the central lawn.
  art+=face([inner,v+d*.38,0],[inner,v+d*.72,0],[inner,v+d*.72,23],[inner,v+d*.38,23],'#3e8298');
  art+=face([inner,v+d*.35,36],[inner,v+d*.74,36],[inner,v+d*.74,51],[inner,v+d*.35,51],'#97e6de','stroke="#fff4d9" stroke-width="2"');
 }
 art+='</g>';
 if(glass){
  art+=face([u+17,v+d+.2,3],[u+w-17,v+d+.2,3],[u+w-17,v+d+.2,77],[u+17,v+d+.2,77],'#73cdd4','stroke="#e6f8db" stroke-width="3"');
  for(let x=u+17;x<=u+w-17;x+=26)art+=`<path d="M${P(x,v+d+.3,3)}L${P(x,v+d+.3,77)}" stroke="#d4eedd" stroke-width="2"/>`;
  for(const z of [20,40,60])art+=`<path d="M${P(u+17,v+d+.4,z)}L${P(u+w-17,v+d+.4,z)}" stroke="#d4eedd" stroke-width="2"/>`;
  art+=face([u,v+d+.6,98],[u+w,v+d+.6,98],[u+w,v+d+.6,81],[u,v+d+.6,81],'#e68166');
 }else{
  const gable=side==='left'?u+w:u;
  art+=poly([P(gable,v,h),P(gable,v+d,h),P(gable,v+d/2,h+20)],'#ffe7ba','stroke="#fff3d1" stroke-width="2"');
  art+=`<circle cx="${P(gable,v+d/2,h+7)[0]}" cy="${P(gable,v+d/2,h+7)[1]}" r="3.5" fill="#4d9ca3"/>`;
 }
 const a=P(u-5,v-6,h),b=P(u+w+5,v-6,h),c=P(u+w+5,v+d+6,h),e=P(u-5,v+d+6,h),ra=P(u-5,v+d/2,h+20),rb=P(u+w+5,v+d/2,h+20);
 art+=`<g class="school-roof" data-ridge="across-courtyard">${poly([a,b,rb,ra],'#6087a0','stroke="#d3e0d3" stroke-width="1.5"')}${poly([ra,rb,c,e],'#335f7c','stroke="#dce8d6" stroke-width="1.5"')}`;
 for(let x=u;x<u+w;x+=14)art+=`<path d="M${P(x,v+d/2,h+20)}L${P(x,v+d+6,h)}" stroke="#8baeb9" stroke-width="1" opacity=".6"/>`;
 art+='</g>';
 if(glass){const roof=P(0,v+d/2,h+20);art+=`<path d="m${roof[0]-22} ${roof[1]-4} 22-22 22 22Z" fill="#b6eef0" stroke="#eef9d8" stroke-width="3"/>`;}
 return `<g class="school-block ${decorative?'rear-connector':''}" data-side="${side}" ${s.row===undefined?'':`data-row="${s.row}"`}>${art}</g>`;
}
function schoolBuilding(d){
 const sports=d.id==='sports',rear=d.side==='rear';
 let art;
 if(sports){art=`<ellipse cy="-4" rx="127" ry="61" fill="#d35c43" stroke="#fff0bc" stroke-width="4"/><ellipse cy="-4" rx="118" ry="53" fill="#f29d62"/><ellipse cy="-4" rx="96" ry="37" fill="#76c73d"/><ellipse cy="-4" rx="123" ry="57" fill="none" stroke="#fff0c7" stroke-width="1.5"/><ellipse cy="-4" rx="110" ry="46" fill="none" stroke="#fff0c7" stroke-width="1.5"/><path d="M-73-28v47H73v-47Z" fill="none" stroke="#e9f4b8" stroke-width="1.5"/><g transform="translate(0 -8) scale(.44)">${departmentLandmark(d.id)}</g>`;}
 else{
  art=`<g transform="translate(${-d.x} ${-d.y})">${campusBlock(d,{glass:rear})}</g>`;
  const landmark=campusPoint(d.u+d.w*(d.side==='left'?.33:.67),d.v+d.d*.7,rear?112:82);
  art+=`<g class="department-model" transform="translate(${landmark[0]-d.x} ${landmark[1]-d.y}) scale(${rear?.48:.64})">${departmentLandmark(d.id)}</g>`;
 }
 const labelY=sports?75:rear?25:-20;
 return `<g class="campus-building" data-department="${d.id}" data-campus-side="${d.side}" role="button" tabindex="0" aria-label="探索${d.name}，體驗小任務" transform="translate(${d.x} ${d.y})"><g filter="url(#soft-shadow)">${art}</g><g class="building-sign" transform="translate(0 ${labelY})"><rect class="label-bg" x="-91" y="-12" width="182" height="34" rx="13"/><circle cx="-69" cy="5" r="5" fill="${d.accent}"/><text text-anchor="middle" x="6" y="11" fill="#245a64" font-size="17" font-weight="700">${d.name}</text></g></g>`;
}
function campusShops(){
 const hilife=`<g class="hilife-store" transform="translate(890 762)"><path d="M-50-24H55l27-17v55L55 32-50 12Z" fill="#fff2d3" stroke="#dacfb0" stroke-width="2"/><path d="m55-24 27-17v55L55 32Z" fill="#d0d9c0"/><path d="m-56-30 111 0 36-20H-20Z" fill="#f7efd6"/><path d="M-51-27H57v22H-51Z" fill="#269bab"/><path d="M-51-27H57v5H-51Z" fill="#d94e52"/><text x="2" y="-11" text-anchor="middle" fill="white" font-size="12" font-weight="700">萊爾富 Hi-Life</text><path d="M-42 0h35v15h-35Zm48-1h26v26H6Z" fill="#9dc8b8" stroke="#e7dfbf" stroke-width="2"/></g>`;
 return `<g class="campus-shops" aria-label="面向正門，左邊南臺灣土魠魚羹、右邊萊爾富">${foodShopScenery().replace('translate(1002 108)','translate(330 753)')}${hilife}<text x="620" y="802" text-anchor="middle" fill="#65805b" font-size="11">面向校園：左・南臺灣土魠魚羹 ｜ 右・萊爾富</text></g>`;
}
function scooterArt(){return `<g class="scooter-model"><ellipse cy="13" rx="37" ry="8" fill="#4d6c5920"/><circle cx="-24" cy="10" r="7" fill="#526d70" stroke="#d3dfd1" stroke-width="2"/><circle cx="25" cy="10" r="7" fill="#526d70" stroke="#d3dfd1" stroke-width="2"/><path d="M-24 8h42L25-27h-11" fill="none" stroke="#e7b44e" stroke-width="5" stroke-linecap="round"/><path d="M17 6 6-14" stroke="#5c8c90" stroke-width="4"/><g transform="translate(-2 -3) scale(.72)">${animal(0,0,'','rabbit')}</g><g class="npc-headband"><path d="M-14-41q12-12 25 0" stroke="#e2aa48" stroke-width="3" fill="none"/><rect x="-14" y="-50" width="28" height="13" rx="5" fill="#fff1a5" stroke="#d9ac51" stroke-width="1"/><text x="0" y="-40" text-anchor="middle" fill="#8a6e34" font-size="9" font-weight="800">客服</text></g></g>`;}
function campusNpc(){return `<g class="reward-npc campus-npc" id="reward-npc" role="button" tabindex="0" aria-label="呼叫中鼎文，校園客服" transform="translate(540 530)"><g class="npc-scooter">${scooterArt()}</g><g transform="translate(0 31)"><rect x="-67" y="-9" width="134" height="25" rx="12" fill="#fff5cc" stroke="#e7d9a7"/><text x="0" y="8" text-anchor="middle" fill="#8e794a" font-size="11">中鼎文・校園客服</text></g></g>`;}
function renderCampusMap(){
 for(const d of departments){const s=CAMPUS_BUILDINGS[d.id];Object.assign(d,s);[d.x,d.y]=campusPoint(s.u+s.w/2,s.v+s.d);d.scale=1;}
 const P=campusPoint,corners=[[-900,-20],[900,-20],[600,690],[-600,690]].map(([u,v])=>P(u,v));
 let art=poly(corners.map(([x,y])=>[x,y+12]),'#79a750')+poly(corners,'#a8d65d','stroke="#fff0b8" stroke-width="10" stroke-linejoin="round"');
 art+=`<path d="M60 740H1180" stroke="#89a09a" stroke-width="53" stroke-linecap="round"/><path d="M60 740H1180" stroke="#fff4d4" stroke-width="2" stroke-dasharray="17 14"/>`;
 const lawn=[[-130,165],[130,165],[130,625],[-130,625]].map(([u,v])=>P(u,v));
 art+=`<g id="central-courtyard" data-layout="single-u">${poly(lawn,'#72c437','stroke="#f5df9a" stroke-width="10"')}`;
 for(let v=165;v<625;v+=46)art+=poly([P(-125,v),P(125,v),P(125,Math.min(v+22,620)),P(-125,Math.min(v+22,620))],'#89d348');
 art+=`<text x="620" y="405" text-anchor="middle" fill="#4c982d" font-size="16" font-weight="700" letter-spacing="3">中央草地</text><text x="620" y="426" text-anchor="middle" fill="#5b9e37" font-size="9" letter-spacing="2">一起發現你的方向</text></g>`;
 for(const [a,b] of CAMPUS_EDGES){art+=`<path d="M${CAMPUS_NODES[a]}L${CAMPUS_NODES[b]}" fill="none" stroke="#f1d59b" stroke-width="22" stroke-linecap="round"/><path d="M${CAMPUS_NODES[a]}L${CAMPUS_NODES[b]}" stroke="#fff2cf" stroke-width="1"/>`;}
 art+=`<g id="rear-campus-wing" aria-label="後方校舍連接左右翼">${campusBlock({u:-490,v:75,w:408,d:65,side:'left'},{decorative:true})}${campusBlock({u:82,v:75,w:408,d:65,side:'right'},{decorative:true})}</g>`;
 // Rear sports field and small activity centre follow the supplied overview.
 art+=`<g id="activity-center" transform="translate(1035 106)"><path d="M-83-10H70v54H-83Z" fill="#f2c18d"/><path d="m-93-10 30-43H50l32 43Z" fill="#3c6b89" stroke="#d9e6cf" stroke-width="3"/><path d="M-52 44V6H38v38" fill="#7bcbd2" stroke="#fff3cd" stroke-width="4"/><text x="-7" y="62" text-anchor="middle" fill="#49764c" font-size="12">漾采樓・活動中心</text></g>`;
 const trees=[];
 for(const v of [175,330,500,640])for(const u of [-132,132])trees.push([u,v,.65]);
 for(const v of [200,365,535,650])for(const u of [-555,555])trees.push([u,v,.83]);

 for(const [u,v,size]of trees){const [x,y]=P(u,v);art+=`<g class="campus-tree" transform="translate(${x} ${y}) scale(${size})">${tree(0,0,1)}</g>`;}
 art+=[...departments].sort((a,b)=>a.y-b.y).map(schoolBuilding).join('');
 // A small campus sculpture beside the entrance, without obstructing the lawn.
 art+=`<g transform="translate(463 666)"><ellipse cy="8" rx="22" ry="9" fill="#8da978"/><path d="M-10 0q-9-20 9-25 20-4 18 17Q15 3 6-4q-6-5 2-10" fill="none" stroke="#fff3c7" stroke-width="6"/></g>`;
 const frontGate=P(0,690);
 art+=`<g id="campus-main-gate" transform="translate(${frontGate})"><path d="M-66-33V4m132-37V4" stroke="#e9794e" stroke-width="13"/><path d="M-77-43H77l14 14H-91Z" fill="#235d7e" stroke="#cadfcb" stroke-width="2"/><rect x="-65" y="-31" width="130" height="21" fill="#e98e5d"/><text y="-16" text-anchor="middle" fill="#fff8d1" font-size="14" font-weight="800">國立草屯商工</text><path d="M-58 12h116" stroke="#fff7d9" stroke-width="5"/><text y="38" text-anchor="middle" fill="#456c57" font-size="12">正門・芬草路</text></g>`;
 art+=campusShops()+`<g id="campus-students" aria-hidden="true"></g>`+campusNpc();
 $('#map-world').innerHTML=art;
 const labels=document.createElementNS('http://www.w3.org/2000/svg','g');labels.id='campus-labels';
 for(const d of departments){const building=$(`[data-department="${d.id}"]`),sign=building.querySelector('.building-sign');const wrapper=document.createElementNS('http://www.w3.org/2000/svg','g');wrapper.setAttribute('class','campus-map-label');wrapper.setAttribute('aria-hidden','true');wrapper.setAttribute('transform',`translate(${d.x} ${d.y}) scale(${d.scale})`);wrapper.dataset.labelFor=d.id;wrapper.append(sign);wrapper.onclick=()=>{if(!drag.moved)openDepartment(d.id);};labels.append(wrapper);}
 $('#map-world').append(labels);
 $$('[data-department]').forEach(el=>{el.onclick=()=>{if(!drag.moved)openDepartment(el.dataset.department);};el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDepartment(el.dataset.department);}};});
}
