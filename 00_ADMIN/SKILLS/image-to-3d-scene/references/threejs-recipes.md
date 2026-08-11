# Three.js Recipes — Cloud adaptation

本檔保留上游 `threejs-recipes.md` 的功能意圖；Cloud runtime 不假設 localhost、shell 或瀏覽器自動化存在。

## 1. Page skeleton
- Three.js `0.170.0`（若使用 CDN，需確認交付環境允許外部 host）。
- `renderer.outputColorSpace = THREE.SRGBColorSpace`。
- `renderer.toneMapping = THREE.ACESFilmicToneMapping`。
- OrbitControls damping、min/max distance、polar/azimuth clamp。
- resize handler、pixelRatio ≤ 2、touch support。

```html
<div id="app"></div><div id="hint">拖曳環繞・滾輪縮放</div>
<script type="module">
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js';
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,0.1,200);
const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true;
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera)});
</script>
```

## 2. Geometry / camera
以 box、plane、cylinder、lathe、extrude、InstancedMesh 對應主要物件；預設鏡頭需重現來源圖的構圖。限制 orbit，避免看到未建構背面。

## 3. Lighting
- 日間：Directional + Hemisphere。
- 黃昏：低角度暖 key + 冷 fill + 暖 fog。
- 夜間：冷月光 + practical point lights；必要時 bloom。
- 室內：window-direction spotlight + low ambient + emissive fixtures。
- 霓虹：emissive + selective bloom。
優先匹配來源圖的主光方向與陰影硬度。

## 4. Procedural textures
CanvasTexture 適用 noise、speckle、plank、brick、window grids；避免每 frame 配置新物件。自然材質 roughness 約 0.7–1.0，玻璃／金屬／水再降低 roughness。

## 5. Atmosphere
Sky dome + fog，fog color 接近 horizon；粒子可做 dust/snow/rain/fireflies。動畫 loop 內重用 buffer／vector。

## 6. Optional effects
Bloom、camera intro、Raycaster hover/click、gesture-gated WebAudio 都是可選；使用前確認 runtime／交付環境支援。

## 7. Performance
InstancedMesh 處理重複物、shadow map ≤ 2048、單一主要 cast-shadow light、pixelRatio ≤ 2、fog 隱藏遠平面、行動裝置測試 touch／pinch。

## 8. Verification contract
若有 browser/screenshot 工具：至少兩輪 screenshot compare，檢查 console、orbit、clipping、z-fighting、composition、palette、light direction、mood。若沒有，標記 `⏳ VISUAL_VERIFICATION_DEFERRED`。

## 9. Offline / CSP
若交付環境阻擋 CDN，需 bundle/inlining；只有 runtime 真能執行 bundle 工具時才執行，否則交付離線適配指引，不宣稱已 bundle。

Upstream source blob: `151addc2874e173beac64038c4a9ae9f01bc33b3`.
