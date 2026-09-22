#!/usr/bin/env node
/**
 * Content audit (plan T4).
 * - Schema: every card has id, type; word cards have content or singular/plural.
 * - IDs unique within a set.
 * - Image refs resolve to files in public/assets/cards/set{1,2}/ (or relative jpg lookups).
 * - Deck reconciliation per Q4: deck = 10 type files + WildCard.json; Time-full.json excluded.
 * - Card-count check vs the 60-cards-per-set requirement (reports actuals; count approval is owner's).
 *
 * Exit 1 on schema/ID/image failures. Count discrepancies are warnings.
 * Run: node scripts/audit-content.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONTENTS = path.join(ROOT, 'public', 'contents');
const ASSETS = path.join(ROOT, 'public', 'assets', 'cards');

const DECK_FILES = [
  'Noun.json', 'Verb.json', 'Adjective.json', 'Adverb.json', 'Conjuntion.json',
  'ExtraInformation.json', 'HelpingVerb.json', 'Location.json', 'Preposition.json',
  'Time.json', 'WildCard.json'
];
const EXCLUDED = ['Time-full.json'];

let errors = [];
let warnings = [];

function loadCards(file) {
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(raw) ? raw : raw.cards || [];
}

function wordCardHasText(card) {
  if (card.content !== undefined || card.singular || card.plural) return true;
  return false;
}

for (const setNum of [1, 2]) {
  const dir = path.join(CONTENTS, `cards_set_${setNum}`);
  const assetDirs = [path.join(ASSETS, `set${setNum}`), path.join(ROOT, 'public', 'assets', 'images')];
  const assetFiles = new Set();
  for (const d of assetDirs) {
    if (fs.existsSync(d)) fs.readdirSync(d).forEach(f => assetFiles.add(f));
  }

  const seenIds = new Map();
  let deckCount = 0;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  for (const f of files) {
    const file = path.join(dir, f);
    let cards;
    try {
      cards = loadCards(file);
    } catch (e) {
      errors.push(`set${setNum}/${f}: unparseable JSON (${e.message})`);
      continue;
    }

    const inDeck = DECK_FILES.includes(f);
    if (inDeck) deckCount += cards.length;

    cards.forEach((card, i) => {
      const label = `set${setNum}/${f}#${i + 1}`;

      if (!card.id) errors.push(`${label}: missing id`);
      else if (inDeck && seenIds.has(card.id)) errors.push(`${label}: duplicate id "${card.id}" (first in ${seenIds.get(card.id)})`);
      else if (inDeck) seenIds.set(card.id, f);

      if (!card.type) errors.push(`${label}: missing type`);

      if (f !== 'WildCard.json' && f !== 'Preposition.json' && !wordCardHasText(card)) {
        errors.push(`${label}: no content/singular/plural`);
      }

      if (card.image) {
        const names = Array.isArray(card.image) ? card.image : [card.image];
        for (const name of names.map(String)) {
          const base = path.basename(name);
          if (!assetFiles.has(name) && !assetFiles.has(base)) {
            errors.push(`${label}: image "${name}" not found in assets`);
          }
        }
      }
    });
  }

  if (EXCLUDED.some(f => files.includes(f))) {
    // informational only; exclusion is intentional per Q4
  }

  const runtimeCount = deckCount;
  const requirement = setNum === 1 ? 73 : 60; // approved by owner 2026-09-12
  if (runtimeCount !== requirement) {
    warnings.push(`set${setNum}: deck file count = ${runtimeCount}, required = ${requirement} (owner must approve actual)`);
  }

  console.log(`Set ${setNum}: deck files = ${DECK_FILES.length}, runtime cards = ${runtimeCount}, total JSON files = ${files.length}, assets = ${assetFiles.size}`);
}

// Runtime loader parity: deckLoader must load the Q4 deck list (incl. WildCard, excl. Time-full)
// Both sets reference the same file names, so a single whole-file check suffices.
const loaderSrc = fs.readFileSync(path.join(ROOT, 'src', 'utils', 'deckLoader.ts'), 'utf8');
for (const f of DECK_FILES) {
  if (!loaderSrc.includes(`"${f}"`)) warnings.push(`deckLoader does not load "${f}" (Q4 requires it in deck)`);
}
if (loaderSrc.includes('"Time-full.json"')) warnings.push('deckLoader loads Time-full.json (Q4 requires exclusion)');

console.log('');
warnings.forEach(w => console.log(`WARN: ${w}`));
errors.forEach(e => console.log(`ERROR: ${e}`));
console.log('');
console.log(`${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
