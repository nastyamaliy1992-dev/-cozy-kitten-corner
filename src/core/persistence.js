const SAVE_KEY = 'cozy-kitten-corner.save';
const SCHEMA_VERSION = 1;

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return migrate(parsed);
  } catch {
    return null;
  }
}

export function saveGame(state) {
  const payload = {
    ...state,
    schemaVersion: SCHEMA_VERSION,
    updatedAt: Date.now()
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  return payload;
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

function migrate(data) {
  const version = Number(data.schemaVersion || 0);
  if (version === SCHEMA_VERSION) return data;

  // v0 -> v1 migration.
  if (version === 0) {
    return {
      ...data,
      schemaVersion: 1,
      settings: data.settings || { language: 'ru', reduceMotion: false }
    };
  }
  return data;
}