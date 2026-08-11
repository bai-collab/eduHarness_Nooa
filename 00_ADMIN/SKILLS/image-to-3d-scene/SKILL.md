---
name: image-to-3d-scene
description: Rebuild a supplied scene image as an interactive, orbitable Three.js showcase specification/page using procedural assets; verify visually when the current runtime provides executable browser/screenshot tooling, otherwise report verification as deferred.
---
# 圖片轉3D

## 定位
把一張場景圖重建為可環繞 Three.js 展示頁。不是攝影測量、深度估計，也不宣稱輸出 GLB／OBJ／FBX。

## 必要輸入
一張可讀取的來源圖片。沒有圖片時停止並要求提供。

## Cloud workflow
1. 先讀圖並建立 scene spec：layout、geometry、lighting、palette、atmosphere、style call。
2. 讀 `references/threejs-recipes.md`，建立單頁 Three.js 規格／HTML；保留 SRGB、ACES、OrbitControls、responsive、touch、performance 等必要契約。
3. 預設鏡頭重現原圖構圖；材質優先 procedural assets。
4. 若 runtime 有可執行瀏覽器／頁面預覽與截圖工具，至少做 2 輪：render → screenshot → compare → fix；檢查 console、orbit、clipping、z-fighting。
5. 若沒有 browser verify 能力，仍可交付程式／規格，但必須標記 `⏳ VISUAL_VERIFICATION_DEFERRED`，不得聲稱已視覺驗證或可公開發佈。

## Output contract
scene spec、單頁 HTML／程式規格、使用方式、實際完成的 verification rounds、差異與未驗證項目。

## Stopping / Human Gate
- 無來源圖 → 停止。
- 外部部署、付費服務、上傳未授權素材 → 使用者核准。
- runtime 缺 browser／server 等效能力 → 不阻擋規格產出，但不得升級成「已驗證」。

## Verification
若工具可用：零 console error、互動／touch／resize 正常、預設鏡頭構圖近似來源、剩餘差異需明列；若工具不可用則狀態為 deferred。

## Cloud runtime boundary

- Runtime：ChatGPT Web / Gemini Spark；實際能力以當次可用工具與 Connected Apps 為準。
- 不假設 shell、Git CLI、本機絕對路徑、Node.js、daemon、hooks、localhost server 或真實 while-loop。
- 文件／檔案內容使用當次平台可用的 Drive、上傳檔案或文件讀取工具；工具不可用時回報 `⏳ SOURCE_UNAVAILABLE`。
- 只有工具實際成功後，才能宣稱已建立、修改、儲存、上傳、部署或產圖。
- 不保存 secrets、tokens、credentials、private keys 或學生個資。

## Upstream metadata

- repository: `https://github.com/bai-collab/eduHarness-.git`
- branch: `main`
- snapshot_commit: `95234c8b0b6da75b34f0f032ef29272a0f194aa4`
- path: `brain/skills/image-to-3d-scene/SKILL.md`
- source_blob_sha: `2aab1e31bab6a2e850dc411cdb36f0e7dc1c708d`
- canonical_sha256: `F2BD6AE48111E6BED4907EFA032EFC3DD6B43135C2BF4686994AAF775F629663`
- upstream_version: `1`
- cloud_port_mode: `functional-adaptation`
