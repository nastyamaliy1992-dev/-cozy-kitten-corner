// Canonical Luna runtime asset registry.
// Every state is a separate character layer. Missing state art intentionally falls back
// to the verified transparent idle asset until the matching user-supplied PNG is uploaded.
const idle = new URL('../../assets/luna/idle.webp', import.meta.url).href;
const pet = new URL('../../assets/luna/pet.webp', import.meta.url).href;
const happy = new URL('../../assets/luna/happy.webp', import.meta.url).href;
const sad = new URL('../../assets/luna/sad.webp', import.meta.url).href;

export const LUNA_ASSETS = {
  idle,
  happy,
  pet,
  sleepy: idle,
  sleep: idle,
  hungry: idle,
  sad,
};

export const LUNA_MAIN = idle;

export function lunaAssetFor({ sleeping=false, emotion='calm', activity='idle' }={}){
  if (sleeping) return LUNA_ASSETS.sleep;
  if (activity === 'petted') return LUNA_ASSETS.pet;
  // Eating remains on idle until the verified transparent eat asset is committed.
  if (emotion === 'tired') return LUNA_ASSETS.sleepy;
  if (emotion === 'hungry') return LUNA_ASSETS.hungry;
  if (emotion === 'sad') return LUNA_ASSETS.sad;
  if (emotion === 'joyful') return LUNA_ASSETS.happy;
  return LUNA_ASSETS.idle;
}
