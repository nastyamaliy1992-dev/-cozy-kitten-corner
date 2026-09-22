import { loadSave, saveGame } from './persistence.js';

const clamp = value => Math.max(0, Math.min(100, value));

export function createInitialState(name, lang = 'ru') {
  return {
    schemaVersion: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    name,
    room: 'living',
    sleeping: false,
    sleepStartedAt: null,
    lastSeenAt: Date.now(),
    needs: {
      hunger: 78,
      thirst: 82,
      cleanliness: 88,
      mood: 86,
      energy: 80,
      toilet: 84,
      health: 100,
      happiness: 88
    },
    economy: { coins: 250, xp: 0, level: 1 },
    inventory: {
      food: { starterFish: 3, milk: 2 },
      clothes: [],
      furniture: []
    },
    settings: {
      language: lang,
      reduceMotion: false
    }
  };
}

export function restoreState() {
  const saved = loadSave();
  if (!saved) return null;

  const now = Date.now();
  const awayMs = Math.max(0, now - (saved.lastSeenAt || saved.updatedAt || now));
  const awayMinutes = awayMs / 60000;

  const next = structuredClone(saved);
  next.lastSeenAt = now;

  // Gentle real-time decay. No harsh punishment.
  next.needs.hunger = clamp(next.needs.hunger - Math.min(18, awayMinutes * 0.08));
  next.needs.thirst = clamp(next.needs.thirst - Math.min(14, awayMinutes * 0.06));
  next.needs.toilet = clamp(next.needs.toilet - Math.min(14, awayMinutes * 0.05));

  if (next.sleeping) {
    next.needs.energy = clamp(next.needs.energy + Math.min(48, awayMinutes * 0.28));
    if (next.needs.energy >= 96 || awayMinutes >= 240) {
      next.sleeping = false;
      next.sleepStartedAt = null;
    }
  } else {
    next.needs.energy = clamp(next.needs.energy - Math.min(12, awayMinutes * 0.04));
  }

  next.needs.happiness = Math.round(
    (next.needs.hunger + next.needs.cleanliness + next.needs.mood + next.needs.energy + next.needs.health) / 5
  );

  saveGame(next);
  return next;
}

export function tickState(state, seconds = 10) {
  const n = structuredClone(state);
  const factor = seconds / 10;
  n.needs.hunger = clamp(n.needs.hunger - 0.18 * factor);
  n.needs.thirst = clamp(n.needs.thirst - 0.12 * factor);
  n.needs.toilet = clamp(n.needs.toilet - 0.08 * factor);

  if (n.sleeping) n.needs.energy = clamp(n.needs.energy + 0.8 * factor);
  else n.needs.energy = clamp(n.needs.energy - 0.07 * factor);

  n.needs.happiness = Math.round(
    (n.needs.hunger + n.needs.cleanliness + n.needs.mood + n.needs.energy + n.needs.health) / 5
  );
  n.lastSeenAt = Date.now();
  return n;
}

export function petKitten(state) {
  const n = structuredClone(state);
  n.needs.mood = clamp(n.needs.mood + 4);
  n.needs.happiness = clamp(n.needs.happiness + 2);
  return n;
}

export function feedKitten(state, foodId = 'starterFish') {
  const n = structuredClone(state);
  const count = n.inventory.food?.[foodId] || 0;
  if (count <= 0 || n.needs.hunger >= 96) return { state: n, ok: false };

  n.inventory.food[foodId] -= 1;
  n.needs.hunger = clamp(n.needs.hunger + 24);
  n.needs.mood = clamp(n.needs.mood + 3);
  n.economy.xp += 6;
  return { state: n, ok: true };
}

export function setSleeping(state, value) {
  const n = structuredClone(state);
  n.sleeping = value;
  n.sleepStartedAt = value ? Date.now() : null;
  return n;
}