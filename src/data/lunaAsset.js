// Canonical Luna runtime asset registry.
const idle = new URL('../../assets/luna/idle.webp', import.meta.url).href;
const pet = idle; // no asset swap on stroking: avoids any rectangular/square pet sprite
const happy = new URL('../../assets/luna/happy.webp', import.meta.url).href;
const sad = new URL('../../assets/luna/sad.webp', import.meta.url).href;
const sleepy = new URL('../../assets/luna/sleepy.webp', import.meta.url).href;
const sleep = new URL('../../assets/luna/sleep.webp', import.meta.url).href;
const eat = new URL('../../assets/luna/eat.webp', import.meta.url).href;
const actionDraw = new URL('../../assets/luna/action-draw.webp', import.meta.url).href;
const actionYarn = new URL('../../assets/luna/action-yarn.webp', import.meta.url).href;
const actionBath = new URL('../../assets/luna/action-bath.webp', import.meta.url).href;
const actionJump = new URL('../../assets/luna/action-jump.webp', import.meta.url).href;

export const LUNA_ASSETS = {
  idle, happy, pet, sleepy, sleep,
  hungry:eat, sad, eat,
  play:actionYarn, draw:actionDraw, bath:actionBath, toilet:pet, fish:happy, jump:actionJump
};

export const LUNA_MAIN = idle;

export function lunaAssetFor({ sleeping=false, emotion='calm', activity='idle' }={}){
  if (sleeping || activity === 'sleep') return LUNA_ASSETS.sleep;
  if (activity === 'petted' || activity === 'petting') return LUNA_ASSETS.idle;
  if (activity === 'eating' || activity === 'drink') return LUNA_ASSETS.eat;
  if (activity === 'toiletNeed') return LUNA_ASSETS.sad;
  if (activity === 'toilet') return LUNA_ASSETS.toilet;
  if (activity === 'bath' || activity === 'bathReady' || activity === 'soap' || activity === 'shampoo' || activity === 'shower' || activity === 'bathBomb' || activity === 'towel') return LUNA_ASSETS.bath;
  if (activity === 'draw') return LUNA_ASSETS.draw;
  if (activity === 'fish') return LUNA_ASSETS.fish;
  if (activity === 'jump' || activity === 'celebrate' || activity === 'levelup') return LUNA_ASSETS.jump;
  if (activity === 'play' || activity === 'drum' || activity === 'happy') return LUNA_ASSETS.happy;
  if (activity === 'sad') return LUNA_ASSETS.sad;
  if (emotion === 'tired') return LUNA_ASSETS.sleepy;
  if (emotion === 'hungry') return LUNA_ASSETS.hungry;
  if (emotion === 'sad' || emotion === 'toilet') return LUNA_ASSETS.sad;
  if (emotion === 'joyful') return LUNA_ASSETS.happy;
  return LUNA_ASSETS.idle;
}
