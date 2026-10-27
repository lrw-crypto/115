商業經營科介紹照片存放區

## 修改介紹

- 編輯 `assets/business-management-intro.js`：標題、簡介、技能標籤、照片說明及收合內容都在 `BUSINESS_MANAGEMENT_INTRO`。
- 沿用資處科的圖文元件與相簿：共用程式為 `assets/data-processing-intro.js`，共用樣式為 `assets/data-processing-intro.css`，不要另外建立視窗。
- 原有遊戲仍為 `assets/campus-missions.js` 的商經科「小店陳列設計師」。閱讀介紹不會發放金幣。

## 替換照片

目前六張照片均已確認為 JPEG，原檔不裁切、不拉伸，檔案不大，直接用於卡片與放大檢視：

| 檔名 | 用途 | 原始寬 × 高 |
| --- | --- | --- |
| `fintech-classroom.jpg` | 金融科技創新教室 | 560 × 342 |
| `retail-classroom.jpg` | 門市服務教室 | 532 × 354 |
| `marketing-classroom.jpg` | 多元行銷教室 | 472 × 350 |
| `competition-01.jpg` | 專題與競賽 | 652 × 487 |
| `industry-visit.jpg` | 校外參訪 | 745 × 484 |
| `internship-01.jpg` | 校外實習 | 749 × 487 |

將新照片放入此資料夾，再更新介紹設定中的 `file`、`width`、`height`、`alt`。若換成 PNG，使用實際 `.png` 檔名，檔名大小寫需一致。未有實際照片的項目請先從 `photos` 清單移除，避免破圖；不可建立假的照片檔案。路徑由共用元件組成相對網址，適用 GitHub Pages 的 `/115/` 子路徑。

## 檢查

使用既有 Playwright／Chromium 環境執行 `tests/browser-business-management-intro.cjs`，並以 `tests/browser-data-processing-intro.cjs` 確認資處科相容性；測試網址可透過 `CAMPUS_BASE_URL` 指定。
