'use strict';

// The same graph draws the bridges and routes the residents: nobody walks on water.
const WALK_CONNECTIONS = [[0,1],[0,3],[1,4],[2,3],[3,4],[2,5],[3,6],[4,7],[5,6]];
function islandRadius(island, angle) {
  const x = Math.abs(Math.cos(angle)), y = Math.abs(Math.sin(angle));
  return Math.min(x > .00001 ? 142 / x : Infinity, 78 / (y + 39 / 142 * x)) * (island.scale || .8);
}
function shorelineTree(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">${tree(0,0,1)}</g>`;
}
function shoreScenery() {
  return `<g id="shore-scenery" aria-label="岸邊風景與萊爾富想像場景" role="img">
    <path d="M-1500-1200H1500V175Q1320 148 1175 162T970 165Q892 177 820 137T667 96Q570 111 505 58T420-20Q300-100-100-400L-1500-1200Z" fill="#739f8730" transform="translate(0 12)"/>
    <path d="M-1500-1200H1500V175Q1320 148 1175 162T970 165Q892 177 820 137T667 96Q570 111 505 58T420-20Q300-100-100-400L-1500-1200Z" fill="#f1e0b6" stroke="#fff0ce" stroke-width="10"/>
    <path d="M-1500-1200H1500V139Q1320 108 1165 126T970 128Q893 139 825 103T670 59Q575 73 520 22T420-55Q300-130-100-430L-1500-1200Z" fill="#c3d49b"/>
    <path d="M483-13Q611 110 713 65T929 102Q1107 139 1330 92" fill="none" stroke="#ded9be" stroke-width="32" stroke-linecap="round"/>
    <path d="M483-13Q611 110 713 65T929 102Q1107 139 1330 92" fill="none" stroke="#fdf5d5" stroke-width="2" stroke-dasharray="11 12"/>
    ${[[520,0,.8],[580,28,.6],[650,3,.9],[715,23,.7],[777,42,.65],[1085,39,.8],[1140,94,.7],[1210,39,.9]].map(t=>shorelineTree(...t)).join('')}
    <g class="hilife-store" transform="translate(985 48)">
      <ellipse cx="36" cy="40" rx="92" ry="23" fill="#76997d2b"/>
      <path d="M-45-14 62-14 99-36V33L62 55-45 32Z" fill="#fff6df" stroke="#eee7c9" stroke-width="2" stroke-linejoin="round"/>
      <path d="M62-14 99-36V33L62 55Z" fill="#e2e4cc"/>
      <path d="m-53-20 116 0 45-25-116-1Z" fill="#f7f8e9" stroke="#e7e5cd" stroke-width="3" stroke-linejoin="round"/>
      <path d="M-47-23H64v24H-47Z" fill="#26a1b4"/>
      <path d="M-47-23H64v6H-47Z" fill="#dc5560"/>
      <path d="M-47-2H64v4H-47Z" fill="#fcf7df"/>
      <text x="8" y="-6" fill="#ffffff" font-size="13" font-weight="800" text-anchor="middle">萊爾富 Hi-Life</text>
      <path d="M64-23 101-44v24L64 2Z" fill="#1b91ab"/>
      <path d="M64-23 101-44v6L64-17Z" fill="#cc525d"/>
      <rect x="-37" y="8" width="36" height="21" rx="2" fill="#acd3cf" stroke="#d7d9c2" stroke-width="2"/>
      <path d="M-32 25-16 11m4 14 9-9" stroke="#d8efdc" stroke-width="2"/>
      <rect x="9" y="5" width="32" height="35" rx="2" fill="#a6c8bd" stroke="#dfddc2" stroke-width="2"/>
      <path d="M25 5v35m-4-17v9m8-9v9" stroke="#f4edcf" stroke-width="2"/>
      <rect x="46" y="12" width="10" height="23" rx="2" fill="#df8970"/>
      <rect x="48" y="15" width="6" height="9" rx="1" fill="#fff2bc"/>
      <path d="m75 0 12-7v23l-12 7Z" fill="#99bfb6"/>
      <path d="m-38 40 29 5m-29-1 29 5" stroke="#b99c73" stroke-width="4" stroke-linecap="round"/>
      <path d="m-33 44-1 8m21-4-1 8" stroke="#a68e6d" stroke-width="2"/>
      <g transform="translate(-59 17) scale(.6)">${animal(0,0,'','rabbit')}</g>
      <g transform="translate(69 62) scale(.6)">${animal(0,0,'','bear')}</g>
      <text x="13" y="80" fill="#708769" text-anchor="middle" font-size="9">岸邊的萊爾富 · 想像場景</text>
    </g>
    <g fill="#af9a76" stroke="#af9a76" stroke-width="2">
      <path d="M702 108v-24m88 44v-24m264 48v-24"/>
      <circle cx="702" cy="83" r="4" fill="#fff1bc"/><circle cx="790" cy="103" r="4" fill="#fff1bc"/><circle cx="1054" cy="127" r="4" fill="#fff1bc"/>
    </g>
  </g>`;
}

let walkingController = null;
function initWalkingResidents() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const adjacent = islands.map(() => []);
  WALK_CONNECTIONS.forEach(([a,b]) => { adjacent[a].push(b); adjacent[b].push(a); });
  let paused = reduced.matches, manualPaused = false, frameId = null, previousTime = null;
  const actors = [];
  const frontPoint = island => ({x:island.x - 22 * island.scale, y:island.y + 43 * island.scale, island:island.id});
  function perimeter(island, angle) {
    const radius = islandRadius(island, angle) * .92;
    return {x:island.x + Math.cos(angle)*radius, y:island.y + Math.sin(angle)*radius, island:island.id};
  }
  function ring(island, from, to) {
    const delta = Math.atan2(Math.sin(to-from), Math.cos(to-from));
    const steps = Math.max(2, Math.ceil(Math.abs(delta)/.18));
    return Array.from({length:steps+1}, (_,i) => perimeter(island, from+delta*i/steps));
  }
  function trip(fromIndex, toIndex) {
    const from = islands[fromIndex], to = islands[toIndex];
    const angle = Math.atan2(to.y-from.y, to.x-from.x);
    const departure = ring(from, Math.PI/2, angle);
    const arrival = ring(to, angle+Math.PI, Math.PI/2);
    // A tagged transit segment is precisely the centerline of a rendered bridge.
    return [frontPoint(from), ...departure,
      {...arrival[0], island:null, bridgeFrom:from.id, bridgeTo:to.id},
      ...arrival, frontPoint(to)];
  }
  const transit = $('#walking-transit');
  for (let i=0;i<16;i++) {
    const current = i%islands.length;
    const element = document.createElementNS('http://www.w3.org/2000/svg','g');
    element.setAttribute('class','walking-resident');
    element.setAttribute('aria-hidden','true');
    element.dataset.resident = String(i);
    element.innerHTML = animal(0,0,'',i%3===0?'rabbit':i%3===1?'bear':'cat');
    const start = frontPoint(islands[current]);
    actors.push({element,current,target:current,path:[],segment:0,progress:0,x:start.x+(i>=8?22:0),y:start.y+(i>=8?4:0),waiting:i*.35,speed:17+(i%4)*2,phase:i*.8,island:islands[current].id,heading:1});
    transit.append(element);
  }
  function place(actor) {
    const island = islands.find(d => d.id === actor.island);
    const parent = island ? $(`[data-resident-${actor.y < island.y+7?'back':'front'}="${island.id}"]`) : transit;
    if (actor.element.parentNode !== parent) parent.append(actor.element);
    const x = island ? (actor.x-island.x)/island.scale : actor.x;
    const y = island ? (actor.y-island.y)/island.scale : actor.y;
    const scale = .66/(island ? island.scale : 1);
    actor.element.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale})`);
    actor.element.classList.toggle('is-walking',!paused&&actor.waiting<=0);
    actor.element.dataset.onIsland = actor.island || 'bridge';
    actor.element.dataset.current = islands[actor.current].id;
    actor.element.dataset.target = islands[actor.target].id;
  }
  function chooseTrip(actor) {
    const choices = adjacent[actor.current];
    const next = choices[Math.floor(Math.random()*choices.length)];
    actor.target = next;
    actor.path = trip(actor.current,next);
    actor.path[0] = {x:actor.x,y:actor.y,island:islands[actor.current].id};
    actor.segment=0;actor.progress=0;
  }
  function advance(actor, seconds) {
    if(actor.waiting>0){actor.waiting-=seconds;return;}
    if(!actor.path.length) chooseTrip(actor);
    let distance = actor.speed*seconds;
    while(distance>0 && actor.segment<actor.path.length-1) {
      const a=actor.path[actor.segment], b=actor.path[actor.segment+1];
      const length=Math.hypot(b.x-a.x,b.y-a.y);
      const remaining=length-actor.progress;
      if(distance>=remaining){distance-=remaining;actor.segment++;actor.progress=0;actor.x=b.x;actor.y=b.y;actor.island=b.island;}
      else {
        actor.progress+=distance;distance=0;
        const fraction=length?actor.progress/length:1;
        actor.x=a.x+(b.x-a.x)*fraction;actor.y=a.y+(b.y-a.y)*fraction;
        actor.island=a.island===b.island?a.island:null;
      }
    }
    if(actor.segment>=actor.path.length-1){actor.current=actor.target;actor.path=[];actor.waiting=2+Math.random()*4;}
  }
  function paint(){actors.forEach(place);}
  function tick(time) {
    frameId=null;
    if(paused){previousTime=null;return;}
    const seconds=previousTime===null?0:Math.min((time-previousTime)/1000,.06);
    previousTime=time;
    if(!$('#map-page').hidden && $('#modal-backdrop').hidden) actors.forEach(actor=>advance(actor,seconds));
    paint();frameId=requestAnimationFrame(tick);
  }
  function updateControl() {
    $('#toggle-walk').setAttribute('aria-pressed',String(paused));
    $('#toggle-walk').textContent=reduced.matches?'已減少動態':paused?'▶ 繼續散步':'Ⅱ 暫停散步';
    $('#toggle-walk').disabled=reduced.matches;
    document.body.classList.toggle('residents-paused',paused);
    paint();
    if(paused && frameId!==null){cancelAnimationFrame(frameId);frameId=null;previousTime=null;}
    if(!paused && frameId===null) frameId=requestAnimationFrame(tick);
  }
  $('#toggle-walk').onclick=()=>{manualPaused=!paused;paused=manualPaused||reduced.matches;updateControl();};
  reduced.addEventListener('change',()=>{paused=manualPaused||reduced.matches;updateControl();});
  document.addEventListener('visibilitychange',()=>{
    previousTime=null;
    if(document.hidden && frameId!==null){cancelAnimationFrame(frameId);frameId=null;}
    if(!document.hidden && !paused && frameId===null)frameId=requestAnimationFrame(tick);
  });
  walkingController={get paused(){return paused;},get actors(){return actors;},trip,advance,paint};
  updateControl();
}
