import test from 'node:test';
import assert from 'node:assert/strict';

import { lunaAssetFor } from '../src/data/lunaAsset.js';
import { createInitialState, consumeDrinkUnit, finishDrink } from '../src/core/state.js';
import { renderGame } from '../src/ui/appView.js';
import { readFile } from 'node:fs/promises';

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
  assert.match(idle, /hall\/luna-main\.png$/);
  assert.match(wave, /hall\/luna-wave\.png$/);
  assert.notEqual(idle, wave);
});

test('drink stages use six distinct transparent frame files', () => {
  const frames = Array.from({ length: 6 }, (_, index) =>
    lunaAssetFor({ activity: 'drink', stage: `drink${String(index + 1).padStart(2, '0')}` })
  );
  assert.equal(new Set(frames).size, 6);
  frames.forEach((src, index) => assert.match(src, new RegExp(`kitchen/drink/drink${String(index + 1).padStart(2, '0')}\\.png$`)));
});

test('bathroom, fishing and drawing actions use their separate transparent frames', () => {
  const expected = {
    bathStepIn: /actions\/bathroom\/041_04_bathroom_bath_bath_step_in\.png$/,
    inTub: /actions\/bathroom\/042_04_bathroom_bath_bath_sitting\.png$/,
    bathSoap: /actions\/bathroom\/043_04_bathroom_bath_bath_soap\.png$/,
    bathRinse: /actions\/bathroom\/044_04_bathroom_bath_bath_rinse\.png$/,
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
  assert.match(html, /assets\/luna\/hall\/luna-main\.png/);
});

test('welcome sequence waves and speaks the requested greeting with soft voice settings', async () => {
  const [main, audio] = await Promise.all([
    readFile(new URL('../src/main.js',import.meta.url),'utf8'),
    readFile(new URL('../src/core/audio.js',import.meta.url),'utf8')
  ]);
  assert.match(main, /stage:'greetingWave'/);
  assert.match(main, /Привет, я Луна\. Я тебя ждала!/);
  assert.match(audio, /u\.rate=\.94/);
  assert.match(audio, /u\.pitch=1\.18/);
});

test('kitchen action frames stay above the food panel', async () => {
  const css = await readFile(new URL('../src/styles.css',import.meta.url),'utf8');
  assert.match(css,/\.room-kitchen\.activity-eating \.pet-button,[\s\S]*?bottom:210px!important/);
  assert.match(css,/\.feeding-sequence-layer\{[\s\S]*?bottom:207px/);
});
