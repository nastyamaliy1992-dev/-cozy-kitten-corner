import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {createInitialState,restoreState} from '../src/core/state.js';
import {saveGame} from '../src/core/persistence.js';
import {lunaAssetFor} from '../src/data/lunaAsset.js';
import {renderGame} from '../src/ui/appView.js';
import {sequenceSoundCue} from '../src/core/audio.js';
import {rooms} from '../src/core/rooms.js';

test('dance room and playroom both render Luna and their interactive controls',()=>{
 const state=createInitialState('Luna');
 for(const room of ['dance','playroom','toilet']){
  state.room=room;
  const html=renderGame(state,'',{});
  assert.match(html,/class="pet-button"/);
  assert.match(html,/class="luna-photo"/);
  if(room==='dance'){assert.match(html,/data-dance-move="left"/);assert.match(html,/data-dance-move="right"/);assert.match(html,/data-dance-move="spin"/)}
  if(room==='playroom'){assert.match(html,/data-play-action="ball"/);assert.match(html,/data-play-action="yarn"/);assert.match(html,/data-play-action="jump"/)}
  if(room==='toilet')assert.match(html,/data-object="litter"/);
 }
 assert.ok(rooms.dance);
});

test('all new dance, jump, toy and toilet sprites actually exist',async()=>{
 const stages=['danceLeft1','danceLeft2','danceRight1','danceSpin1','danceJump1','danceFinished','playReady','playChaseLeft','playChaseRight','playPounce','playJumpRise','playJumpPeak','playJumpLand','playCelebrate','toiletReady','toiletSitDown','toiletSitting','toiletFlush'];
 for(const stage of stages){
  const url=lunaAssetFor({activity:'dance',stage});
  assert.ok(url.includes('/assets/luna/'),stage);
  await access(new URL(url));
 }
 await access(new URL('../assets/rooms/dance.svg',import.meta.url));
});

test('toilet actually flushes after sitting rather than before',()=>{
 assert.deepEqual(sequenceSoundCue('toilet','toiletSitting'),['fart']);
 assert.deepEqual(sequenceSoundCue('toilet','toiletFlush'),['flush']);
});

test('dance rewards and game progress survive a persistent reload',()=>{
 const store=new Map();
 globalThis.localStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value),removeItem:key=>store.delete(key)};
 const s=createInitialState('Luna');
 s.economy.coins=378;
 s.economy.level=2;
 s.dance={moves:4,completed:1};
 saveGame(s);
 const loaded=restoreState();
 assert.equal(loaded.economy.coins,378);
 assert.equal(loaded.economy.level,2);
 assert.equal(loaded.dance.completed,1);
 assert.equal(loaded.dance.moves,4);
});

test('animation sequences no longer reset the scene on every speech bubble',async()=>{
 const code=await readFile(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(code,/function showBubble\(text,ms=1500\)/);
 const chunk=code.slice(code.indexOf('function showBubble('),code.indexOf('let lunaSequenceToken'));
 assert.doesNotMatch(chunk,/render\(\)/);
 assert.match(code,/function runDanceMove/);
 assert.match(code,/stage:'toiletFlush'/);
 assert.match(code,/if\(!actionLock\)render\(\)/);
 assert.doesNotMatch(code,/if\(launchIntroPending&&state\)/);
});

test('motion CSS includes left, right, jump, spinning and rolling toys',async()=>{
 const css=await readFile(new URL('../src/styles.css',import.meta.url),'utf8');
 for(const motion of ['danceSidestepLeft','danceSidestepRight','danceJumpMove','danceSpinMove','toyLunaChaseLeft','toyLunaPounce','rollingToy','toilet-lid-visual'])assert.ok(css.includes(motion),motion);
});
