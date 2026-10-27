'use strict';
// Text and original uploaded photo names for the shared department introduction.
// Keep folder/file paths relative to support GitHub Pages at /115/.
const BUSINESS_MANAGEMENT_INTRO={
 id:'business', folder:'business-management',
 title:'商業經營科',
 subtitle:'解鎖你的商管超能力！',
 description:'從行銷、門市到財會，學習商業運作，把課堂知識用在生活與職場。',
 skills:['商業管理','數位行銷','門市服務','會計應用'],
 sections:[
  {id:'classrooms', title:'在哪裡學？', columns:3},
  {id:'experiences', title:'走出教室，實際體驗', columns:3}
 ],
 photos:[
  {file:'fintech-classroom.jpg',section:'classrooms',title:'金融科技創新教室',description:'探索財會與金融科技的學習空間。',alt:'金融科技創新教室內，桌上多螢幕電腦顯示金融資訊，前方設有投影牆',width:560,height:342},
  {file:'retail-classroom.jpg',section:'classrooms',title:'門市服務教室',description:'練習收銀與清潔等門市服務技能。',alt:'門市服務教室內，成排實作桌設有收銀機與條碼掃描器',width:532,height:354},
  {file:'marketing-classroom.jpg',section:'classrooms',title:'多元行銷教室',description:'學習行銷，練習表達與創意。',alt:'多元行銷教室內，分排座椅穿上有號碼的彩色球衣，前方設有投影幕',width:472,height:350},
  {file:'competition-01.jpg',section:'experiences',title:'專題與競賽',description:'把課堂所學化為專題，挑戰競賽。',alt:'師生在競賽舞臺上手持獎狀及成果看板合影',width:652,height:487},
  {file:'industry-visit.jpg',section:'experiences',title:'校外參訪',description:'走進職場，認識企業如何運作。',alt:'商業經營科師生在棒球場入口前，持職場參訪活動布條合影',width:745,height:484},
  {file:'internship-01.jpg',section:'experiences',title:'校外實習',description:'在服務現場累積實務經驗。',alt:'實習照片拼圖呈現學生在咖啡店合影、辨識咖啡豆、包裝及操作咖啡設備',width:749,height:487}
 ],
 more:[
  {title:'三年學習路線',paragraphs:['高一：商業、會計與門市服務，建立基礎。','高二：行銷、資料分析與專題，深化技能。','高三：企業經營、商業溝通與實務，準備升學。']},
  {title:'可以挑戰的證照',text:'門市服務丙級、電腦軟體應用丙／乙級、會計事務資訊項丙／乙級，以及商業管理能力檢定。'},
  {title:'未來發展',paragraphs:['升學方向：企業管理、行銷與流通管理、會計資訊、財務金融等相關科系。','職涯方向：企業行政、會計助理、門市營運及數位行銷等工作。']}
 ],
 missionNote:'完成原有小店陳列任務，首次可得 1 枚金幣。閱讀介紹不影響進度。'
};
