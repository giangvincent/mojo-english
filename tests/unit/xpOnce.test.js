import { describe, it, expect } from 'vitest';
import { createStore } from 'vuex';

// Minimal replica of the progression module wiring to prove XP is awarded once
// via awardFromContext (the only XP path the game view dispatches).
import progression from '@/store/progression';
import { calculateXpFromContext } from '@/utils/xp';

const makeStore = () => createStore({
  modules: { progression: { ...progression, namespaced: false, state: () => JSON.parse(JSON.stringify(progression.state)) } }
});

describe('XP awarded exactly once (T8)', () => {
  it('awardFromContext applies XP once for a given context', () => {
    const store = makeStore();
    const context = {
      correctSentence: true,
      score: 20,
      cardsUsed: [{ type: 'Noun' }, { type: 'Verb' }],
      sentenceText: 'the giant crawls',
      multiplier: 1
    };
    const before = store.state.progression.xp;
    store.dispatch('awardFromContext', context);
    const afterOne = store.state.progression.xp;
    expect(afterOne).toBeGreaterThan(before);
    expect(afterOne - before).toBe(calculateXpFromContext(context));
  });

  it('dispatching gainXp twice adds twice — game view must call awardFromContext only', () => {
    const store = makeStore();
    store.dispatch('gainXp', 10);
    store.dispatch('gainXp', 10);
    expect(store.state.progression.xp).toBe(20);
  });
});
