import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const previousVersion = '20261010-school-play2';
const danceVersion = '20261010-dance-photo1';

test('dance photograph and its scene imports refresh without changing untouched modules', async () => {
  const [index, main, appView, scenes, pet, roomAssets] = await Promise.all([
    'index.html',
    'src/main.js',
    'src/ui/appView.js',
    'src/ui/scenes.js',
    'src/ui/pet.js',
    'src/data/roomAssets.js'
  ].map(p => readFile(new URL(`../${p}`, import.meta.url), 'utf8')));
  assert.match(index, new RegExp(`main\\.js\\?v=${danceVersion}`));
  assert.match(index, new RegExp(`styles\\.css\\?v=${danceVersion}`));
  assert.match(main, new RegExp(`appView\\.js\\?v=${danceVersion}`));
  assert.match(main, new RegExp(`roomAssets\\.js\\?v=${danceVersion}`));
  assert.match(appView, new RegExp(`scenes\\.js\\?v=${danceVersion}`));
  assert.match(scenes, new RegExp(`roomAssets\\.js\\?v=${danceVersion}`));
  assert.match(roomAssets, /assets\/rooms\/dance-final-20261010\.webp/);
  assert.match(main, new RegExp(`state\\.js\\?v=${previousVersion}`));
  assert.match(main, new RegExp(`lunaAsset\\.js\\?v=${previousVersion}`));
  assert.match(main, new RegExp(`shop\\.js\\?v=${previousVersion}`));
  assert.match(appView, new RegExp(`pet\\.js\\?v=${previousVersion}`));
  assert.match(appView, new RegExp(`shop\\.js\\?v=${previousVersion}`));
  assert.match(pet, new RegExp(`lunaAsset\\.js\\?v=${previousVersion}`));
});
