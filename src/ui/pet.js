import { LUNA_MAIN } from '../data/lunaAsset.js';

export function renderPet({sleeping=false,emotion='calm'}={}){
  const stateClass = sleeping ? 'is-sleeping' : `emotion-${emotion}`;
  return `<div class="pet-stage ${stateClass}" data-emotion="${emotion}" aria-label="Luna">
    <img class="luna-photo" src="${LUNA_MAIN}" alt="Серо-белая Luna" draggable="false">
    <span class="pet-life-glow" aria-hidden="true"></span>
    ${sleeping?'<div class="sleep-z" aria-hidden="true">Z <span>z</span></div>':''}
  </div>`;
}