import { lunaAssetFor } from '../data/lunaAsset.js';

export function renderPet({sleeping=false,emotion='calm',activity='idle',movement={x:50,y:78,facing:1}}={}){
  const stateClass = sleeping ? 'is-sleeping' : `emotion-${emotion}`;
  const lunaAsset = lunaAssetFor({sleeping,emotion,activity});
  const assetState = sleeping ? 'sleep' : activity==='eating' ? 'eat' : activity==='petted' ? 'pet' : activity==='happy' ? 'happy' : emotion==='tired' ? 'sleepy' : emotion==='hungry' ? 'hungry' : emotion==='sad' ? 'sad' : emotion==='joyful' ? 'happy' : 'idle';
  const pose = sleeping ? 'sleep' : activity==='eating' ? 'eat' : activity==='petted' ? 'pet' : activity==='happy' ? 'happy' : activity==='play' ? 'play' : activity==='bath' ? 'bath' : activity==='toilet' ? 'toilet' : emotion==='joyful' ? 'happy' : 'idle';
  const pos=`--luna-x:${movement?.x??50};--luna-y:${movement?.y??78};--luna-facing:${movement?.facing??1}`;
  return `<div class="pet-stage ${stateClass} pose-${pose}" data-emotion="${emotion}" data-pose="${pose}" data-luna-state="${assetState}" style="${pos}" aria-label="Luna">
    <img class="luna-photo" src="${lunaAsset}" alt="Luna" draggable="false" decoding="async" fetchpriority="high">
    <span class="pet-life-glow" aria-hidden="true"></span>
    ${sleeping?'<div class="sleep-z" aria-hidden="true">Z <span>z</span></div>':''}
  </div>`;
}
