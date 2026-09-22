import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { calculateScore } from '@/utils/scoringEngine';
import type { VerbaCard } from '@/types/verba';

const SET1 = path.resolve(__dirname, '../../public/contents/cards_set_1');
const load = (f: string) => JSON.parse(fs.readFileSync(path.join(SET1, f), 'utf8'));
const nouns = load('Noun.json');
const verbs = load('Verb.json');
const adjs = load('Adjective.json');
const byId = (cards: VerbaCard[], id: string) => cards.find(c => c.id === id)!;

describe('scoringEngine — card points', () => {
  it('uses runtime-selected point when attached', () => {
    const noun = { ...byId(nouns, 'N1a'), selectedPoint: 6 }; // singular face point
    const verb = { ...byId(verbs, 'V1a'), selectedPoint: 4 };
    const { totalPoints, breakdown } = calculateScore([noun, verb]);
    expect(breakdown.cardPoints).toBe(10);
    expect(totalPoints).toBe(10);
  });
  it('falls back to card.point for simple cards', () => {
    const prep = { id: 'P1a', type: 'Prep', point: 7 };
    const { breakdown } = calculateScore([prep as any]);
    expect(breakdown.cardPoints).toBe(7);
  });
});

describe('scoringEngine — bonus combinations', () => {
  it('awards bonus when sentence matches another card\'s bonus condition', () => {
    // A1a bonus: Noun with words ["werewolf","giant"] → +5. N1a is "the giant".
    const adj = { ...byId(adjs, 'A1a'), selectedPoint: 5, selectedText: 'hairy' };
    const noun = { ...byId(nouns, 'N1a'), selectedPoint: 6, selectedText: 'the giant' };
    const { breakdown, totalPoints } = calculateScore([adj, noun]);
    expect(breakdown.bonusPoints).toBe(5);
    expect(totalPoints).toBe(16); // 11 base + 5 bonus
  });
  it('no bonus when word does not match', () => {
    const adj = { ...byId(adjs, 'A1a'), selectedPoint: 5, selectedText: 'hairy' };
    const noun = { ...byId(nouns, 'N1b'), selectedPoint: 6, selectedText: 'the hero' };
    const { breakdown } = calculateScore([adj, noun]);
    expect(breakdown.bonusPoints).toBe(0);
  });
});

describe('scoringEngine — full hand bonus (rulebook §4)', () => {
  it('grants +5 only for exactly 7-card sentence from a 7-card hand', () => {
    const cards = Array.from({ length: 7 }, (_, i) => ({ id: `x${i}`, type: 'Noun', point: 1 }));
    const { breakdown } = calculateScore(cards, 7);
    expect(breakdown.handBonus).toBe(5);
  });
  it('no bonus for 7-card sentence from 9-card 5/4 pool', () => {
    const cards = Array.from({ length: 7 }, (_, i) => ({ id: `x${i}`, type: 'Noun', point: 1 }));
    const { breakdown } = calculateScore(cards, 9);
    expect(breakdown.handBonus).toBe(0);
  });
  it('no bonus for 6-card sentence', () => {
    const cards = Array.from({ length: 6 }, (_, i) => ({ id: `x${i}`, type: 'Noun', point: 1 }));
    const { breakdown } = calculateScore(cards, 7);
    expect(breakdown.handBonus).toBe(0);
  });
});

describe('scoringEngine — breakdown is explainable', () => {
  it('total equals sum of breakdown parts', () => {
    const cards = Array.from({ length: 3 }, (_, i) => ({ id: `x${i}`, type: 'Noun', point: 2 }));
    const { totalPoints, breakdown } = calculateScore(cards, 7);
    expect(totalPoints).toBe(breakdown.cardPoints + breakdown.bonusPoints + breakdown.handBonus);
  });
});
