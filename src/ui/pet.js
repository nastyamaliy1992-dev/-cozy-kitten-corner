import { LUNA_MAIN } from '../data/lunaAsset.js';

export function renderPet({sleeping=false,emotion='calm',activity='idle'}={}){
  const stateClass = sleeping ? 'is-sleeping' : `emotion-${emotion}`;
  const pose = sleeping ? 'sleep' : activity==='eating' ? 'eat' : activity==='petted' ? 'happy' : activity==='play' ? 'play' : emotion==='joyful' ? 'happy' : 'idle';
  return `<div class="pet-stage ${stateClass} pose-${pose}" data-emotion="${emotion}" data-pose="${pose}" aria-label="Luna">
    <img class="luna-photo" src="${LUNA_MAIN}" alt="Luna" draggable="false">
    <span class="pet-life-glow" aria-hidden="true"></span>
    ${sleeping?'<div class="sleep-z" aria-hidden="true">Z <span>z</span></div>':''}
  </div>`;
}
