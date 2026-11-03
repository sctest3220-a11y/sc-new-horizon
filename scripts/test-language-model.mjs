import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createLocalLanguageStore,
  initialLanguage,
  isAppLanguage,
  languageStorageKey,
  languages,
  parseLanguagePreference,
  pick,
} from '../app/language-model.ts';

test('the saved preference accepts only supported codes and never throws', () => {
  for (const raw of [null, '', '{bad', 'fr', 'TH', 'constructor', '"th"', ' th']) assert.equal(parseLanguagePreference(raw), null, String(raw));
  for (const language of languages) assert.equal(parseLanguagePreference(language), language);
  assert.equal(isAppLanguage(3), false);
});

test('a saved preference wins over the browser language', () => {
  assert.equal(initialLanguage('en', ['th-TH']), 'en');
  assert.equal(initialLanguage('th', ['en-US']), 'th');
});

test('without a saved preference the first supported browser language is used', () => {
  assert.equal(initialLanguage(null, ['th-TH', 'en']), 'th');
  assert.equal(initialLanguage(null, ['TH']), 'th');
  assert.equal(initialLanguage(null, ['fr-FR', 'th']), 'th');
  assert.equal(initialLanguage(null, ['en-US', 'th']), 'en');
});

test('an unsupported or empty browser language falls back to English', () => {
  assert.equal(initialLanguage(null, ['fr-FR', 'ja']), 'en');
  assert.equal(initialLanguage(null, []), 'en');
});

test('pick returns the text for the language', () => {
  assert.equal(pick({ en: 'Home', th: 'หน้าแรก' }, 'th'), 'หน้าแรก');
  assert.deepEqual(pick({ en: ['a'], th: ['ก'] }, 'en'), ['a']);
});

function memoryStorage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), values };
}

test('the local store saves under the versioned key and reads it back', () => {
  const storage = memoryStorage();
  const store = createLocalLanguageStore(storage);
  assert.equal(store.load(), null);
  store.save('th');
  assert.equal(storage.values.get(languageStorageKey), 'th');
  assert.equal(createLocalLanguageStore(storage).load(), 'th');
});

test('the local store ignores a corrupt saved value', () => {
  const storage = memoryStorage();
  storage.setItem(languageStorageKey, '{"language":"th"}');
  assert.equal(createLocalLanguageStore(storage).load(), null);
});

test('the local store keeps the choice in memory when storage throws or is missing', () => {
  const throwing = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  for (const storage of [throwing, null]) {
    const store = createLocalLanguageStore(storage);
    assert.equal(store.load(), null);
    assert.doesNotThrow(() => store.save('th'));
    assert.equal(store.load(), 'th');
  }
});
