const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync('assets/'+p,'utf8');
// Exercise the actual multi-contact handlers without a browser dependency.
const listeners={},windowListeners={};let clicksBlocked=false;
const el={addEventListener:(t,f)=>listeners[t]=f,classList:{add(){},remove(){}}};
const ctx=vm.createContext({console,Date,Map,Math,DOMPoint:class {constructor(x,y){this.x=x;this.y=y}matrixTransform(){return this}},window:{addEventListener:(t,f)=>windowListeners[t]=f},$:()=>({getScreenCTM:()=>({inverse(){return {}}})}),camera:{x:0,y:0,scale:1},drag:{},cancelDepartmentVisit(){},updateCamera(){},zoom(){}});
vm.runInContext(read('campus-gestures.js'),ctx);ctx.initCampusGestures(el);
const event=(id,x,y)=>({pointerId:id,clientX:x,clientY:y,pointerType:'touch',button:0,cancelable:true,preventDefault(){}});
listeners.pointerdown(event(1,100,100));listeners.pointerdown(event(2,200,100));windowListeners.pointermove(event(2,300,100));assert.equal(ctx.camera.scale,2);
// Midpoint stays anchored: original world point at x=150 ends at x=200.
assert.equal(ctx.camera.x+580+(150-580)*ctx.camera.scale,200);
windowListeners.pointerup(event(2,300,100));const x=ctx.camera.x;windowListeners.pointermove(event(1,110,100));assert.equal(ctx.camera.x,x+10);
windowListeners.pointercancel(event(1,110,100));assert.equal(ctx.drag.active,false);
listeners.click({preventDefault(){},stopImmediatePropagation(){clicksBlocked=true}});assert(clicksBlocked);
listeners.pointerdown(event(3,100,100));listeners.pointerdown(event(4,200,100));windowListeners.pointermove(event(4,5000,100));assert.equal(ctx.camera.scale,2.8);windowListeners.blur();assert.equal(ctx.drag.active,false);
console.log('PASS pinch scaling, midpoint anchor, pinch-to-pan, cancellation, click suppression, upper bound');
// Exercise route selection and actual animation lifecycle for every department.
let frames=new Map(),seq=0,shown=[],painted=[],status=null;
const elements={'#modal-backdrop':{hidden:true},'#map-page':{hidden:false,classList:{add(){}},append(e){status=e}},'#campus-map':{setAttribute(){}}};
const c=vm.createContext({console,Math,Map,Set,Infinity,document:{activeElement:{},body:{},createElement:()=>({setAttribute(){},remove(){status=null}})},$:s=>elements[s]||null,matchMedia:()=>({matches:false}),requestAnimationFrame:f=>{frames.set(++seq,f);return seq},cancelAnimationFrame:id=>frames.delete(id),camera:{},updateCamera(){},modalOrigin:null,departments:['accounting','business','data','service','mechanical','piping','english','sports'].map(id=>({id,name:id}))});
vm.runInContext(read('campus-map.js')+'\n'+read('campus-navigation.js')+'\n'+read('campus-player.js')+`\nconst CAMPUS_VISITOR_HOME_NODE='east-2';const CAMPUS_SUPPORTER_POINT=[868,477];campusPlayerProfile={name:'測試',gender:'girl'};`,c);
c.paintCampusPlayer=(p,m)=>painted.push({p,m});c.showDepartmentAfterWalk=id=>{c.cancelCampusPlayerWalk();shown.push(id)};c.closeModal=()=>{c.cancelCampusPlayerWalk();elements['#modal-backdrop'].hidden=true};c.showView=()=>c.cancelCampusPlayerWalk();
function flush(){let t=0;while(frames.size){const batch=[...frames.values()];frames.clear();for(const f of batch)f(t);t+=16;if(t>15000)throw Error('route did not finish');}}
for(const id of c.departments.map(d=>d.id)){c.walkCampusPlayer(id);flush();assert.equal(shown.at(-1),id);assert.equal(status,null);}
c.walkCampusPlayer('data');c.cancelCampusPlayerWalk();const count=shown.length;flush();assert.equal(shown.length,count);
c.walkCampusPlayer('data');c.walkCampusPlayer('service');flush();assert.equal(shown.at(-1),'service');assert.equal(shown.length,count+1);
assert(painted.some(x=>x.m));console.log('PASS eight destinations, movement, cancellation, replacement visit, status cleanup');
