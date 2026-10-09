const fish=[
{id:'carp',name:'Карась',rarity:'common',coins:18},
{id:'perch',name:'Окунь',rarity:'common',coins:22},
{id:'trout',name:'Форель',rarity:'rare',coins:48},
{id:'koi',name:'Золотой кои',rarity:'epic',coins:110},
{id:'boot',name:'Старый сапог',rarity:'junk',coins:2},
{id:'chest',name:'Сундучок',rarity:'special',coins:75},
{id:'golden_wish_fish',name:'Золотая рыбка желаний',rarity:'legendary',coins:0}
];
const clamp=v=>Math.max(0,Math.min(100,Number(v)||0));
export function canFish(s){return s.inventory.owned?.some(id=>id.startsWith('rod_'))}
export function fishingGear(s){return {rod:s.inventory.owned?.find(id=>id.startsWith('rod_'))||null,bucket:s.inventory.owned?.includes('fish_bucket'),tackle:s.inventory.owned?.includes('tackle_box')}}
export function castLine(s){const n=structuredClone(s);if(!canFish(n))return{state:n,ok:false,reason:'rod'};n.fishing??={collection:[],casts:0};n.fishing.casts++;return{state:n,ok:true}}
export function catchFish(s,{force=false}={}){
 const n=structuredClone(s),gear=fishingGear(n);
 const missChance=force?0:(gear.tackle?.12:.22),r=Math.random();
 if(r<missChance)return{state:n,item:null,ok:false,reason:'miss'};
 // Legendary wish fish: exceptionally rare, only a successful hook may catch it.
 // An upgraded rod increases the chance slightly. This does not require ads or payments.
 const chance=gear.rod&&gear.rod!=='rod_bamboo'?.012:.005;
 let item;
 if(Math.random()<chance)item=fish[6];
 else{
  const q=(r-missChance)/(1-missChance);
  item=q<.48?fish[Math.floor(Math.random()*2)]:q<.75?fish[2]:q<.87?fish[4]:q<.96?fish[5]:fish[3];
 }
 n.fishing??={collection:[],casts:0};
 n.fishing.collection.push({...item,caughtAt:Date.now()});
 n.economy.xp+=gear.bucket?12:10;
 if(item.id==='golden_wish_fish'){
  // The wish is specifically to restore hunger, not grant unlimited rewards.
  n.needs.hunger=100;
  n.needs.happiness=Math.round((n.needs.hunger+n.needs.thirst+n.needs.cleanliness+n.needs.mood+n.needs.energy+n.needs.toilet+n.needs.health)/7);
  n.fishing.wishFishCaught=(n.fishing.wishFishCaught||0)+1;
 }
 return{state:n,item,ok:true,wishGranted:item.id==='golden_wish_fish'};
}
export function sellCatch(s,index){const n=structuredClone(s);if(!n.fishing?.collection?.[index])return n;const [item]=n.fishing.collection.splice(index,1);if(item.id==='golden_wish_fish')return s;n.economy.coins+=item.coins;return n}
