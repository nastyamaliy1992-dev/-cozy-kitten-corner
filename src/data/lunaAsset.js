// Canonical Luna runtime asset registry.
// Every state is a separate transparent character layer. Missing state art falls back
// to the verified transparent idle asset until the matching user-supplied art is connected.
const idle = new URL('../../assets/luna/idle.webp', import.meta.url).href;
const pet = new URL('../../assets/luna/pet.webp', import.meta.url).href;
const happy = new URL('../../assets/luna/happy.webp', import.meta.url).href;
const sad = new URL('../../assets/luna/sad.webp', import.meta.url).href;
const sleepy = new URL('../../assets/luna/sleepy.webp', import.meta.url).href;
const sleep = new URL('../../assets/luna/sleep.webp', import.meta.url).href;
const eat = new URL('../../assets/luna/eat.webp', import.meta.url).href;

export const LUNA_ASSETS = {
  idle,
  happy,
  pet,
  sleepy,
  sleep,
  hungry: idle,
  sad,
  eat,
};

export const LUNA_MAIN = idle;

export function lunaAssetFor({ sleeping=false, emotion='calm', activity='idle' }={}){
  if (sleeping) return LUNA_ASSETS.sleep;
  if (activity === 'petted') return LUNA_ASSETS.pet;
  if (activity === 'eating') return LUNA_ASSETS.eat;
  if (emotion === 'tired') return LUNA_ASSETS.sleepy;
  if (emotion === 'hungry') return LUNA_ASSETS.hungry;
  if (emotion === 'sad') return LUNA_ASSETS.sad;
  if (emotion === 'joyful') return LUNA_ASSETS.happy;
  return LUNA_ASSETS.idle;
}
