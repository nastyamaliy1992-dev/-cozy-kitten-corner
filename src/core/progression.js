export const quests=[
{id:'care3',name:'Забота',goal:3,reward:35,type:'care'},{id:'play2',name:'Время игры',goal:2,reward:30,type:'play'},{id:'fish1',name:'Первая рыбалка',goal:1,reward:45,type:'fish'}
];
export const achievements=[
{id:'firstMeal',name:'Первый обед',reward:25},{id:'firstBath',name:'Первое купание',reward:25},{id:'firstToy',name:'Первая игра',reward:25},{id:'firstFish',name:'Первая рыбка',reward:40},{id:'firstOutfit',name:'Первый образ',reward:30}
];
export function ensureProgress(s){const n=structuredClone(s);n.progress??={streak:0,lastDaily:null,actions:{care:0,play:0,fish:0},claimed:[],achievements:[],drawings:[]};n.progress.actions??={care:0,play:0,fish:0};n.progress.claimed??=[];n.progress.achievements??=[];n.progress.drawings??=[];return n}
export function track(s,type,amount=1){const n=ensureProgress(s);n.progress.actions[type]=(n.progress.actions[type]||0)+amount;return n}
export function dailyReward(s){const n=ensureProgress(s),today=new Date().toISOString().slice(0,10);if(n.progress.lastDaily===today)return{state:n,ok:false};const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);n.progress.streak=n.progress.lastDaily===yesterday?n.progress.streak+1:1;n.progress.lastDaily=today;const reward=40+Math.min(60,n.progress.streak*5);n.economy.coins+=reward;return{state:n,ok:true,reward}}
export function claimQuest(s,id){const n=ensureProgress(s),q=quests.find(x=>x.id===id);if(!q||n.progress.claimed.includes(id)||(n.progress.actions[q.type]||0)<q.goal)return{state:n,ok:false};n.progress.claimed.push(id);n.economy.coins+=q.reward;n.economy.xp+=15;return{state:n,ok:true,reward:q.reward}}
export function unlockAchievement(s,id){const n=ensureProgress(s),a=achievements.find(x=>x.id===id);if(!a||n.progress.achievements.includes(id))return{state:n,ok:false};n.progress.achievements.push(id);n.economy.coins+=a.reward;return{state:n,ok:true,reward:a.reward}}
export function addDrawing(s){const n=ensureProgress(s),item={id:'drawing_'+Date.now(),createdAt:Date.now()};n.progress.drawings.push(item);n.economy.xp+=7;return{state:n,item}}
