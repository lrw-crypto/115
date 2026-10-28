// Google Apps Script web app. Deploy as yourself; access: Anyone.
// Student nicknames are never sent here. One anonymous browser ID has one rank.
const PRIZE_LIMIT=15;
const COMPLETE_DEPARTMENTS=['mechanical','piping','business','accounting','data','english','service','sports'];
const PRIZE_HEADERS=['匿名瀏覽器編號','完成名次','完成時間','領獎編號','得獎資格','已領取（校方填寫）'];

function setupPrizeCounter(){
 const props=PropertiesService.getScriptProperties();
 if(props.getProperty('PRIZE_SHEET_ID'))return props.getProperty('PRIZE_SHEET_ID');
 const book=SpreadsheetApp.create('草商探索趣－完成名次與領獎紀錄');
 const sheet=book.getSheets()[0];sheet.setName('Completions');sheet.appendRow(PRIZE_HEADERS);sheet.setFrozenRows(1);
 props.setProperty('PRIZE_SHEET_ID',book.getId());
 console.log('名次與領獎紀錄：'+book.getUrl());return book.getId();
}
function prizeSheet(){
 const id=PropertiesService.getScriptProperties().getProperty('PRIZE_SHEET_ID');
 if(!id)throw new Error('SETUP_REQUIRED');
 const sheet=SpreadsheetApp.openById(id).getSheetByName('Completions');
 if(!sheet||sheet.getLastRow()<1)throw new Error('SETUP_REQUIRED');return sheet;
}
function prizeJSON(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);}
function prizeReceipt(row,total){
 const rank=Number(row[1]);return{ok:true,rank,total,limit:PRIZE_LIMIT,eligible:rank<=PRIZE_LIMIT,completedAt:new Date(row[2]).toISOString(),receiptCode:String(row[3])};
}
function doGet(){
 try{const s=prizeSheet(),last=s.getLastRow();return prizeJSON({ok:true,total:Math.max(Number(PropertiesService.getScriptProperties().getProperty('PRIZE_TOTAL')||0),last>1?Number(s.getRange(last,2).getValue()):0),limit:PRIZE_LIMIT});}
 catch(e){return prizeJSON({ok:false,error:'TEMPORARILY_UNAVAILABLE'});}
}
function doPost(e){
 let data;
 try{
  const raw=e&&e.postData&&e.postData.contents;if(!raw||raw.length>2048)throw Error();data=JSON.parse(raw);
  if(!/^[a-zA-Z0-9-]{20,80}$/.test(data.clientId||'')||!Array.isArray(data.completed)||data.completed.length!==8||new Set(data.completed).size!==8||!COMPLETE_DEPARTMENTS.every(id=>data.completed.includes(id)))throw Error();
 }catch(error){return prizeJSON({ok:false,error:'INVALID_COMPLETION'});}
 const lock=LockService.getScriptLock();let held=false;
 try{
  lock.waitLock(20000);held=true;
  const sheet=prizeSheet(),last=sheet.getLastRow(),total=Math.max(Number(PropertiesService.getScriptProperties().getProperty('PRIZE_TOTAL')||0),last>1?Number(sheet.getRange(last,2).getValue()):0);
  // The script lock covers lookup + allocation + append, across every visitor.
  if(last>1){const match=sheet.getRange(2,1,last-1,1).createTextFinder(data.clientId).matchEntireCell(true).findNext();if(match)return prizeJSON(prizeReceipt(sheet.getRange(match.getRow(),1,1,6).getValues()[0],total));}
  const rank=total+1,code='CS-'+String(rank).padStart(3,'0')+'-'+Utilities.getUuid().replace(/-/g,'').slice(0,8).toUpperCase();
  const row=[data.clientId,rank,new Date().toISOString(),code,rank<=PRIZE_LIMIT?'可領取':'名額已滿',''];
  sheet.appendRow(row);PropertiesService.getScriptProperties().setProperty('PRIZE_TOTAL',String(rank));SpreadsheetApp.flush();return prizeJSON(prizeReceipt(row,rank));
 }catch(error){return prizeJSON({ok:false,error:'TEMPORARILY_UNAVAILABLE'});}
 finally{if(held)lock.releaseLock();}
}
