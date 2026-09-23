const make=(id,name,category,price,rarity='Common',level=1,effect=null,currency='coins',extra={})=>({id,name,image:null,category,price,currency,rarity,unlockLevel:level,level,room:extra.room||null,slot:extra.slot||null,asset:extra.asset||null,interaction:extra.interaction||null,effect,quantity:1,owned:false,equipped:false,placed:false,isNew:true,destination:category,...extra});
export const catalog=[
make('food_salmon','Лосось','food',20,'Common',1,{hunger:28}),make('food_tuna','Тунец','food',22,'Common',1,{hunger:28}),make('food_chicken','Курица','food',18),make('food_meat','Мясо','food',24),make('food_steak','Стейк','food',38,'Uncommon',3),make('food_sausage','Сосиски','food',16),make('food_cheese','Сыр','food',15),make('food_bread','Хлеб','food',10),make('food_pie','Пирожок','food',14),make('food_salad','Салат','food',18),make('food_pasta','Паста','food',24),make('food_seafood','Паста с морепродуктами','food',34,'Uncommon',2),make('food_soup','Суп','food',18),make('food_cutlet','Макароны с котлетой','food',28),make('food_mash','Пюре с курицей','food',26),
make('drink_water','Вода','drinks',8),make('drink_milk','Молоко','drinks',14),make('drink_berry','Ягодный напиток','drinks',18,'Uncommon',2),
make('treat_cookie','Печенье-лапка','treats',16),make('treat_cake','Торт','treats',45,'Rare',4),make('treat_icecream','Мороженое','treats',28,'Uncommon',2),make('treat_candy','Конфеты','treats',20),
...['Мячик','Мышка','Удочка с пером','Лазер','Клубок','Тоннель','Пружинка','Плюшевая рыбка'].map((n,i)=>make('toy_'+i,n,'toys',35+i*12,i>5?'Rare':'Common',1+Math.floor(i/3),{mood:15})),
...['Альбом','Краски','Кисти','Карандаши','Мелки','Фломастеры','Мольберт'].map((n,i)=>make('art_'+i,n,'art',25+i*10,i>4?'Uncommon':'Common',1,{draw:true})),
...['Пижама звёзды','Свитер лавандовый','Худи','Платье','Стильный костюм','Карнавальный костюм'].map((n,i)=>make('outfit_'+i,n,i===0?'pajamas':i===5?'costumes':'outfits',70+i*25,i>3?'Rare':'Common',1+Math.floor(i/2),null,'coins',{slot:'body'})),
...['Шляпка','Корона'].map((n,i)=>make('hat_'+i,n,'hats',90+i*55,i?'Epic':'Rare',3+i,null,'coins',{slot:'head'})),
make('glasses_round','Круглые очки','glasses',95,'Rare',3,null,'coins',{slot:'eyes'}),make('collar_moon','Лунный ошейник','collars',80,'Uncommon',2,null,'coins',{slot:'neck'}),make('shoes_purple','Лиловые ботиночки','shoes',120,'Rare',4,null,'coins',{slot:'feet'}),make('bag_small','Рюкзачок','accessories',105,'Rare',3,null,'coins',{slot:'accessory'}),
make('bath_towel','Мягкое полотенце','bath',55),make('bath_dryer','Фен','bath',90,'Uncommon',2),
...['Диван','Кресло','Пуф','Ковёр','Столик','Лампа-звезда','Растение','Полка','Аквариум','Кошачье дерево'].map((n,i)=>make('furn_'+i,n,'furniture',90+i*28,i>7?'Rare':'Common',1+Math.floor(i/3),{decorate:true})),
make('bed_cloud','Кровать-облако','beds',180,'Rare',4,{decorate:true}),make('kitchen_bowl','Лиловая миска','kitchen',80,'Uncommon',2,{decorate:true}),make('decor_picture','Картина','decor',95,'Uncommon',2,{decorate:true}),
make('rod_bamboo','Удочка бамбуковая','rods',75),make('rod_lake','Удочка озёрная','rods',150,'Rare',4),make('tackle_box','Коробка снастей','fishing',90),make('fish_bucket','Ведро','fishing',55),make('bait_worm','Наживка','fishing',18),
make('season_scarf','Зимний шарф','seasonal',160,'Epic',7,null,'coins',{slot:'neck'}),make('rare_crown','Лунная корона','rare',450,'Legendary',12,null,'coins',{slot:'head'}),make('gift_box','Подарочная коробка','gifts',100,'Rare',5),
make('premium_starlight','Звёздный ошейник','premium',49,'Legendary',1,null,'XTR',{stars:49,slot:'neck'})
];
catalog.push(
...['Индейка','Говядина','Колбаса','Овощи','Креветки','Яйцо','Рис','Картофель','Морковь','Тыква'].map((n,i)=>make('food_more_'+i,n,'food',14+i*3,'Common',1,{hunger:22},'coins',{room:'kitchen',interaction:'eat'})),
...['Чай','Какао','Молочный коктейль','Мохито безалкогольный','Фруктовый напиток'].map((n,i)=>make('drink_more_'+i,n,'drinks',12+i*5,'Common',1,{thirst:24},'coins',{room:'kitchen',interaction:'drink'})),
...['Пирожное','Капкейк','Пончик','Макарон','Ягодный десерт'].map((n,i)=>make('treat_more_'+i,n,'treats',18+i*6,i>2?'Uncommon':'Common',1,{mood:8},'coins',{room:'kitchen',interaction:'eat'})),
...['Рыба с овощами','Курица с рисом','Овощное рагу','Мясное ассорти','Стейк с овощами','Сливочная паста'].map((n,i)=>make('dish_more_'+i,n,'food',28+i*5,i>3?'Uncommon':'Common',2,{hunger:30,mood:4},'coins',{room:'kitchen',interaction:'eat'})),
...['Мяч с бубенчиком','Плюшевая мышь','Интерактивный шар','Когтеточка-игрушка'].map((n,i)=>make('toy_more_'+i,n,'toys',42+i*14,'Uncommon',2,{mood:16},'coins',{room:'playroom',interaction:'play'})),
...['Скетчбук','Наклейки','Цветная бумага'].map((n,i)=>make('art_more_'+i,n,'art',35+i*10,'Common',1,{draw:true},'coins',{room:'playroom',interaction:'draw'})),
...['Мятное худи','Розовый комбинезон','Джинсовый жилет','Полосатая футболка','Платье с бантом','Спортивный костюм'].map((n,i)=>make('outfit_more_'+i,n,'outfits',85+i*18,i>3?'Rare':'Common',2,null,'coins',{room:'wardrobe',slot:'body',interaction:'wear'})),
...['Пижама облака','Пижама лапки','Лавандовая пижама','Пижама сердечки'].map((n,i)=>make('pajama_more_'+i,n,'pajamas',78+i*16,'Common',2,null,'coins',{room:'wardrobe',slot:'body',interaction:'wear'})),
...['Принцесса','Единорог','Ведьмочка','Супер-кот','Космонавт'].map((n,i)=>make('costume_more_'+i,n,'costumes',130+i*28,i>2?'Rare':'Uncommon',3,null,'coins',{room:'wardrobe',slot:'body',interaction:'wear'})),
...['Берет','Кепка','Панама','Ушки-звёзды'].map((n,i)=>make('hat_more_'+i,n,'hats',65+i*20,'Uncommon',2,null,'coins',{room:'wardrobe',slot:'head',interaction:'wear'})),
...['Сердечки','Солнечные очки','Звёздные очки'].map((n,i)=>make('glasses_more_'+i,n,'glasses',75+i*22,'Uncommon',2,null,'coins',{room:'wardrobe',slot:'eyes',interaction:'wear'})),
...['Ошейник-сердце','Жемчужный ошейник','Бантик'].map((n,i)=>make('collar_more_'+i,n,'collars',55+i*20,'Uncommon',2,null,'coins',{room:'wardrobe',slot:'neck',interaction:'wear'})),
...['Белые кеды','Розовые тапочки','Звёздные сапожки'].map((n,i)=>make('shoes_more_'+i,n,'shoes',90+i*25,'Uncommon',3,null,'coins',{room:'wardrobe',slot:'feet',interaction:'wear'})),
...['Тумба','Подушка','Корзина','Домик','Настенный светильник','Мягкая лавка'].map((n,i)=>make('furn_more_'+i,n,'furniture',80+i*22,'Common',2,{decorate:true},'coins',{interaction:'place'})),
...['Ваза','Гирлянда','Фоторамка','Плед','Неоновая лапка','Часы','Зеркало'].map((n,i)=>make('decor_more_'+i,n,'decor',45+i*15,'Common',2,{decorate:true},'coins',{interaction:'place'})),
...['Лежанка-сердце','Лежанка-пончик','Домик-луна'].map((n,i)=>make('bed_more_'+i,n,'beds',145+i*38,'Uncommon',3,{decorate:true},'coins',{room:'bedroom',interaction:'place'})),
...['Поплавок','Блесна','Сачок','Черви','Рыбная приманка'].map((n,i)=>make('fishgear_more_'+i,n,'fishing',20+i*14,'Common',1,null,'coins',{room:'lake',interaction:'fish'}))
);
catalog.push(
make('bath_soap','Мыло с пеной','bath',45,'Common',1,{cleanliness:28,mood:8},'coins',{room:'bathroom',interaction:'soap'}),
make('bath_bomb_pink','Бомбочка «Клубника»','bath',55,'Common',1,{cleanliness:12,mood:12},'coins',{room:'bathroom',interaction:'bathBomb',bathColor:'#ff8fb8'}),
make('bath_bomb_blue','Бомбочка «Океан»','bath',60,'Uncommon',2,{cleanliness:12,mood:12},'coins',{room:'bathroom',interaction:'bathBomb',bathColor:'#68c9ff'}),
make('bath_bomb_violet','Бомбочка «Лаванда»','bath',65,'Uncommon',2,{cleanliness:12,mood:14},'coins',{room:'bathroom',interaction:'bathBomb',bathColor:'#a98bff'}),
make('toy_feather','Палочка с перьями','toys',65,'Uncommon',1,{mood:20},'coins',{room:'playroom',interaction:'chase'}),
make('toy_mouse_live','Заводная мышка','toys',58,'Common',1,{mood:18},'coins',{room:'playroom',interaction:'chase'}),
make('toy_ball_bell','Мячик с бубенчиком','toys',52,'Common',1,{mood:18},'coins',{room:'playroom',interaction:'ball'}),
make('sleep_pajama_moon','Пижама «Луна»','pajamas',95,'Uncommon',1,null,'coins',{room:'bedroom',slot:'body',interaction:'sleepwear'})
);
export const categories=[...new Set(catalog.map(x=>x.category))];
const wearable=i=>['pajamas','outfits','costumes','hats','glasses','accessories','shoes','collars','seasonal','rare','premium'].includes(i.category);
export function buyItem(state,id){const n=structuredClone(state),item=catalog.find(x=>x.id===id);if(!item)return{state:n,ok:false,reason:'missing'};if(item.currency==='XTR')return{state:n,ok:false,reason:'premium'};n.inventory.owned??=[];n.inventory.food??={};n.inventory.clothes??=[];n.inventory.furniture??=[];const stackable=['food','drinks','treats','fishing'].includes(item.category);if(n.inventory.owned.includes(id)&&!stackable)return{state:n,ok:false,reason:'owned'};if(n.economy.level<item.level)return{state:n,ok:false,reason:'level'};if(n.economy.coins<item.price)return{state:n,ok:false,reason:'coins'};n.economy.coins-=item.price;if(stackable){n.inventory.food[id]=(n.inventory.food[id]||0)+1}else{n.inventory.owned.push(id);if(wearable(item))n.inventory.clothes.push(id);if(['furniture','beds','kitchen','decor'].includes(item.category))n.inventory.furniture.push(id)}n.economy.xp+=4;n.activity={type:'celebrate',stage:'jump',itemId:id,startedAt:Date.now()};n.needs.mood=Math.min(100,n.needs.mood+5);return{state:n,ok:true,item}}
export function equipItem(state,id){const n=structuredClone(state),item=catalog.find(x=>x.id===id);if(!item||!n.inventory.clothes.includes(id))return n;if(!n.inventory.equipped||typeof n.inventory.equipped!=='object')n.inventory.equipped={};n.inventory.equipped[item.slot||'body']=id;return n}
export function applyFurniture(state,id,room=state.room){const n=structuredClone(state);if(!n.inventory.furniture?.includes(id))return n;n.roomDecor??={};n.roomDecor[room]??=[];if(!n.roomDecor[room].includes(id))n.roomDecor[room].push(id);return n}
export function ownedInteractive(state,category){return catalog.filter(x=>x.category===category&&state.inventory.owned?.includes(x.id))}
