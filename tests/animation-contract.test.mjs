import test from 'node:test';
import assert from 'node:assert/strict';

import { lunaAssetFor } from '../src/data/lunaAsset.js';
import { createInitialState, consumeDrinkUnit, finishDrink } from '../src/core/state.js';
import { renderGame } from '../src/ui/appView.js';

test('kitchen feeding stages use twelve distinct transparent frame files', () => {
  const frames = Array.from({ length: 12 }, (_, index) =>
    lunaAssetFor({ activity: 'eating', stage: `feed${String(index + 1).padStart(2, '0')}` })
  );
  assert.equal(new Set(frames).size, 12);
  frames.forEach((src, index) => assert.match(src, new RegExp(`kitchen/feed/feed${String(index + 1).padStart(2, '0')}\\.png$`)));
});

test('drink stages use six distinct transparent frame files', () => {
  const frames = Array.from({ length: 6 }, (_, index) =>
    lunaAssetFor({ activity: 'drink', stage: `drink${String(index + 1).padStart(2, '0')}` })
  );
  assert.equal(new Set(frames).size, 6);
  frames.forEach((src, index) => assert.match(src, new RegExp(`kitchen/drink/drink${String(index + 1).padStart(2, '0')}\\.png$`)));
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
});
