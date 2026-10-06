// Canonical Luna runtime asset registry + deterministic state/frame mapping.
const asset = name => new URL(`../../assets/luna/${name}`, import.meta.url).href;

const idle = asset('idle.webp');
const pet = asset('happy.webp');
const happy = asset('happy.webp');
const sad = asset('sad.webp');
const sleepy = asset('sleepy.webp');
const sleep = asset('sleep.webp');
const eat = asset('eat.webp');
const actionDraw = asset('action-draw.webp');
const actionYarn = asset('action-yarn.webp');
const actionBath = asset('action-bath.webp');
const actionJump = asset('action-jump.webp');
const actionToilet = asset('action-toilet.webp');

export const LUNA_ASSETS = {
  idle, pet, happy, sad, sleepy, sleep, eat,
  hungry:eat,
  play:actionYarn,
  draw:actionDraw,
  bath:actionBath,
  toilet:actionToilet,
  fish:idle,
  jump:actionJump,
  proud:happy,
  laugh:happy,
  surprised:idle,
  annoyed:sad
};

export const LUNA_MAIN = idle;

const stageMap = {
  idle,
  arrived:idle,
  asking:sad,
  stroking:pet,
  happy:happy,
  satisfied:happy,
  celebrate:actionJump,
  newOutfit:actionJump,
  mouthOpen:eat,
  bite:eat,
  chew1:eat,
  chew2:eat,
  swallow:eat,
  lick:happy,
  drinking:eat,
  sleepy:sleepy,
  yawn:sleepy,
  lying:sleep,
  sleeping:sleep,
  wake:sleepy,
  stretch:happy,
  approaching:idle,
  sitting:actionToilet,
  using:actionToilet,
  finished:happy,
  inTub:actionBath,
  readyToScrub:actionBath,
  scrubbing:actionBath,
  rinsing:actionBath,
  wet:actionBath,
  drying:actionBath,
  fresh:happy,
  drawSit:actionDraw,
  drawStart:actionDraw,
  drawing:actionDraw,
  drawFinish:actionDraw,
  showDrawing:actionDraw,
  proud:happy,
  cast:idle,
  waiting:idle,
  biteFish:idle,
  reeling:idle,
  catch:actionJump,
  miss:sad,
  preview:idle,
  equipped:actionJump,
  jumping:actionJump,
  chasing:actionYarn,
  drumming:happy
};

export function lunaAssetFor({ sleeping=false, emotion='calm', activity='idle', stage='idle' }={}){
  const type = typeof activity === 'object' ? (activity.type || 'idle') : activity;
  const phase = typeof activity === 'object' ? (activity.stage || stage || 'idle') : stage;
  if (sleeping || type === 'sleep' || phase === 'sleeping') return sleep;
  if (stageMap[phase]) return stageMap[phase];
  if (type === 'petting' || type === 'petted') return pet;
  if (type === 'eating' || type === 'drink') return eat;
  if (type === 'toiletNeed') return sad;
  if (type === 'toilet') return actionToilet;
  if (['bath','bathReady','soap','shampoo','shower','bathBomb','towel'].includes(type)) return actionBath;
  if (type === 'draw') return actionDraw;
  if (type === 'play') return actionYarn;
  if (type === 'jump' || type === 'celebrate' || type === 'levelup') return actionJump;
  if (type === 'happy' || type === 'dress' || type === 'drum') return happy;
  if (type === 'sad') return sad;
  if (emotion === 'tired') return sleepy;
  if (emotion === 'hungry') return eat;
  if (emotion === 'sad' || emotion === 'toilet' || emotion === 'dirty') return sad;
  if (emotion === 'joyful') return happy;
  return idle;
}

export const LUNA_PRELOAD = [...new Set(Object.values(LUNA_ASSETS))];

let preloadPromise;
export function preloadLunaFrames(){
  if (preloadPromise) return preloadPromise;
  preloadPromise = Promise.all(LUNA_PRELOAD.map(src => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve({src,ok:true});
    img.onerror = () => resolve({src,ok:false});
    img.decoding = 'async';
    img.src = src;
  })));
  return preloadPromise;
}
