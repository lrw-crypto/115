# 校方現有 GAS 全站完成計數

網站已改用校方提供、已部署的 GET 計數介面；不再使用先前草稿的 POST／領獎編號協定。公開部署網址在 `assets/reward-config.js`，不用重新部署另一份 Apps Script。

## 目前契約

- URL：公開的 Google Apps Script `/exec` 網址。
- 正式計數 ID：`ttvs_115_all_tasks_clear`（依使用者最新提供的完整程式碼）。不要混用先前範例的 `game_clear_115`。
- 唯一加計請求：`GET /exec?action=hit&id=ttvs_115_all_tasks_clear`。
- 成功回應：`{"success":true,"count":15}`，`count` 必須為大於零的整數（也接受純數字字串）。只有這個回應能決定完成名次。
- 前端不送暱稱、性別或其他個人資料。

## 觸發與保存

1. `triggerEntranceMessage()` 在走到科別入口時顯示「前15名完成遊戲者可以領取小獎品唷！」，不連線、不計數。
2. 最後一科完成、八枚金幣集滿時才執行 `triggerAllTasksCompleted()`。函式及底層請求都會檢查實際八科紀錄，並非傳入 true 就能觸發。
3. 成功名次存入 localStorage 的 `ttvs_115_all_tasks_clear`，重整、重玩、再次找客服均使用原名次。不會以登入／選科／開啟網站計數。
4. 同頁共用未完成的請求；有 Web Locks 的瀏覽器在多分頁間鎖住結算，鎖內再次檢查已保存名次。
5. GET hit 介面沒有提供伺服器查重或名次查詢，因此回應遺失時無法判斷後端是否已加計。前端會先保存 `ttvs_115_all_tasks_clear_pending`；網路／格式異常後提示截圖洽工作人員，重開或重整也不再自動 hit，以免重複占名額。只有伺服器明確回應 `success:false` 時才提供手動重試。
6. 此瀏覽器無法儲存時不發出 hit，提示截圖洽工作人員。這是每個瀏覽器的防重刷，不能當作每位學生的身分認證。

## 維護、測試與重設

- `node tests/reward-counter.cjs` 及 `tests/browser-completion-rewards.cjs` 使用模擬回應，測試全數完成才計數、名次 15／16、保存、重整、多分頁、失敗等情況，不消耗正式名額。
- 正式 GAS 未做 `hit` 測試，以免占用前 15 名。既有後端的全站鎖定、同時多人加計及 Google 跨來源連線，仍取決於校方實際部署的 GAS；前端不能替遠端計數表加鎖。後端應在讀取／加一／寫入期間使用 `LockService`。
- 前端不會呼叫任何歸零、刪列或測試用正式 hit。
- 若連線不明需處理，由工作人員先核對試算表，再決定是否補登名次或清除該瀏覽器的 pending。不要直接清除 pending 後反覆 hit。
- 新一輪活動不能只把試算表數字歸零，否則舊瀏覽器仍會持有上一輪名次；需同時規劃新的活動計數 ID 與本機保存鍵，再更新網站。現階段不自動重設任何正式紀錄。
