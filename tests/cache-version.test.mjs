import test from 'node:test';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const previousVersion = '20261010-school-play2';
const roomVersion = '20261010-toilet-photo2';
const stateVersion = '20261010-floor-anchor4';
const currentVersion = '20261011-dance-fullframe-controls2';
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

test('dance interface offers independently selectable clips', async () => {
 const [appView,main]=await Promise.all(['src/ui/appView.js','src/main.js'].map(p=>readFile(new URL(`../${p}`,import.meta.url),'utf8')));
 assert.match(appView,/data-dance-routine="1"/);
 assert.match(appView,/data-dance-routine="2"/);
 assert.match(appView,/🔒 Танец 3/);
 assert.match(main,/runDanceRoutine\(Number\(b\.dataset\.danceRoutine\)\)/);
 assert.doesNotMatch(appView,/>\s*(Макарена|Арам-зам-зам|Хип-хоп)/);
 assert.match(main,/const LUNA_DANCE_STEPS=/);
 assert.doesNotMatch(main,/const DANCE_ROUTINES=/);
});


test('first MP4 is selected while previous approved video is preserved', async () => {
 const [view, workflow, builder] = await Promise.all([
  'src/ui/appView.js',
  '.github/workflows/pages.yml',
  'scripts/build_dance_video.py',
 ].map(p => readFile(new URL('../' + p, import.meta.url), 'utf8')));
 assert.match(view, /luna-dance-01-mobile\.mp4/);
 assert.match(view, /luna-dance-02-mobile\.mp4/);
 assert.match(view, /src="\.\/assets\/videos\/\$\{danceClip\}/);
 assert.doesNotMatch(view, /assets\/videos\/\$\{state\.activity\.videoStyle\}/);
 assert.match(workflow, /test -s assets\/videos\/luna-dance\.mp4/);
 assert.doesNotMatch(workflow, /python scripts\/build_dance_video\.py/);
 assert.match(builder, /luna-dance\.mp4/);
});


test('Telegram dance video is a visible, tappable player started by user action',async()=>{
 const [view,main,css]=await Promise.all(['src/ui/appView.js','src/main.js','src/styles.css']
  .map(p=>readFile(new URL('../'+p,import.meta.url),'utf8')));
 assert.match(view,/const danceVideo=\(state\.room==='dance'&&!state\.settings\?\.reduceMotion\)/);
 assert.match(view,/<video class="dance-video" controls playsinline webkit-playsinline preload="auto"/);
 assert.match(view,/\$\{danceClip\}\?v=20261011-dance-fullframe-controls2/);
 assert.match(view,/data-stop-dance/);
 assert.match(main,/const started=video\.play\(\)/);
 assert.match(main,/shell\?\.classList\.add\('dance-video-ready'\)/);
 assert.match(css,/\.room-dance\.dance-video-ready \.scene \.dance-video\{visibility:visible;opacity:1\}/);
});


test('approved Luna dance V4 is embedded byte-exactly, without rebuilding a substitute', async () => {
 const video=await readFile(new URL('../assets/videos/luna-dance.mp4',import.meta.url));
 assert.equal(video.length,1548731);
 assert.equal(createHash('sha256').update(video).digest('hex'),'1e7c8fa914af2a1502a71949dba583fcf749d61dc8ba75c9fa0dc004aa04935f');
});


test('user-supplied first filmed dance deploys byte-exactly and third choice remains locked', async () => {
 const video=await readFile(new URL('../assets/videos/luna-dance-01.mp4',import.meta.url));
 assert.equal(video.length,1388796);
 assert.equal(createHash('sha256').update(video).digest('hex'),'9e44db07ceddf7166addc7747b7991f9434ee3d2a26be7878379e6aca54720b0');
 const view=await readFile(new URL('../src/ui/appView.js',import.meta.url),'utf8');
 assert.match(view,/data-dance-routine="1"/);
 assert.match(view,/data-dance-routine="2"/);
 assert.doesNotMatch(view,/data-dance-routine="3"/);
});

test('user-supplied second filmed dance deploys byte-exactly and is independently selectable', async () => {
 const video=await readFile(new URL('../assets/videos/luna-dance-02.mp4',import.meta.url));
 assert.equal(video.length,1375383);
 assert.equal(createHash('sha256').update(video).digest('hex'),'b5208334978e3c292c0c0aa16d097f95a1c6af1f0142c4cd3decfed96b714221');
 const [view,main]=await Promise.all(['src/ui/appView.js','src/main.js'].map(p=>readFile(new URL('../'+p,import.meta.url),'utf8')));
 assert.match(view,/data-dance-routine="2"/);
 assert.match(view,/state\.dance\?\.selectedVideo===2/);
 assert.match(main,/!\[1,2\]\.includes\(danceId\)/);
});


test('Telegram media fallback uses iOS Baseline video and retains original exports',async()=>{
 const [first,second,view,main,css,workflow]=await Promise.all([
  readFile(new URL('../assets/videos/luna-dance-01-mobile.mp4',import.meta.url)),
  readFile(new URL('../assets/videos/luna-dance-02-mobile.mp4',import.meta.url)),
  readFile(new URL('../src/ui/appView.js',import.meta.url),'utf8'),
  readFile(new URL('../src/main.js',import.meta.url),'utf8'),
  readFile(new URL('../src/styles.css',import.meta.url),'utf8'),
  readFile(new URL('../.github/workflows/pages.yml',import.meta.url),'utf8')
 ]);
 assert.equal(first.length,1540941);
 assert.equal(second.length,1494320);
 assert.equal(createHash('sha256').update(first).digest('hex'),'3fac868065f2767943218dc5d6e24c60581b6882ccbc9bd273470b70d2e9e56d');
 assert.equal(createHash('sha256').update(second).digest('hex'),'79e2881fbb88dbe7f0cdd872308de97115b075e98b16eaa5646a72c50a9816c0');
 assert.match(view,/luna-dance-01-mobile\.mp4/);
 assert.match(view,/luna-dance-02-mobile\.mp4/);
 assert.match(main,/const retryOriginal=/);
 assert.match(main,/video\.load\(\)/);
 assert.match(css,/display:block;visibility:hidden;opacity:0/);
 assert.match(workflow,/Verify iPhone-compatible Luna dance 1/);
 assert.match(workflow,/Verify iPhone-compatible Luna dance 2/);
});


test('full body Luna dance is uncropped and compact controls do not cover the kitten', async () => {
 const [css, main] = await Promise.all(['src/styles.css','src/main.js']
  .map(p => readFile(new URL('../'+p,import.meta.url),'utf8')));
 assert.match(css,/object-fit:contain!important/);
 assert.match(css,/\.room-dance\.activity-dance \.dance-routines\s*\{[^}]*top:10px!important/);
 assert.match(css,/\.room-dance\.activity-dance \.dance-status\s*\{\s*display:none!important/);
 assert.match(css,/\.room-dance\.activity-dance \.dance-routines \[data-stop-dance\]\s*\{[^}]*min-height:32px!important/);
 assert.match(main,/video\.addEventListener\('playing'/);
 assert.match(main,/video\.controls=false/);
 assert.match(main,/dance-video-playing/);
});
