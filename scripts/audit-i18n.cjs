#!/usr/bin/env node
/*
 * T26: i18n completeness audit.
 * Loads src/lang.js default locale (en) keys and every declared locale
 * (vi) and ensures every key present in en is present in each other locale
 * at the same shape (recursively, by key path). Reports 0 errors and exits 0
 * only when fully covered; otherwise exits non-zero.
 *
 * Additionally scans .vue files for hard-coded English UI strings that
 * should use locale keys instead (warnings only, does not fail CI).
 */
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');
const langPath = path.join(root, 'src', 'lang.js');

async function loadLang() {
  const fileUrl = `file://${langPath}`;
  const mod = await import(fileUrl);
  return mod.default || mod;
}

function collectKeys(obj, prefix = '') {
  const keys = new Set();
  function walk(node, p) {
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      for (const k of Object.keys(node)) {
        const np = p ? `${p}.${k}` : k;
        if (node[k] && typeof node[k] === 'object' && !Array.isArray(node[k])) {
          walk(node[k], np);
        } else {
          keys.add(np);
        }
      }
    }
  }
  walk(obj, prefix);
  return keys;
}

function findVueFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findVueFiles(full));
    } else if (entry.name.endsWith('.vue')) {
      results.push(full);
    }
  }
  return results;
}

// Find text content between > and < that isn't a {{ }} interpolation or directive
const TEXT_BETWEEN_TAGS = />([^<>{]+)</g;
// Matches visible English phrases: capital word, space, capital word
const ENGLISH_PHRASE = /^[A-Z][a-zA-Z]+\s+[A-Z]?[a-zA-Z]+/;

function findHardcodedEnglish() {
  const warnings = [];
  const vueFiles = findVueFiles(srcDir);

  for (const file of vueFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const templateMatch = content.match(/<template[\s\S]*?<\/template>/);
    if (!templateMatch) continue;

    const template = templateMatch[0];
    let match;
    TEXT_BETWEEN_TAGS.lastIndex = 0;
    while ((match = TEXT_BETWEEN_TAGS.exec(template)) !== null) {
      const text = match[1].trim();
      if (!text || text.length < 4) continue;
      if (!text.includes(' ')) continue;
      if (ENGLISH_PHRASE.test(text)) {
        warnings.push(`Hard-coded English in ${path.basename(file)}: "${text}"`);
      }
    }
  }

  return warnings;
}

async function main() {
  const lang = await loadLang();
  const locales = Object.keys(lang);
  if (locales.length < 2) {
    console.log('0 errors, 0 warnings');
    process.exit(0);
  }
  const base = locales[0];
  const baseKeys = collectKeys(lang[base]);
  let errors = 0;
  for (let i = 1; i < locales.length; i++) {
    const loc = locales[i];
    const locKeys = collectKeys(lang[loc]);
    for (const k of baseKeys) {
      if (!locKeys.has(k)) {
        console.error(`Missing key [${loc}]: ${k}`);
        errors++;
      }
    }
  }

  // Scan for hard-coded English UI strings (warnings only)
  const hardcodedWarnings = findHardcodedEnglish();
  for (const w of hardcodedWarnings) {
    console.warn(w);
  }

  if (errors === 0) {
    const total = hardcodedWarnings.length;
    console.log(`${locales.length} locales, ${baseKeys.size} keys each, 0 errors, ${total} warnings`);
  } else {
    console.error(`${errors} i18n error(s)`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
