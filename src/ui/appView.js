import { t } from '../data/localization.js';
import { rooms } from '../core/rooms.js';
import { renderPet } from './pet.js';
import { renderRoomDecor } from './scenes.js';

const needLabels={hunger:'Сытость',thirst:'Жажда',cleanliness:'Чистота',mood:'Настрой',energy:'Энергия',toilet:'Лоток',health:'Здоровье'};
function meter(key,value){return `<div class="need-line"><div class="need-label"><span class="need-mark ${key}"></span><span>${needLabels[key]}</span><strong>${Math.round(value)}</strong></div><div class="meter"><i style="width:${value}%"></i></div></div>`;}

export function renderWelcome(lang='ru'){return `<main class="welcome-screen"><div class="brand-mark">CK</div><h1>${t('title',lang)}</h1><p>${t('tagline',lang)}</p><section class="name-card"><label for="pet-name">${t('namePrompt',lang)}</label><input id="pet-name" maxlength="16" autocomplete="off" placeholder="${t('namePlaceholder',lang)}" /><button id="start-game" class="primary" disabled>${t('start',lang)}</button></section></main>`;}

export function renderGame(state,bubble=''){
 const lang=state.settings?.language||'ru',room=rooms[state.room]||rooms.living,foodLeft=state.inventory.food?.starterFish||0;
 const action=state.room==='kitchen'?`<button class="action-button" data-action="feed">${t('feed',lang)} <small>×${foodLeft}</small></button>`:state.room==='bedroom'?`<button class="action-button" data-action="sleep">${state.sleeping?t('wake',lang):t('sleep',lang)}</button>`:`<div class="pet-hint">${t('petHint',lang)}</div>`;
 return `<main class="game-shell ${room.className}">
 <header class="topbar"><div class="identity"><div class="avatar-mini">L</div><div><b>${state.name}</b><small>Lv. ${state.economy.level} · ${state.economy.xp}/250 XP</small></div></div><div class="currency"><span class="coin-dot"></span><b>${state.economy.coins}</b></div><button class="icon-button" data-action="settings" aria-label="Settings">⋯</button></header>
 <section class="status-panel"><div class="happiness-head"><span>СЧАСТЬЕ</span><strong>${Math.round(state.needs.happiness)}%</strong></div><div class="happiness-meter"><i style="width:${state.needs.happiness}%"></i></div><div class="needs-grid">${meter('hunger',state.needs.hunger)}${meter('thirst',state.needs.thirst)}${meter('cleanliness',state.needs.cleanliness)}${meter('mood',state.needs.mood)}${meter('energy',state.needs.energy)}${meter('toilet',state.needs.toilet)}${meter('health',state.needs.health)}</div></section>
 <section class="scene"><div class="room-title">${t(room.labelKey,lang)}</div>${renderRoomDecor(state.room)}<div class="scene-light"></div><button class="pet-button" data-action="pet" aria-label="Pet kitten">${renderPet({sleeping:state.sleeping,mood:state.needs.mood})}</button>${bubble?`<div class="speech-bubble">${bubble}</div>`:''}<div class="pet-name">${state.name}</div>${action}</section>
 <nav class="bottom-nav"><button data-room="living" class="${state.room==='living'?'active':''}"><span class="nav-glyph home-glyph"></span><small>${t('home',lang)}</small></button><button data-room="kitchen" class="${state.room==='kitchen'?'active':''}"><span class="nav-glyph food-glyph"></span><small>${t('kitchen',lang)}</small></button><button data-room="bedroom" class="${state.room==='bedroom'?'active':''}"><span class="nav-glyph sleep-glyph"></span><small>${t('bedroom',lang)}</small></button></nav>
 </main>`;
}