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
  dance: new URL('../../assets/rooms/dance.svg', import.meta.url).href+'?v=20261009-photo2',
  store: new URL('../../assets/rooms/wardrobe.webp', import.meta.url).href, // safe fallback until dedicated store art is bundled
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

/* Resolve the embedded, user-approved dance photograph directly for iOS Safari:
   some SVG image contexts do not draw nested data-URI images. */
export async function loadDancePhoto(){
 if(typeof fetch!=='function')return false;
 const url=ROOM_BACKGROUNDS.dance;
 if(url.startsWith('data:'))return true;
 try{
  const response=await fetch(url,{cache:'no-store'});
  if(!response.ok)return false;
  const source=await response.text();
  const match=source.match(/data:image\/webp;base64,[A-Za-z0-9+/=]+/);
  if(!match)return false;
  ROOM_BACKGROUNDS.dance=match[0];
  if(typeof document!=='undefined'){
   document.querySelectorAll('.room-dance .room-background').forEach(image=>{image.src=match[0]});
  }
  return true;
 }catch{return false}
}
if(typeof window!=='undefined')void loadDancePhoto();
