import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const previousVersion = '20261010-school-play2';
const roomVersion = '20261010-toilet-photo2';
const stateVersion = '20261010-floor-anchor4';
const currentVersion = '20261010-dance-video3';
const poseVersion = '20261010-choreo3';
const petVersion = '20261010-fullbody5';

test('latest UI and pose assets refresh while dance photo stays correctly wired', async () => {
  const [index, main, appView, scenes, pet, roomAssets] = await Promise.all([
    'index.html',
    'src/main.js',
    'src/ui/appView.js',
    'src/ui/scenes.js',
    'src/ui/pet.js',
    'src/data/roomAssets.js'
  ].map(p => readFile(new URL(`../${p}`, import.meta.url), 'utf8')));
  assert.match(index, new RegExp(`main\\.js\\?v=${currentVersion}`));
  assert.match(index, new RegExp(`styles\\.css\\?v=${currentVersion}`));
  assert.match(main, new RegExp(`appView\\.js\\?v=${currentVersion}`));
  assert.match(main, new RegExp(`roomAssets\\.js\\?v=${roomVersion}`));
  assert.match(appView, new RegExp(`scenes\\.js\\?v=${roomVersion}`));
  assert.match(scenes, new RegExp(`roomAssets\\.js\\?v=${roomVersion}`));
  assert.match(roomAssets, /assets\/rooms\/dance-final-20261010\.webp/);
  assert.match(main, new RegExp(`state\\.js\\?v=${stateVersion}`));
  assert.match(main, new RegExp(`lunaAsset\\.js\\?v=${poseVersion}`));
  assert.match(main, new RegExp(`shop\\.js\\?v=${previousVersion}`));
  assert.match(appView, new RegExp(`pet\\.js\\?v=${petVersion}`));
  assert.match(appView, new RegExp(`shop\\.js\\?v=${previousVersion}`));
  assert.match(pet, new RegExp(`lunaAsset\\.js\\?v=${poseVersion}`));
});

test('dance interface uses one accurate Luna dance label', async () => {
 const [appView,main]=await Promise.all(['src/ui/appView.js','src/main.js'].map(p=>readFile(new URL(`../${p}`,import.meta.url),'utf8')));
 assert.match(appView,/data-dance-routine="luna"/);
 assert.doesNotMatch(appView,/>\s*(Макарена|Арам-зам-зам|Хип-хоп)/);
 assert.match(main,/const LUNA_DANCE_STEPS=/);
 assert.doesNotMatch(main,/const DANCE_ROUTINES=/);
});


test('one real generated MP4 is used for the Luna dance', async () => {
 const [view, workflow, builder] = await Promise.all([
  'src/ui/appView.js',
  '.github/workflows/pages.yml',
  'scripts/build_dance_video.py',
 ].map(p => readFile(new URL('../' + p, import.meta.url), 'utf8')));
 assert.match(view, /src="\.\/assets\/videos\/luna-dance\.mp4/);
 assert.doesNotMatch(view, /assets\/videos\/\$\{state\.activity\.videoStyle\}/);
 assert.match(workflow, /python scripts\/build_dance_video\.py/);
 assert.match(builder, /luna-dance\.mp4/);
});


test('Telegram dance video is a visible, tappable player started by user action',async()=>{
 const [view,main,css]=await Promise.all(['src/ui/appView.js','src/main.js','src/styles.css']
  .map(p=>readFile(new URL('../'+p,import.meta.url),'utf8')));
 assert.match(view,/const danceVideo=\(state\.room==='dance'&&!state\.settings\?\.reduceMotion\)/);
 assert.match(view,/<video class="dance-video" controls playsinline webkit-playsinline/);
 assert.match(view,/luna-dance\.mp4\?v=20261010-dance-video3/);
 assert.match(view,/data-stop-dance/);
 assert.match(main,/const started=video\.play\(\)/);
 assert.match(main,/shell\?\.classList\.add\('dance-video-ready'\)/);
 assert.match(css,/\.room-dance\.dance-video-ready \.scene \.dance-video\{display:block\}/);
});
