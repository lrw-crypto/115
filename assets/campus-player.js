'use strict';
let campusPlayerProfile=null,campusPlayerNode=9,campusPlayerFrame=null,campusPlayerSerial=0;
const CAMPUS_PLAYER_STOPS={accounting:1,business:1,data:1,service:5,mechanical:21,piping:20,english:21,sports:47};
function chooseCampusPlayer(after){
 openModal(`<div class="eyebrow">MY CAMPUS ADVENTURE</div><h2 id="dialog-title">今天，換你當草商新生！</h2><p>選擇自己的角色，點選科別，就會帶你走過去。</p><div class="player-choices">${['boy','girl'].map(g=>`<button type="button" data-player-gender="${g}" aria-pressed="${(campusPlayerProfile?.gender||'boy')===g}"><svg viewBox="-30 -65 60 80" aria-hidden="true">${animal(0,0,'',g==='girl'?'cat':'bear','smile')}</svg>${g==='boy'?'男生角色':'女生角色'}</button>`).join('')}</div><label for="player-name">你的暱稱（最多 12 個字）</label><input id="player-name" maxlength="12" autocomplete="off" placeholder="例如：小宇" value="${esc(campusPlayerProfile?.name||'')}"><p>角色與暱稱保存在此瀏覽器，不影響已獲得的金幣。</p><button class="primary-btn" id="player-start">進入校園 →</button>`);
 let gender=campusPlayerProfile?.gender||'boy';$$('[data-player-gender]').forEach(b=>b.onclick=()=>{gender=b.dataset.playerGender;$$('[data-player-gender]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});
 $('#player-start').onclick=()=>{campusPlayerProfile={gender,name:$('#player-name').value.trim().slice(0,12)||'草商新生'};try{localStorage.setItem('caotun-player-v1',JSON.stringify(campusPlayerProfile));}catch{}closeModal();paintCampusPlayer();if(after)after();};
}
function paintCampusPlayer(position=CAMPUS_NODES[campusPlayerNode],moving=false){
 let el=$('#campus-player');if(!el){el=document.createElementNS('http://www.w3.org/2000/svg','g');el.id='campus-player';el.style.pointerEvents='none';$('#map-world').append(el);}
 if(!campusPlayerProfile)return;
 if(el.dataset.profile!==JSON.stringify(campusPlayerProfile)){el.dataset.profile=JSON.stringify(campusPlayerProfile);el.innerHTML=`<ellipse rx="13" ry="5" fill="#ffcd6488" stroke="#c47b28"/><g class="player-body" transform="scale(.8)">${animal(0,-6,'',campusPlayerProfile.gender==='girl'?'cat':'bear','smile')}</g><rect x="-58" y="-74" width="116" height="21" rx="10" fill="#fff7da" stroke="#d3a555"/><text y="-60" text-anchor="middle" font-size="10" fill="#765029">${esc(campusPlayerProfile.name)} · 你</text>`;}
 el.setAttribute('transform',`translate(${position[0]} ${position[1]})`);el.classList.toggle('player-walking',moving);
 $('#player-profile').textContent=`${campusPlayerProfile.gender==='girl'?'👧':'👦'} ${campusPlayerProfile.name} · 換角色`;
}
function cancelCampusPlayerWalk(){campusPlayerSerial++;if(campusPlayerFrame!==null)cancelAnimationFrame(campusPlayerFrame);campusPlayerFrame=null;$('#campus-player')?.classList.remove('player-walking');$('#player-travel')?.remove();if(campusPlayerProfile)paintCampusPlayer();}
function walkCampusPlayer(id){
 const d=departments.find(x=>x.id===id);if(!d)return;const origin=$('#modal-backdrop').hidden?document.activeElement:modalOrigin;
 closeModal();showView('map');modalOrigin=origin;cancelCampusPlayerWalk();const serial=campusPlayerSerial;
 const target=CAMPUS_PLAYER_STOPS[id];let route=campusRoute(campusPlayerNode,target);
 const status=document.createElement('div');status.id='player-travel';status.setAttribute('role','status');status.textContent=`${campusPlayerProfile.name}，前往${d.name}…`;$('#map-page').append(status);
 // The traced track is disconnected; use a labelled transfer instead of crossing buildings.
 if(!route.length){status.textContent=`步道不相連，轉場前往${d.name}的探索入口…`;route=[target];}
 const arrival=()=>{campusPlayerNode=target;campusPlayerFrame=null;paintCampusPlayer();status.remove();showDepartmentAfterWalk(id);};
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){arrival();return;}
 let index=1,last=null,progress=0,transferStart=null;
 function frame(now){if(serial!==campusPlayerSerial)return;
  if(route.length===1){transferStart??=now;if(now-transferStart<650){campusPlayerFrame=requestAnimationFrame(frame);return;}arrival();return;}
  const dt=last===null?0:Math.min((now-last)/1000,.05);last=now;progress+=dt*190;
  while(index<route.length){const a=CAMPUS_NODES[route[index-1]],b=CAMPUS_NODES[route[index]],length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(progress<length){const t=progress/length;paintCampusPlayer([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],true);break;}progress-=length;campusPlayerNode=route[index++];}
  if(index>=route.length){arrival();return;}campusPlayerFrame=requestAnimationFrame(frame);
 }
 // Show the complete route even when the visitor had zoomed into another area.
 $('#map-page').classList.add('map-panorama');$('#campus-map').setAttribute('preserveAspectRatio','xMidYMid meet');Object.assign(camera,{x:0,y:0,scale:1});updateCamera();
 campusPlayerFrame=requestAnimationFrame(frame);
}
function initCampusPlayer(){
 try{const p=JSON.parse(localStorage.getItem('caotun-player-v1'));if(p&&['boy','girl'].includes(p.gender)&&typeof p.name==='string')campusPlayerProfile={gender:p.gender,name:p.name.slice(0,12)};}catch{}
 const button=document.createElement('button');button.id='player-profile';button.textContent='選擇我的角色';button.onclick=()=>chooseCampusPlayer();$('.header-right').prepend(button);paintCampusPlayer();
 if(!campusPlayerProfile)chooseCampusPlayer();
}
