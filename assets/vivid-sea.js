'use strict';

function installVividSceneDefs(){
 const defs=$('#island-map defs');
 defs.querySelector('#student-skin')?.remove();defs.querySelector('#student-hair')?.remove();defs.querySelector('#uniform-blue')?.remove();
 const gradients=`
 <radialGradient id="student-skin" cx="32%" cy="25%" r="78%"><stop stop-color="#ffeac0"/><stop offset=".56" stop-color="#f4bc77"/><stop offset="1" stop-color="#d58a48"/></radialGradient>
 <linearGradient id="student-hair" x2=".8" y2="1"><stop stop-color="#5b5d42"/><stop offset=".4" stop-color="#30372a"/><stop offset="1" stop-color="#141f1a"/></linearGradient>
 <linearGradient id="uniform-blue" x2="1" y2=".6"><stop stop-color="#48b5ee"/><stop offset=".45" stop-color="#167bc4"/><stop offset="1" stop-color="#155185"/></linearGradient>
 <linearGradient id="shirt-material" x2="1" y2=".8"><stop stop-color="#fffef2"/><stop offset=".6" stop-color="#fff3d5"/><stop offset="1" stop-color="#d9d0ae"/></linearGradient>
 <linearGradient id="sunny-plaza" x2=".7" y2="1"><stop stop-color="#fff9e3"/><stop offset=".5" stop-color="#fce6ac"/><stop offset="1" stop-color="#eac68c"/></linearGradient>
 <radialGradient id="leaf-light" cx="30%" cy="24%" r="80%"><stop stop-color="#d1f35a"/><stop offset=".45" stop-color="#9bd635"/><stop offset="1" stop-color="#549e22"/></radialGradient>
 <radialGradient id="leaf-shadow" cx="30%" cy="20%" r="80%"><stop stop-color="#a9e846"/><stop offset=".6" stop-color="#65bc28"/><stop offset="1" stop-color="#358c28"/></radialGradient>
 <linearGradient id="metal-material" x2=".7" y2="1"><stop stop-color="#effcf1"/><stop offset=".22" stop-color="#addbd5"/><stop offset=".5" stop-color="#f8fff3"/><stop offset="1" stop-color="#659fa9"/></linearGradient>
 <linearGradient id="calculator-material" x2=".7" y2="1"><stop stop-color="#e4c5ff"/><stop offset=".55" stop-color="#ba88ec"/><stop offset="1" stop-color="#9354c3"/></linearGradient>
 <linearGradient id="screen-frame" x2="1" y2="1"><stop stop-color="#85e6f5"/><stop offset=".45" stop-color="#1cb1db"/><stop offset="1" stop-color="#1476b9"/></linearGradient>
 <linearGradient id="screen-dark" x2=".8" y2="1"><stop stop-color="#274e78"/><stop offset="1" stop-color="#10324f"/></linearGradient>
 <radialGradient id="globe-material" cx="25%" cy="22%" r="77%"><stop stop-color="#bdf4ff"/><stop offset=".45" stop-color="#39c6ee"/><stop offset="1" stop-color="#1574c1"/></radialGradient>
 <linearGradient id="desk-material" x2=".7" y2="1"><stop stop-color="#e9e4b9"/><stop offset=".5" stop-color="#cbbf90"/><stop offset="1" stop-color="#a78c60"/></linearGradient>
 <linearGradient id="boat-hull" x2="0" y2="1"><stop stop-color="#fffdf3"/><stop offset=".4" stop-color="#edfaff"/><stop offset="1" stop-color="#abc9d6"/></linearGradient>
 <linearGradient id="boat-side" x2="1" y2="1"><stop stop-color="#ffbe44"/><stop offset=".6" stop-color="#f27535"/><stop offset="1" stop-color="#b74326"/></linearGradient>
 <linearGradient id="boat-glass" x2=".5" y2="1"><stop stop-color="#bdf4ff"/><stop offset=".5" stop-color="#53c5e4"/><stop offset="1" stop-color="#217ea9"/></linearGradient>
 <filter id="model-depth" x="-35%" y="-40%" width="180%" height="190%"><feDropShadow dx="4" dy="8" stdDeviation="3" flood-color="#244d65" flood-opacity=".27"/></filter>
 <pattern id="vivid-water" width="96" height="56" patternUnits="userSpaceOnUse"><path d="m3 22 14-3 17 2m20 25 13-4 20 2" fill="none" stroke="#b6ffff" stroke-width="2" opacity=".17"/><path d="m30 9 12-2 10 2m-47 35 9-2 7 1" fill="none" stroke="#0c97c4" stroke-width="3" opacity=".18"/></pattern>
 ${islands.map(d=>`<linearGradient id="island-wall-${d.id}" x2=".8" y2="1"><stop stop-color="${d.accent}"/><stop offset=".25" stop-color="${shade(d.accent,15)}"/><stop offset="1" stop-color="${shade(d.accent,-45)}"/></linearGradient>`).join('')}`;
 defs.insertAdjacentHTML('beforeend',gradients);
}
function vividMaterial(body){
 const materials={'#cdc0db':'url(#calculator-material)','#a399bb':'#8056b9','#80aeb1':'url(#screen-frame)','#365c66':'url(#screen-dark)','#345d5d':'url(#screen-dark)','#a9bca9':'#52769a','#92cacc':'url(#globe-material)','#b6d18f':'#9bdb41','#b7c9ba':'url(#desk-material)','#d2d9cf':'url(#metal-material)','#bccdc2':'url(#metal-material)','#b8cbd0':'url(#metal-material)','#c2cbc2':'url(#metal-material)','#7daeb0':'#2eaecb','#6e9d99':'#208db2','#548e8d':'#136b95','#81aa9b':'#20a5a5','#d9786d':'#fa6554','#e8bb70':'#ffbf33','#f1cf83':'#ffcf49','#d59777':'#f5814f','#b7cc8d':'#93d448','#91b7c2':'#40baeb','#72a1b1':'#2285c6','#90bcb9':'#48bfc7','#78a5ac':'#2596b3','#adc196':'#9dcc3f','#7da78b':'#64a53b','#e9a58b':'#ff7c6a','#a8d5a2':'#6bec99'};
 return body.replace(/#[0-9a-fA-F]{6}/g,color=>materials[color.toLowerCase()]||color);
}
function campusStudio(id){
 const d=islands.find(x=>x.id===id);
 return `<g class="campus-studio" filter="url(#soft-shadow)">${box(-60,-64,76,34,35,'#fff8df',d.accent)}<path d="M-58-58 13-23" stroke="#fffdf0" stroke-width="3" opacity=".5"/>${poly([pt(-57,-30,12),pt(11,-30,12),pt(11,-30,17),pt(-57,-30,17)],d.accent)}<g transform="translate(-62 7)"><circle r="8" fill="${d.accent}"/><circle cx="-2" cy="-3" r="2" fill="#fff9dc" opacity=".65"/></g></g>`;
}

function speedboatArt(){return `<g class="speedboat-model">
 <g class="boat-wake" fill="none" stroke-linecap="round"><path d="M-47-3q-28-16-62-8m62 14q-28 16-62 8" stroke="#ddffff" stroke-width="4" opacity=".8"/><path d="M-49 0h-53m25-22-16-4m16 48-16 4" stroke="#a9f3ff" stroke-width="2" opacity=".7"/></g>
 <ellipse cx="-1" cy="13" rx="54" ry="12" fill="#075d9f" opacity=".15"/>
 <path d="M-45-8Q-4-28 55-4Q37 25-38 22L-49 8Z" fill="url(#boat-side)" stroke="#bd5b2e" stroke-width="1"/>
 <path d="M-45-13Q0-32 55-8Q28 15-43 13L-51 2Z" fill="url(#boat-hull)" stroke="#fff8dc" stroke-width="2"/>
 <path d="M-43 8Q8 10 42-2" fill="none" stroke="#ffb73d" stroke-width="4"/>
 <path d="m-22-15 30-5 22 9-15 10-38-2Z" fill="#fff9df" stroke="#d4e7e5" stroke-width="1"/>
 <path d="m4-20 18 7-8 8-12-4Z" fill="url(#boat-glass)" stroke="#8ec9d6" stroke-width="1.5"/>
 <path d="m-36-6 12 0 0 12-12-1Z" fill="#faa85b"/><path d="M-43-5v14" stroke="#616d73" stroke-width="6" stroke-linecap="round"/>
 <g class="boat-driver" transform="translate(-6 -9) scale(.43)">${animal(0,0,'','rabbit')}</g>
 <path d="m31-14 8 3" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
 </g>`;}

// A smooth outer-water patrol: clear of all eight hexagons and the shoreline.
const NPC_SEA_WAYPOINTS=[[430,200],[450,174],[650,185],[870,205],[1015,265],[1070,390],[1060,470],[1030,410],[980,290],[860,212],[650,190],[450,185],[300,225],[180,340],[95,470],[52,620],[70,715],[125,750],[250,748],[320,725],[305,745],[130,755],[65,700],[65,530],[140,375],[250,260]];
function boatRoutePath(){
 const points=NPC_SEA_WAYPOINTS;let d=`M${points[0][0]} ${points[0][1]}`;
 for(let i=0;i<points.length;i++){
  const a=points[(i-1+points.length)%points.length],b=points[i],c=points[(i+1)%points.length],e=points[(i+2)%points.length];
  d+=`C${b[0]+(c[0]-a[0])/6} ${b[1]+(c[1]-a[1])/6} ${c[0]-(e[0]-b[0])/6} ${c[1]-(e[1]-b[1])/6} ${c[0]} ${c[1]}`;
 }return d+'Z';
}
let boatController=null;
function initNpcBoat(){
 const route=$('#npc-sea-route'),boat=$('#reward-npc'),model=boat.querySelector('.boat-turn');
 const length=route.getTotalLength();let distance=0,hovered=false;
 const controller={paused:walkingController?.paused||false,speed:76,position:null,
  advance(seconds){if(this.paused||hovered)return;distance=(distance+seconds*this.speed)%length;this.paint();},
  paint(){const p=route.getPointAtLength(distance),ahead=route.getPointAtLength((distance+2)%length);const angle=Math.atan2(ahead.y-p.y,ahead.x-p.x)*180/Math.PI;this.position={x:p.x,y:p.y};boat.setAttribute('transform',`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`);model.setAttribute('transform',`rotate(${angle.toFixed(1)}) scale(.67)`);model.querySelector('.boat-driver').setAttribute('transform',`translate(-6 -9) rotate(${-angle.toFixed(1)}) scale(.43)`);boat.dataset.seaX=p.x.toFixed(2);boat.dataset.seaY=p.y.toFixed(2);},
  route,length};
 boat.addEventListener('pointerenter',()=>hovered=true);boat.addEventListener('pointerleave',()=>hovered=false);boat.addEventListener('focus',()=>hovered=true);boat.addEventListener('blur',()=>hovered=false);
 boat.addEventListener('pointerdown',()=>hovered=true);boat.addEventListener('pointerup',()=>setTimeout(()=>hovered=boat.matches(':hover,:focus'),350));
 boatController=controller;controller.paint();
}
function updateNpcBoat(seconds){boatController?.advance(seconds);}
