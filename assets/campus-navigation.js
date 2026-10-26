'use strict';
// Ground geometry traced on the existing 1536 × 1024 illustration. Never screen pixels.
// The track has no clearly drawn gate to the courtyard: it is a separate component.
// The west service lane is reserved for the existing scooter patrol.
const CAMPUS_WALK_RADIUS=10;
const CAMPUS_NAV_ZONES={
 courtyard:{color:'#eb659a',areas:[
  [[682,389],[756,389],[756,422],[682,422]],
  [[640,405],[662,385],[710,393],[744,386],[790,391],[820,418],[797,440],[742,420],[697,435],[672,447],[640,429]],
  [[645,417],[671,413],[935,735],[949,761],[923,782],[904,748],[876,717],[842,677],[808,637],[774,597],[740,557],[706,517],[672,477],[645,437]],
  [[795,393],[820,393],[1180,705],[1139,726],[1077,689],[1036,649],[987,610],[939,570],[892,530],[844,490],[796,450],[773,428]],
  [[891,721],[932,723],[943,767],[915,786],[891,754]],
  [[904,724],[947,729],[951,756],[1004,804],[1044,831],[1037,870],[930,873],[834,858],[743,838],[657,820],[647,787],[681,776],[746,773],[834,784],[902,764]],
  [[1006,827],[1058,814],[1127,786],[1228,726],[1244,754],[1141,823],[1048,868]],
  [[792,831],[821,841],[772,956],[741,944]]
 ],holes:[
  // Pavilion garden, guardhouse/side wall, and the planted edge of the lawn.
  [[635,696],[704,644],[788,646],[842,692],[860,734],[831,758],[713,775],[650,751]],
  [[966,672],[1032,651],[1088,690],[1088,758],[998,801],[965,763]],
  [[690,439],[710,435],[961,714],[944,735]],
  [[934,519],[952,510],[970,519],[952,533]],
  [[1008,579],[1027,570],[1044,581],[1027,594]],
  [[1044,588],[1062,582],[1079,595],[1060,603]],
  [[1099,631],[1119,622],[1138,642],[1118,651]],
  [[1151,684],[1171,676],[1182,691],[1165,698]]
 ]},
 track:{color:'#377ec8',areas:[[[87,213],[95,180],[132,145],[213,117],[315,116],[381,144],[462,198],[504,235],[512,267],[480,291],[411,313],[286,326],[189,308],[126,277],[102,247]]],holes:[[[150,191],[182,173],[242,156],[315,157],[360,177],[418,216],[454,246],[454,258],[420,274],[354,283],[270,282],[209,268],[171,246],[148,220]]]},
 service:{color:'#d7a32b',areas:[[[199,370],[227,336],[269,334],[284,355],[249,377],[239,398],[266,448],[307,501],[354,556],[400,611],[446,654],[493,688],[537,709],[580,718],[616,714],[623,740],[576,751],[527,739],[478,719],[430,686],[381,640],[333,585],[287,531],[244,477],[213,428],[196,397]]],holes:[]}
};
// Coordinates are deliberately only on paving / the track, not the central lawn.
const CAMPUS_NAV_POINTS=[
 ['north-west',664,415,'courtyard'],['west-1',684,460,'courtyard'],['west-2',718,501,'courtyard'],['west-3',752,542,'courtyard'],['west-4',786,583,'courtyard'],['west-5',820,624,'courtyard'],['west-6',854,665,'courtyard'],['west-7',888,706,'courtyard'],['gate-inner',917,745,'courtyard'],['gate-open',920,779,'courtyard'],
 ['plaza-centre',835,810,'courtyard'],['plaza-west',740,802,'courtyard'],['gate-outside',803,841,'courtyard'],['crosswalk',783,886,'courtyard'],['crosswalk-south',762,936,'courtyard'],['plaza-east',935,822,'courtyard'],['plaza-corner',1025,841,'courtyard'],['east-sidewalk',1118,810,'courtyard'],['east-sidewalk-end',1220,751,'courtyard'],
 ['north-1',695,405,'courtyard'],['north-2',742,406,'courtyard'],['north-east',807,413,'courtyard'],['east-1',856,454,'courtyard'],['east-2',904,494,'courtyard'],['east-3',947,549,'courtyard'],['east-4',985,580,'courtyard'],['east-5',1048,614,'courtyard'],['east-6',1096,654,'courtyard'],['east-end',1129,680,'courtyard'],
 ['service-front',563,733,'service'],['service-south',520,720,'service'],['service-start',474,697,'service'],['service-2',425,663,'service'],['service-3',379,617,'service'],['service-4',333,564,'service'],['service-turn',287,510,'service'],['service-6',249,458,'service'],['service-7',220,407,'service'],['service-end',220,381,'service'],['service-entry',240,355,'service'],
 ['track-0',140,177,'track'],['track-1',211,142,'track'],['track-2',292,135,'track'],['track-3',361,154,'track'],['track-4',424,197,'track'],['track-5',475,239,'track'],['track-6',483,261,'track'],['track-7',448,284,'track'],['track-8',371,302,'track'],['track-9',278,304,'track'],['track-10',202,287,'track'],['track-11',150,257,'track'],['track-12',122,222,'track'],['track-13',119,197,'track'],['tree-skirt-1',910,523,'courtyard'],['tree-skirt-2',1006,605,'courtyard']
];
const CAMPUS_NODE_UV=CAMPUS_NAV_POINTS.map(p=>p.slice(1,3));
const CAMPUS_NODES=CAMPUS_NODE_UV.map(p=>campusPoint(...p));
const CAMPUS_NODE_ZONES=CAMPUS_NAV_POINTS.map(p=>p[3]);
const CAMPUS_NODE_INDEX=Object.fromEntries(CAMPUS_NAV_POINTS.map((p,i)=>[p[0],i]));
const chains=[[0,1,2,3,4,5,6,7,8,9,10,12,13,14],[10,11],[10,15,16,17,18],[0,19,20,21,22,23,54,24,25,55,26,27,28],[29,30,31,32,33,34,35,36,37,38,39],[40,41,42,43,44,45,46,47,48,49,50,51,52,53,40]];
const CAMPUS_EDGES=chains.flatMap(chain=>chain.slice(1).map((n,i)=>[chain[i],n]));
// Original map nodes remain available for landmarks; select residents through
// campusReachableNodes / fixed-resident clearance, never from this list alone.
const CAMPUS_WALK_NODES=CAMPUS_NODES.map((_,i)=>i).filter(i=>CAMPUS_NODE_ZONES[i]!=='service');
const CAMPUS_STOP_NODES=[...Array.from({length:29},(_,i)=>i).filter(i=>![9,12,13].includes(i)),40,42,44,46,48,50,52];
const CAMPUS_NAV_WORLD=Object.fromEntries(Object.entries(CAMPUS_NAV_ZONES).map(([key,z])=>[key,{areas:z.areas.map(p=>p.map(q=>campusPoint(...q))),holes:z.holes.map(p=>p.map(q=>campusPoint(...q)))}]));
const CAMPUS_ADJACENCY=CAMPUS_NODES.map(()=>[]);
for(const[a,b]of CAMPUS_EDGES){const length=Math.hypot(CAMPUS_NODES[a][0]-CAMPUS_NODES[b][0],CAMPUS_NODES[a][1]-CAMPUS_NODES[b][1]);CAMPUS_ADJACENCY[a].push({next:b,length});CAMPUS_ADJACENCY[b].push({next:a,length});}
// The fixed visitor reserves enough room for both complete character silhouettes.
// Functions are evaluated after all scripts load, so his home has one source of truth.
const CAMPUS_FIXED_RESIDENT_PADDING={x:18,y:34};
function campusFixedResidentBounds(radius=CAMPUS_WALK_RADIUS){const[x,y]=CAMPUS_NODES[CAMPUS_NODE_INDEX[CAMPUS_VISITOR_HOME_NODE]];return{x,y,halfWidth:CAMPUS_FIXED_RESIDENT_PADDING.x+radius,halfDepth:CAMPUS_FIXED_RESIDENT_PADDING.y+radius};}
function campusFixedResidentClear(x,y,radius=CAMPUS_WALK_RADIUS){const b=campusFixedResidentBounds(radius);return Math.abs(x-b.x)>=b.halfWidth||Math.abs(y-b.y)>=b.halfDepth;}
function campusFixedResidentSegmentClear(a,b,radius=CAMPUS_WALK_RADIUS){
 const obstacle=campusFixedResidentBounds(radius);let enter=0,exit=1;
 for(const [axis,centre,extent]of [[0,obstacle.x,obstacle.halfWidth],[1,obstacle.y,obstacle.halfDepth]]){
  const delta=b[axis]-a[axis],low=centre-extent,high=centre+extent;
  if(Math.abs(delta)<1e-10){if(a[axis]<=low||a[axis]>=high)return true;continue;}
  const t1=(low-a[axis])/delta,t2=(high-a[axis])/delta;enter=Math.max(enter,Math.min(t1,t2));exit=Math.min(exit,Math.max(t1,t2));if(enter>=exit)return true;
 }return false;
}
const campusComponentCache=new Map();
function campusReachableNodes(from){
 if(campusComponentCache.has(from))return campusComponentCache.get(from);
 if(!CAMPUS_NODES[from]||!campusFixedResidentClear(...CAMPUS_NODES[from]))return [];
 const queue=[from],seen=new Set(queue);
 for(let i=0;i<queue.length;i++)for(const{next}of CAMPUS_ADJACENCY[queue[i]])if(!seen.has(next)&&campusFixedResidentSegmentClear(CAMPUS_NODES[queue[i]],CAMPUS_NODES[next])){seen.add(next);queue.push(next);}
 const component=[...seen].sort((a,b)=>a-b);for(const n of component)campusComponentCache.set(n,component);return component;
}
function campusRoute(from,to){
 if(!CAMPUS_NODES[from]||!CAMPUS_NODES[to]||!campusReachableNodes(from).includes(to))return [];
 const distance=new Map([[from,0]]),previous=new Map(),pending=new Set([from]);
 while(pending.size){const node=[...pending].reduce((a,b)=>distance.get(a)<distance.get(b)?a:b);pending.delete(node);if(node===to){const path=[to];while(path[0]!==from)path.unshift(previous.get(path[0]));return path;}
  for(const{next,length}of CAMPUS_ADJACENCY[node]){if(!campusFixedResidentSegmentClear(CAMPUS_NODES[node],CAMPUS_NODES[next]))continue;const cost=distance.get(node)+length;if(cost<(distance.get(next)??Infinity)){distance.set(next,cost);previous.set(next,node);pending.add(next);}}
 }return [];
}
function campusDistanceToEdge(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],length=dx*dx+dy*dy,t=length?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/length)):0;return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);}
function campusWalkPointSafe(x,y,radius=CAMPUS_WALK_RADIUS,zone='courtyard'){
 const geometry=CAMPUS_NAV_WORLD[zone];if(!geometry||!campusFixedResidentClear(x,y,radius))return false;
 if(!geometry.areas.some(poly=>campusContains([x,y],poly)))return false;
 // Analytic circle/obstacle clearance also catches narrow flowerbed corners.
 for(const poly of geometry.holes){if(campusContains([x,y],poly)||poly.some((a,i)=>campusDistanceToEdge(x,y,a,poly[(i+1)%poly.length])<radius))return false;}
 for(let i=0;i<32;i++){const angle=i*Math.PI/16,px=x+Math.cos(angle)*radius,py=y+Math.sin(angle)*radius;if(!geometry.areas.some(poly=>campusContains([px,py],poly)))return false;}return true;
}
function campusWalkSegmentSafe(a,b,radius=CAMPUS_WALK_RADIUS,zone='courtyard'){
 const length=Math.hypot(b[0]-a[0],b[1]-a[1]),steps=Math.max(1,Math.ceil(length/.5));
 // The extra .35 covers the interval between samples, not just its endpoints.
 for(let i=0;i<=steps;i++){const t=i/steps;if(!campusWalkPointSafe(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,radius+.35,zone))return false;}return true;
}
function validateCampusNavigation(){
 const errors=[];
 for(const[a,b]of CAMPUS_EDGES)if(campusFixedResidentSegmentClear(CAMPUS_NODES[a],CAMPUS_NODES[b])&&!campusWalkSegmentSafe(CAMPUS_NODES[a],CAMPUS_NODES[b],CAMPUS_WALK_RADIUS,CAMPUS_NODE_ZONES[a]))errors.push(`${CAMPUS_NAV_POINTS[a][0]} → ${CAMPUS_NAV_POINTS[b][0]}`);
 return errors;
}
