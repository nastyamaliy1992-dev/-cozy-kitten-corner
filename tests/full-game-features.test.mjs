import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createInitialState} from '../src/core/state.js';
import {renderGame} from '../src/ui/appView.js';
import {outfitLayer,outfitPalette} from '../src/ui/outfits.js';
import {drawingPaper,drawingGallery} from '../src/ui/drawingCard.js';
import {animateToyChase} from '../src/ui/toyChase.js';
import {equipItem,unequipItem} from '../src/core/shop.js';

const rooms=['living','kitchen','bedroom','bathroom','toilet','wardrobe','playroom','store','dance','school','lake'];
for(const room of rooms){
 test('room '+room+' renders its existing UI without losing Luna',()=>{
  const state=createInitialState('Luna');state.room=room;
  const html=renderGame(state,'',{});
  assert.match(html,/class="game-shell/);
  assert.match(html,/class="luna-photo"/);
  assert.match(html,/data-room="/);
  assert.match(html,/room-/);
 });
}
test('all photographed rooms have deployable images',async()=>{
 for(const name of ['living','kitchen','bedroom','bathroom','toilet','wardrobe','playroom','lake']){
  const a=await readFile(new URL('../assets/rooms/'+name+'.webp',import.meta.url));
  assert.ok(a.length>20000,name);
 }
});
test('wardrobe equips fabric drawings, retains separate slots, and lets Luna undress',()=>{
 const s=createInitialState('Luna');s.room='wardrobe';
 s.inventory.clothes=['sleep_pajama_moon','collar_moon'];
 let n=equipItem(s,'sleep_pajama_moon');
 n=equipItem(n,'collar_moon');
 assert.equal(n.inventory.equipped.body,'sleep_pajama_moon');
 assert.equal(n.inventory.equipped.neck,'collar_moon');
 let h=renderGame(n,'',{panel:'wardrobe'});
 assert.match(h,/class="luna-outfit-svg/);
 assert.match(h,/data-wear-id="sleep_pajama_moon"/);
 assert.match(h,/data-wear-id="collar_moon"/);
 assert.match(h,/data-clear-outfit/);
 assert.match(h,/data-unequip="body"/);
 n=unequipItem(n,'body');
 assert.equal(n.inventory.equipped.body,undefined);
 assert.equal(n.inventory.equipped.neck,'collar_moon');
 n=unequipItem(n);
 assert.deepEqual(n.inventory.equipped,{});
});
test('real clothes are SVG layers with sleeves and neckline, not emoji',()=>{
 const item={id:'outfit_0',name:'Пижама звёзды'};
 const svg=outfitLayer('body',item);
 assert.match(svg,/<svg/);
 assert.match(svg,/stroke=/);
 assert.match(svg,/M121 225/);
 assert.deepEqual(outfitPalette(item).length,3);
 assert.match(outfitLayer('head',{id:'hat_0',name:'Шляпка'}),/viewBox/);
});
test('playroom uses throw button and three-round chasing instead of tapping flying objects',()=>{
 const s=createInitialState('Luna');s.room='playroom';s.playChallenge={kind:'ball',hits:1,target:1,startedAt:1};
 const html=renderGame(s);
 assert.match(html,/data-play-catch/);
 assert.match(html,/toy-throw-button/);
 assert.match(html,/Поймай игрушку: 1\/3/);
 assert.doesNotMatch(html,/class="play-catch-target"/);
 assert.equal(typeof animateToyChase,'function');
});
test('drawing displays the finished art and opens a saved-drawings gallery',()=>{
 const s=createInitialState('Luna');s.room='playroom';s.activity={type:'draw',stage:'drawStart'};
 const html=renderGame(s);
 assert.match(html,/class="drawing-live"/);
 assert.match(html,/class="drawing-stroke"/);
 assert.match(drawingPaper(),/<svg/);
 s.progress={drawings:[{id:'drawing_1'}]};
 assert.match(drawingGallery(s),/сохранила 1 рисунок/);
 assert.match(renderGame(s,'',{panel:'drawings'}),/class="game-panel drawing-gallery"/);
});
test('voice uses gentle meow by default, robotic speech remains opt-in',async()=>{
 const audio=await readFile(new URL('../src/core/audio.js',import.meta.url),'utf8');
 const st=await readFile(new URL('../src/core/state.js',import.meta.url),'utf8');
 assert.match(audio,/voiceStyle!=='speech'/);
 assert.match(audio,/softMeow/);
 assert.match(st,/voiceStyle:'cat'/);
});
test('all room graphics use same enhancement and dance video stays uncropped',async()=>{
 const css=await readFile(new URL('../src/styles.css',import.meta.url),'utf8');
 assert.match(css,/\.game-shell \.room-background/);
 assert.match(css,/brightness\(1\.075\)/);
 assert.match(css,/\.room-dance \.room-background/);
 assert.match(css,/object-fit:contain!important/);
});


test('toy catching survives ten-second state refresh without losing progress or locking the game',async()=>{
 const main=await readFile(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(main,/state\.playChallenge\?\.startedAt!==startedAt/);
 assert.match(main,/const currentChallenge=state\.playChallenge/);
 assert.match(main,/actionLock=false;return;/);
 assert.doesNotMatch(main,/state\.playChallenge!==challenge/);
});

test('outfit is entirely absent outside the wardrobe, even if equipped or previewed',()=>{
 const rooms=['living','kitchen','bedroom','bathroom','toilet','playroom','store','dance','school','lake'];
 for(const room of rooms){
  const state=createInitialState('Луна');
  state.room=room;
  state.inventory.clothes=['sleep_pajama_moon','collar_moon'];
  state.inventory.equipped={body:'sleep_pajama_moon',neck:'collar_moon'};
  const output=renderGame(state,'',{previewItem:'outfit_1'});
  assert.doesNotMatch(output,/class="luna-wearables"/,room);
  assert.doesNotMatch(output,/class="luna-outfit-svg[^"]*" viewBox="0 0 300 400"[^>]*data-wear-id="sleep_pajama_moon"/,room);
 }
});
test('selected clothing displays only in wardrobe and can still be removed',()=>{
 const state=createInitialState('Луна');
 state.room='wardrobe';
 state.inventory.clothes=['sleep_pajama_moon'];
 state.inventory.equipped={body:'sleep_pajama_moon'};
 const html=renderGame(state,'',{panel:'wardrobe'});
 assert.match(html,/class="luna-wearables"/);
 assert.match(html,/data-unequip="body"/);
 assert.match(html,/data-clear-outfit/);
});
test('old automatically worn sweater resets once without deleting purchased clothes',async()=>{
 const {restoreState}=await import('../src/core/state.js');
 const {saveGame}=await import('../src/core/persistence.js');
 const previous=globalThis.localStorage;
 const store=new Map();
 globalThis.localStorage={
  getItem(k){return store.get(k)||null},
  setItem(k,v){store.set(k,String(v))},
  removeItem(k){store.delete(k)}
 };
 try{
  const before=createInitialState('Луна');
  before.inventory.clothes=['sleep_pajama_moon','collar_moon'];
  before.inventory.owned=['sleep_pajama_moon','collar_moon'];
  before.inventory.equipped={body:'sleep_pajama_moon',neck:'collar_moon'};
  saveGame(before);
  const after=restoreState();
  assert.deepEqual(after.inventory.equipped,{});
  assert.ok(after.inventory.clothes.includes('sleep_pajama_moon'));
  assert.ok(after.inventory.owned.includes('sleep_pajama_moon'));
  assert.equal(after.onboarding.wardrobeOnlyReset20261018,true);
  after.inventory.equipped={neck:'collar_moon'};
  saveGame(after);
  assert.equal(restoreState().inventory.equipped.neck,'collar_moon');
 }finally{globalThis.localStorage=previous}
});
