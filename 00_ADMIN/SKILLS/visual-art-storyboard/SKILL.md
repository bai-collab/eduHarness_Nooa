---
name: visual-art-storyboard
description: 規劃美術方向、角色、場景、素材提示與可選的八格連續分鏡；分鏡預設關閉，明確要求 `/gb`、運鏡八格或連續鏡頭時啟用。
---
# 美工與分鏡設計

## 核心原則
- 預設 `art-only`；不自行增加分鏡。
- `/gb`、運鏡八格、明確分鏡要求 → `storyboard-on`。
- 多場景、連續動作或鏡頭演出有明顯價值時可詢問一次；未回答不阻塞 art-only。

## Cloud workflow
1. 確認用途、受眾、媒介、風格、比例、角色／場景限制、參考素材。
2. 建立視覺語彙、色彩、光線、構圖、角色辨識特徵、場景層次、asset list。
3. 建立角色一致性錨點：服裝、輪廓、比例、配色、道具、表情、不可變特徵。
4. storyboard-on 時讀 `references/storyboard-prompts.md`，建立 8 個連續鏡頭。
5. 使用者明確要求產圖且當次平台具備圖片生成能力時才生成；否則交付提示與分鏡規格，不宣稱已產圖。

## 八格契約
每格標示景別、鏡頭方向／運動、角色動作、場景變化、敘事目的、銜接點；角色外觀、道具、光源、左右位置、空間軸線需連續。

## Output contract
- art-only：美術方向、角色／場景規格、資產清單、生成提示。
- storyboard-on：另含八格分鏡表、角色一致性錨點、鏡頭連續性檢查、完整生成提示。

## Stopping / Human Gate
影片／補幀／影片模型參數不在本 Skill；停在分鏡與提示交接。涉及對外發布或未成年人敏感呈現時採教師／使用者審查。

## Verification
檢查角色一致性、空間／光線／左右軸連續、八格是否為同一事件、每格是否推進資訊、教育內容不只靠顏色傳達關鍵資訊。

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
- path: `brain/skills/visual-art-storyboard/SKILL.md`
- source_blob_sha: `c02d2481d3d304733f620272a6a4f9126f69ab82`
- canonical_sha256: `F30A07F3349458D2CC552A1F6C1489C28EFECCE55D643585D9F9EF24BD2F8697`
- upstream_version: `1`
- cloud_port_mode: `functional-adaptation`
