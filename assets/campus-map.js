'use strict';
// A playful interpretation of the supplied school photos; department locations
// are navigation assignments, not claims about actual classroom locations.
const CAMPUS_NODES=[[215,315],[460,318],[695,283],[355,493],[590,488],[820,463],[365,678],[720,648],[260,335],[460,335],[700,335],[950,335],[260,530],[540,530],[950,530],[260,705],[540,705],[950,705],[920,750],[700,530]];
const CAMPUS_EDGES=[[0,8],[1,9],[2,10],[3,12],[4,13],[5,14],[6,15],[6,16],[7,16],[7,14],[8,9],[9,10],[10,11],[8,12],[12,15],[11,14],[14,17],[12,13],[13,19],[19,14],[10,19],[13,16],[15,16],[16,17],[17,18]];
function campusRoute(from,to){const queue=[[from]],seen=new Set([from]);while(queue.length){const path=queue.shift(),last=path.at(-1);if(last===to)return path;for(const [a,b] of CAMPUS_EDGES){const next=a===last?b:b===last?a:null;if(next!==null&&!seen.has(next)){seen.add(next);queue.push([...path,next]);}}}return [from];}
function schoolBlock(u,v,w=116,d=40,h=54,roof='#3e647a'){
 const color='#fff0d2';let art=box(u,v,w,d,h,color);
 // Brick piers and two levels of windows on the long, cream-colored facade.
 for(let i=0;i<Math.floor(w/22);i++){
  const x=u+3+i*22;
  art+=poly([pt(x,v+d,0),pt(x+6,v+d,0),pt(x+6,v+d,h),pt(x,v+d,h)],'#bd725d');
  for(const z of [h-11,h-34])art+=poly([pt(x+8,v+d+.1,z),pt(x+18,v+d+.1,z),pt(x+18,v+d+.1,z-13),pt(x+8,v+d+.1,z-13)],'#89b7b2','stroke="#fff5dc" stroke-width="1.5"');
 }
 const a=pt(u,v,h),b=pt(u+w,v,h),c=pt(u+w,v+d,h),e=pt(u,v+d,h),ra=pt(u,v+d/2,h+18),rb=pt(u+w,v+d/2,h+18);
 art+=poly([a,b,rb,ra],shade(roof,15),'stroke="#f3ebd6" stroke-width="1"')+poly([ra,rb,c,e],roof,'stroke="#d4e0d4" stroke-width="1"');
 for(let i=8;i<w;i+=11)art+=`<path d="M${pt(u+i,v+d/2,h+18)}L${pt(u+i,v+d,h)}" stroke="#adc1c0" opacity=".28" stroke-width="1"/>`;
 return art;
}
function schoolBuilding(d){
 const sports=d.id==='sports';
 const art=sports?`<ellipse cy="-5" rx="102" ry="54" fill="#b57559"/><ellipse cy="-5" rx="92" ry="46" fill="#cd9270"/><ellipse cy="-5" rx="76" ry="34" fill="#9abf5b"/><ellipse cy="-5" rx="97" ry="50" fill="none" stroke="#fce7c4" stroke-width="1.5"/><ellipse cy="-5" rx="87" ry="42" fill="none" stroke="#fce7c4" stroke-width="1.5"/><path d="M-65-20v32H65v-32Z" fill="none" stroke="#eaf1c3" stroke-width="1"/><g transform="translate(0 -52) scale(.58)">${schoolBlock(-65,-35,124,35,42)}</g><g transform="translate(8 -2) scale(.48)">${departmentLandmark(d.id)}</g>`:`${schoolBlock(-63,-43,122,40,55)}<g class="building-feature" transform="translate(3 27) scale(.38)">${departmentLandmark(d.id)}</g><path d="M-63 35Q0 53 63 35" fill="none" stroke="#ebd5ae" stroke-width="12" stroke-linecap="round"/>`;
 return `<g class="campus-building" data-department="${d.id}" role="button" tabindex="0" aria-label="探索${d.name}，體驗小任務" transform="translate(${d.x} ${d.y}) scale(${d.scale})"><ellipse cy="20" rx="92" ry="28" fill="#54764f24" filter="url(#shadow)"/><g filter="url(#soft-shadow)">${art}</g><g class="building-sign" transform="translate(0 ${sports?66:76})"><rect class="label-bg" x="-91" y="-12" width="182" height="34" rx="13"/><circle cx="-69" cy="5" r="5" fill="${d.accent}"/><text text-anchor="middle" x="6" y="11" fill="#365e58" font-size="17" font-weight="700">${d.name}</text></g></g>`;
}
function schoolLibrary(){return `<g transform="translate(650 346)">${box(-39,-36,76,49,72,'#f5d4b3')}<path d="M-54-8 12 30v-62l-66-38Z" fill="#a2c8bd" stroke="#ebdfc7" stroke-width="4"/><path d="M-54-50 12-12m-66-19 66 38m-46-65V4m20-50V17M-54-8 12 30" fill="none" stroke="#779d99" stroke-width="2"/><path d="m-49-72 31-27 44 36-35 12Z" fill="#b8d5c5" stroke="#f8eed8" stroke-width="2"/><path d="m-18-99 9 48m-40-21 75 9" fill="none" stroke="#789996" stroke-width="1.5"/><text x="-7" y="51" text-anchor="middle" fill="#66816c" font-size="11">學習中庭</text></g>`;}
function campusShops(){
 // Use the original shop art without the former shore/sea: recreate a small block.
 const hilife=`<g class="hilife-store" transform="translate(28 590)"><path d="M-50-24H55l27-17v55L55 32-50 12Z" fill="#fff2d3" stroke="#dacfb0" stroke-width="2"/><path d="m55-24 27-17v55L55 32Z" fill="#d0d9c0"/><path d="m-56-30 111 0 36-20H-20Z" fill="#f7efd6"/><path d="M-51-27H57v22H-51Z" fill="#269bab"/><path d="M-51-27H57v5H-51Z" fill="#d94e52"/><text x="2" y="-11" text-anchor="middle" fill="white" font-size="12" font-weight="700">萊爾富 Hi-Life</text><path d="M-42 0h35v15h-35Zm48-1h26v26H6Z" fill="#9dc8b8" stroke="#e7dfbf" stroke-width="2"/></g>`;
 return `<g class="campus-shops" aria-label="校外店家">${hilife}${foodShopScenery().replace('translate(1002 108)','translate(165 640)')}<text x="115" y="718" fill="#8b8e73" font-size="10">校外散步・店家想像場景</text></g>`;
}
function scooterArt(){return `<g class="scooter-model"><ellipse cy="13" rx="37" ry="8" fill="#4d6c5920"/><circle cx="-24" cy="10" r="7" fill="#526d70" stroke="#d3dfd1" stroke-width="2"/><circle cx="25" cy="10" r="7" fill="#526d70" stroke="#d3dfd1" stroke-width="2"/><path d="M-24 8h42L25-27h-11" fill="none" stroke="#e7b44e" stroke-width="5" stroke-linecap="round"/><path d="M17 6 6-14" stroke="#5c8c90" stroke-width="4"/><g transform="translate(-2 -3) scale(.72)">${animal(0,0,'','rabbit')}</g><g class="npc-headband"><path d="M-14-41q12-12 25 0" stroke="#e2aa48" stroke-width="3" fill="none"/><rect x="-14" y="-50" width="28" height="13" rx="5" fill="#fff1a5" stroke="#d9ac51" stroke-width="1"/><text x="0" y="-40" text-anchor="middle" fill="#8a6e34" font-size="9" font-weight="800">客服</text></g></g>`;}
function campusNpc(){return `<g class="reward-npc campus-npc" id="reward-npc" role="button" tabindex="0" aria-label="呼叫中鼎文，校園客服" transform="translate(540 530)"><g class="npc-scooter">${scooterArt()}</g><g transform="translate(0 31)"><rect x="-67" y="-9" width="134" height="25" rx="12" fill="#fff5cc" stroke="#e7d9a7"/><text x="0" y="8" text-anchor="middle" fill="#8e794a" font-size="11">中鼎文・校園客服</text></g></g>`;}
function renderCampusMap(){
 const border=[[95,151],[715,77],[1104,328],[1042,745],[471,779],[64,499]];
 let art=poly(border.map(([x,y])=>[x,y+13]),'#a5b994')+poly(border,'#cbd8aa','stroke="#fff3cf" stroke-width="12" stroke-linejoin="round"');
 art+=`<path d="M-35 619Q176 793 469 782L1045 779" fill="none" stroke="#b7beb1" stroke-width="47"/><path d="M-35 619Q176 793 469 782L1045 779" fill="none" stroke="#f3efd3" stroke-width="2" stroke-dasharray="12 10"/>`;
 art+=`<path d="M466 491 775 509 796 642 470 600Z" fill="#97bb54" stroke="#e5d6b5" stroke-width="11"/><path d="M478 503 762 520 780 624 482 591Z" fill="#a8c969"/><g fill="#e6e6bc" opacity=".7"><ellipse cx="548" cy="537" rx="3" ry="1.5"/><ellipse cx="691" cy="554" rx="2" ry="1"/><ellipse cx="621" cy="526" rx="2" ry="1"/></g>`;
 for(const [a,b] of CAMPUS_EDGES){const p=CAMPUS_NODES[a],q=CAMPUS_NODES[b];art+=`<path d="M${p}L${q}" fill="none" stroke="#e6d7b4" stroke-width="23" stroke-linecap="round"/><path d="M${p}L${q}" fill="none" stroke="#fbefd6" stroke-width="1" opacity=".8"/>`;}
 art+=`<g transform="translate(544 142) scale(.8)">${schoolBlock(-90,-40,160,48,65)}<text x="0" y="43" text-anchor="middle" fill="#60806b" font-size="12">澄采樓・活動中心</text></g>${schoolLibrary()}`;
 for(const [x,y,k] of [[140,201,.7],[330,149,.65],[402,146,.7],[810,210,.75],[870,261,.65],[995,399,.7],[991,487,.7],[991,575,.7],[816,680,.65],[608,620,.55],[492,587,.55],[445,579,.55],[108,422,.7],[137,529,.75],[227,585,.55],[591,184,.5],[480,536,.45],[748,551,.45]])art+=`<g transform="translate(${x} ${y}) scale(${k})">${tree(0,0,1)}</g>`;
 art+=`<text x="630" y="584" text-anchor="middle" fill="#738f4e" font-size="11">中央草地</text><g transform="translate(615 627)"><ellipse cy="6" rx="22" ry="11" fill="#bac39e"/><path d="M-10 0q-9-20 9-25 20-4 18 17Q15 3 6-4q-6-5 2-10" fill="none" stroke="#fff6db" stroke-width="5"/></g>`;art+=departments.map(schoolBuilding).join('');
 art+=`<g transform="translate(920 740)"><path d="M-44-34V0m88-34V0" stroke="#bc735b" stroke-width="12"/><path d="M-54-41H54l12 10H-66Z" fill="#446c7e"/><text y="-22" text-anchor="middle" fill="#fff5d7" font-size="12" font-weight="700">國立草屯商工</text><path d="M-41 6h82" stroke="#fff8dc" stroke-width="4"/><text y="29" text-anchor="middle" fill="#6f866d" font-size="11">正門・芬草路</text></g><g transform="translate(280 112)"><path d="M-44-10H44" stroke="#506e77" stroke-width="7"/><text y="10" text-anchor="middle" fill="#71836a" font-size="10">北門・中投公路</text></g>`;
 art+=campusShops()+`<g id="campus-students" aria-hidden="true"></g>`+campusNpc();
 $('#map-world').innerHTML=art;
 $$('[data-department]').forEach(el=>{el.onclick=()=>{if(!drag.moved)openDepartment(el.dataset.department);};el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDepartment(el.dataset.department);}};});
}
