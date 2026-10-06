import { renderWelcome,renderGame } from './ui/appView.js?v=20261006-roomfix2';
import { createInitialState,restoreState,tickState,petKitten,feedKitten,consumeFoodUnit,finishMeal,consumeDrinkUnit,finishDrink,setSleeping,drink,bathe,useToilet,play,getWant,wantSpeech,toggleLamp,rewardPetting,moveLuna,grantStarterPack } from './core/state.js?v=20261006-roomfix2';
import { saveGame } from './core/persistence.js';import { t } from './data/localization.js';
import { startRoomMusic,stopMusic,sfx,purr,waterSound,flushSound,fartSound,applauseSound,happyJingle,sleepyChime,eatSound,biteSound,chewSound,swallowSound,lickSound,meow,configureAudio,unlockAudio,speakLuna,splashSound,bubbleSound,giggleSound,sadWhimper,drumSound,introTheme } from './core/audio.js';
import { buyItem,equipItem,applyFurniture,catalog,grantPremiumItem } from './core/shop.js';
import { dailyReward,claimQuest,track,unlockAchievement,addDrawing,processLevels } from './core/progression.js';
import { castLine,catchFish } from './core/fishing.js';
import { initTelegram,bindTelegramBack,haptic,openBotPurchase,readTelegramPurchaseGrant,clearTelegramPurchaseGrant } from './core/telegram.js';
import { preloadRoomBackgrounds } from './data/roomAssets.js';
import { preloadLunaFrames,lunaAssetFor } from './data/lunaAsset.js?v=20261006-roomfix2';
const telegram=initTelegram();
preloadLunaFrames();
let launchIntroPending=true;
const app=document.querySelector('#app');let state=restoreState(),bubble='',bubbleTimer=null,actionLock=false,soundOn=false,lastWant=null,lastWantAt=0,petReactionTimer=null,ui={fridgeOpen:false,settingsOpen:false,panel:null,shopCategory:'all',selectedFood:null};
if(state){state.room='living';state.sleeping=false;state.sleepStartedAt=null;state.movement={...(state.movement||{}),x:50,y:78,facing:1,target:'idle'};state.activity={type:'idle',stage:'idle',startedAt:Date.now()}}
if(state&&telegram.available){const grant=readTelegramPurchaseGrant();if(grant){const g=grantPremiumItem(state,grant.item,grant.receipt);state=g.state;saveGame(state);clearTelegramPurchaseGrant();if(g.ok)setTimeout(()=>showBubble('Оплата Stars подтверждена ⭐ Предмет уже в гардеробе!',2600),500)}}
const lang=()=>state?.settings?.language||'ru';
let audioUnlocked=false;async function unlockGameAudio(){if(audioUnlocked||!state)return;audioUnlocked=true;try{await unlockAudio();soundOn=true;startRoomMusic(state.room)}catch{audioUnlocked=false}}
document.addEventListener('pointerdown',async()=>{await unlockGameAudio();if(launchIntroPending&&state){launchIntroPending=false;startGreeting()}},{once:false,passive:true});
bindTelegramBack(()=>{if(ui.panel||ui.settingsOpen){ui.panel=null;ui.settingsOpen=false;render()}else if(state?.room&&state.room!=='living'){state.room='living';persist();render()}});
function showBubble(text,ms=1500){bubble=text;clearTimeout(bubbleTimer);render();bubbleTimer=setTimeout(()=>{bubble='';render()},ms)}
let lunaSequenceToken=0;
function syncLunaFrame(type,stage){
  if(!state)return;
  state.activity={...(state.activity||{}),type,stage};
  const img=document.querySelector('.luna-photo');
  const petStage=document.querySelector('.pet-stage');
  if(img){
    const next=lunaAssetFor({sleeping:state.sleeping,activity:type,stage});
    if(img.src!==next)img.src=next;
  }
  if(petStage){petStage.dataset.lunaState=type;petStage.dataset.lunaStage=stage}
  const feedingLayer=document.querySelector('.feeding-sequence-layer');
  if(feedingLayer&&type==='eating')feedingLayer.dataset.stage=stage;
}
function cancelLunaSequence(){
  lunaSequenceToken++;
  actionLock=false;
}
function runLunaSequence(type,frames,{extra={},onFrame=null,onDone=null,keepLocked=false}={}){
  if(!state)return;
  const token=++lunaSequenceToken;
  actionLock=true;
  const first=frames[0]||{stage:'idle',ms:120};
  state.activity={type,stage:first.stage,startedAt:Date.now(),...extra};
  persist();
  render();
  let index=0;
  const step=()=>{
    if(token!==lunaSequenceToken||!state)return;
    if(index>=frames.length){
      onDone?.();
      if(token!==lunaSequenceToken||!state)return;
      if(!keepLocked){
        state.activity={type:'idle',stage:'idle',startedAt:Date.now()};
        actionLock=false;
        persist();
        render();
      }
      return;
    }
    const frame=frames[index++];
    state.activity={...(state.activity||{}),type,stage:frame.stage,frameIndex:index-1};
    syncLunaFrame(type,frame.stage);
    onFrame?.(frame,index-1);
    setTimeout(step,frame.ms);
  };
  step();
}
function startGreeting(){
  if(!state)return;
  state.room='living';
  state.movement={...(state.movement||{}),x:50,y:78,facing:1,target:'idle'};
  introTheme();
  showBubble('Привет, я Луна. Я тебя ждала! ♥',2600);
  runLunaSequence('greeting',[
    {stage:'greetingIdle',ms:180},
    {stage:'greetingWave',ms:440},
    {stage:'greetingIdle',ms:170},
    {stage:'greetingWave',ms:440},
    {stage:'greetingIdle',ms:420}
  ],{onFrame:(frame,index)=>{if(frame.stage==='greetingWave'&&index===1){meow('happy');speakLuna('Привет, я Луна. Я тебя ждала!')}}});
}
function persist(){if(!state)return;const lv=processLevels(state);state=lv.state;if(lv.leveled.length){state.activity={type:'levelup',stage:'celebrate',startedAt:Date.now()};happyJingle();sfx('level');const last=lv.leveled.at(-1);bubble=`Уровень ${last.level}! +${last.coins} 🪙`}state.lastSeenAt=Date.now();saveGame(state)}
function render(){if(state)configureAudio(state.settings);if(!state){app.innerHTML=renderWelcome('ru');bindWelcome();return}app.innerHTML=renderGame(state,bubble,ui);bindGame()}
function bindWelcome(){const input=document.querySelector('#pet-name'),start=document.querySelector('#start-game');input.addEventListener('input',()=>start.disabled=!input.value.trim());start.addEventListener('click',()=>{const name=input.value.trim();if(!name)return;state=createInitialState(name,'ru');const starter=grantStarterPack(state);state=starter.state;persist();startRoomMusic('living');render();setTimeout(()=>{sfx('coin');meow('happy');speakLuna('Привет! Я Луна. Давай играть!');showBubble('Привет! Я Luna ♥ Стартовый подарок уже у тебя!',2600)},350)})}
function moveTo(target,after,ms=320){if(actionLock)return;actionLock=true;state=moveLuna(state,target);state.activity={type:'walk',stage:'moving',startedAt:Date.now()};persist();render();setTimeout(()=>{state.activity={type:'idle',stage:'arrived',startedAt:Date.now()};persist();render();actionLock=false;after?.()},ms)}
function doAction(fn,msg,kind='pet'){if(actionLock)return;actionLock=true;state=fn(state);state.activity={type:kind==='play'?'play':kind,stage:'active',startedAt:Date.now()};persist();sfx(kind);showBubble(msg);setTimeout(()=>{state.activity={type:'idle',stage:'idle',startedAt:Date.now()};persist();render();actionLock=false},1300)}
function petDirect(){if(actionLock)return;
 if(state.room==='bathroom'&&!['bathReady','soap','bathBomb'].includes(state.activity?.type)){document.querySelector('[data-object="tub"]')?.click();return}
 if(state.room==='toilet'&&state.activity?.type==='toiletNeed'){document.querySelector('[data-object="litter"]')?.click();return}
 if(state.room==='bedroom'&&!state.sleeping&&state.needs.energy<70){document.querySelector('[data-object="bed"]')?.click();return}
 if(state.sleeping){purr(1.8);showBubble('Мр-р-р… Луна спит ♥',1100);return}
 if(state.settings?.haptics!==false)haptic('light');soundOn=true;purr(2.8);const r=rewardPetting(state);state=r.state;state.activity={type:'petting',stage:'happy',startedAt:Date.now()};persist();showBubble(r.rewarded?'Хр-р-р-р-р… ♥ +2 XP':'Хр-р-р-р-р… ♥',1200);clearTimeout(petReactionTimer);petReactionTimer=setTimeout(()=>{if(!state||state.sleeping)return;state.activity={type:'idle',stage:'idle',startedAt:Date.now()};persist();render()},1200)}
function runPlayAction(kind='ball'){
  if(actionLock)return;
  const target=kind==='draw'?'art':'toy';
  state=moveLuna(state,target);
  if(kind==='draw'){
    sfx('step');
    runLunaSequence('draw',[
      {stage:'drawSit',ms:260},
      {stage:'drawPickPencil',ms:220},
      {stage:'drawStart',ms:220},
      {stage:'drawFirstLine',ms:170},
      {stage:'drawHeart',ms:170},
      {stage:'drawOutline',ms:170},
      {stage:'drawColor',ms:180},
      {stage:'drawStars',ms:190},
      {stage:'drawInspect',ms:220},
      {stage:'drawLift',ms:230},
      {stage:'showDrawing',ms:420},
      {stage:'drawProud',ms:480}
    ],{
      onFrame:(f,i)=>{
        if(['drawStart','drawFirstLine','drawHeart','drawColor','drawStars'].includes(f.stage))sfx('draw');
        if(f.stage==='showDrawing'){state=addDrawing(state).state;happyJingle();giggleSound();showBubble('Смотри, что я нарисовала! 🎨',900)}
        if(f.stage==='drawProud')speakLuna('Я нарисовала!');
      }
    });
    return;
  }
  if(kind==='jump'){
    state=play(state);state=track(state,'play');
    runLunaSequence('jump',[
      {stage:'arrived',ms:180},{stage:'jumping',ms:420},{stage:'celebrate',ms:460},{stage:'happy',ms:320}
    ],{onFrame:f=>{if(f.stage==='jumping')sfx('jump');if(f.stage==='celebrate'){giggleSound();happyJingle();showBubble('Ура-а-а! ✨',650)}}});
    return;
  }
  state=play(state);state=track(state,'play');state=unlockAchievement(state,'firstToy').state;
  runLunaSequence('play',[
    {stage:'arrived',ms:220},{stage:'chasing',ms:360},{stage:'chasing',ms:360},{stage:'happy',ms:420}
  ],{extra:{playKind:kind},onFrame:f=>{if(f.stage==='chasing')sfx('play');if(f.stage==='happy'){giggleSound();showBubble(kind==='yarn'?'Поймала клубок! 🧶':'Поймала мяч! ⚽',700)}}});
}
function bindGame(){document.querySelector('[data-action="pet-now"]')?.addEventListener('click',()=>petDirect());const pet=document.querySelector('.pet-button');let petStart=null,petMoved=false,strokeTotal=0,lastStrokeSound=0;pet?.addEventListener('pointerdown',e=>{if(actionLock)return;e.preventDefault();petStart={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY};petMoved=false;strokeTotal=0;pet.classList.add('is-stroking');pet.setPointerCapture?.(e.pointerId);if(['soap','shampoo'].includes(state.activity?.type)){bubbleSound();giggleSound()}else{purr(1.6);state.activity={type:'petting',stage:'stroking',startedAt:Date.now()};document.querySelector('.game-shell')?.classList.add('activity-petting')}});pet?.addEventListener('pointermove',e=>{if(!petStart)return;e.preventDefault();const step=Math.hypot(e.clientX-petStart.lastX,e.clientY-petStart.lastY);const d=Math.hypot(e.clientX-petStart.x,e.clientY-petStart.y);petStart.lastX=e.clientX;petStart.lastY=e.clientY;strokeTotal+=step;if(d>8||strokeTotal>12){petMoved=true;pet.style.setProperty('--stroke-x',Math.max(-12,Math.min(12,(e.clientX-petStart.x)/5))+'px');const now=Date.now();if(['soap','shampoo'].includes(state.activity?.type)){state.activity.scrub=Math.min(100,(state.activity.scrub||0)+Math.max(1,Math.round(step/2.3)));const pct=document.querySelector('.foam-fx i');if(pct)pct.textContent=Math.min(100,state.activity.scrub)+'%';const foam=document.querySelector('.foam-fx');if(foam)foam.style.transform=`translateX(-50%) scale(${.72+(state.activity.scrub||0)/350})`;if(now-lastStrokeSound>430){lastStrokeSound=now;bubbleSound();giggleSound()}if(state.activity.scrub>=100){state.needs.cleanliness=Math.min(100,state.needs.cleanliness+32);state.needs.mood=Math.min(100,state.needs.mood+10);applauseSound();giggleSound();speakLuna('Хи-хи! Какая пена!');state.activity={type:'bathReady',stage:'inTub',startedAt:Date.now()};persist();showBubble('Готово! Вся в пенке 🫧😸',1500);render();petStart=null}}else if(now-lastStrokeSound>780){lastStrokeSound=now;purr(1.25)}}});pet?.addEventListener('pointerup',()=>{if(!petStart)return;const wasBath=['soap','shampoo'].includes(state.activity?.type);petStart=null;pet.classList.remove('is-stroking');pet.style.removeProperty('--stroke-x');if(wasBath){persist();render();return}const rr=rewardPetting(state);state=rr.state;state.activity={type:'petted',stage:'happy',startedAt:Date.now()};persist();purr(1.8);showBubble(rr.rewarded?'Мр-р-р… +2 XP ♥':'Мр-р-р… ещё ♥',1000);render();setTimeout(()=>{if(state&&!state.sleeping&&['petted','petting'].includes(state.activity?.type)){state.activity={type:'idle',stage:'idle',startedAt:Date.now()};persist();render()}},1100)});const clearPetGesture=()=>{petStart=null;petMoved=false;pet?.classList.remove('is-stroking');pet?.style.removeProperty('--stroke-x')};pet?.addEventListener('pointercancel',clearPetGesture);pet?.addEventListener('lostpointercapture',clearPetGesture);const toggleFridge=()=>{ui.fridgeOpen=!ui.fridgeOpen;if(ui.fridgeOpen)state=moveLuna(state,'fridge');persist();render();if(ui.fridgeOpen)showBubble('Выбирай еду ♥',900)};document.querySelector('[data-object="fridge"]')?.addEventListener('click',toggleFridge);document.querySelector('[data-action="open-fridge"]')?.addEventListener('click',()=>{if(state.room!=='kitchen'){state.room='kitchen';ui.fridgeOpen=true;persist();render();startRoomMusic('kitchen')}else toggleFridge()});document.querySelector('[data-object="lamp"]')?.addEventListener('click',()=>moveTo('lamp',()=>{state=toggleLamp(state);persist();render()}));document.querySelector('[data-object="bed"]')?.addEventListener('click',()=>moveTo('bed',()=>{
  stopMusic();
  sleepyChime();
  speakLuna('Спокойной ночи');
  showBubble('Пижама надета. Ложусь под одеяло… Zzz ♥',1900);
  const sleepFrames=[
    {stage:'sleep01',ms:420},{stage:'sleep02',ms:480},{stage:'sleep03',ms:620},
    {stage:'sleep04',ms:420},{stage:'sleep05',ms:480},{stage:'sleep06',ms:300},
    {stage:'sleep07',ms:450},{stage:'sleep08',ms:450},
    {stage:'sleep07',ms:450},{stage:'sleep08',ms:450},
    {stage:'sleep07',ms:450},{stage:'sleep08',ms:450},
    {stage:'sleep09',ms:650},{stage:'sleep04',ms:350},{stage:'sleep10',ms:700}
  ];
  runLunaSequence('sleepSequence',sleepFrames,{
    onFrame:f=>{
      if(f.stage==='sleep07'&&!state.sleeping){state.sleeping=true;state.sleepStartedAt=Date.now();state.activity={type:'sleepSequence',stage:f.stage,startedAt:Date.now()};persist();render();purr(3.2)}
      if(f.stage==='sleep09'&&state.sleeping){state.sleeping=false;state.sleepStartedAt=null;state.needs.energy=Math.min(100,state.needs.energy+35);state.activity={type:'sleepSequence',stage:f.stage,startedAt:Date.now()};persist();render();startRoomMusic('bedroom')}
      if(f.stage==='sleep10'){happyJingle();applauseSound();showBubble('Доброе утро! Я выспалась ♥',1200)}
    }
  });
}));
document.querySelector('[data-object="tub"]')?.addEventListener('click',()=>moveTo('tub',()=>{
  ui.panel=null;
  waterSound();
  runLunaSequence('bath',[{stage:'bathStepIn',ms:520},{stage:'inTub',ms:650}],{
    keepLocked:true,
    onFrame:f=>{if(f.stage==='inTub'){purr(2.4);giggleSound()}},
    onDone:()=>{state.activity={type:'bathReady',stage:'inTub',startedAt:Date.now()};actionLock=false;persist();showBubble('Мр-р-р… я в ванне! Нажми на мыло 🧼',2200);render()}
  });
}));
document.querySelector('[data-object="litter"]')?.addEventListener('click',()=>moveTo('litter',()=>{
  runLunaSequence('toilet',[{stage:'toiletSitDown',ms:430},{stage:'toiletSitting',ms:850},{stage:'toiletFinished',ms:520}],{
    onFrame:f=>{if(f.stage==='toiletSitting'){fartSound();showBubble('Мр-р… почти готово!',800)}},
    onDone:()=>{state=useToilet(state);flushSound();applauseSound();showBubble('Ура! Готово! ♥',1300)}
  });
}));
document.querySelector('[data-object="toy"]')?.addEventListener('click',()=>runPlayAction('yarn'));
document.querySelector('[data-object="water"]')?.addEventListener('click',()=>moveTo('water',()=>{
  let r=castLine(state);state=r.state;
  if(!r.ok){if(!state.inventory.owned.includes('rod_bamboo'))state.inventory.owned.push('rod_bamboo');r=castLine(state);state=r.state}
  runLunaSequence('fishGame',[{stage:'fishingReady',ms:300},{stage:'liftRod',ms:280},{stage:'cast',ms:440},{stage:'waiting',ms:520}],{
    keepLocked:true,
    onFrame:f=>{if(f.stage==='cast'){sfx('cast');waterSound()}},
    onDone:()=>{state.activity={type:'fishGame',stage:'waiting',startedAt:Date.now()};actionLock=false;persist();showBubble('Клюёт! Нажми «ПОДСЕЧЬ» в зелёной зоне 🎣',1800);render()}
  });
}));
document.querySelector('[data-action="bath-enter"]')?.addEventListener('click',()=>document.querySelector('[data-object="tub"]')?.click());
document.querySelector('[data-action="bed-sleep"]')?.addEventListener('click',()=>document.querySelector('[data-object="bed"]')?.click());
document.querySelector('[data-action="toilet-seat"]')?.addEventListener('click',()=>document.querySelector('[data-object="litter"]')?.click());
document.querySelector('[data-action="lake-fish"]')?.addEventListener('click',()=>document.querySelector('[data-object="water"]')?.click());
document.querySelector('[data-action="bath-shower"]')?.addEventListener('click',()=>{state.bath??={};state.bath.wet=true;state.activity={type:'shower',stage:'rinsing',startedAt:Date.now()};persist();waterSound();splashSound();giggleSound();speakLuna('Водичка!');showBubble('Поливаем душем 🚿💦',1500);render();setTimeout(()=>{if(state.activity?.type==='shower'){state.activity={type:'bathReady',stage:'inTub',startedAt:Date.now()};persist();render()}},1700)});
document.querySelector('[data-action="bath-shop"]')?.addEventListener('click',()=>{ui.shopCategory='bath';ui.panel='shop';ui.previewItem=null;render()});
document.querySelector('[data-action="bath-finish"]')?.addEventListener('click',()=>{
 if(actionLock)return;
 state=bathe(state);state.bath??={};state.bath.wet=false;
 state=moveLuna(state,'idle');
 runLunaSequence('towel',[
  {stage:'bathStepOut',ms:430},{stage:'bathShake',ms:520},{stage:'bathTowel',ms:650},{stage:'bathFinished',ms:620}
 ],{onFrame:f=>{
  if(f.stage==='bathStepOut')splashSound();
  if(f.stage==='bathShake')waterSound();
  if(f.stage==='bathTowel')showBubble('Вытираемся полотенцем 🧖',900);
  if(f.stage==='bathFinished'){happyJingle();applauseSound();giggleSound();speakLuna('Я чистая и пушистая!');showBubble('Чистая и пушистая! ✨',1300)}
 }});
});
document.querySelectorAll('[data-play-action]').forEach(b=>b.addEventListener('click',()=>runPlayAction(b.dataset.playAction)));
document.querySelector('[data-action="fish-hook"]')?.addEventListener('click',()=>{
 if(actionLock||state.activity?.type!=='fishGame')return;
 const phase=((Date.now()-(state.activity.startedAt||Date.now()))%2200)/2200,hit=phase>=.28&&phase<=.72;
 if(!hit){state.activity={type:'sad',stage:'miss',startedAt:Date.now()};persist();sfx('miss');sadWhimper();meow('sad');showBubble('Мимо! Рыбка сорвалась — попробуй ещё 😿',1400);render();setTimeout(()=>{state.activity={type:'idle',stage:'idle',startedAt:Date.now()};persist();render()},1500);return}
 const caught=catchFish(state,{force:true});state=caught.state;state=track(state,'fish');state=unlockAchievement(state,'firstFish').state;
 runLunaSequence('fishCatch',[
  {stage:'biteFish',ms:320},{stage:'pullRod',ms:330},{stage:'reeling',ms:360},{stage:'fishOnHook',ms:380},
  {stage:'fishSwing',ms:330},{stage:'holdFish',ms:440},{stage:'bucketFish',ms:380},{stage:'fullBucket',ms:650}
 ],{onFrame:f=>{
  if(f.stage==='biteFish')splashSound();
  if(f.stage==='fishOnHook')sfx('catch');
  if(f.stage==='fullBucket'){happyJingle();giggleSound();meow('happy');applauseSound();speakLuna('Я поймала рыбку!');showBubble(`Поймала: ${caught.item?.name||'рыбку'}! 🪣♥`,1500)}
 }});
});
document.querySelector('[data-action="fish-shop"]')?.addEventListener('click',()=>{ui.shopCategory='rods';ui.panel='shop';ui.previewItem=null;render()});
document.querySelector('[data-action="wardrobe-shop"]')?.addEventListener('click',()=>{ui.shopCategory='outfits';ui.panel='shop';ui.previewItem=null;render()});
document.querySelectorAll('[data-preview]').forEach(b=>b.addEventListener('click',()=>{ui.previewItem=b.dataset.preview;state.activity={type:'dress',stage:'preview',itemId:ui.previewItem,startedAt:Date.now()};giggleSound();showBubble('Примеряю… как тебе? 😸',1200);render()}));
document.querySelector('[data-clear-preview]')?.addEventListener('click',()=>{ui.previewItem=null;state.activity={type:'idle',stage:'idle',startedAt:Date.now()};render()});
document.querySelector('[data-buy-preview]')?.addEventListener('click',()=>{const id=ui.previewItem||document.querySelector('[data-buy-preview]')?.dataset.buyPreview;if(!id)return;const r=buyItem(state,id);state=r.state;if(r.ok){state=equipItem(state,id);state=unlockAchievement(state,'firstOutfit').state;ui.previewItem=null;state.activity={type:'jump',stage:'newOutfit',itemId:id,startedAt:Date.now()};persist();sfx('coin');happyJingle();giggleSound();applauseSound();showBubble('Куплено и надето! Ура! ✨',1600);render();setTimeout(()=>{state.activity={type:'idle',stage:'idle',startedAt:Date.now()};persist();render()},1700)}else if(r.reason==='premium'){openBotPurchase(id)}else{showBubble(r.reason==='coins'?'Не хватает монет':'Пока закрыто',1500);render()}});
document.querySelector('[data-action="invite"]')?.addEventListener('click',()=>{state.referral??={rewardClaimed:false,shown:0};const share='https://t.me/share/url?url='+encodeURIComponent('https://t.me/CozyKittenCornerBot?start=friend')+'&text='+encodeURIComponent('Поиграй со мной в Cozy Kitten Corner 🐾');try{window.Telegram?.WebApp?.openTelegramLink?window.Telegram.WebApp.openTelegramLink(share):window.open(share,'_blank')}catch{}if(!state.referral.rewardClaimed){state.referral.rewardClaimed=true;state.economy.coins+=100;persist();sfx('coin');applauseSound();showBubble('+100 🪙 за приглашение! 🎁',1800);render()}else showBubble('Ссылка для друга открыта ♥',1200)});
document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>{if(actionLock)return;cancelLunaSequence();state.room=b.dataset.room;state=moveLuna(state,'idle');ui.fridgeOpen=false;if(state.room==='store')ui.panel='shop';soundOn=true;preloadRoomBackgrounds(state.room);persist();render();startRoomMusic(state.room);if(state.room==='toilet'){state.activity={type:'toiletNeed',stage:'asking',startedAt:Date.now()};persist();meow('toilet');showBubble('Мяу… хочу в туалет! 🐾',2400);setTimeout(()=>{if(state?.room==='toilet'&&state.activity?.type==='toiletNeed'){state.activity={type:'idle',stage:'idle',startedAt:Date.now()};persist();render()}},2500)}else if(state.room==='bathroom'){state.activity={type:'bathWant',stage:'asking',startedAt:Date.now()};persist();meow('bath');speakLuna('Хочу купаться!');showBubble('Хочу купаться! 🛁',1900)}else if(state.room==='bedroom'&&state.needs.energy<70){meow('sleep');speakLuna('Хочу спать');showBubble('Хочу спать! 🌙',1600)}else if(state.room==='kitchen'&&state.needs.hunger<70){meow('food');speakLuna('Хочу кушать');showBubble('Хочу кушать! 🍽️',1600)}else if(state.room==='playroom'){meow('play');showBubble('Хочу играть!',1500)}else if(state.room==='lake'){meow('fish');showBubble('Хочу ловить рыбку!',1500)}}));
// Petting is gesture-only. Do not bind click: a completed pointer stroke may synthesize a click and double-reward Luna.
document.querySelectorAll('[data-action="select-food"]').forEach(el=>el.addEventListener('click',event=>{
  if(actionLock)return;
  const id=event.currentTarget.dataset.food;
  if(!id||(state.inventory.food?.[id]||0)<=0)return;
  ui.selectedFood=id;
  ui.fridgeOpen=false;
  state=moveLuna(state,'bowl');
  persist();
  render();
  const item=catalog.find(x=>x.id===id);
  showBubble(`Выбрано: ${item?.name||'еда'} · нажми «Покормить»`,900);
}));
document.querySelectorAll('[data-action="feed-selected"]').forEach(el=>el.addEventListener('click',event=>{
  if(actionLock)return;
  const id=event.currentTarget.dataset.food||ui.selectedFood;
  const item=catalog.find(x=>x.id===id);
  const name=item?.name||(id==='dryFood'?'Корм':id==='wetFood'?'Влажный корм':'Рыбное лакомство');
  if(!id||(state.inventory.food?.[id]||0)<=0){showBubble(name+' закончилось — купи ещё 🛍️',1500);return}
  ui.fridgeOpen=false;
  ui.selectedFood=id;
  state=moveLuna(state,'bowl');
  let unitConsumed=false,mealFinished=false;
  runLunaSequence('eating',[
    {stage:'feed01',ms:450},
    {stage:'feed02',ms:160},
    {stage:'feed03',ms:180},
    {stage:'feed04',ms:160},
    {stage:'feed05',ms:420},
    {stage:'feed06',ms:120},
    {stage:'feed07',ms:140},
    {stage:'feed08',ms:140},{stage:'feed09',ms:140},
    {stage:'feed08',ms:140},{stage:'feed09',ms:140},
    {stage:'feed08',ms:140},{stage:'feed09',ms:140},
    {stage:'feed10',ms:220},
    {stage:'feed11',ms:260},
    {stage:'feed12',ms:620}
  ],{
    extra:{itemId:id},
    onFrame:f=>{
      if(f.stage==='feed01')meow('food');
      if(f.stage==='feed02')sfx('pet');
      if(f.stage==='feed06'&&!unitConsumed){
        const r=consumeFoodUnit(state,id);state=r.state;unitConsumed=r.ok;
        if(r.ok)persist();
      }
      if(f.stage==='feed07'&&unitConsumed)biteSound();
      if((f.stage==='feed08'||f.stage==='feed09')&&unitConsumed)chewSound();
      if(f.stage==='feed10'&&unitConsumed&&!mealFinished){
        const r=finishMeal(state,id);state=r.state;mealFinished=r.ok;
        if(r.ok){state=track(state,'care');state=unlockAchievement(state,'firstMeal').state;persist();}
        swallowSound();
      }
      if(f.stage==='feed11')lickSound();
      if(f.stage==='feed12'){
        purr(1.8);happyJingle();meow('happy');
        showBubble(`Вкусно! ${name} · осталось ${state.inventory.food?.[id]||0}`,1000);
      }
    },
    onDone:()=>{
      if((state.inventory.food?.[id]||0)<=0)ui.selectedFood=null;
    }
  });
}));
document.querySelectorAll('[data-action="serve-drink"]').forEach(el=>el.addEventListener('click',e=>{
  if(actionLock)return;
  const id=e.currentTarget.dataset.food,item=catalog.find(x=>x.id===id);
  if((state.inventory.food?.[id]||0)<=0){showBubble('Напиток закончился — купи ещё 🛍️');return}
  ui.fridgeOpen=false;state=moveLuna(state,'water');let consumed=false,finished=false;
  runLunaSequence('drink',[
    {stage:'drink01',ms:320},{stage:'drink02',ms:260},{stage:'drink03',ms:360},
    {stage:'drink04',ms:620},{stage:'drink05',ms:320},{stage:'drink06',ms:560}
  ],{extra:{itemId:id},onFrame:f=>{
    if(f.stage==='drink01')meow('food');
    if(f.stage==='drink04'&&!consumed){const r=consumeDrinkUnit(state,id);state=r.state;consumed=r.ok;if(r.ok)persist();waterSound()}
    if(f.stage==='drink05'&&consumed&&!finished){const r=finishDrink(state);state=r.state;finished=r.ok;state=track(state,'care');persist();sfx('drink')}
    if(f.stage==='drink06'){meow('happy');purr(1.5);showBubble(`Ммм… ${item?.name||'напиток'} · осталось ${state.inventory.food?.[id]||0}`,800)}
  }});
}));
const drinkNow=()=>{if(actionLock)return;actionLock=true;state=moveLuna(state,'water');state=drink(state);state.activity={type:'drink',stage:'drinking',startedAt:Date.now()};persist();waterSound();showBubble('Ммм… водичка! ♥',1200);setTimeout(()=>{state.activity={type:'idle',stage:'idle',startedAt:Date.now()};persist();render();actionLock=false},1200)};document.querySelector('[data-action="drink"]')?.addEventListener('click',drinkNow);document.querySelector('[data-object="drink"]')?.addEventListener('click',drinkNow);
document.querySelector('[data-action="bathe"]')?.addEventListener('click',()=>{waterSound();doAction(bathe,'Чисто и пушисто!','bath')});
document.querySelector('[data-action="toilet"]')?.addEventListener('click',()=>{flushSound();doAction(useToilet,'Готово!','toilet')});
document.querySelector('[data-action="play"]')?.addEventListener('click',()=>doAction(play,'Ещё!','play'));document.querySelector('[data-action="draw"]')?.addEventListener('click',()=>{state=addDrawing(state).state;state.activity={type:'draw',stage:'drawing',startedAt:Date.now()};persist();sfx('play');showBubble('Рисую!')});document.querySelector('[data-action="fish"]')?.addEventListener('click',()=>{state.activity={type:'fish',stage:'casting',startedAt:Date.now()};persist();sfx('play');showBubble('Забрасываю удочку…')});
document.querySelectorAll('[data-action="shop"]').forEach(b=>b.addEventListener('click',()=>{ui.panel='shop';render()}));document.querySelectorAll('[data-shop-category]').forEach(b=>b.addEventListener('click',()=>{ui.shopCategory=b.dataset.shopCategory;render()}));document.querySelector('[data-action="room-items"]')?.addEventListener('click',()=>{ui.panel='roomItems';render()});document.querySelectorAll('[data-use-item]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.useItem,it=catalog.find(x=>x.id===id);if(!it)return;if(it.category==='pajamas'){state=equipItem(state,id);persist();showBubble('Пижама надета. Спокойной ночи ♥',1800);sleepyChime();speakLuna('Спокойной ночи');ui.panel=null;render();return}if(['soap','shampoo'].includes(it.interaction)){if(state.room!=='bathroom'||!['bathReady','soap','shampoo','bathBomb','shower'].includes(state.activity?.type)){showBubble('Сначала посади Луну в ванну 🛁',1700);ui.panel=null;render();return}state.activity={type:it.interaction,stage:'readyToScrub',itemId:id,foamColor:it.foamColor||'#f5f1ff',scrub:0,startedAt:Date.now()};bubbleSound();giggleSound();speakLuna('Намыливай меня пальцем!');showBubble('Теперь води пальцем по Луне 🫧',2200)}else if(it.interaction==='bathBomb'){if(state.room!=='bathroom'||!['bathReady','soap','shampoo','bathBomb','shower'].includes(state.activity?.type)){showBubble('Сначала посади Луну в ванну 🛁',1700);ui.panel=null;render();return}state.activity={type:'bathBomb',stage:'fizzing',itemId:id,bathColor:it.bathColor,startedAt:Date.now()};state.needs.mood=Math.min(100,state.needs.mood+12);bubbleSound();splashSound();giggleSound();speakLuna('Ух ты! Вода цветная!');showBubble('Ух ты! Цветная вода! 🫧',1800)}else if(it.category==='art'){state=addDrawing(state).state;state.activity={type:'draw',stage:'drawing',itemId:id,startedAt:Date.now()};sfx('draw');showBubble('Смотри, что я нарисовала! 🎨',1700)}else{state=play(state);state=track(state,'play');state.activity={type:it.interaction==='drum'?'drum':'play',stage:it.interaction==='drum'?'drumming':'chasing',itemId:id,startedAt:Date.now()};if(it.interaction==='drum'){drumSound();giggleSound();speakLuna('Слушай, как я умею!');showBubble('Бум-бум-бум! 🥁😸',1900)}else{sfx('play');giggleSound();speakLuna(it.interaction==='chase'?'Лови меня!':'Ещё! Ещё!');showBubble(it.interaction==='chase'?'Ловлю! 🐾':'Ещё! 🧶',1600)}}persist();ui.panel=null;render();if(!['soap','shampoo'].includes(state.activity?.type))setTimeout(()=>{if(state.activity?.itemId===id){state.activity=['bathBomb','shower'].includes(state.activity?.type)?{type:'bathReady',stage:'inTub',startedAt:Date.now()}:{type:'idle',stage:'idle',startedAt:Date.now()};persist();render()}},2100)}));document.querySelector('[data-action="decorate"]')?.addEventListener('click',()=>{ui.panel='furniture';render()});document.querySelector('[data-object="closet"]')?.addEventListener('click',()=>moveTo('closet',()=>{ui.panel='wardrobe';render()}));document.querySelector('[data-action="progress"]')?.addEventListener('click',()=>{ui.panel='progress';render()});document.querySelectorAll('[data-close-panel]').forEach(b=>b.addEventListener('click',()=>{ui.panel=null;render()}));document.querySelectorAll('[data-buy]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.buy;const r=buyItem(state,id);state=r.state;if(r.ok){sfx('coin');showBubble('Куплено! ♥')}else if(r.reason==='premium'){const opened=openBotPurchase(id);showBubble(opened?'Открываю оплату через Telegram Stars ⭐':'Не удалось открыть оплату',2200)}else showBubble(r.reason==='coins'?'Не хватает монет':r.reason==='owned'?'Уже куплено':'Пока закрыто');persist();render()}));document.querySelectorAll('[data-place]').forEach(b=>b.addEventListener('click',()=>{state=applyFurniture(state,b.dataset.place,state.room);persist();showBubble('Готово! Декор установлен ♥');ui.panel=null;render()}));document.querySelectorAll('[data-equip]').forEach(b=>b.addEventListener('click',()=>{state=equipItem(state,b.dataset.equip);state=unlockAchievement(state,'firstOutfit').state;state.activity={type:'dress',stage:'preview',itemId:b.dataset.equip,startedAt:Date.now()};persist();giggleSound();happyJingle();applauseSound();showBubble('Смотри! Я уже в этом наряде ♥',1500);render()}));document.querySelector('[data-daily]')?.addEventListener('click',()=>{const r=dailyReward(state);state=r.state;persist();showBubble(r.ok?`Подарок получен! ♥`:'Сегодня уже получено');render()});document.querySelectorAll('[data-quest]').forEach(b=>b.addEventListener('click',()=>{const r=claimQuest(state,b.dataset.quest);state=r.state;persist();showBubble(r.ok?'Награда получена! ♥':'Задание ещё не готово');render()}));document.querySelector('[data-action="help"]')?.addEventListener('click',()=>{ui.settingsOpen=false;render();setTimeout(()=>showBubble('Проведи пальцем по Luna или нажми «Гладить». Комнаты слева, магазин — 🛍️.',3600),30)});document.querySelector('[data-action="support"]')?.addEventListener('click',()=>{ui.settingsOpen=false;render();setTimeout(()=>showBubble('Поддержка Cozy Kitten Corner ♥ Если что-то не работает — пришли скрин.',3600),30)});document.querySelectorAll('[data-action="settings"]').forEach(el=>el.addEventListener('click',()=>{ui.settingsOpen=!ui.settingsOpen;render()}));document.querySelectorAll('[data-setting]').forEach(el=>el.addEventListener('change',e=>{const k=e.currentTarget.dataset.setting;state.settings[k]=e.currentTarget.type==='checkbox'?e.currentTarget.checked:e.currentTarget.type==='range'?Number(e.currentTarget.value):e.currentTarget.value;configureAudio(state.settings);persist();render()}));
document.querySelector('[data-action="sound"]')?.addEventListener('click',()=>{soundOn=!soundOn;if(soundOn){startRoomMusic(state.room);showBubble('Музыка включена')}else{stopMusic();showBubble('Музыка выключена')}});
document.querySelector('[data-action="sleep"]')?.addEventListener('click',()=>{if(actionLock)return;state=setSleeping(state,!state.sleeping);persist();showBubble(state.sleeping?t('goodNight',lang()):'Доброе утро!')})}
setInterval(()=>{if(state){state=tickState(state,10);const want=getWant(state),now=Date.now();if(want&&(want!==lastWant||now-lastWantAt>90000)){lastWant=want;lastWantAt=now;meow(want);speakLuna(wantSpeech[want]);showBubble(wantSpeech[want],2400)}persist();render()}},10000);if(state){preloadRoomBackgrounds(state.room);setTimeout(()=>{if(state){showBubble('Добро пожаловать! Нажми на экран — Luna тебя поприветствует ♥',2600)}},500)}else preloadRoomBackgrounds('living');
document.addEventListener('visibilitychange',()=>{if(document.hidden)persist()});window.addEventListener('pagehide',persist);render();
