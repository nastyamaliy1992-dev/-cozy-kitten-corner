import { loadSave, saveGame } from './persistence.js';
const clamp=v=>Math.max(0,Math.min(100,v));
const recalc=n=>{n.needs.happiness=Math.round((n.needs.hunger+n.needs.thirst+n.needs.cleanliness+n.needs.mood+n.needs.energy+n.needs.toilet+n.needs.health)/7);return n};
export function createInitialState(name,lang='ru'){return {schemaVersion:1,createdAt:Date.now(),updatedAt:Date.now(),name,room:'living',sleeping:false,sleepStartedAt:null,lastSeenAt:Date.now(),needs:{hunger:78,thirst:82,cleanliness:88,mood:86,energy:80,toilet:84,health:100,happiness:88},economy:{coins:250,xp:0,level:1},inventory:{food:{starterFish:3,milk:2},clothes:[],furniture:[],owned:[],equipped:null},settings:{language:lang,reduceMotion:false}}}
export function restoreState(){const s=loadSave();if(!s)return null;const now=Date.now(),m=Math.max(0,now-(s.lastSeenAt||s.updatedAt||now))/60000,n=structuredClone(s);n.lastSeenAt=now;n.needs.hunger=clamp(n.needs.hunger-Math.min(18,m*.08));n.needs.thirst=clamp(n.needs.thirst-Math.min(14,m*.06));n.needs.toilet=clamp(n.needs.toilet-Math.min(14,m*.05));if(n.sleeping){n.needs.energy=clamp(n.needs.energy+Math.min(48,m*.28));if(n.needs.energy>=96||m>=240){n.sleeping=false;n.sleepStartedAt=null}}else n.needs.energy=clamp(n.needs.energy-Math.min(12,m*.04));recalc(n);saveGame(n);return n}
export function tickState(s,seconds=10){const n=structuredClone(s),f=seconds/10;n.needs.hunger=clamp(n.needs.hunger-.18*f);n.needs.thirst=clamp(n.needs.thirst-.12*f);n.needs.toilet=clamp(n.needs.toilet-.08*f);n.needs.energy=clamp(n.needs.energy+(n.sleeping ? 0.8 : -0.07)*f);n.lastSeenAt=Date.now();return recalc(n)}
export function petKitten(s){const n=structuredClone(s);n.needs.mood=clamp(n.needs.mood+4);return recalc(n)}
export function feedKitten(s,id='starterFish'){const n=structuredClone(s),count=n.inventory.food?.[id]||0;if(count<=0)return{state:n,ok:false,reason:'empty'};if(n.needs.hunger>=96)return{state:n,ok:false,reason:'full'};const disliked=['food_7','food_15'];if(disliked.includes(id)&&Math.random()<.72){n.needs.mood=clamp(n.needs.mood-1);return{state:recalc(n),ok:false,reason:'refused'}};const favorite=['starterFish','food_0','food_1','food_4'];n.inventory.food[id]--;n.needs.hunger=clamp(n.needs.hunger+(favorite.includes(id)?28:22));n.needs.mood=clamp(n.needs.mood+(favorite.includes(id)?6:3));n.needs.toilet=clamp(n.needs.toilet-4);n.economy.xp+=6;return{state:recalc(n),ok:true,favorite:favorite.includes(id)}}
export function drink(s){const n=structuredClone(s);n.needs.thirst=clamp(n.needs.thirst+25);n.economy.xp+=3;return recalc(n)}
export function bathe(s){const n=structuredClone(s);n.needs.cleanliness=clamp(n.needs.cleanliness+35);n.needs.mood=clamp(n.needs.mood+2);n.economy.xp+=5;return recalc(n)}
export function useToilet(s){const n=structuredClone(s);n.needs.toilet=clamp(n.needs.toilet+40);n.needs.cleanliness=clamp(n.needs.cleanliness-3);n.economy.xp+=4;return recalc(n)}
export function play(s){const n=structuredClone(s);n.needs.mood=clamp(n.needs.mood+18);n.needs.energy=clamp(n.needs.energy-8);n.economy.xp+=5;return recalc(n)}
export function setSleeping(s,v){const n=structuredClone(s);n.sleeping=v;n.sleepStartedAt=v?Date.now():null;return n}
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
