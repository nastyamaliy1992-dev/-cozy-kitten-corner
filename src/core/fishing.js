const fish=[
{id:'carp',name:'Карась',rarity:'common',coins:18},{id:'perch',name:'Окунь',rarity:'common',coins:22},{id:'trout',name:'Форель',rarity:'rare',coins:48},{id:'koi',name:'Золотой кои',rarity:'epic',coins:110},{id:'boot',name:'Старый сапог',rarity:'junk',coins:2},{id:'chest',name:'Сундучок',rarity:'special',coins:75}
];
export function canFish(s){return s.inventory.owned?.some(id=>id.startsWith('fish_0')||id.startsWith('fish_1')||id.startsWith('fish_2'))}
export function castLine(s){const n=structuredClone(s);if(!canFish(n))return{state:n,ok:false,reason:'rod'};n.fishing??={collection:[],casts:0};n.fishing.casts++;return{state:n,ok:true}}
export function catchFish(s){const n=structuredClone(s);const r=Math.random(),item=r<.48?fish[Math.floor(Math.random()*2)]:r<.75?fish[2]:r<.87?fish[4]:r<.96?fish[5]:fish[3];n.fishing??={collection:[],casts:0};n.fishing.collection.push({...item,caughtAt:Date.now()});n.economy.xp+=10;return{state:n,item}}
export function sellCatch(s,index){const n=structuredClone(s);if(!n.fishing?.collection?.[index])return n;const [item]=n.fishing.collection.splice(index,1);n.economy.coins+=item.coins;return n}