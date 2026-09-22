import { lunaAssetFor } from '../data/lunaAsset.js';

export function renderPet({sleeping=false,emotion='calm',activity='idle'}={}){
  const stateClass = sleeping ? 'is-sleeping' : `emotion-${emotion}`;
  const lunaAsset = lunaAssetFor({sleeping,emotion,activity});
  const assetState = sleeping ? 'sleep' : activity==='petted' ? 'happy' : emotion==='tired' ? 'sleepy' : emotion==='hungry' ? 'hungry' : emotion==='sad' ? 'sad' : emotion==='joyful' ? 'happy' : 'idle';
  const pose = sleeping ? 'sleep' : activity==='eating' ? 'eat' : activity==='petted' ? 'happy' : activity==='play' ? 'play' : emotion==='joyful' ? 'happy' : 'idle';
  return `<div class="pet-stage ${stateClass} pose-${pose}" data-emotion="${emotion}" data-pose="${pose}" data-luna-state="${assetState}" aria-label="Luna">
    <img class="luna-photo" src="${lunaAsset}" alt="Luna" draggable="false" decoding="async" fetchpriority="high">
    <span class="pet-life-glow" aria-hidden="true"></span>
    ${sleeping?'<div class="sleep-z" aria-hidden="true">Z <span>z</span></div>':''}
  </div>`;
}
