import { describe, it, expect } from 'vitest';
import { createStore } from 'vuex';
import { createLocalPersist } from '@/store/persist';

function makeStore() {
  return createStore({
    modules: {
      progression: {
        namespaced: true,
        state: { level: 1, xp: 0 },
        mutations: { setLevel: (s, v) => (s.level = v) }
      },
      player: {
        namespaced: true,
        state: { name: 'guest' },
        mutations: { setName: (s, v) => (s.name = v) }
      },
      prefs: {
        namespaced: true,
        state: { language: 'en' },
        mutations: { setLanguage: (s, v) => (s.language = v) }
      },
      playing: {
        namespaced: true,
        state: { hand: [] },
        mutations: { add: (s) => s.hand.push(1) }
      }
    }
  });
}

describe('persist — restore + debounce (T16)', () => {
  it('restores persisted state into store modules', () => {
    const store = makeStore();
    localStorage.setItem('verbapix_local_state_v1', JSON.stringify({
      progression: { level: 5, xp: 100 },
      player: { name: 'Ada' },
      prefs: { language: 'vi' }
    }));
    const { restore } = createLocalPersist(store);
    restore();
    expect(store.state.progression.level).toBe(5);
    expect(store.state.player.name).toBe('Ada');
    expect(store.state.prefs.language).toBe('vi');
  });

  it('no-op when nothing saved', () => {
    const store = makeStore();
    localStorage.removeItem('verbapix_local_state_v1');
    const { restore } = createLocalPersist(store);
    expect(() => restore()).not.toThrow();
    expect(store.state.progression.level).toBe(1);
  });

  it('persists persisted-module mutations (debounced)', async () => {
    const store = makeStore();
    const { persist } = createLocalPersist(store);
    store.commit('progression/setLevel', 9);
    persist();
    // debounce: not written yet
    expect(localStorage.getItem('verbapix_local_state_v1')).toBeNull();
    await new Promise(r => setTimeout(r, 400));
    const saved = JSON.parse(localStorage.getItem('verbapix_local_state_v1'));
    expect(saved.progression.level).toBe(9);
  });

  it('skips non-persisted modules (playing)', async () => {
    const store = makeStore();
    const { persist } = createLocalPersist(store);
    store.commit('playing/add');
    persist();
    await new Promise(r => setTimeout(r, 400));
    const saved = JSON.parse(localStorage.getItem('verbapix_local_state_v1'));
    expect(saved.playing).toBeUndefined();
  });
});

describe('persist — subscribe pattern for non-namespaced modules (T16)', () => {
  it('subscribe fires persist on mutation regardless of namespace', async () => {
    const store = createStore({
      modules: {
        progression: {
          namespaced: false,
          state: { level: 1, xp: 0 },
          mutations: { setLevel: (s, v) => (s.level = v) }
        }
      }
    });
    const { persist } = createLocalPersist(store);
    store.subscribe(() => persist());
    store.commit('setLevel', 5);
    await new Promise(r => setTimeout(r, 400));
    const saved = JSON.parse(localStorage.getItem('verbapix_local_state_v1'));
    expect(saved.progression.level).toBe(5);
  });
});
