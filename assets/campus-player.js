'use strict';
let campusPlayerProfile=null,campusPlayerNode=9,campusPlayerFrame=null,campusPlayerSerial=0,campusPlayerPosition=null,campusPlayerSegment=null,campusPlayerDistance=0,campusPlayerHeading=1;
const CAMPUS_PLAYER_STOPS={accounting:1,business:1,data:1,service:5,mechanical:21,piping:20,english:21,sports:47};
// Reuse the school's existing students; only the player's backpack/straps
// distinguish this avatar, so the other roaming students stay unchanged.
function campusPlayerArt(gender){
 const girl=gender==='girl',color=girl?'#e795b6':'#66b4dc',dark=girl?'#ae5d87':'#3b7eaa';
 const bag=`<g class="player-backpack" aria-hidden="true"><path d="M-9-20q0-7 7-7h12q7 0 7 7V0q-11 5-25 0Z" fill="${color}" stroke="${dark}" stroke-width="1.4"/><path d="M-2-27v-4h8v4" fill="none" stroke="${dark}" stroke-width="2.5"/><rect x="9" y="-20" width="13" height="18" rx="5" fill="${color}" stroke="${dark}" stroke-width="1.3"/><path d="M11-10h8" stroke="#fff6dd" stroke-width="1.5"/><circle cx="15" cy="-14" r="2" fill="#ffe39c"/></g>`;
 const straps=`<g class="player-backpack-straps" fill="none" stroke="${dark}" stroke-width="2.5" stroke-linecap="round"><path d="M-8-22q-3 6-1 12M8-22q3 6 1 12"/></g>`;
 return animal(0,0,'',girl?'cat':'bear','smile').replace('<g class="friend-bob">',`<g class="friend-bob">${bag}`).replace('<circle cx="4" cy="-15"',`${straps}<circle cx="4" cy="-15"`);
}
function validCampusNickname(value){return /^(?:[\p{Script=Han}]{1,3}|[A-Za-z]{1,6})$/u.test(value);}
function chooseCampusPlayer(after){
 openModal(`<h2 id="dialog-title">選擇角色與暱稱</h2><p class="player-walk-instruction">點選科別後，自動走到探索入口</p><div class="player-choices">${['boy','girl'].map(g=>`<button type="button" data-player-gender="${g}" aria-pressed="${(campusPlayerProfile?.gender||'boy')===g}"><svg viewBox="-30 -65 60 80" aria-hidden="true">${campusPlayerArt(g)}</svg>${g==='boy'?'男生角色':'女生角色'}</button>`).join('')}</div><label for="player-name">暱稱（中文最多 3 字／英文最多 6 字）</label><input id="player-name" maxlength="6" autocomplete="off" aria-describedby="player-name-error" placeholder="輸入暱稱" value="${esc(campusPlayerProfile?.name||'')}"><p id="player-name-error" class="player-name-error" role="alert" hidden></p><small class="player-storage-note">角色與暱稱保存在此瀏覽器。</small><button class="primary-btn" id="player-start">進入校園 →</button>`);
 let gender=campusPlayerProfile?.gender||'boy';$$('[data-player-gender]').forEach(b=>b.onclick=()=>{gender=b.dataset.playerGender;$$('[data-player-gender]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});
 $('#player-name').oninput=()=>{$('#player-name').removeAttribute('aria-invalid');$('#player-name-error').hidden=true;};
 $('#player-start').onclick=()=>{
  const name=$('#player-name').value.trim();
  if(!validCampusNickname(name)){$('#player-name').setAttribute('aria-invalid','true');$('#player-name-error').textContent='請輸入中文 1～3 字或英文 1～6 字。';$('#player-name-error').hidden=false;$('#player-name').focus();return;}
  campusPlayerProfile={gender,name};try{localStorage.setItem('caotun-player-v1',JSON.stringify(campusPlayerProfile));}catch{}closeModal();paintCampusPlayer();if(after)after();
 };
}
function paintCampusPlayer(position=campusPlayerPosition||CAMPUS_NODES[campusPlayerNode],moving=false){
 let el=$('#campus-player');if(!el){el=document.createElementNS('http://www.w3.org/2000/svg','g');el.id='campus-player';el.style.pointerEvents='none';$('#map-world').append(el);}
 if(!campusPlayerProfile)return;
 const previous=campusPlayerPosition;campusPlayerPosition=[...position];if(moving&&previous){const dx=position[0]-previous[0];campusPlayerDistance+=Math.hypot(dx,position[1]-previous[1]);if(Math.abs(dx)>.01)campusPlayerHeading=dx<0?-1:1;}
 const labelWidth=Math.max(56,Array.from(campusPlayerProfile.name).length*10+20);
 if(el.dataset.profile!==JSON.stringify(campusPlayerProfile)){el.dataset.profile=JSON.stringify(campusPlayerProfile);el.innerHTML=`<ellipse rx="13" ry="5" fill="#ffcd6488" stroke="#c47b28"/><g class="player-body" transform="scale(.8)">${campusPlayerArt(campusPlayerProfile.gender)}</g><rect class="player-nameplate" x="${-labelWidth/2}" y="-74" width="${labelWidth}" height="21" rx="10" fill="#fff7da" stroke="#d3a555"/><text class="player-nickname" y="-60" text-anchor="middle" font-size="10" fill="#765029">${esc(campusPlayerProfile.name)}</text>`;}
 el.setAttribute('role','img');el.setAttribute('aria-label',`${campusPlayerProfile.name}的${campusPlayerProfile.gender==='girl'?'女生':'男生'}角色，背著小書包`);
 const body=el.querySelector('.player-body');body.setAttribute('transform',`translate(0 -7.52) scale(${campusPlayerHeading*.8} .8)`);
 const swing=moving?Math.sin(campusPlayerDistance/16*Math.PI*2):0;for(const [selector,angle,pivot]of [['.step-left',swing*18,'-5 -5'],['.step-right',-swing*18,'5 -5'],['.arm-left',-swing*12,'-9 -17'],['.arm-right',swing*12,'9 -17']])el.querySelector(selector).setAttribute('transform',`rotate(${angle} ${pivot})`);
 el.setAttribute('transform',`translate(${position[0]} ${position[1]})`);el.classList.toggle('player-walking',moving);
 $('#player-profile').textContent=campusPlayerProfile.name;$('#player-profile').setAttribute('aria-label',`${campusPlayerProfile.name}，更換角色或暱稱`);$('#player-profile').title='更換角色或暱稱';
}
function cancelCampusPlayerWalk(){campusPlayerSerial++;if(campusPlayerFrame!==null)cancelAnimationFrame(campusPlayerFrame);campusPlayerFrame=null;$('#campus-player')?.classList.remove('player-walking');$('#player-travel')?.remove();if(campusPlayerProfile)paintCampusPlayer();}
function walkCampusPlayer(id){
 const d=departments.find(x=>x.id===id);if(!d)return;const origin=$('#modal-backdrop').hidden?document.activeElement:modalOrigin;
 closeModal();showView('map');modalOrigin=origin;cancelCampusPlayerWalk();const serial=campusPlayerSerial;
 const target=CAMPUS_PLAYER_STOPS[id],start=campusPlayerPosition||CAMPUS_NODES[campusPlayerNode];
 // A cancelled journey can stop between nodes. Continue from that exact point
 // via either endpoint of the same validated edge, never across a courtyard.
 const endpoints=campusPlayerSegment?[campusPlayerSegment.from,campusPlayerSegment.to]:[campusPlayerNode];
 const options=endpoints.map(node=>{const path=campusRoute(node,target);let length=Math.hypot(start[0]-CAMPUS_NODES[node][0],start[1]-CAMPUS_NODES[node][1]);for(let i=1;i<path.length;i++)length+=Math.hypot(CAMPUS_NODES[path[i]][0]-CAMPUS_NODES[path[i-1]][0],CAMPUS_NODES[path[i]][1]-CAMPUS_NODES[path[i-1]][1]);return{path,length}}).filter(o=>o.path.length).sort((a,b)=>a.length-b.length);
 const route=options[0]?.path||[],transfer=!route.length,points=[start,...route.map(n=>CAMPUS_NODES[n])];
 const status=document.createElement('div');status.id='player-travel';
 status.innerHTML=`<span role="status">${transfer?`步道不相連，轉場前往${esc(d.name)}的探索入口…`:`前往${esc(d.name)}的探索入口…`}</span><button type="button" id="cancel-player-travel">取消前往</button>`;
 $('#map-page').append(status);$('#cancel-player-travel').onclick=()=>{cancelCampusPlayerWalk();origin?.focus?.({preventScroll:true});};
 const arrival=()=>{campusPlayerNode=target;campusPlayerSegment=null;campusPlayerPosition=[...CAMPUS_NODES[target]];campusPlayerFrame=null;paintCampusPlayer();status.remove();const focusOrigin=origin?.getClientRects&&!origin.getClientRects().length?$(`[data-label-for="${id}"]`):origin;showDepartmentAfterWalk(id,focusOrigin);};
 // Retain the transfer notice even when walking animations are reduced.
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced&&!transfer){arrival();return;}
 let index=1,last=null,progress=0,transferStart=null;
 function frame(now){if(serial!==campusPlayerSerial)return;
  if(transfer){transferStart??=now;if(now-transferStart<650){campusPlayerFrame=requestAnimationFrame(frame);return;}arrival();return;}
  const dt=last===null?0:Math.max(0,Math.min((now-last)/1000,.05));last=now;progress+=dt*100;
  while(index<points.length){const a=points[index-1],b=points[index],length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(progress<length){const t=progress/length;if(index>1)campusPlayerSegment={from:route[index-2],to:route[index-1]};paintCampusPlayer([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],true);break;}progress-=length;campusPlayerNode=route[index-1];campusPlayerPosition=[...b];campusPlayerSegment=null;index++;}
  if(index>=points.length){arrival();return;}campusPlayerFrame=requestAnimationFrame(frame);
 }

 // Show the complete route even when the visitor had zoomed into another area.
 $('#map-page').classList.add('map-panorama');$('#campus-map').setAttribute('preserveAspectRatio','xMidYMid meet');Object.assign(camera,{x:0,y:0,scale:1});updateCamera();
 campusPlayerFrame=requestAnimationFrame(frame);
}
function initCampusPlayer(){
 try{const p=JSON.parse(localStorage.getItem('caotun-player-v1'));if(p&&['boy','girl'].includes(p.gender)&&typeof p.name==='string'&&validCampusNickname(p.name.trim()))campusPlayerProfile={gender:p.gender,name:p.name.trim()};}catch{}
 const button=document.createElement('button');button.id='player-profile';button.textContent='設定暱稱';button.onclick=()=>chooseCampusPlayer();$('.header-right').prepend(button);paintCampusPlayer();
 if(!campusPlayerProfile)chooseCampusPlayer();
}
