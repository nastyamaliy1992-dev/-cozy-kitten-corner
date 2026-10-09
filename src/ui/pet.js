import { lunaAssetFor } from '../data/lunaAsset.js?v=20261010-poses-hotfix3';

export function renderPet({sleeping=false,emotion='calm',activity='idle',stage='idle',movement={x:50,y:78,facing:1}}={}){
  const type = typeof activity === 'object' ? (activity.type || 'idle') : activity;
  const phase = typeof activity === 'object' ? (activity.stage || stage || 'idle') : stage;
  const stateClass = sleeping ? 'is-sleeping' : `emotion-${emotion}`;
  const lunaAsset = lunaAssetFor({sleeping,emotion,activity:type,stage:phase});
  const pose = sleeping || type==='sleep' ? 'sleep'
    : type==='greeting' ? 'greeting'
    : type==='eating' ? 'eat'
    : type==='drink' ? 'drink'
    : ['petted','petting'].includes(type) ? 'pet'
    : ['happy','celebrate','levelup','jump'].includes(type) ? 'happy'
    : type==='play' ? 'play'
    : type==='draw' ? 'draw'
    : type==='drum' ? 'drum'
    : ['bath','bathReady','soap','shampoo','shower','bathBomb','towel'].includes(type) ? 'bath'
    : type==='toilet' ? 'toilet'
    : type==='toiletNeed' ? 'toilet-need'
    : ['fish','fishGame','fishCatch'].includes(type) ? 'fish'
    : type==='sad' ? 'sad'
    : emotion==='joyful' ? 'happy' : 'idle';
  const x=movement?.x??50,y=movement?.y??78;
  const pos=`--luna-x:${x};--luna-y:${y};--luna-bottom:${Math.max(0,100-y)}%;--luna-facing:${movement?.facing??1}`;
  return `<div class="pet-stage ${stateClass} pose-${pose}" data-emotion="${emotion}" data-pose="${pose}" data-luna-state="${type}" data-luna-stage="${phase}" style="${pos}" aria-label="Luna">
    <img class="luna-photo" src="${lunaAsset}" alt="Luna" draggable="false" decoding="async" fetchpriority="high">
    <span class="pet-life-glow" aria-hidden="true"></span>
    ${sleeping?'<div class="sleep-z" aria-hidden="true">Z <span>z</span></div>':''}
  </div>`;
}
