// Canonical Luna runtime asset registry + deterministic state/frame mapping.
const asset = name => new URL(`../../assets/luna/${name}`, import.meta.url).href;

const idle = asset('hall/luna-main-clean.png');
const greetingWave = asset('hall/luna-wave-clean.png');
const idleBlink = asset('hall/luna-idle-blink-clean.png');
const idleTail = asset('hall/luna-idle-tail-clean.png');
const emotion = name => asset(`emotions/${name}.png`);
const emotionAssets = {
  angry:emotion('angry'),annoyed:emotion('annoyed'),pleading:emotion('pleading'),
  scared:emotion('scared'),sadEmotion:emotion('sad'),surprised:emotion('surprised'),
  laugh:emotion('laugh'),curious:emotion('curious'),warmHappy:emotion('happy')
};
const pet = asset('happy.webp');
const happy = asset('happy.webp');
const sad = emotionAssets.sadEmotion;
const sleepy = asset('sleepy.webp');
const sleep = asset('sleep.webp');
const eat = asset('eat.webp');
const actionDraw = asset('action-draw.webp');
const actionYarn = asset('action-yarn.webp');
const actionBath = asset('action-bath.webp');
const actionJump = asset('action-jump.webp');
const actionToilet = asset('action-toilet.webp');
const actionFrame = path => asset(`actions/${path}`);
const bathPeekNoFixture = actionFrame('bathroom/bath_peek_no_fixture.webp');
const toiletSitNoFixture = actionFrame('bathroom/toilet_sit_no_fixture.webp');
const bathroomFrames = {
  // Toilet artwork must NEVER contain a second toilet: the room already has its own fixture.
  toiletReady:idle,
  toiletSitDown:toiletSitNoFixture,
  toiletSitting:toiletSitNoFixture,
  toiletFinished:greetingWave,
  bathStepIn:bathPeekNoFixture,
  inTub:bathPeekNoFixture,
  bathSoap:bathPeekNoFixture,
  bathRinse:bathPeekNoFixture,
  bathStepOut:actionFrame('bathroom/046_04_bathroom_bath_shake_water.png'),
  bathShake:actionFrame('bathroom/046_04_bathroom_bath_shake_water.png'),
  bathTowel:actionFrame('bathroom/047_04_bathroom_bath_dry_towel.png'),
  bathFinished:actionFrame('bathroom/048_04_bathroom_bath_bath_finished.png')
};
const fishingFrames = Object.fromEntries([
  ['fishingReady','073_07_fishing_empty_bucket_rod.png'],['liftRod','074_07_fishing_lift_rod.png'],
  ['cast','075_07_fishing_cast_line.png'],['waiting','076_07_fishing_wait_for_fish.png'],
  ['biteFish','077_07_fishing_fish_bite.png'],['pullRod','078_07_fishing_pull_rod.png'],
  ['reeling','079_07_fishing_reel_line.png'],['fishOnHook','080_07_fishing_fish_on_hook.png'],
  ['fishSwing','081_07_fishing_fish_swing.png'],['holdFish','082_07_fishing_hold_fish_empty_bucket.png'],
  ['bucketFish','083_07_fishing_put_fish_in_bucket.png'],['fullBucket','084_07_fishing_full_bucket_celebrate.png']
].map(([stage,file])=>[stage,actionFrame(`fishing/${file}`)]));
const drawingFrames = Object.fromEntries([
  ['drawSit','097_09_drawing_seated_sit_blank_paper.png'],['drawPickPencil','098_09_drawing_seated_pick_pencil.png'],
  ['drawStart','099_09_drawing_seated_ready_to_draw.png'],['drawFirstLine','100_09_drawing_seated_first_line.png'],
  ['drawHeart','101_09_drawing_seated_draw_heart.png'],['drawOutline','102_09_drawing_seated_heart_outline.png'],
  ['drawColor','103_09_drawing_seated_color_heart.png'],['drawStars','104_09_drawing_seated_add_stars.png'],
  ['drawInspect','105_09_drawing_seated_inspect_picture.png'],['drawLift','106_09_drawing_seated_lift_picture.png'],
  ['showDrawing','107_09_drawing_seated_show_picture.png'],['drawProud','108_09_drawing_seated_proud_seated.png']
].map(([stage,file])=>[stage,actionFrame(`drawing/${file}`)]));
const feedFrames = Object.fromEntries(Array.from({length:12},(_,i)=>{
  const stage=`feed${String(i+1).padStart(2,'0')}`;
  return [stage,asset(`kitchen/feed/${stage}.png`)];
}));
const drinkFrames = Object.fromEntries(Array.from({length:6},(_,i)=>{
  const stage=`drink${String(i+1).padStart(2,'0')}`;
  return [stage,asset(`kitchen/drink/${stage}.png`)];
}));
const sleepFrames = Object.fromEntries(Array.from({length:10},(_,i)=>{
  const stage=`sleep${String(i+1).padStart(2,'0')}`;
  return [stage,asset(`bedroom/sleep/${stage}.png`)];
}));

export const LUNA_ASSETS = {
  idle, greetingWave, idleBlink, idleTail, ...emotionAssets, pet, happy, sad, sleepy, sleep, eat,
  hungry:idle,
  play:greetingWave,
  draw:drawingFrames.drawSit,
  bath:actionBath,
  toilet:actionToilet,
  fish:idle,
  jump:greetingWave,
  proud:happy,
  laugh:happy,
  surprised:idle,
  annoyed:sad
};

export const LUNA_MAIN = idle;

const stageMap = {
  ...feedFrames,
  ...drinkFrames,
  ...sleepFrames,
  ...bathroomFrames,
  ...fishingFrames,
  ...drawingFrames,
  danceLeft:greetingWave,
  danceRight:idleTail,
  danceJump:greetingWave,
  danceSpin:idleTail,
  macarenaArms:idle,
  macarenaArmsHigh:greetingWave,
  macarenaHands:idleTail,
  macarenaHips:idle,
  macarenaSide:idleTail,
  macarenaTurn:greetingWave,
  aramClap:greetingWave,
  aramClapAlt:idleTail,
  aramReach:idleTail,
  aramReachAlt:greetingWave,
  aramBounce:idle,
  aramSpin:greetingWave,
  hiphopBounce:idleTail,
  hiphopSlide:greetingWave,
  hiphopSlideBack:idle,
  hiphopPop:greetingWave,
  hiphopWave:idleTail,
  hiphopSpin:greetingWave,
  hiphopFreeze:idle,
  hiphopJump:greetingWave,
  danceFinish:greetingWave,
  schoolThink:idleTail,
  schoolWrite:drawingFrames.drawStart,
  schoolCorrect:greetingWave,
  schoolWrong:idleTail,
  schoolAngry:idleTail,
  schoolSad:idleTail,
  dressHappy:emotionAssets.laugh,
  petBliss:emotionAssets.laugh,
  // Expression-only images are bust portraits; gameplay needs whole-body art.
  toySurprise:greetingWave,
  toyScared:idle,
  toyAnnoyed:idleTail,
  toyAngry:idleTail,
  playReady:idle,
  playReach:greetingWave,
  playCatch:greetingWave,
  idle,
  idleBlink,
  idleTail,
  greetingIdle:idle,
  greetingWave,
  arrived:idle,
  asking:emotionAssets.pleading,
  stroking:pet,
  happy:emotionAssets.warmHappy,
  satisfied:emotionAssets.warmHappy,
  celebrate:greetingWave,
  newOutfit:greetingWave,
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
  sitting:bathroomFrames.toiletSitting,
  using:bathroomFrames.toiletSitting,
  finished:bathroomFrames.toiletFinished,
  readyToScrub:bathroomFrames.bathSoap,
  scrubbing:bathroomFrames.bathSoap,
  rinsing:bathroomFrames.bathRinse,
  wet:bathroomFrames.bathRinse,
  drying:bathroomFrames.bathTowel,
  fresh:bathroomFrames.bathFinished,
  drawing:drawingFrames.drawHeart,
  drawFinish:drawingFrames.drawInspect,
  proud:emotionAssets.warmHappy,
  catch:fishingFrames.fullBucket,
  miss:emotionAssets.sadEmotion,
  ...emotionAssets,
  preview:idle,
  equipped:actionJump,
  jumping:greetingWave,
  chasing:idleTail,
  drumming:happy
};

export function lunaAssetFor({ sleeping=false, emotion='calm', activity='idle', stage='idle' }={}){
  const type = typeof activity === 'object' ? (activity.type || 'idle') : activity;
  const phase = typeof activity === 'object' ? (activity.stage || stage || 'idle') : stage;
  if (stageMap[phase] && (phase !== 'idle' || emotion === 'calm')) return stageMap[phase];
  if (sleeping || type === 'sleep' || phase === 'sleeping') return sleep;
  if (type === 'petting' || type === 'petted') return pet;
  if (type === 'eating' || type === 'drink') return eat;
  if (type === 'toiletNeed') return sad;
  if (type === 'toilet') return actionToilet;
  if (['bath','bathReady','soap','shampoo','shower','bathBomb','towel'].includes(type)) return actionBath;
  if (type === 'draw') return actionDraw;
  if (type === 'play') return greetingWave;
  if (type === 'jump' || type === 'celebrate' || type === 'levelup') return greetingWave;
  if (type === 'happy' || type === 'dress' || type === 'drum') return happy;
  if (type === 'sad') return sad;
  if (emotion === 'tired') return sleepy;
  if (emotion === 'hungry' || emotion === 'thirsty') return emotionAssets.pleading;
  if (emotion === 'dirty') return emotionAssets.annoyed;
  if (emotion === 'annoyed') return emotionAssets.annoyed;
  if (emotion === 'angry') return emotionAssets.angry;
  if (emotion === 'sad' || emotion === 'toilet' || emotion === 'dirty') return sad;
  if (emotion === 'joyful') return emotionAssets.warmHappy;
  return idle;
}

// iOS Telegram WebView cannot reliably decode 100+ large transparent PNGs at once.
// Keep only the essential idle frames warm. Actions load their own frames on demand.
export const LUNA_PRELOAD = [idle, idleBlink, idleTail, greetingWave];

export function sequenceFrameSources(type,frames=[]){
  return [...new Set(frames.map(frame=>lunaAssetFor({activity:type,stage:frame.stage})))];
}

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
