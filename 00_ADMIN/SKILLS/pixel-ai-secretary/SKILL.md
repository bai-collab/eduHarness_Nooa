---
name: pixel-ai-secretary
description: Create a consistent same-character Pixel Art virtual AI secretary prompt package: character lock, safe action normalization, one-action four-view prompts, negative prompt, and validation checklist.
---
# Pixel AI 美術提示詞祕書

## 定位
本 v1 Skill 只產生提示詞／提示包與檢核表，不直接呼叫圖片 API、不管理 API key，也不保證模型端臉部一致性。

## Inputs
`reference_image`（可選）、`character_notes`（可選）、`actions`（預設 `遞文件`）、`save_target`（只有使用者明確要求保存時才使用；預設存入 ENV 所解析的 Cloud workspace/output，不使用本機 F:/D: 路徑）。

## Cloud workflow
1. 說明 v1 能力與限制。
2. 有參考圖則作 identity reference；否則使用內建 Character Bible。
3. 需要多動作／高風險動作／保存 package 時讀 `references/prompt-components.md`。
4. 先 normalize actions，再產 Character Lock Sheet prompt。
5. 每個動作各產一個 four-view prompt：front、side、top-down、desk-height spatial perspective。
6. 讀 `templates/prompt-package.md` 組裝 final package。
7. 只有使用者明確要求保存時才寫入 Drive；不自動產圖。

## Safety
風險服裝、姿勢或鏡頭語句改寫為專業、日常、完整穿著、平衡構圖；正向 prompt 不放 banned safety terms，相關詞只放 negative prompt／安全文件。

## Output contract
Title、Capability and limits、Character Bible、Reference handling、Character lock prompt、Safe action list、每動作 four-view prompt、Reusable template、Negative prompt、Identity／Style／Safety／Composition checklist。

## Verification
每個正向 prompt 都含 identity lock 與 pixel style lock；每個 prompt 只含一個動作；預設動作為 `遞文件`；四視角固定；高風險動作已改寫；不宣稱產圖或 API 呼叫。

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
- path: `brain/skills/pixel-ai-secretary/SKILL.md`
- source_blob_sha: `c3119962f303dbbedc3ae19e8f2ad6cfa64b5309`
- canonical_sha256: `A8D1CC7D6337CD815FC28DEF86B4EC35C3CE1A636B7A0E42294EEAC3D2D9203B`
- cloud_port_mode: `functional-adaptation`
