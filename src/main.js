import { renderWelcome, renderGame } from './ui/appView.js';
import { createInitialState, restoreState, tickState, petKitten, feedKitten, setSleeping } from './core/state.js';
import { saveGame } from './core/persistence.js';
import { t } from './data/localization.js';

const app = document.querySelector('#app');
let state = restoreState();
let bubble = '';
let bubbleTimer = null;
let actionLock = false;

function lang() {
  return state?.settings?.language || 'ru';
}

function showBubble(text, ms = 1800) {
  bubble = text;
  clearTimeout(bubbleTimer);
  render();
  bubbleTimer = setTimeout(() => {
    bubble = '';
    render();
  }, ms);
}

function persist() {
  if (!state) return;
  state.lastSeenAt = Date.now();
  saveGame(state);
}

function render() {
  if (!state) {
    app.innerHTML = renderWelcome('ru');
    bindWelcome();
    return;
  }
  app.innerHTML = renderGame(state, bubble);
  bindGame();
}

function bindWelcome() {
  const input = document.querySelector('#pet-name');
  const start = document.querySelector('#start-game');

  input.addEventListener('input', () => {
    start.disabled = !input.value.trim();
  });

  start.addEventListener('click', () => {
    const name = input.value.trim();
    if (!name) return;
    state = createInitialState(name, 'ru');
    persist();
    render();
    setTimeout(() => showBubble('Мяу! ♥'), 250);
  });
}

function bindGame() {
  document.querySelectorAll('[data-room]').forEach(button => {
    button.addEventListener('click', () => {
      if (actionLock) return;
      state.room = button.dataset.room;
      persist();
      render();
    });
  });

  document.querySelector('[data-action="pet"]')?.addEventListener('click', () => {
    if (state.sleeping || actionLock) return;
    state = petKitten(state);
    persist();
    showBubble(t('purr', lang()), 1400);
  });

  document.querySelector('[data-action="feed"]')?.addEventListener('click', () => {
    if (actionLock) return;
    actionLock = true;
    const result = feedKitten(state, 'starterFish');
    state = result.state;
    persist();
    showBubble(result.ok ? t('yum', lang()) : t('alreadyFull', lang()), 1600);
    setTimeout(() => { actionLock = false; }, 550);
  });

  document.querySelector('[data-action="sleep"]')?.addEventListener('click', () => {
    if (actionLock) return;
    state = setSleeping(state, !state.sleeping);
    persist();
    showBubble(state.sleeping ? t('goodNight', lang()) : 'Доброе утро!', 1600);
  });
}

setInterval(() => {
  if (!state) return;
  state = tickState(state, 10);
  persist();
  render();
}, 10000);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) persist();
});

window.addEventListener('pagehide', persist);
render();
