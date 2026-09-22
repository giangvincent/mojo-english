import { describe, it, expect, vi } from 'vitest';
import { createStore } from 'vuex';
import playing from '@/store/playing';

const makeCards = (type, n) =>
  Array.from({ length: n }, (_, i) => ({ id: `${type}${i}`, type, point: 1 }));

vi.mock('@/utils/deckLoader', () => ({
  loadDeck: vi.fn(async () => makeCards('Noun', 40)),
  shuffleDeck: (d) => d
}));

const makeStore = () => createStore({
  modules: { playing: { ...playing, namespaced: false, state: () => JSON.parse(JSON.stringify(playing.state)) } }
});

describe('standard mode dealing (rulebook §5A)', () => {
  it('deals 7 and 3 rounds, max 3 discards', async () => {
    const s = makeStore();
    await s.dispatch('initializeGame', 'standard');
    expect(s.state.playing.hand).toHaveLength(7);
    expect(s.state.playing.maxRounds).toBe(3);
    expect(s.state.playing.maxDiscards).toBe(3);
    expect(s.state.playing.roundHandSize).toBe(7);
    expect(s.state.playing.communityCards).toHaveLength(0);
  });

  it('keeps the same hand while advancing discard rounds', async () => {
    const s = makeStore();
    await s.dispatch('initializeGame', 'standard');
    const ids = s.state.playing.hand.map(card => card.id);
    await s.dispatch('advanceRound');
    expect(s.state.playing.currentRound).toBe(2);
    expect(s.state.playing.hand.map(card => card.id)).toEqual(ids);
    expect(s.state.playing.discardCount).toBe(0);
  });
});

describe('5/4 split mode dealing (rulebook §5B)', () => {
  it('starts 2 hand + 1 pool, 4 rounds, 1 discard cap', async () => {
    const s = makeStore();
    await s.dispatch('initializeGame', '5-4-split');
    expect(s.state.playing.hand).toHaveLength(2);
    expect(s.state.playing.communityCards).toHaveLength(1);
    expect(s.state.playing.maxRounds).toBe(4);
    expect(s.state.playing.maxDiscards).toBe(1);
    expect(s.state.playing.currentRound).toBe(1);
  });

  it('progresses hand 2→3→4→5 and pool 1→2→3→4 over 4 rounds', async () => {
    const s = makeStore();
    await s.dispatch('initializeGame', '5-4-split');
    for (let r = 2; r <= 4; r++) {
      s.dispatch('advanceRound');
      expect(s.state.playing.currentRound).toBe(r);
      expect(s.state.playing.hand).toHaveLength(r + 1);
      expect(s.state.playing.communityCards).toHaveLength(r);
      expect(s.state.playing.maxDiscards).toBe(r >= 4 ? 2 : 1);
    }
  });
});

describe('co-op mode dealing (rulebook §5C)', () => {
  it('deals 3 per player, 1 max discard, single round', async () => {
    const s = makeStore();
    await s.dispatch('initializeGame', 'coop');
    expect(s.state.playing.hand).toHaveLength(3);
    expect(s.state.playing.maxRounds).toBe(1);
    expect(s.state.playing.maxDiscards).toBe(1);
  });

  it('deals 4 cards per player when exactly two players join', async () => {
    const s = makeStore();
    await s.dispatch('initializeGame', { mode: 'coop', playerCount: 2 });
    expect(s.state.playing.hand).toHaveLength(4);
  });

  it('accepts exactly one appended card and records the last successful player', async () => {
    const s = makeStore();
    await s.dispatch('initializeGame', 'coop');
    const first = s.state.playing.hand[0];
    await s.dispatch('submitCoopTurn', { sentence: [first], playerId: 'p1' });
    expect(s.state.playing.coopSentence.map(card => card.id)).toEqual([first.id]);
    expect(s.state.playing.winner).toBe('p1');
    expect(() => s.dispatch('submitCoopTurn', { sentence: [first], playerId: 'p2' }))
      .toThrow(/one card/i);
  });
});

describe('discard cap enforcement', () => {
  it('rejects discard beyond the round cap in split round 1', async () => {
    const s = makeStore();
    await s.dispatch('initializeGame', '5-4-split');
    const card = s.state.playing.hand[0];
    s.dispatch('discardCard', card.id);
    s.dispatch('discardCard', card.id); // second attempt, at cap
    expect(s.state.playing.discardCount).toBe(1);
  });
});
describe('Set 2 deck option (T13)', () => {
  it('initializeGame accepts { mode, set } object payload', async () => {
    const s = makeStore();
    await s.dispatch('initializeGame', { mode: 'standard', set: 2 });
    expect(s.state.playing.gameMode).toBe('standard');
    expect(s.state.playing.hand).toHaveLength(7);
  });
});
