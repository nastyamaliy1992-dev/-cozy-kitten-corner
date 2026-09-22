import { renderWelcome,renderGame } from './ui/appView.js';
import { createInitialState,restoreState,tickState,petKitten,feedKitten,setSleeping,drink,bathe,useToilet,play } from './core/state.js';
import { saveGame } from './core/persistence.js';import { t } from './data/localization.js';
import { startRoomMusic,stopMusic,sfx,speak } from './core/audio.js';
const app=document.querySelector('#app');let state=restoreState(),bubble='',bubbleTimer=null,actionLock=false,soundOn=false;
const lang=()=>state?.settings?.language||'ru';
function showBubble(text,ms=1500){bubble=text;clearTimeout(bubbleTimer);render();bubbleTimer=setTimeout(()=>{bubble='';render()},ms)}
function persist(){if(!state)return;state.lastSeenAt=Date.now();saveGame(state)}
function render(){if(!state){app.innerHTML=renderWelcome('ru');bindWelcome();return}app.innerHTML=renderGame(state,bubble);bindGame()}
function bindWelcome(){const input=document.querySelector('#pet-name'),start=document.querySelector('#start-game');input.addEventListener('input',()=>start.disabled=!input.value.trim());start.addEventListener('click',()=>{const name=input.value.trim();if(!name)return;state=createInitialState(name,'ru');persist();render();setTimeout(()=>showBubble('Мяу! ♥'),250)})}
function doAction(fn,msg,kind='pet'){if(actionLock)return;actionLock=true;state=fn(state);persist();sfx(kind);if(kind==='pet'||kind==='play')speak(msg);showBubble(msg);setTimeout(()=>actionLock=false,500)}
function bindGame(){document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>{if(actionLock)return;state.room=b.dataset.room;persist();render();if(soundOn)startRoomMusic(state.room)}));
document.querySelector('[data-action="pet"]')?.addEventListener('click',()=>{if(!state.sleeping)doAction(petKitten,t('purr',lang()))});
document.querySelector('[data-action="feed"]')?.addEventListener('click',()=>{if(actionLock)return;actionLock=true;const r=feedKitten(state);state=r.state;persist();showBubble(r.ok?t('yum',lang()):t('alreadyFull',lang()));setTimeout(()=>actionLock=false,500)});
document.querySelector('[data-action="drink"]')?.addEventListener('click',()=>doAction(drink,'Водичка!','drink'));
document.querySelector('[data-action="bathe"]')?.addEventListener('click',()=>doAction(bathe,'Чисто и пушисто!','bath'));
document.querySelector('[data-action="toilet"]')?.addEventListener('click',()=>doAction(useToilet,'Готово!','toilet'));
document.querySelector('[data-action="play"]')?.addEventListener('click',()=>doAction(play,'Ещё!','play'));
document.querySelector('[data-action="sound"]')?.addEventListener('click',()=>{soundOn=!soundOn;if(soundOn){startRoomMusic(state.room);showBubble('Музыка включена')}else{stopMusic();showBubble('Музыка выключена')}});
document.querySelector('[data-action="sleep"]')?.addEventListener('click',()=>{if(actionLock)return;state=setSleeping(state,!state.sleeping);persist();showBubble(state.sleeping?t('goodNight',lang()):'Доброе утро!')})}
setInterval(()=>{if(state){state=tickState(state,10);persist();render()}},10000);document.addEventListener('visibilitychange',()=>{if(document.hidden)persist()});window.addEventListener('pagehide',persist);render();