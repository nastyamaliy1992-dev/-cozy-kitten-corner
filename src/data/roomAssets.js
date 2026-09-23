// User-supplied room artwork is the gameplay scene source of truth.
export const HALL_BG = new URL('../../assets/rooms/living.webp', import.meta.url).href;

export const ROOM_BACKGROUNDS = {
  living: HALL_BG,
  kitchen: new URL('../../assets/rooms/kitchen.webp', import.meta.url).href,
  bedroom: new URL('../../assets/rooms/bedroom.webp', import.meta.url).href,
  bathroom: new URL('../../assets/rooms/bathroom.webp', import.meta.url).href,
  toilet: new URL('../../assets/rooms/toilet.webp', import.meta.url).href,
  wardrobe: new URL('../../assets/rooms/wardrobe.webp', import.meta.url).href,
  playroom: new URL('../../assets/rooms/playroom.webp', import.meta.url).href,
  lake: new URL('../../assets/rooms/lake.webp', import.meta.url).href,
  store: new URL('../../assets/rooms/store.webp', import.meta.url).href,
};

export function preloadRoomBackgrounds(current='living'){
  const order=Object.keys(ROOM_BACKGROUNDS);
  const i=Math.max(0,order.indexOf(current));
  const wanted=[order[i],order[(i+1)%order.length],order[(i-1+order.length)%order.length]];
  for(const id of new Set(wanted)){
    const img=new Image();
    img.decoding='async';
    img.src=ROOM_BACKGROUNDS[id];
  }
}
