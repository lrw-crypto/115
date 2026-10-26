'use strict';
let campusVisitorController=null;
const CAMPUS_VISITOR_ROUTE=['east-1','east-2','tree-skirt-1','east-3','east-4','tree-skirt-2','east-5','east-6','east-end'];
const CAMPUS_VISITOR_LINE='我沒吃鳳梨跟芒果呀!';
function campusVisitorArt(){return `<defs>
 <radialGradient id="visitor-skin" cx="35%" cy="20%" r="85%"><stop stop-color="#fbe4d5"/><stop offset=".65" stop-color="#deb29a"/><stop offset="1" stop-color="#bb846f"/></radialGradient>
 <linearGradient id="visitor-polo" x2="1" y2=".7"><stop stop-color="#606494"/><stop offset=".5" stop-color="#514875"/><stop offset="1" stop-color="#352f50"/></linearGradient>
 <linearGradient id="visitor-jeans" x2="1" y2=".5"><stop stop-color="#5e819e"/><stop offset=".6" stop-color="#355873"/><stop offset="1" stop-color="#233e55"/></linearGradient>
 <clipPath id="visitor-shirt-clip"><path d="M-8-24h16l5 9-4 3v7q-9 3-18 0v-7l-4-3Z"/></clipPath></defs>
 <g class="visitor-model">
 <g class="step-left"><path d="M-5-5v7" stroke="#496c87" stroke-width="6" stroke-linecap="round"/><path d="M-5 0v5" stroke="#38556d" stroke-width="5"/><ellipse cx="-6" cy="6" rx="5" ry="3" fill="#424545" stroke="#292e30" stroke-width=".8"/></g>
 <g class="step-right"><path d="M5-5v7" stroke="#365670" stroke-width="6" stroke-linecap="round"/><path d="M5 0v5" stroke="#2f4c63" stroke-width="5"/><ellipse cx="5" cy="6" rx="5" ry="3" fill="#424545" stroke="#292e30" stroke-width=".8"/></g>
 <g class="friend-bob"><path d="M-8-10H8v11H1L0-5-1 1h-7Z" fill="url(#visitor-jeans)"/>
 <path class="arm-left" d="m-10-17-2 10" stroke="url(#visitor-skin)" stroke-width="4.5" stroke-linecap="round"/><path class="arm-right" d="m10-17 2 10" stroke="url(#visitor-skin)" stroke-width="4.5" stroke-linecap="round"/>
 <path d="M-8-24h16l5 9-4 3v7q-9 3-18 0v-7l-4-3Z" fill="url(#visitor-polo)"/>
 <g clip-path="url(#visitor-shirt-clip)" fill="none">${Array.from({length:10},(_,i)=>`<path d="M-14 ${-21+i*1.8}h28" stroke="${i%3===0?'#58a2b1':i%3===1?'#da8eae':'#b6a4c1'}" stroke-width=".5"/>`).join('')}</g>
 <path d="m-7-25 7 3-4 7-5-6Zm14 0-7 3 4 7 5-6Z" fill="#eac745" stroke="#c4a02e" stroke-width=".6"/><path d="M0-21v9" stroke="#b5a6b8" stroke-width=".8"/><circle cy="-18" r=".7" fill="#e7e1d7"/><circle cy="-15" r=".7" fill="#e7e1d7"/>
 <circle cx="-14" cy="-36" r="3.7" fill="#d6a68f"/><circle cx="14" cy="-36" r="3.7" fill="#d6a68f"/><ellipse cy="-39" rx="15" ry="17" fill="url(#visitor-skin)"/>
 <path d="M-13-47q-7 6-2 17l1-13ZM13-47q7 6 2 17l-1-13Z" fill="#665a55"/>
 <path d="m-11-44 6-2m10 0 6 2" stroke="#665143" stroke-width="1.7" stroke-linecap="round"/>
 <g fill="none" stroke="#393936" stroke-width="1.5"><rect x="-12" y="-41" width="11" height="9" rx="2"/><rect x="1" y="-41" width="11" height="9" rx="2"/><path d="M-1-38h2m-13 0-3-1m27 1 3-1"/></g>
 <ellipse cx="-6.5" cy="-36.5" rx="1.1" ry="1.7" fill="#39322c"/><ellipse cx="6.5" cy="-36.5" rx="1.1" ry="1.7" fill="#39322c"/><ellipse cy="-32" rx="2.2" ry="1.7" fill="#d9a98c"/><path d="M-4-27q4-4 8 0" fill="none" stroke="#a46560" stroke-width="1.4" stroke-linecap="round"/>
 </g></g>`;}
function createCampusVisitor(layer){
 $('#campus-visitor')?.remove();
 const el=document.createElementNS('http://www.w3.org/2000/svg','g');el.id='campus-visitor';el.setAttribute('class','campus-visitor');el.setAttribute('role','button');el.setAttribute('tabindex','0');el.setAttribute('aria-label','和右側步道的條紋衫先生說話');
 el.innerHTML=`<ellipse class="resident-ground-shadow" cy=".4" rx="7" ry="2.2" fill="#43684c32"/><g class="walker-figure">${campusVisitorArt()}</g><ellipse class="visitor-hit-area" cx="0" cy="-20" rx="13" ry="23" fill="transparent"/><g class="visitor-talk-hint" transform="translate(0 -46)" aria-hidden="true"><rect x="-12" y="-8" width="24" height="16" rx="8" fill="#fff5d9" stroke="#c3a658"/><text y="3" text-anchor="middle" font-size="12" fill="#80643b">⋯</text></g>`;
 layer.append(el);
 el.onpointerdown=e=>{drag.moved=false;e.stopPropagation();};
 const talk=()=>{el.focus({preventScroll:true});openCampusVisitor();};
 el.onclick=()=>{if(!drag.moved)talk();};el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();talk();}};
 return el;
}
function openCampusVisitor(){
 openModal(`<div class="crying-visitor-dialog"><img class="crying-visitor-portrait" src="assets/crying-visitor.png" alt="戴黑框眼鏡、穿黃領條紋衫的先生，委屈地流著眼淚" width="1024" height="1536"><div class="crying-visitor-speech"><h2 id="dialog-title">${CAMPUS_VISITOR_LINE}</h2></div></div>`);
}
