import { loadSave, saveGame } from './persistence.js';
const clamp=v=>Math.max(0,Math.min(100,v));
const recalc=n=>{n.needs.happiness=Math.round((n.needs.hunger+n.needs.thirst+n.needs.cleanliness+n.needs.mood+n.needs.energy+n.needs.toilet+n.needs.health)/7);return n};
export function createInitialState(name,lang='ru'){return {schemaVersion:1,createdAt:Date.now(),updatedAt:Date.now(),name,room:'living',sleeping:false,sleepStartedAt:null,lastSeenAt:Date.now(),needs:{hunger:78,thirst:82,cleanliness:88,mood:86,energy:80,toilet:84,health:100,happiness:88},economy:{coins:250,xp:0,level:1},inventory:{food:{dryFood:4,wetFood:2,fishTreat:1},clothes:[],furniture:[],owned:[],equipped:null},bedroom:{lampOn:true},petting:{lastXpAt:0},settings:{language:lang,reduceMotion:false,musicVolume:.35,sfxVolume:.7,voiceVolume:.65,haptics:true,subtitles:true,graphics:'high',batterySaver:false,notifications:false,purchaseConfirm:true},movement:{x:50,y:78,target:null,facing:1},onboarding:{introSeen:false,starterClaimed:false}}}
export function restoreState(){const s=loadSave();if(!s)return null;const now=Date.now(),m=Math.max(0,now-(s.lastSeenAt||s.updatedAt||now))/60000,n=structuredClone(s);n.movement??={x:50,y:78,target:null,facing:1};n.inventory??={food:{},clothes:[],furniture:[],owned:[],equipped:{}};n.inventory.food??={};n.inventory.clothes??=[];n.inventory.furniture??=[];n.inventory.owned??=[];n.onboarding??={introSeen:true,starterClaimed:true};n.roomDecor??={};n.fishing??={collection:[],casts:0};n.settings={musicEnabled:true,sfxEnabled:true,voiceEnabled:true,musicVolume:.35,sfxVolume:.7,voiceVolume:.65,haptics:true,subtitles:true,graphics:'high',batterySaver:false,notifications:false,purchaseConfirm:true,language:'ru',reduceMotion:false,...(n.settings||{})};n.lastSeenAt=now;n.needs.hunger=clamp(n.needs.hunger-Math.min(18,m*.08));n.needs.thirst=clamp(n.needs.thirst-Math.min(14,m*.06));n.needs.toilet=clamp(n.needs.toilet-Math.min(14,m*.05));if(n.sleeping){n.needs.energy=clamp(n.needs.energy+Math.min(48,m*.28));if(n.needs.energy>=96||m>=240){n.sleeping=false;n.sleepStartedAt=null}}else n.needs.energy=clamp(n.needs.energy-Math.min(12,m*.04));recalc(n);saveGame(n);return n}
export function tickState(s,seconds=10){const n=structuredClone(s),f=seconds/10;n.needs.hunger=clamp(n.needs.hunger-.18*f);n.needs.thirst=clamp(n.needs.thirst-.12*f);n.needs.toilet=clamp(n.needs.toilet-.08*f);n.needs.energy=clamp(n.needs.energy+(n.sleeping ? 0.8 : -0.07)*f);n.lastSeenAt=Date.now();return recalc(n)}
export function petKitten(s){const n=structuredClone(s);n.needs.mood=clamp(n.needs.mood+4);return recalc(n)}
export function feedKitten(s,id='dryFood'){const n=structuredClone(s),count=n.inventory.food?.[id]||0;if(count<=0)return{state:n,ok:false,reason:'empty'};if(n.needs.hunger>=96)return{state:n,ok:false,reason:'full'};const disliked=['food_7','food_15'];if(disliked.includes(id)&&Math.random()<.72){n.needs.mood=clamp(n.needs.mood-1);return{state:recalc(n),ok:false,reason:'refused'}};const favorite=['wetFood','fishTreat','food_0','food_1','food_4'];n.inventory.food[id]--;n.needs.hunger=clamp(n.needs.hunger+(favorite.includes(id)?28:22));n.needs.mood=clamp(n.needs.mood+(favorite.includes(id)?6:3));n.needs.toilet=clamp(n.needs.toilet-4);n.economy.xp+=6;return{state:recalc(n),ok:true,favorite:favorite.includes(id)}}
export function drink(s,id=null){const n=structuredClone(s);if(id){const count=n.inventory.food?.[id]||0;if(count<=0)return{state:n,ok:false,reason:'empty'};if(n.needs.thirst>=97)return{state:n,ok:false,reason:'full'};n.inventory.food[id]--}n.needs.thirst=clamp(n.needs.thirst+25);n.economy.xp+=3;const out=recalc(n);return id?{state:out,ok:true}:out}
export function bathe(s){const n=structuredClone(s);n.needs.cleanliness=clamp(n.needs.cleanliness+35);n.needs.mood=clamp(n.needs.mood+2);n.economy.xp+=5;return recalc(n)}
export function useToilet(s){const n=structuredClone(s);n.needs.toilet=clamp(n.needs.toilet+40);n.needs.cleanliness=clamp(n.needs.cleanliness-3);n.economy.xp+=4;return recalc(n)}
export function play(s){const n=structuredClone(s);n.needs.mood=clamp(n.needs.mood+18);n.needs.energy=clamp(n.needs.energy-8);n.economy.xp+=5;return recalc(n)}
export function setSleeping(s,v){const n=structuredClone(s);n.sleeping=v;n.sleepStartedAt=v?Date.now():null;n.activity={type:v?'sleep':'wake',stage:v?'sleeping':'awake',startedAt:Date.now()};return n}
export function toggleLamp(s){const n=structuredClone(s);n.bedroom=n.bedroom||{lampOn:true};n.bedroom.lampOn=!n.bedroom.lampOn;return n}
export function rewardPetting(s){const n=structuredClone(s),now=Date.now();n.petting=n.petting||{lastXpAt:0};const rewarded=now-(n.petting.lastXpAt||0)>30000;if(rewarded){n.needs.mood=clamp(n.needs.mood+4);n.economy.xp+=2;n.petting.lastXpAt=now;recalc(n)}return{state:n,rewarded}}
export function getEmotion(s){
 if(s.sleeping)return 'sleepy';
 const n=s.needs;
 if(n.hunger<35)return 'hungry';
 if(n.thirst<30)return 'thirsty';
 if(n.toilet<30)return 'toilet';
 if(n.cleanliness<35)return 'dirty';
 if(n.energy<32)return 'tired';
 if(n.mood>88&&n.happiness>82)return 'joyful';
 if(n.mood<45)return 'sad';
 return 'calm';
}
export function getWant(s){const n=s.needs;if(n.hunger<42)return 'food';if(n.toilet<42)return 'toilet';if(n.cleanliness<42)return 'bath';if(n.energy<42)return 'sleep';if(n.mood<55)return s.room==='lake'?'fish':'play';return null}
export const wantSpeech={food:'Хочу есть!',sleep:'Хочу спать!',play:'Хочу играть!',toilet:'Хочу в туалет!',bath:'Хочу купаться!',fish:'Хочу ловить рыбку!'};
export function setActivity(s,type,stage='active'){const n=structuredClone(s);n.activity={type,stage,startedAt:Date.now()};return n}
export function clearActivity(s){const n=structuredClone(s);n.activity=null;return n}

export function rewardLevel(s){const n=structuredClone(s);while(n.economy.xp>=250*n.economy.level){const need=250*n.economy.level;n.economy.xp-=need;n.economy.level++;n.economy.coins+=75}return n}


export const ROOM_POINTS={
 living:{idle:[50,78],toy:[24,76],center:[52,70]},
 kitchen:{idle:[50,78],fridge:[78,56],bowl:[50,66],water:[42,79]},
 bedroom:{idle:[50,78],bed:[63,55],lamp:[78,38]},
 bathroom:{idle:[50,78],tub:[61,55]},
 toilet:{idle:[50,78],litter:[57,57]},
 wardrobe:{idle:[50,78],closet:[46,66]},
 playroom:{idle:[50,78],toy:[58,72],art:[30,72]},
 store:{idle:[50,78],shop:[52,68]},
 lake:{idle:[50,78],water:[62,72]}
};
export function moveLuna(s,target){const n=structuredClone(s),p=ROOM_POINTS[n.room]?.[target]||ROOM_POINTS[n.room]?.idle||[50,78];n.movement??={x:50,y:78,target:null,facing:1};n.movement.facing=p[0]<(n.movement.x??50)?-1:1;n.movement.x=p[0];n.movement.y=p[1];n.movement.target=target;n.movement.startedAt=Date.now();return n}

export function grantStarterPack(s){const n=structuredClone(s);n.onboarding??={introSeen:false,starterClaimed:false};if(n.onboarding.starterClaimed)return{state:n,ok:false};n.onboarding.starterClaimed=true;n.onboarding.introSeen=true;n.economy.coins+=150;n.inventory.food.food_salmon=(n.inventory.food.food_salmon||0)+2;n.inventory.food.drink_water=(n.inventory.food.drink_water||0)+3;n.inventory.owned??=[];n.inventory.clothes??=[];n.inventory.furniture??=[];for(const id of ['toy_0','collar_moon','decor_picture'])if(!n.inventory.owned.includes(id))n.inventory.owned.push(id);if(!n.inventory.clothes.includes('collar_moon'))n.inventory.clothes.push('collar_moon');if(!n.inventory.furniture.includes('decor_picture'))n.inventory.furniture.push('decor_picture');return{state:n,ok:true}}
