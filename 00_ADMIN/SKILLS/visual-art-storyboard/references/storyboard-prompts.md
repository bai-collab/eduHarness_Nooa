# Storyboard Prompts

## Activation
- `/gb`：使用者已明確啟用八格分鏡，不再詢問。
- 明確要求運鏡八格、連續鏡頭、PREVIS → storyboard-on。
- 一般生圖維持 art-only。

## Shared Preconditions
先完成主 Skill 的 Visual Spec、identity anchors、hard constraints 與必要 structural pass，再進入分鏡。八格不得重新定義角色 identity。

## 八格契約
每格標示：
- 景別
- 鏡頭方向／運動
- 角色動作
- 場景變化
- 敘事目的
- 銜接點

## Continuity Anchors
- same character identity
- costume / props
- lighting direction
- screen direction
- spatial axis
- object location
- action phase

## Motion Design Guidance
先決定「為什麼動」再決定「怎麼動」：
1. 敘事目的
2. 動作節奏
3. 重點動作與停頓
4. camera motivation
5. easing / acceleration 的視覺感受
6. 前後鏡頭銜接

本 Skill 只規劃 motion concept 與 storyboard，不輸出 Lottie JSON、影片檔或影片模型參數。

## PREVIS Prompt Pattern
`Create an 8-frame cinematic PREVIS storyboard of one continuous event. Preserve the exact character identity, costume, props, lighting direction, screen direction and spatial relationships. Each frame must show a meaningful action phase and motivated camera change. Label shot size, camera movement, character action, scene change, narrative purpose and transition cue.`

## Table
| 格次 | 景別 | 鏡頭方向／運動 | 角色動作 | 場景變化 | 敘事目的 | 銜接點 |
|---|---|---|---|---|---|---|
| 1–8 | 遠/中/近等 | 推/拉/搖/移/跟/固定 | 明確 action phase | 光線/空間/事件 | 推進資訊 | 與下一格 continuity |

## Verification
- 八格是同一事件，不是八張無關海報。
- identity、服裝、道具、主要色彩與光源一致。
- 左右方向、視線、動作軸線連續。
- camera change 有敘事目的，不為變化而變化。
- 動作從 anticipation → action → follow-through 等階段自然推進（若適用）。
- 最後一格形成下一幕可接續狀態。
