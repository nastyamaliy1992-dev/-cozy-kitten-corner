// Canonical Luna runtime asset registry.
// Every state is a separate character layer. Missing state art intentionally falls back
// to the verified transparent idle asset until the matching user-supplied PNG is uploaded.
const idle = new URL('../../assets/luna/idle.webp', import.meta.url).href;

export const LUNA_ASSETS = {
  idle,
  happy: idle,
  sleepy: idle,
  sleep: idle,
  hungry: idle,
  sad: idle,
};

export const LUNA_MAIN = idle;

export function lunaAssetFor({ sleeping=false, emotion='calm', activity='idle' }={}){
  if (sleeping) return LUNA_ASSETS.sleep;
  if (activity === 'petted') return LUNA_ASSETS.happy;
  if (emotion === 'tired') return LUNA_ASSETS.sleepy;
  if (emotion === 'hungry') return LUNA_ASSETS.hungry;
  if (emotion === 'sad') return LUNA_ASSETS.sad;
  if (emotion === 'joyful') return LUNA_ASSETS.happy;
  return LUNA_ASSETS.idle;
}
