import { t } from '../data/localization.js';
import { rooms } from '../core/rooms.js';
import { renderPet } from './pet.js';
import { renderRoomDecor } from './scenes.js';

function meter(label, icon, value) {
  return `
    <div class="need-card" title="${label}">
      <div class="need-top"><span>${icon}</span><strong>${Math.round(value)}</strong></div>
      <div class="meter"><i style="width:${value}%"></i></div>
    </div>
  `;
}

export function renderWelcome(lang = 'ru') {
  return `
    <main class="welcome-screen">
      <div class="welcome-paw">🐾</div>
      <h1>${t('title', lang)}</h1>
      <p>${t('tagline', lang)}</p>
      <section class="name-card">
        <label for="pet-name">${t('namePrompt', lang)}</label>
        <input id="pet-name" maxlength="16" autocomplete="off" placeholder="${t('namePlaceholder', lang)}" />
        <button id="start-game" class="primary" disabled>${t('start', lang)}</button>
      </section>
    </main>
  `;
}

export function renderGame(state, bubble = '') {
  const lang = state.settings?.language || 'ru';
  const room = rooms[state.room] || rooms.living;
  const foodLeft = state.inventory.food?.starterFish || 0;

  const action = state.room === 'kitchen'
    ? `<button class="action-button" data-action="feed">🐟 ${t('feed', lang)} <small>×${foodLeft}</small></button>`
    : state.room === 'bedroom'
      ? `<button class="action-button" data-action="sleep">${state.sleeping ? '☀️ ' + t('wake', lang) : '🌙 ' + t('sleep', lang)}</button>`
      : `<div class="pet-hint">✨ ${t('petHint', lang)}</div>`;

  return `
    <main class="game-shell ${room.className}">
      <header class="topbar">
        <div class="level-pill"><b>Lv. ${state.economy.level}</b><span>✦ ${state.economy.coins}</span></div>
        <h2>${t(room.labelKey, lang)}</h2>
        <button class="icon-button" data-action="settings" aria-label="Settings">⚙️</button>
      </header>

      <section class="needs-row">
        ${meter(t('hunger', lang), '🍽️', state.needs.hunger)}
        ${meter(t('energy', lang), '⚡', state.needs.energy)}
        ${meter(t('mood', lang), '💜', state.needs.mood)}
      </section>

      <section class="scene">
        ${renderRoomDecor(state.room)}
        <div class="scene-light"></div>
        <button class="pet-button" data-action="pet" aria-label="Pet kitten">
          ${renderPet({ sleeping: state.sleeping, mood: state.needs.mood })}
        </button>
        ${bubble ? `<div class="speech-bubble">${bubble}</div>` : ''}
        <div class="pet-name">${state.name}</div>
        ${action}
      </section>

      <nav class="bottom-nav">
        <button data-room="living" class="${state.room === 'living' ? 'active' : ''}"><span>⌂</span><small>${t('home', lang)}</small></button>
        <button data-room="kitchen" class="${state.room === 'kitchen' ? 'active' : ''}"><span>🍽</span><small>${t('kitchen', lang)}</small></button>
        <button data-room="bedroom" class="${state.room === 'bedroom' ? 'active' : ''}"><span>☾</span><small>${t('bedroom', lang)}</small></button>
      </nav>
    </main>
  `;
}