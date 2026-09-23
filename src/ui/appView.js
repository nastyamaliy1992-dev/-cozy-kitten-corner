import { t } from '../data/localization.js';
import { rooms } from '../core/rooms.js';
import { renderRoomDecor } from './scenes.js';
import { getEmotion } from '../core/state.js';
import { renderPet } from './pet.js';
const labels={hunger:'Сытость',thirst:'Жажда',cleanliness:'Чистота',mood:'Настрой',energy:'Энергия',toilet:'Лоток',health:'Здоровье'};
const meter=(k,v)=>`<div class="need-line"><div class="need-label"><span class="need-mark ${k}"></span><span>${labels[k]}</span><strong>${Math.round(v)}</strong></div><div class="meter"><i style="width:${v}%"></i></div></div>`;
export function renderWelcome(lang='ru'){return `<main class="welcome-screen"><div class="brand-mark">CK</div><h1>${t('title',lang)}</h1><p>${t('tagline',lang)}</p><section class="name-card"><label for="pet-name">${t('namePrompt',lang)}</label><input id="pet-name" maxlength="16" autocomplete="off" placeholder="${t('namePlaceholder',lang)}"><button id="start-game" class="primary" disabled>${t('start',lang)}</button></section></main>`;}
function settingsPanel(state){const s=state.settings||{};return `<div class="settings-panel"><div class="panel-head"><b>Настройки</b><button data-action="settings">×</button></div>
<label>Музыка <input data-setting="musicVolume" type="range" min="0" max="1" step=".05" value="${s.musicVolume??.35}"></label>
<label>Звуки <input data-setting="sfxVolume" type="range" min="0" max="1" step=".05" value="${s.sfxVolume??.7}"></label>
<label>Голос Luna <input data-setting="voiceVolume" type="range" min="0" max="1" step=".05" value="${s.voiceVolume??.65}"></label>
<label>Язык <select data-setting="language"><option value="ru" ${s.language==='ru'?'selected':''}>Русский</option><option value="uk" ${s.language==='uk'?'selected':''}>Українська</option><option value="en" ${s.language==='en'?'selected':''}>English</option></select></label>
<label class="toggle">Субтитры <input data-setting="subtitles" type="checkbox" ${s.subtitles!==false?'checked':''}></label>
<label class="toggle">Меньше движения <input data-setting="reduceMotion" type="checkbox" ${s.reduceMotion?'checked':''}></label></div>`}
export function renderGame(state,bubble='',ui={}){
 const lang=state.settings?.language||'ru',room=rooms[state.room]||rooms.living,food=state.inventory.food||{};
 const actions={kitchen:ui.fridgeOpen?`<div class="fridge-panel open"><div class="fridge-head"><b>Холодильник</b><button class="fridge-close" data-action="open-fridge" aria-label="Закрыть">×</button></div><div class="food-choice"><button class="food-card" data-action="feed" data-food="dryFood"><span class="food-emoji">🥣</span><b>Корм</b><small>×${food.dryFood||0}</small></button><button class="food-card" data-action="feed" data-food="wetFood"><span class="food-emoji">🥫</span><b>Влажный</b><small>×${food.wetFood||0}</small></button><button class="food-card" data-action="feed" data-food="fishTreat"><span class="food-emoji">🐟</span><b>Рыбка</b><small>×${food.fishTreat||0}</small></button></div></div>`:''};
 const action=(actions[state.room]||'')+(ui.settingsOpen?settingsPanel(state):'');
 const nav=[['living','🏠','Холл'],['kitchen','🍽️','Кухня'],['bedroom','🌙','Спальня'],['bathroom','🛁','Ванная'],['toilet','🚽','Туалет'],['wardrobe','👗','Гардероб'],['playroom','🧶','Игры'],['lake','🎣','Озеро']];
 return `<main class="game-shell ${room.className} activity-${state.activity?.type||'idle'} ${state.settings?.reduceMotion?'reduce-motion':''}">
 <header class="topbar"><div class="identity"><div class="avatar-mini">L</div><div><b>${state.name}</b><small>Lv. ${state.economy.level} · ${state.economy.xp}/250 XP</small></div></div><div class="currency"><span class="coin-dot"></span><b>${state.economy.coins}</b></div><button class="icon-button sound-button" data-action="sound" aria-label="Музыка">♫</button><button class="icon-button" data-action="settings" aria-label="Настройки">⚙</button></header>
 <section class="mini-needs"><div><b>♥</b><strong>${Math.round(state.needs.happiness)}%</strong><small>Счастье</small></div><div><b>●</b><strong>${Math.round(state.needs.hunger)}%</strong><small>Сытость</small></div><div><b>◆</b><strong>${Math.round(state.needs.thirst)}%</strong><small>Вода</small></div><div><b>☾</b><strong>${Math.round(state.needs.energy)}%</strong><small>Энергия</small></div></section>
 <section class="scene"><aside class="side-nav">${nav.map(([id,ico,label])=>`<button data-room="${id}" class="${state.room===id?'active':''}"><b>${ico}</b><small>${label}</small></button>`).join('')}</aside>${renderRoomDecor(state.room,{...ui,lampOn:state.bedroom?.lampOn!==false})}<button class="pet-button" data-action="pet" aria-label="Погладить Luna">${renderPet({sleeping:state.sleeping,emotion:getEmotion(state),activity:state.activity?.type||'idle',movement:state.movement})}</button>${bubble?`<div class="speech-bubble">${bubble}</div>`:''}${action}</section>
 </main>`;
}