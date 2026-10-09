import test from 'node:test';
import assert from 'node:assert/strict';
import {createInitialState,rewardPetting} from '../src/core/state.js';
import {LESSONS, startLesson, answerLesson, unlockLesson, lessonUnlocked} from '../src/core/school.js';
import {buyItem,equipItem,catalog} from '../src/core/shop.js';
import {renderGame} from '../src/ui/appView.js';

test('school displays 3 real lessons and mathematics is open at level 1',()=>{
 const s=createInitialState('Луна');
 assert.equal(LESSONS.length,3);
 assert.equal(lessonUnlocked(s,'math'),true);
 assert.equal(lessonUnlocked(s,'reading'),false);
 s.room='school';
 const h=renderGame(s);
 assert.match(h,/data-school-open="math"/);
 assert.match(h,/data-school-buy="reading"/);
 assert.match(h,/data-school-buy="logic"/);
 assert.match(h,/data-room="school"/);
});
test('3 solved math problems earn bonus and record completion',()=>{
 let s=createInitialState('Луна');
 let r=startLesson(s,'math');assert.equal(r.ok,true);s=r.state;
 for(const a of [1,2,1]){r=answerLesson(s,a);assert.equal(r.correct,true);s=r.state;}
 assert.equal(r.finished,true);
 assert.equal(s.school.completed.math,1);
 assert.ok(r.coins>=30);assert.ok(r.xp>=20);
 assert.equal(s.school.active,null);
});
test('incorrect answer does not advance to next question',()=>{
 let s=startLesson(createInitialState('Луна'),'math').state;
 let r=answerLesson(s,0);assert.equal(r.correct,false);
 assert.equal(r.state.school.active.index,0);assert.equal(r.state.school.active.mistakes,1);
});
test('locked lessons can be bought with game coins',()=>{
 let s=createInitialState('Луна');
 s.economy.coins=400;
 const r=unlockLesson(s,'reading');
 assert.equal(r.ok,true);assert.equal(r.state.economy.coins,240);
 assert.equal(lessonUnlocked(r.state,'reading'),true);
 assert.equal(startLesson(r.state,'reading').ok,true);
});
test('shop purchase enters wardrobe and equip requires separate action',()=>{
 let s=createInitialState('Луна');
 s.economy.coins=10000;s.economy.level=10;
 const item=catalog.find(x=>x.category==='outfits'&&x.currency==='coins');
 assert.ok(item);
 const r=buyItem(s,item.id);assert.equal(r.ok,true);
 assert.ok(r.state.inventory.clothes.includes(item.id));
 assert.equal(r.state.inventory.equipped.body,undefined);
 const dressed=equipItem(r.state,item.id);
 assert.equal(dressed.inventory.equipped.body,item.id);
});
test('petting visibly replenishes energy and remains capped at 100',()=>{
 const s=createInitialState('Луна');s.needs.energy=40;s.petting={lastXpAt:0};
 const r=rewardPetting(s);assert.ok(r.state.needs.energy>40);assert.ok(r.state.needs.happiness>0);
});
test('playroom shows three-catch touch target for active challenge',()=>{
 const s=createInitialState('Луна');s.room='playroom';
 s.playChallenge={kind:'yarn',hits:1,target:2,startedAt:Date.now()};
 const h=renderGame(s);
 assert.match(h,/data-play-catch/);assert.match(h,/Поймай игрушку: 1\/3/);
 assert.match(h,/assets\/toys\/yarn.svg/);
});
