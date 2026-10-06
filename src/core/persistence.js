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
  let n={...data};
  let version=Number(n.schemaVersion||0);
  if(version<1){
    n={...n,schemaVersion:1,settings:n.settings||{language:'ru',reduceMotion:false}};
    version=1;
  }
  if(version<2){
    n={
      ...n,
      schemaVersion:2,
      inventory:{...(n.inventory||{}),equipped:(n.inventory?.equipped&&typeof n.inventory.equipped==='object')?n.inventory.equipped:{}},
      roomDecor:n.roomDecor||{},
      fishing:n.fishing||{collection:[],casts:0},
      progress:n.progress||{streak:0,lastDaily:null,actions:{care:0,play:0,fish:0},claimed:[],achievements:[],drawings:[],levelClaims:[],milestones:[]}
    };
  }
  return n;
}