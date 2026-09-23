import { HALL_BG, ROOM_BACKGROUNDS } from '../data/roomAssets.js';

export function renderRoomDecor(room,ui={}){
 const bg=ROOM_BACKGROUNDS[room] || HALL_BG;
 const background=`<img class="room-background" src="${bg}" alt="" draggable="false">`;
 if(room==='kitchen')return `<div class="decor kitchen-decor real-room">${background}<button class="scene-hotspot kitchen-fridge-hotspot" data-object="fridge" aria-label="Открыть холодильник"></button><button class="scene-hotspot kitchen-bowl-hotspot" data-object="bowl" aria-label="Миска"></button><button class="scene-hotspot kitchen-water-hotspot" data-object="drink" aria-label="Вода"></button></div>`;
 if(room==='bedroom')return `<div class="decor bedroom-decor real-room">${background}<button class="scene-hotspot bedroom-lamp-hotspot" data-object="lamp" aria-label="Лампа"></button><button class="scene-hotspot bedroom-bed-hotspot" data-object="bed" aria-label="Кровать"></button></div>`;
 if(room==='bathroom')return `<div class="decor bathroom-decor real-room">${background}<button class="scene-hotspot bathroom-tub-hotspot" data-object="tub" aria-label="Ванна"></button></div>`;
 if(room==='toilet')return `<div class="decor toilet-decor real-room">${background}<button class="scene-hotspot toilet-litter-hotspot" data-object="litter" aria-label="Лоток"></button></div>`;
 if(room==='wardrobe')return `<div class="decor wardrobe-decor real-room">${background}<button class="scene-hotspot wardrobe-closet-hotspot" data-object="closet" aria-label="Гардероб"></button></div>`;
 if(room==='playroom')return `<div class="decor playroom-decor real-room">${background}<button class="scene-hotspot playroom-toy-hotspot" data-object="toy" aria-label="Игрушки"></button><button class="scene-hotspot playroom-art-hotspot" data-action="draw" aria-label="Рисовать"></button></div>`;
 if(room==='store')return `<div class="decor store-decor real-room">${background}<button class="scene-hotspot store-shop-hotspot" data-action="shop" aria-label="Магазин"></button></div>`;
 if(room==='lake')return `<div class="decor lake-decor real-room">${background}<button class="scene-hotspot lake-water-hotspot" data-object="water" aria-label="Рыбачить"></button></div>`;
 return `<div class="decor living-decor real-room">${background}<button class="scene-hotspot hall-toy-hotspot" data-object="toy" aria-label="Игрушки"></button><button class="scene-hotspot hall-kitchen-hotspot" data-room="kitchen" aria-label="Кухня"></button></div>`;
}