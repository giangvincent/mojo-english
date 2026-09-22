import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  validateSentence, validateConnection, chainAllows, numberAgrees,
  tenseAgrees, firstCardAllowed, adjectiveFitsNoun
} from '@/utils/grammarEngine';
import type { VerbaCard } from '@/types/verba';

const SET1 = path.resolve(__dirname, '../../public/contents/cards_set_1');
const load = (f: string) => JSON.parse(fs.readFileSync(path.join(SET1, f), 'utf8'));

const byId = (cards: VerbaCard[], id: string) => cards.find(c => c.id === id)!;

const nouns = load('Noun.json');
const verbs = load('Verb.json');
const adjs = load('Adjective.json');
const preps = load('Preposition.json');
const times = load('Time.json');
const wilds = load('WildCard.json');

describe('grammarEngine — chain (colours)', () => {
  it('allows Noun → Verb per nextCards', () => {
    expect(chainAllows(byId(nouns, 'N1a'), byId(verbs, 'V1a'))).toBe(true);
  });
  it('rejects Verb → Noun directly (needs Prep)', () => {
    expect(chainAllows(byId(verbs, 'V1a'), byId(nouns, 'N1a'))).toBe(false);
  });
  it('allows Verb → Prep', () => {
    expect(chainAllows(byId(verbs, 'V1a'), byId(preps, 'P1a'))).toBe(true);
  });
  it('wildcard chains anywhere', () => {
    expect(chainAllows(byId(wilds, 'W1a'), byId(nouns, 'N1a'))).toBe(true);
    expect(chainAllows(byId(verbs, 'V1a'), byId(wilds, 'W1a'))).toBe(true);
  });
});

describe('grammarEngine — adjective categories (icons)', () => {
  it('person/animal adjective fits person noun', () => {
    const adj = byId(adjs, 'A1a'); // person, animal
    expect(adjectiveFitsNoun(adj, byId(nouns, 'N1b'))).toBe(true); // person
  });
  it('animal-only adjective rejects person-only noun', () => {
    const animalAdj = { ...byId(adjs, 'A1e'), condition: [{ type: 'Noun', categories: ['animal'] }] };
    expect(adjectiveFitsNoun(animalAdj, byId(nouns, 'N1b'))).toBe(false); // N1b person only
  });
});

describe('grammarEngine — number agreement (smileys)', () => {
  it('singular noun face matches singular verb form', () => {
    const noun = { ...byId(nouns, 'N1a'), selectedNumber: 'singular' };
    const verb = byId(verbs, 'V1a'); // has "crawls" singular
    expect(numberAgrees(noun, verb)).toBe(true);
  });
  it('mismatch: plural noun face still fine when verb offers plural forms', () => {
    const noun = { ...byId(nouns, 'N1a'), selectedNumber: 'plural' };
    const verb = { ...byId(verbs, 'V1a'), selectedConditions: ['plural', 'repeat'] };
    expect(numberAgrees(noun, verb)).toBe(true); // "crawl" plural
  });
  it('rejects a noun that disagrees with the selected verb face', () => {
    const noun = { ...byId(nouns, 'N1a'), selectedNumber: 'plural' };
    const verb = { ...byId(verbs, 'V1a'), selectedConditions: ['singular'] };
    expect(numberAgrees(noun, verb)).toBe(false);
  });
});

describe('grammarEngine — tense squares', () => {
  it('matching tenses agree', () => {
    const time = { ...byId(times, 'T1a'), selectedTense: 'past simple' };
    const verb = { ...byId(verbs, 'V1a'), selectedTense: 'past simple' };
    expect(tenseAgrees(time, verb)).toBe(true);
  });
  it('mismatched tenses fail', () => {
    const time = { ...byId(times, 'T1a'), selectedTense: 'past simple' };
    const verb = { ...byId(verbs, 'V1a'), selectedTense: 'present simple' };
    // V1a has both present and past entries; tenseAgrees compares selected only
    expect(tenseAgrees(time, verb)).toBe(false);
  });
});

describe('grammarEngine — first card by mode', () => {
  it('co-op requires Noun first', () => {
    expect(firstCardAllowed(byId(nouns, 'N1a'), 'coop')).toBe(true);
    expect(firstCardAllowed(byId(verbs, 'V1a'), 'coop')).toBe(false);
    expect(firstCardAllowed(byId(times, 'T1a'), 'coop')).toBe(false);
  });
  it('standard allows Noun, Time, Location first', () => {
    expect(firstCardAllowed(byId(nouns, 'N1a'), 'standard')).toBe(true);
    expect(firstCardAllowed(byId(times, 'T1a'), 'standard')).toBe(true);
    expect(firstCardAllowed(byId(preps, 'P1a'), 'standard')).toBe(false);
  });
});

describe('grammarEngine — full sentence', () => {
  it('accepts a valid Noun→Verb sentence with selections', () => {
    const noun = { ...byId(nouns, 'N1a'), selectedNumber: 'singular', selectedText: 'the giant' };
    const verb = { ...byId(verbs, 'V1a'), selectedTense: 'present simple' };
    const result = validateSentence([noun, verb], 'standard');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
  it('rejects broken chain with per-card errors', () => {
    const result = validateSentence([byId(verbs, 'V1a'), byId(nouns, 'N1a')], 'standard');
    expect(result.valid).toBe(false);
    expect(result.errors[1]).toContain('invalid-chain:Verb->Noun');
  });
  it('rejects non-noun first card in co-op', () => {
    const result = validateSentence([byId(verbs, 'V1a'), byId(preps, 'P1a')], 'coop');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('first-card-not-noun');
  });
  it('rejects empty sentence', () => {
    expect(validateSentence([], 'standard').valid).toBe(false);
  });
  it('requires face selections only for final submission', () => {
    const sentence = [byId(nouns, 'N1a'), byId(verbs, 'V1a')];
    expect(validateSentence(sentence, 'standard').valid).toBe(true);
    expect(validateSentence(sentence, 'standard', { requireSelections: true }).valid).toBe(false);
  });
  it('checks tense when a Time card appears after the Verb', () => {
    const noun = { ...byId(nouns, 'N1a'), selectedNumber: 'singular' };
    const verb = { ...byId(verbs, 'V1a'), selectedTense: 'present simple', selectedConditions: ['singular'] };
    const time = { ...byId(times, 'T1a'), selectedTense: 'past simple' };
    expect(validateSentence([noun, verb, time], 'standard', { requireSelections: true }).valid).toBe(false);
  });
  it('wildcard bridges an otherwise invalid chain', () => {
    // N→V ok; V→Prep only via data, but V→wild→Prep must also hold (wild = any type)
    const result = validateSentence([byId(nouns, 'N1a'), byId(verbs, 'V1a'), byId(wilds, 'W1a'), byId(preps, 'P1a')], 'standard');
    expect(result.valid).toBe(true);
  });
});

describe('grammarEngine — raw card data is coherent', () => {
  it('every chain-referenced type matches a real card file type', () => {
    const realTypes = new Set(['Noun', 'Verb', 'Adj', 'Adverb', 'Conj', 'Prep', 'HelpingVerb', 'ExtraInformation', 'TimeCard', 'Location', 'wild_card']);
    for (const file of ['Noun.json', 'Verb.json', 'Adjective.json', 'Preposition.json', 'Time.json', 'WildCard.json']) {
      for (const card of load(file)) {
        for (const t of [...(card.nextCards ?? []), ...(card.previousCards ?? [])]) {
          if (!realTypes.has(t)) throw new Error(`${file}: unknown referenced type "${t}"`);
        }
      }
    }
  });
});
