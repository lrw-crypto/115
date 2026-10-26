'use strict';

// Edit the introduction here. Photos are the school's original uploaded files;
// paths are relative so the same page works under GitHub Pages' /115/ prefix.
const DATA_PROCESSING_INTRO = {
 title: '資料處理科',
 subtitle: '把創意變成看得見的作品！',
 description: '學習程式、App、網頁與多媒體，結合商業應用，動手實現自己的想法。',
 skills: ['程式設計', 'App 設計', '網頁設計', '多媒體製作'],
 extra: '也能接觸手機 App 製作與 AI 應用。',
 photos: [
  {file:'smart-planter.jpg', section:'projects', title:'智能植栽', description:'探索科技與植物照顧的結合。', alt:'盆栽下方連接控制板與線路的智能植栽作品', width:303, height:359},
  {file:'smart-car.jpg', section:'projects', title:'智能小車', description:'動手製作小車，體驗創客樂趣。', alt:'學生在電腦旁動手組裝智能小車', width:386, height:344},
  {file:'computer-classroom.jpg', section:'equipment', title:'電腦專業教室', description:'全科共 8 間電腦專業教室。', alt:'電腦專業教室內成排的桌上型電腦與座椅', width:399, height:322},
  {file:'3d-printer.jpg', section:'equipment', title:'3D 印表機', description:'認識立體製作，看看創意如何成形。', alt:'藍色機身、上蓋開啟的 3D 印表機', width:194, height:272},
  {file:'laser-marker.jpg', section:'equipment', title:'雷射打標機', description:'體驗將文字雕刻在金屬上的應用。', alt:'學生在電腦旁操作雷射打標設備', width:477, height:470},
  // Award details are not reliably legible in these originals. Do not infer ranks.
  {file:'award-01.jpg', section:'awards', title:'競賽成果紀錄', description:'師生與獎狀合影。', alt:'師生手持獎狀的競賽成果合影', width:360, height:360},
  {file:'award-02.jpg', section:'awards', title:'競賽成果紀錄', description:'師生在校園留下成果合影。', alt:'師生手持成果看板在校園前合影', width:406, height:288}
 ],
 more: [
  {title:'學習內容', text:'除了程式與多媒體，也會接觸商業、會計、資料庫及電子商務。'},
  {title:'證照方向', text:'電腦軟體應用、會計人工，以及 App、AI 應用等相關檢定。'},
  {title:'未來方向', text:'可探索資訊相關科系，以及程式設計、網頁設計、電子商務等領域。'}
 ]
};
function dataPhotoPath(photo){return `assets/departments/data-processing/${photo.file}`;}
function dataPhotoCards(section){
 return DATA_PROCESSING_INTRO.photos.map((photo,index)=>photo.section!==section?'':`<figure class="data-photo-card"><button class="data-photo-open" data-data-photo="${index}" aria-label="放大照片：${esc(photo.title)}（第 ${index+1} 張，共 7 張）"><img src="${dataPhotoPath(photo)}" alt="${esc(photo.alt)}" width="${photo.width}" height="${photo.height}" loading="${index<2?'eager':'lazy'}" decoding="async"><span class="data-photo-hint" aria-hidden="true">＋ 放大照片</span></button><figcaption><h4>${esc(photo.title)}</h4><p>${esc(photo.description)}</p></figcaption></figure>`).join('');
}
function renderDataProcessingIntro(origin){
 const info=DATA_PROCESSING_INTRO;
 openModal(`<header class="data-intro-header"><h2 id="dialog-title">${info.title}</h2></header><div class="data-intro-body"><section class="data-intro-cover"><span class="data-intro-kicker">草商科別探索</span><h3>${info.subtitle}</h3><p>${info.description}</p><ul class="data-skill-tags" aria-label="可以學到的技能">${info.skills.map(s=>`<li>${s}</li>`).join('')}</ul></section><section class="data-intro-section" aria-labelledby="data-projects-title"><h3 id="data-projects-title">動手做什麼</h3><div class="data-photo-grid data-projects">${dataPhotoCards('projects')}</div><p class="data-extra">${info.extra}</p></section><section class="data-intro-section" aria-labelledby="data-equipment-title"><h3 id="data-equipment-title">我們的學習設備</h3><div class="data-photo-grid data-equipment">${dataPhotoCards('equipment')}</div></section><section class="data-intro-section" aria-labelledby="data-awards-title"><h3 id="data-awards-title">看看我們的競賽成果</h3><div class="data-photo-grid data-awards">${dataPhotoCards('awards')}</div></section><details class="data-learn-more"><summary>想知道更多？<span aria-hidden="true">＋</span></summary><div>${info.more.map(m=>`<section><h4>${m.title}</h4><p>${m.text}</p></section>`).join('')}</div></details><div class="data-intro-actions"><button class="primary-btn" id="start-campus-mission">開始科別體驗 →</button><button class="secondary-btn" id="data-return-campus">返回校園</button><p>完成原有指令小任務，首次可得 1 枚金幣。閱讀介紹不影響進度。</p></div></div>`,{department:true});
 const dialog=$('#dialog');dialog.classList.add('data-department-dialog');
 $('.data-intro-header').append($('.dialog-close'));
 modalOrigin=origin;dialog.scrollTop=0;
 dialog.querySelectorAll('[data-data-photo]').forEach(button=>button.onclick=()=>openDataPhoto(Number(button.dataset.dataPhoto),button));
 $('#start-campus-mission').onclick=()=>startMission('data');
 $('#data-return-campus').onclick=()=>{
  closeModal();
  if($('#map-page').hidden){showView('map');$('[data-label-for="data"]').focus({preventScroll:true});}
 };
}

let dataPhotoViewer=null;
function closeDataPhoto(restoreFocus=true){
 if(!dataPhotoViewer)return;
 const {element,origin}=dataPhotoViewer;dataPhotoViewer=null;element.remove();
 const backdrop=$('#modal-backdrop');backdrop.inert=false;backdrop.removeAttribute('aria-hidden');
 if(restoreFocus&&origin?.isConnected)origin.focus({preventScroll:true});
}
function openDataPhoto(index,origin){
 closeDataPhoto(false);
 const viewer=document.createElement('section');
 viewer.className='data-photo-viewer';viewer.setAttribute('role','dialog');viewer.setAttribute('aria-modal','true');viewer.setAttribute('aria-labelledby','data-photo-title');viewer.tabIndex=-1;
 viewer.innerHTML=`<div class="data-viewer-top"><h2 id="data-photo-title"></h2><button class="data-viewer-close" aria-label="關閉照片">${ico('close')}</button></div><div class="data-viewer-image"><img alt=""></div><div class="data-viewer-bottom"><button class="data-viewer-prev" aria-label="上一張照片">← 上一張</button><span class="data-viewer-count" role="status" aria-live="polite"></span><button class="data-viewer-next" aria-label="下一張照片">下一張 →</button></div>`;
 dataPhotoViewer={element:viewer,origin,index};
 function showPhoto(next){
  const photos=DATA_PROCESSING_INTRO.photos;dataPhotoViewer.index=(next+photos.length)%photos.length;
  const photo=photos[dataPhotoViewer.index],img=viewer.querySelector('img');
  img.src=dataPhotoPath(photo);img.alt=photo.alt;
  viewer.querySelector('h2').textContent=photo.title;
  viewer.querySelector('.data-viewer-count').textContent=`${dataPhotoViewer.index+1} / ${photos.length}`;
 }
 viewer.querySelector('.data-viewer-close').onclick=()=>closeDataPhoto();
 viewer.querySelector('.data-viewer-prev').onclick=()=>showPhoto(dataPhotoViewer.index-1);
 viewer.querySelector('.data-viewer-next').onclick=()=>showPhoto(dataPhotoViewer.index+1);
 viewer.addEventListener('keydown',e=>{
  // Handle the topmost dialog first; Escape must not close the introduction.
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeDataPhoto();}
  else if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();e.stopPropagation();showPhoto(dataPhotoViewer.index+(e.key==='ArrowRight'?1:-1));}
  else if(e.key==='Tab'){
   e.stopPropagation();const buttons=[...viewer.querySelectorAll('button')],first=buttons[0],last=buttons.at(-1);
   if(e.shiftKey&&(document.activeElement===first||document.activeElement===viewer)){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===viewer)){e.preventDefault();first.focus();}
  }
 });
 document.body.append(viewer);showPhoto(index);
 viewer.querySelector('.data-viewer-close').focus({preventScroll:true});
 $('#modal-backdrop').inert=true;$('#modal-backdrop').setAttribute('aria-hidden','true');
}
