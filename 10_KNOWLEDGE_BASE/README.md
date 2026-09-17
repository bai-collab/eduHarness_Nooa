# 10_KNOWLEDGE_BASE

eduHarness Cloud 的可重用知識資料區。

## 用途

- 保存經確認、可跨任務重複使用的 Knowledge。
- 作為 Brain Index 所索引之知識資源的標準 installation 位置。
- 教師可在自己的 Google Drive installation 中加入個人或教學領域知識。
- Canonical Distribution 可保存 portable、可分享、可按需載入的 Official Knowledge。

## Canonical Knowledge packages

- `課綱_各領域/`：臺灣課綱官方知識資源；教案撰寫時依領域與學習階段按需載入。
- `AI素養/README_AI素養知識庫.md`：臺灣中小學 AI 素養知識索引；當教案、課程活動、評量、生成式 AI、人機協作、AI 倫理、提示詞、幻覺、偏見、深偽、個資或學術誠信等概念相關時，先讀索引，再只載入必要子檔案。

## Installation 規則

此目錄是 eduHarness Cloud 標準 runtime 結構的一部分。安裝或修復流程應確保 Google Drive 中存在 `10_KNOWLEDGE_BASE`，即使目前沒有任何 installation-owned 知識檔案。

GitHub Canonical Distribution 中的 Official Knowledge 由 runtime 依 pinned immutable Distribution snapshot 直接解析，不要求複製到 installation Artifact Index；installation-owned Knowledge 仍依正式 ENV／Brain Index／Artifact Index 規則解析。

## 邊界

GitHub 僅保存 portable 的目錄契約與可分享內容。教師個人資料、installation-specific Drive URL、學生個資與其他不應公開的內容不得因同步而回推至 Canonical Distribution。
