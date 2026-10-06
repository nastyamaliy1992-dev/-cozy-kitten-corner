import { lunaAssetFor } from '../data/lunaAsset.js';

export function renderPet({sleeping=false,emotion='calm',activity='idle',movement={x:50,y:78,facing:1}}={}){
  const stateClass = sleeping ? 'is-sleeping' : `emotion-${emotion}`;
  const lunaAsset = lunaAssetFor({sleeping,emotion,activity});
  const pose = sleeping || activity==='sleep' ? 'sleep'
    : activity==='eating' ? 'eat'
    : activity==='drink' ? 'drink'
    : ['petted','petting'].includes(activity) ? 'pet'
    : ['happy','celebrate','levelup','jump'].includes(activity) ? 'happy'
    : activity==='play' ? 'play'
    : activity==='draw' ? 'draw'
    : activity==='drum' ? 'drum'
    : ['bath','bathReady','soap','bathBomb'].includes(activity) ? 'bath'
    : activity==='toilet' ? 'toilet'
    : activity==='toiletNeed' ? 'toilet-need'
    : activity==='fish' ? 'fish'
    : activity==='sad' ? 'sad'
    : emotion==='joyful' ? 'happy' : 'idle';
  const assetState = sleeping ? 'sleep' : pose;
  const pos=`--luna-x:${movement?.x??50};--luna-y:${movement?.y??78};--luna-facing:${movement?.facing??1}`;
  return `<div class="pet-stage ${stateClass} pose-${pose}" data-emotion="${emotion}" data-pose="${pose}" data-luna-state="${assetState}" style="${pos}" aria-label="Luna">
    <img class="luna-photo" src="${lunaAsset}" alt="Luna" draggable="false" decoding="async" fetchpriority="high">
    <span class="pet-life-glow" aria-hidden="true"></span>
    ${sleeping?'<div class="sleep-z" aria-hidden="true">Z <span>z</span></div>':''}
  </div>`;
}
