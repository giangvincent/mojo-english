/**
 * Local-first persistence (T16). Pure stdlib — no new dependency.
 *
 * Scope (per spec): progression, preferences, and the vault queue are
 * persisted locally. Auth tokens, live multiplayer state, and server-backed
 * data are NOT persisted here (they live in auth/vault services).
 *
 * Subscribe to store mutations, debounce, and restore on init.
 */
const STORAGE_KEY = 'verbapix_local_state_v1';
const PERSIST_KEYS = ['progression', 'player', 'prefs'];
const DEBOUNCE_MS = 300;

function safeRead(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function createLocalPersist(store) {
  let timer = null;

  const persist = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const snapshot = {};
      for (const k of PERSIST_KEYS) {
        if (store.state[k]) snapshot[k] = store.state[k];
      }
      safeWrite(STORAGE_KEY, snapshot);
    }, DEBOUNCE_MS);
  };

  const restore = () => {
    const saved = safeRead(STORAGE_KEY);
    if (!saved) return;
    for (const k of PERSIST_KEYS) {
      if (saved[k] && store.state[k]) {
        // Merge rather than wholesale replace so module defaults survive
        store.state[k] = { ...store.state[k], ...saved[k] };
      }
    }
  };

  return { persist, restore };
}

