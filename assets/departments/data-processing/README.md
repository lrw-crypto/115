# 資料處理科實拍照片與介紹維護

此目錄的 7 張 JPG 為校方提供的原始照片，網站直接使用，不使用 AI 生成圖或網路替代素材。原檔約 28–151 KB，這一版不另製縮圖；放大也讀取原檔。維持完整比例，不裁切獎狀或作品。

- 文字、技能標籤、照片標題／短說明／替代文字及相簿順序：修改 `assets/data-processing-intro.js` 的 `DATA_PROCESSING_INTRO`。
- 替換照片：保留本目錄相同檔名即可；若更名，也要修改上述 `photos[].file`。照片尺寸改變時一併更新 `width`、`height`。
- 版面、照片框與手機樣式：修改 `assets/data-processing-intro.css`。
- 兩張成果照的競賽名稱／年度／名次無法可靠辨識，因此僅標示「競賽成果紀錄」。有正式資料後再更新。

介紹共用 `renderDepartmentDialog` 的資料處理科分支；地圖、共用建築、科別體驗與護照入口一致。開始體驗呼叫原有 `startMission('data')`，不另建遊戲，不因閱讀發幣。點「返回校園」會回地圖；從科別體驗頁按 Esc／關閉則返回原卡片。地圖視角與原有進度保留。

照片檢視器獨立於介紹，Esc 先關照片，焦點回照片按鈕，再按 Esc 才關介紹。支援左右方向鍵、上一張／下一張與 Tab 焦點循環。

檢查指令（需要已安裝 Playwright 與 Chromium；測試網址需指向靜態伺服器）：

```sh
CAMPUS_BASE_URL=http://127.0.0.1:8011/115/ node tests/browser-data-processing-intro.cjs
```
