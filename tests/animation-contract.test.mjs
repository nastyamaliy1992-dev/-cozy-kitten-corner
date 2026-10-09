import test from 'node:test';
import assert from 'node:assert/strict';

import { lunaAssetFor } from '../src/data/lunaAsset.js';
import { createInitialState, consumeDrinkUnit, finishDrink } from '../src/core/state.js';
import * as lunaAssets from '../src/data/lunaAsset.js';
import * as stateCore from '../src/core/state.js';
import { sequenceSoundCue } from '../src/core/audio.js';
import { renderGame } from '../src/ui/appView.js';
import { readFile } from 'node:fs/promises';
import { access } from 'node:fs/promises';

test('kitchen feeding stages use twelve distinct transparent frame files', () => {
  const frames = Array.from({ length: 12 }, (_, index) =>
    lunaAssetFor({ activity: 'eating', stage: `feed${String(index + 1).padStart(2, '0')}` })
  );
  assert.equal(new Set(frames).size, 12);
  frames.forEach((src, index) => assert.match(src, new RegExp(`kitchen/feed/feed${String(index + 1).padStart(2, '0')}\\.png$`)));
});

test('hall uses the exact upright Luna sprite and a separate greeting wave', () => {
  const idle = lunaAssetFor({ activity: 'idle', stage: 'idle' });
  const wave = lunaAssetFor({ activity: 'greeting', stage: 'greetingWave' });
  assert.match(idle, /hall\/luna-main-clean\.png$/);
  assert.match(wave, /hall\/luna-wave-clean\.png$/);
  assert.notEqual(idle, wave);
});

test('idle life uses dedicated collar-free blink and tail frames', async () => {
  const blink = lunaAssetFor({ activity: 'idle', stage: 'idleBlink' });
  const tail = lunaAssetFor({ activity: 'idle', stage: 'idleTail' });
  assert.match(blink, /hall\/luna-idle-blink-clean\.png$/);
  assert.match(tail, /hall\/luna-idle-tail-clean\.png$/);
  await Promise.all([
    access(new URL('../assets/luna/hall/luna-main-clean.png',import.meta.url)),
    access(new URL('../assets/luna/hall/luna-wave-clean.png',import.meta.url)),
    access(new URL('../assets/luna/hall/luna-idle-blink-clean.png',import.meta.url)),
    access(new URL('../assets/luna/hall/luna-idle-tail-clean.png',import.meta.url))
  ]);
});

test('uploaded emotions are available as transparent in-game reaction stages', () => {
  const expected={
    angry:/emotions\/angry\.png$/,
    annoyed:/emotions\/annoyed\.png$/,
    pleading:/emotions\/pleading\.png$/,
    scared:/emotions\/scared\.png$/,
    sadEmotion:/emotions\/sad\.png$/,
    surprised:/emotions\/surprised\.png$/,
    laugh:/emotions\/laugh\.png$/,
    curious:/emotions\/curious\.png$/,
    warmHappy:/emotions\/happy\.png$/
  };
  for(const [stage,pattern] of Object.entries(expected))assert.match(lunaAssetFor({activity:'emotion',stage}),pattern);
});

test('drink stages use six distinct transparent frame files', () => {
  const frames = Array.from({ length: 6 }, (_, index) =>
    lunaAssetFor({ activity: 'drink', stage: `drink${String(index + 1).padStart(2, '0')}` })
  );
  assert.equal(new Set(frames).size, 6);
  frames.forEach((src, index) => assert.match(src, new RegExp(`kitchen/drink/drink${String(index + 1).padStart(2, '0')}\\.png$`)));
});

test('bathroom uses fixture-free Luna frames; fishing and drawing keep separate transparent frames', () => {
  const expected = {
    bathStepIn: /actions\/bathroom\/bath_peek_no_fixture\.webp$/,
    inTub: /actions\/bathroom\/bath_peek_no_fixture\.webp$/,
    bathSoap: /actions\/bathroom\/bath_peek_no_fixture\.webp$/,
    bathRinse: /actions\/bathroom\/bath_peek_no_fixture\.webp$/,
    toiletSitting: /actions\/bathroom\/toilet_sit_no_fixture\.webp$/,
    fishingReady: /actions\/fishing\/073_07_fishing_empty_bucket_rod\.png$/,
    waiting: /actions\/fishing\/076_07_fishing_wait_for_fish\.png$/,
    fullBucket: /actions\/fishing\/084_07_fishing_full_bucket_celebrate\.png$/,
    drawSit: /actions\/drawing\/097_09_drawing_seated_sit_blank_paper\.png$/,
    drawHeart: /actions\/drawing\/101_09_drawing_seated_draw_heart\.png$/,
    showDrawing: /actions\/drawing\/107_09_drawing_seated_show_picture\.png$/
  };
  for (const [stage,pattern] of Object.entries(expected)) {
    assert.match(lunaAssetFor({activity:'sequence',stage}),pattern);
  }
});

test('game runs full bath, fishing and drawing frame sequences', async () => {
  const main = await readFile(new URL('../src/main.js',import.meta.url),'utf8');
  assert.match(main,/stage:'bathStepIn'/);
  assert.match(main,/stage:'bathFinished'/);
  assert.match(main,/stage:'fishingReady'/);
  assert.match(main,/stage:'fullBucket'/);
  assert.match(main,/stage:'drawHeart'/);
  assert.match(main,/stage:'drawProud'/);
});

test('sleep stages win over generic sleeping image', () => {
  const frame = lunaAssetFor({ sleeping: true, activity: 'sleepSequence', stage: 'sleep08' });
  assert.match(frame, /bedroom\/sleep\/sleep08\.png$/);
});

test('a drink is consumed before thirst reward is applied', () => {
  const initial = createInitialState('Луна');
  initial.inventory.food.drink_water = 2;
  initial.needs.thirst = 40;
  const consumed = consumeDrinkUnit(initial, 'drink_water');
  assert.equal(consumed.ok, true);
  assert.equal(consumed.state.inventory.food.drink_water, 1);
  assert.equal(consumed.state.needs.thirst, 40);
  const finished = finishDrink(consumed.state);
  assert.equal(finished.state.needs.thirst, 65);
});

test('baked action frames hide emoji wearables', () => {
  const state = createInitialState('Луна');
  state.inventory.equipped = { head: 'hat_0', body: 'sleep_pajama_moon' };
  state.activity = { type: 'sleepSequence', stage: 'sleep03' };
  const html = renderGame(state);
  assert.doesNotMatch(html, /luna-wearables/);
  state.activity = { type: 'fishCatch', stage: 'fullBucket' };
  assert.doesNotMatch(renderGame(state), /luna-wearables/);
  state.activity = { type: 'bathReady', stage: 'inTub' };
  assert.doesNotMatch(renderGame(state), /luna-wearables/);
});

test('header avatar uses the same main Luna sprite', () => {
  const state = createInitialState('Луна');
  const html = renderGame(state);
  assert.match(html, /assets\/luna\/hall\/luna-main-clean\.png/);
});

test('welcome sequence waves and speaks the requested greeting with soft voice settings', async () => {
  const [main, audio] = await Promise.all([
    readFile(new URL('../src/main.js',import.meta.url),'utf8'),
    readFile(new URL('../src/core/audio.js',import.meta.url),'utf8')
  ]);
  assert.match(main, /stage:'greetingWave'/);
  assert.match(main, /Привет, я Луна\. Я тебя ждала!/);
  assert.match(audio, /u\.rate=\.94/);
  assert.match(audio, /u\.pitch=1\.03/);
});

test('kitchen action frames stay above the food panel', async () => {
  const css = await readFile(new URL('../src/styles.css',import.meta.url),'utf8');
  assert.match(css,/\.room-kitchen\.activity-eating \.pet-button,[\s\S]*?bottom:210px!important/);
  assert.match(css,/\.feeding-sequence-layer\{[\s\S]*?bottom:207px/);
});

test('room entry chooses its contextual pose before the first render', async () => {
  assert.equal(typeof stateCore.roomEntryActivity,'function');
  assert.deepEqual(stateCore.roomEntryActivity('bathroom',123),{type:'bathWant',stage:'asking',startedAt:123});
  assert.deepEqual(stateCore.roomEntryActivity('toilet',456),{type:'toiletNeed',stage:'asking',startedAt:456});
  assert.deepEqual(stateCore.roomEntryActivity('kitchen',789),{type:'idle',stage:'idle',startedAt:789});
  const main = await readFile(new URL('../src/main.js',import.meta.url),'utf8');
  const roomHandler = main.slice(main.indexOf("document.querySelectorAll('[data-room]')"));
  const activityAt = roomHandler.indexOf('state.activity=roomEntryActivity(state.room');
  const firstRenderAt = roomHandler.indexOf('persist();render()');
  assert.ok(activityAt >= 0 && activityAt < firstRenderAt,'contextual activity must be assigned before the first room render');
});

test('slow action timing gives drawing and fishing frames time to read', () => {
  assert.equal(typeof stateCore.actionFrameDuration,'function');
  assert.ok(stateCore.actionFrameDuration('draw',200) >= 340);
  assert.ok(stateCore.actionFrameDuration('fishGame',400) >= 640);
  assert.ok(stateCore.actionFrameDuration('fishCatch',400) >= 640);
  assert.ok(stateCore.actionFrameDuration('eating',200) >= 250);
});

test('frame swaps crossfade a retained previous frame instead of a hard visual cut', async () => {
  const main = await readFile(new URL('../src/main.js',import.meta.url),'utf8');
  assert.match(main,/luna-previous-frame/);
  assert.match(main,/previous\.animate\(\[\{opacity:1\},\{opacity:0\}\]/);
  assert.match(main,/img\.animate\(\[\{opacity:0\},\{opacity:1\}\]/);
  assert.match(main,/duration:140,easing:'ease-out'/);
});

test('sequence assets can be collected before playback begins', () => {
  assert.equal(typeof lunaAssets.sequenceFrameSources,'function');
  const frames = lunaAssets.sequenceFrameSources('draw',[
    {stage:'drawSit'},
    {stage:'drawHeart'},
    {stage:'drawSit'}
  ]);
  assert.equal(frames.length,2);
  assert.match(frames[0],/097_09_drawing_seated_sit_blank_paper\.png$/);
  assert.match(frames[1],/101_09_drawing_seated_draw_heart\.png$/);
});

test('generic hunger never shows the old bowl and purple-heart sprite', () => {
  assert.match(lunaAssetFor({emotion:'hungry',activity:'idle',stage:'idle'}),/emotions\/pleading\.png$/);
  assert.match(lunaAssetFor({activity:'bathWant',stage:'asking'}),/emotions\/pleading\.png$/);
});

test('soap renders growing foam over Luna', () => {
  const state = createInitialState('Луна');
  state.room='bathroom';
  state.activity={type:'soap',stage:'readyToScrub',scrub:42,foamColor:'#ffffff'};
  const html=renderGame(state);
  assert.match(html,/class="foam-cloud"/);
  assert.match(html,/--foam-progress:42/);
});

test('Luna is larger and petting uses a heart-free visible reaction', async () => {
  const [css,appView,shop] = await Promise.all([
    readFile(new URL('../src/styles.css',import.meta.url),'utf8'),
    readFile(new URL('../src/ui/appView.js',import.meta.url),'utf8'),
    readFile(new URL('../src/core/shop.js',import.meta.url),'utf8')
  ]);
  assert.match(css,/--luna-size:max\(290px,min\(58vw,330px\)\)/);
  assert.match(css,/@keyframes lunaPetDelight/);
  assert.doesNotMatch(css,/\.activity-petted \.pet-stage:after\{content:'♥/);
  assert.doesNotMatch(appView,/💜/);
  assert.doesNotMatch(shop,/💜/);
});

test('bath towel keeps the same fitted scale as the in-tub sequence', async () => {
  const css = await readFile(new URL('../src/styles.css',import.meta.url),'utf8');
  const finalBathSizing=css.slice(css.lastIndexOf('.room-bathroom.activity-bath .pet-button'));
  assert.match(finalBathSizing,/\.room-bathroom\.activity-towel \.pet-button/);
  assert.match(finalBathSizing,/width:min\(48vw,235px\)!important/);
  assert.match(finalBathSizing,/height:min\(56vw,275px\)!important/);
});

test('neck overlays are not rendered over Luna on entry', () => {
  const state=createInitialState('Луна');
  state.inventory.equipped={neck:'collar_moon'};
  const html=renderGame(state);
  assert.doesNotMatch(html,/class="wear-neck/);
  assert.doesNotMatch(html,/💜/);
});

test('idle life runs only between actions and alternates blink with tail sway', async () => {
  const main=await readFile(new URL('../src/main.js',import.meta.url),'utf8');
  assert.match(main,/function scheduleIdleLife/);
  assert.match(main,/state\.activity\?\.type!=='idle'/);
  assert.match(main,/idleBlink/);
  assert.match(main,/idleTail/);
});

test('sequence sound cues are tied to exact animation frames', () => {
  assert.deepEqual(sequenceSoundCue('eating','feed07'),['bite']);
  assert.deepEqual(sequenceSoundCue('eating','feed08'),['chew']);
  assert.deepEqual(sequenceSoundCue('eating','feed10'),['swallow']);
  assert.deepEqual(sequenceSoundCue('draw','drawFirstLine'),['draw']);
  assert.deepEqual(sequenceSoundCue('fishGame','cast'),['cast','water']);
  assert.deepEqual(sequenceSoundCue('fishCatch','fishOnHook'),['catch']);
});


test('play interactions count both toys, while toilet sprites never overlay a second toilet', async () => {
 const [main, view, luna] = await Promise.all([
  readFile(new URL('../src/main.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/ui/appView.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/lunaAsset.js', import.meta.url), 'utf8')
 ]);
 assert.match(main, /state\.playStats\[kind\]/);
 assert.match(view, /play-score/);
 assert.match(luna, /toiletSitting:toiletSitNoFixture/);
 assert.match(luna, /toiletSitDown:toiletSitNoFixture/);
});
