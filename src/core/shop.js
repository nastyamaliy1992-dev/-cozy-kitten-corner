export const catalog=[
{id:'bow_lilac',category:'clothes',name:'Лиловый бантик',price:80,rarity:'common',level:1},
{id:'collar_moon',category:'clothes',name:'Лунный ошейник',price:140,rarity:'rare',level:2},
{id:'bed_cloud',category:'furniture',name:'Кровать-облако',price:220,rarity:'rare',level:2},
{id:'lamp_star',category:'furniture',name:'Звёздная лампа',price:160,rarity:'common',level:1},
{id:'toy_mouse',category:'toys',name:'Мышка',price:70,rarity:'common',level:1},
{id:'toy_ball',category:'toys',name:'Мячик',price:90,rarity:'common',level:1}
];
export function buyItem(state,id){const n=structuredClone(state),item=catalog.find(x=>x.id===id);if(!item)return{state:n,ok:false,reason:'missing'};n.inventory.owned??=[];if(n.inventory.owned.includes(id))return{state:n,ok:false,reason:'owned'};if(n.economy.level<item.level)return{state:n,ok:false,reason:'level'};if(n.economy.coins<item.price)return{state:n,ok:false,reason:'coins'};n.economy.coins-=item.price;n.inventory.owned.push(id);if(item.category==='clothes')n.inventory.clothes.push(id);if(item.category==='furniture')n.inventory.furniture.push(id);n.economy.xp+=8;return{state:n,ok:true,item}}
export function equipItem(state,id){const n=structuredClone(state);if(!n.inventory.clothes.includes(id))return n;n.inventory.equipped=id;return n}