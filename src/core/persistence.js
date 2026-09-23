const SAVE_KEY = 'cozy-kitten-corner.save';
const SCHEMA_VERSION = 2;

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
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.warn('Save unavailable', error);
    return null;
  }
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

function migrate(data) {
  const version = Number(data.schemaVersion || 0);
  if (version === SCHEMA_VERSION) return data;
  if (version === 1) {
    return {
      ...data,
      schemaVersion: 2,
      inventory: {...(data.inventory||{}), equipped:(data.inventory?.equipped && typeof data.inventory.equipped==='object')?data.inventory.equipped:{}},
      roomDecor: data.roomDecor || {},
      fishing: data.fishing || {collection:[],casts:0},
      progress: data.progress || {streak:0,lastDaily:null,actions:{care:0,play:0,fish:0},claimed:[],achievements:[],drawings:[],levelClaims:[],milestones:[]}
    };
  }

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