import test from 'node:test';
import assert from 'node:assert/strict';
import { saveGame, loadSave, clearSave } from '../src/core/persistence.js';

const storage = new Map();
globalThis.localStorage = {
  getItem(key){ return storage.has(key) ? storage.get(key) : null; },
  setItem(key,value){ storage.set(key,String(value)); },
  removeItem(key){ storage.delete(key); }
};

test('saved progress, settings, play scores and economy survive reload', () => {
  storage.clear();
  const before = {
    schemaVersion:2, name:'Луна', room:'playroom',
    economy:{level:7,xp:132,coins:487},
    needs:{hunger:64,thirst:81,energy:92},
    inventory:{owned:['rod_bamboo','toy_ball'],equipped:{}},
    settings:{language:'ru',musicEnabled:false,voiceEnabled:false},
    dance:{moves:11,completed:2},
    playStats:{ball:5,yarn:3},
    fishing:{casts:15,collection:[{id:'perch'}]},
    progress:{streak:3,claimed:['daily']}
  };
  const saved=saveGame(before);
  assert.ok(saved);
  const after=loadSave();
  assert.equal(after.name,'Луна');
  assert.equal(after.economy.level,7);
  assert.equal(after.economy.coins,487);
  assert.equal(after.playStats.ball,5);
  assert.equal(after.playStats.yarn,3);
  assert.equal(after.settings.musicEnabled,false);
  assert.equal(after.settings.voiceEnabled,false);
  assert.equal(after.dance.completed,2);
  assert.equal(after.fishing.collection[0].id,'perch');
  assert.deepEqual(after.inventory.owned,before.inventory.owned);
  clearSave();
  assert.equal(loadSave(),null);
});

test('broken save does not crash startup',()=>{
  storage.set('cozy-kitten-corner.save','{invalid json');
  assert.equal(loadSave(),null);
  storage.clear();
});
