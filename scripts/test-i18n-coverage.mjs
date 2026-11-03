import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createTranslator } from 'next-intl';
import { languages } from '../app/language-model.ts';
import { untranslatedAllowlist } from './lib/i18n-allowlist.mjs';

// Every visible string in the learner app comes from the message catalogs in
// i18n/messages, and every catalog has the same messages as en.json. See
// docs/LOCALISATION.md, "Adding a language".

const require = createRequire(import.meta.url);
const ts = require('typescript');
// The ICU parser next-intl uses, reached through its own dependency chain (pnpm does not hoist it).
const fromUseIntl = createRequire(createRequire(require.resolve('next-intl')).resolve('use-intl'));
const fromIntlMessageformat = createRequire(fromUseIntl.resolve('intl-messageformat'));
const { parse, TYPE } = fromIntlMessageformat('@formatjs/icu-messageformat-parser');

const root = new URL('../', import.meta.url);
const catalogs = Object.fromEntries(languages.map((language) => [language, JSON.parse(fs.readFileSync(new URL(`i18n/messages/${language}.json`, root), 'utf8'))]));
const learnerDir = new URL('app/(learner)/', root);
const sourceFiles = [
  ...fs.readdirSync(learnerDir, { recursive: true }).filter((file) => file.endsWith('.tsx')).map((file) => path.join('app/(learner)', file)),
  'app/learner-app.tsx',
  'app/watch-labs.tsx',
  'app/watch-awareness.tsx',
  'app/watch-media.tsx',
];
const isEmail = (text) => /^[\w.+-]+@[\w.-]+$/.test(text.trim());
const TEXT_ATTRIBUTES = new Set(['aria-label', 'placeholder', 'title', 'alt', 'label', 'caption', 'description', 'ariaLabel', 'heading']);

function flatten(object, prefix = '') {
  return Object.entries(object).flatMap(([key, value]) => (typeof value === 'string' ? [[`${prefix}${key}`, value]] : flatten(value, `${prefix}${key}.`)));
}
const flat = Object.fromEntries(languages.map((language) => [language, Object.fromEntries(flatten(catalogs[language]))]));

/** Argument and tag names used by an ICU message. */
function icuNames(message) {
  const names = new Set();
  const walk = (elements) => {
    for (const element of elements) {
      if (element.type === TYPE.argument || element.type === TYPE.number || element.type === TYPE.date || element.type === TYPE.time) names.add(element.value);
      if (element.type === TYPE.plural || element.type === TYPE.select) {
        names.add(element.value);
        Object.values(element.options).forEach((option) => walk(option.value));
      }
      if (element.type === TYPE.tag) {
        names.add(`<${element.value}>`);
        walk(element.children);
      }
    }
  };
  walk(parse(message));
  return [...names].sort();
}

/** True when this string is rendered as text: a JSX child, a text attribute, or a branch of either. */
function isRendered(node, sourceFile) {
  if (ts.isJsxAttribute(node.parent) && node.parent.initializer === node) return TEXT_ATTRIBUTES.has(node.parent.name.getText(sourceFile));
  let current = node;
  let parent = node.parent;
  while (parent) {
    if (ts.isParenthesizedExpression(parent)) { current = parent; parent = parent.parent; continue; }
    if (ts.isConditionalExpression(parent) && (parent.whenTrue === current || parent.whenFalse === current)) { current = parent; parent = parent.parent; continue; }
    if (ts.isBinaryExpression(parent) && [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(parent.operatorToken.kind)) { current = parent; parent = parent.parent; continue; }
    if (ts.isJsxExpression(parent)) {
      const host = parent.parent;
      return ts.isJsxElement(host) || ts.isJsxFragment(host) || (ts.isJsxAttribute(host) && TEXT_ATTRIBUTES.has(host.name.getText(sourceFile)));
    }
    return false;
  }
  return false;
}

/** Scans the learner sources: hard-coded visible text, and every t()/t.rich() key with its namespace. */
function scanSources() {
  const hardCoded = [];
  const usedKeys = new Set();
  const literalKeys = new Set(); // keys passed to t() as literals; each must exist
  for (const file of sourceFiles) {
    const source = fs.readFileSync(new URL(file, root), 'utf8');
    const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const where = (node) => `${file}:${sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1}`;
    const namespaceOf = (node) => {
      for (let scope = node.parent; scope; scope = scope.parent) {
        if (!(ts.isFunctionDeclaration(scope) || ts.isArrowFunction(scope) || ts.isFunctionExpression(scope)) || !scope.body || !ts.isBlock(scope.body)) continue;
        // A function that receives t as a parameter names its namespace in a comment.
        const marker = scope.body.getFullText(sourceFile).match(/\/\/ i18n-namespace: (\w+)/);
        if (marker) return marker[1];
        for (const statement of scope.body.statements) {
          if (!ts.isVariableStatement(statement)) continue;
          for (const declaration of statement.declarationList.declarations) {
            const init = declaration.initializer;
            if (declaration.name.getText(sourceFile) !== 't' || !init) continue;
            if (ts.isCallExpression(init) && init.expression.getText(sourceFile) === 'useTranslations') return init.arguments[0]?.text;
            // const t = useMemo(() => watchTranslator(language), [language])
            if (init.getText(sourceFile).includes('watchTranslator(')) return 'watch';
          }
        }
      }
      return null;
    };
    const namespaces = new Set();
    const literals = new Set();
    (function visit(node) {
      if (ts.isStringLiteral(node)) literals.add(node.text);
      if (ts.isCallExpression(node) && node.expression.getText(sourceFile) === 'useTranslations' && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) namespaces.add(node.arguments[0].text);
      if (ts.isCallExpression(node) && node.expression.getText(sourceFile) === 'watchTranslator') namespaces.add('watch');
      if (ts.isJsxText(node) && /[A-Za-z]{2}/.test(node.text.replace(/&[a-zA-Z]+;/g, '')) && !untranslatedAllowlist.has(node.text.trim())) hardCoded.push(`${where(node)} "${node.text.trim().slice(0, 60)}"`);
      if ((ts.isTemplateExpression(node) || ts.isNoSubstitutionTemplateLiteral(node)) && /[A-Za-z]{3}/.test(node.getText(sourceFile).replace(/\$\{[^}]*\}/g, '')) && isRendered(node, sourceFile)) hardCoded.push(`${where(node)} ${node.getText(sourceFile).slice(0, 60)}`);
      if (ts.isStringLiteral(node) && /[A-Za-z]{2}/.test(node.text) && !isEmail(node.text) && !untranslatedAllowlist.has(node.text) && isRendered(node, sourceFile)) hardCoded.push(`${where(node)} "${node.text.slice(0, 60)}"`);
      if (ts.isCallExpression(node) && ['t', 't.rich', 't.markup'].includes(node.expression.getText(sourceFile)) && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
        const namespace = namespaceOf(node);
        const key = namespace ? `${namespace}.${node.arguments[0].text}` : `?${where(node)}`;
        usedKeys.add(key);
        literalKeys.add(key);
      }
      ts.forEachChild(node, visit);
    })(sourceFile);
    // Keys looked up through a variable (t(label)) appear as string literals elsewhere in the file.
    for (const namespace of namespaces) for (const literal of literals) usedKeys.add(`${namespace}.${literal}`);
  }
  return { hardCoded, usedKeys, literalKeys };
}

const { hardCoded, usedKeys, literalKeys } = scanSources();

test('no visible text in the learner app is hard-coded outside the catalogs', () => {
  assert.deepEqual(hardCoded, []);
});

test('every catalog has exactly the keys of en.json', () => {
  const english = Object.keys(flat.en).sort();
  for (const language of languages) assert.deepEqual(Object.keys(flat[language]).sort(), english, language);
});

test('every message is non-empty, valid ICU, and uses the same arguments in every language', () => {
  for (const language of languages) {
    const errors = [];
    const translator = createTranslator({ locale: language, messages: catalogs[language], onError: (error) => errors.push(error) });
    for (const [key, message] of Object.entries(flat[language])) {
      assert.ok(message.trim(), `${language} ${key} is empty`);
      const names = icuNames(message);
      assert.deepEqual(names, icuNames(flat.en[key]), `${language} ${key} arguments differ from English`);
      const values = Object.fromEntries(names.map((name) => (name.startsWith('<') ? [name.slice(1, -1), (chunks) => chunks] : [name, 1])));
      translator.markup(key, values);
    }
    assert.deepEqual(errors.map((error) => error.message), [], `${language} messages`);
  }
});

test('every key the code uses exists, and every message is used', () => {
  const unresolved = [...literalKeys].filter((key) => key.startsWith('?'));
  assert.deepEqual(unresolved, [], 't() calls without a useTranslations namespace');
  const missing = [...literalKeys].filter((key) => !(key in flat.en));
  assert.deepEqual(missing, [], 'keys used in code but missing from en.json');
  // Titles are looked up by route (titles(routeStep)), not by a literal key.
  const unused = Object.keys(flat.en).filter((key) => !key.startsWith('titles.') && !usedKeys.has(key));
  assert.deepEqual(unused, [], 'messages no code uses');
});

test('every non-English message is translated', () => {
  const untranslated = languages.filter((language) => language !== 'en').flatMap((language) =>
    Object.entries(flat[language])
      .filter(([key, message]) => message === flat.en[key] && !untranslatedAllowlist.has(flat.en[key].trim()))
      .map(([key]) => `${language} ${key}`));
  assert.deepEqual(untranslated, []);
});
