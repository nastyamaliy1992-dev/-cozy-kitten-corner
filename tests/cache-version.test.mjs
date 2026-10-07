import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const version = 'v=20261007-life1';

test('entry point and changed animation modules use the same cache version', async () => {
  const [index,main,appView,pet] = await Promise.all([
    readFile(new URL('../index.html',import.meta.url),'utf8'),
    readFile(new URL('../src/main.js',import.meta.url),'utf8'),
    readFile(new URL('../src/ui/appView.js',import.meta.url),'utf8'),
    readFile(new URL('../src/ui/pet.js',import.meta.url),'utf8')
  ]);
  assert.match(index,new RegExp(`main\\.js\\?${version}`));
  assert.match(index,/styles\.css\?v=20261007-life1/);
  assert.match(main,new RegExp(`appView\\.js\\?${version}`));
  assert.match(main,new RegExp(`state\\.js\\?${version}`));
  assert.match(main,new RegExp(`lunaAsset\\.js\\?${version}`));
  assert.match(main,new RegExp(`shop\\.js\\?${version}`));
  assert.match(appView,new RegExp(`pet\\.js\\?${version}`));
  assert.match(appView,new RegExp(`shop\\.js\\?${version}`));
  assert.match(pet,new RegExp(`lunaAsset\\.js\\?${version}`));
});
