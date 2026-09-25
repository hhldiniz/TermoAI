// Generates the guess-validation word lists in src/dictionaries/ from the
// MIT-licensed "an-array-of-*-words" packages. Run with: npm run build:dictionaries
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Must match normalizeText() in src/words.ts.
const normalize = (text) =>
  text.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/Ç/g, 'C').trim();

const SOURCES = {
  pt: 'an-array-of-portuguese-words',
  en: 'an-array-of-english-words',
  es: 'an-array-of-spanish-words',
};

// Standard mode uses 4, 5 and 6 letter words.
const VALID_WORD = /^[A-Z]{4,6}$/;

for (const [lang, pkg] of Object.entries(SOURCES)) {
  const words = JSON.parse(readFileSync(require.resolve(pkg), 'utf8'));
  const unique = [...new Set(words.map(normalize).filter((w) => VALID_WORD.test(w)))].sort();
  writeFileSync(new URL(`../src/dictionaries/${lang}.txt`, import.meta.url), unique.join('\n') + '\n');
  console.log(`${lang}: ${unique.length} words`);
}
