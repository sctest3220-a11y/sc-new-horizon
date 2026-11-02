import test from 'node:test';
import assert from 'node:assert/strict';
import { changedLines, exclusionRange, goPackageCoverage, parseGoProfile, parseLcov, percent, uncoveredChangedLines, withoutExcluded } from './lib/coverage.mjs';

const goModule = 'example.com/app/server';
const profile = [
  'mode: atomic',
  `${goModule}/cmd/api/main.go:10.2,12.3 2 0`,
  `${goModule}/internal/db/db.go:5.10,7.2 3 4`,
  `${goModule}/internal/db/db.go:8.2,9.3 1 0`,
  `${goModule}/internal/db/db.go:5.10,7.2 3 0`,
  '',
].join('\n');

test('Go profiles map to repository paths and keep the highest count of a repeated block', () => {
  const blocks = parseGoProfile(profile, goModule, 'server');
  assert.deepEqual(blocks.map(b => [b.file, b.startLine, b.endLine, b.stmts, b.count]), [
    ['server/cmd/api/main.go', 10, 12, 2, 0],
    ['server/internal/db/db.go', 5, 7, 3, 4],
    ['server/internal/db/db.go', 8, 9, 1, 0],
  ]);
});

test('a Go profile entry from another goModule is rejected, not silently counted', () => {
  assert.throws(() => parseGoProfile('other.com/x/file.go:1.1,2.2 1 1', goModule, 'server'), /outside/);
});

test('Go package coverage weights blocks by statements', () => {
  const coverage = goPackageCoverage(parseGoProfile(profile, goModule, 'server'));
  assert.deepEqual(coverage.map(c => [c.dir, c.found, c.hit, c.percent]), [
    ['server/cmd/api', 2, 0, 0],
    ['server/internal/db', 4, 3, 75],
  ]);
});

test('lcov totals are read per file, and an empty file counts as covered', () => {
  const files = parseLcov(['TN:', 'SF:app/a.ts', 'FNF:4', 'FNH:3', 'BRF:10', 'BRH:9', 'LF:20', 'LH:20', 'end_of_record', 'SF:app/b.ts', 'end_of_record', 'DA:1,1'].join('\n'));
  assert.deepEqual(files[0], { file: 'app/a.ts', lines: { found: 20, hit: 20 }, branches: { found: 10, hit: 9 }, functions: { found: 4, hit: 3 } });
  assert.equal(percent(files[0].functions), 75);
  assert.equal(percent(files[1].lines), 100);
});

const source = ['package main', '', 'func main() {', '\tif err := run(); err != nil {', '\t\tos.Exit(1)', '\t}', '}', '', 'func run() error {', '\treturn nil', '}'].join('\n');

test('an exclusion covers exactly the brace region its anchor opens', () => {
  assert.deepEqual(exclusionRange(source, 'func main() {'), { start: 3, end: 7 });
  assert.deepEqual(exclusionRange(source, '  if err := run(); err != nil {  '), { start: 4, end: 6 });
});

test('an "after" line picks the first repeated anchor that follows it', () => {
  const repeated = ['func f() error {', '\ta, err := one()', '\tif err != nil {', '\t\treturn err', '\t}', '\tb, err := two()', '\tif err != nil {', '\t\treturn err', '\t}', '\treturn nil', '}'].join('\n');
  assert.deepEqual(exclusionRange(repeated, 'if err != nil {', 'b, err := two()'), { start: 7, end: 9 });
  assert.deepEqual(exclusionRange(repeated, 'if err != nil {', 'a, err := one()'), { start: 3, end: 5 });
  assert.throws(() => exclusionRange(repeated, 'if err != nil {'), /matches 2 lines/);
  assert.throws(() => exclusionRange(repeated, 'if err != nil {', 'c, err := three()'), /"after" line .* matches 0 lines/);
  assert.throws(() => exclusionRange(repeated, 'if missing {', 'a, err := one()'), /matches 0 lines/);
});

test('a missing, repeated or unclosed exclusion anchor fails loudly', () => {
  assert.throws(() => exclusionRange(source, 'func gone() {'), /matches 0 lines/);
  assert.throws(() => exclusionRange(`${source}\nfunc main() {\n}`, 'func main() {'), /matches 2 lines/);
  assert.throws(() => exclusionRange('func open() {\n\treturn', 'func open() {'), /no closing brace/);
});

test('excluded blocks drop out of both package totals and the changed-line check', () => {
  const blocks = parseGoProfile(profile, goModule, 'server');
  const excluded = new Map([['server/cmd/api/main.go', [{ start: 9, end: 13 }]]]);
  assert.deepEqual(withoutExcluded(blocks, excluded).map(b => b.file), ['server/internal/db/db.go', 'server/internal/db/db.go']);
  assert.equal(withoutExcluded(blocks, new Map()).length, 3);
});

test('git diff hunks become changed line sets, ignoring deleted files and pure deletions', () => {
  const diff = [
    'diff --git a/server/x.go b/server/x.go', '--- a/server/x.go', '+++ b/server/x.go',
    '@@ -1,0 +2,3 @@', '+a', '+b', '+c',
    '@@ -10 +20 @@', '-old', '+new',
    '@@ -30,2 +40,0 @@', '-gone', '-gone',
    'diff --git a/server/y.go b/server/y.go', '--- a/server/y.go', '+++ /dev/null', '@@ -1,2 +0,0 @@',
  ].join('\n');
  const changed = changedLines(diff);
  assert.deepEqual([...changed.get('server/x.go')], [2, 3, 4, 20]);
  assert.ok(!changed.has('server/y.go'));
});

test('only changed lines inside unexecuted blocks are reported, once each', () => {
  const blocks = [
    { file: 'server/x.go', startLine: 2, endLine: 4, stmts: 2, count: 0 },
    { file: 'server/x.go', startLine: 3, endLine: 5, stmts: 1, count: 0 },
    { file: 'server/x.go', startLine: 20, endLine: 21, stmts: 1, count: 1 },
    { file: 'server/z.go', startLine: 1, endLine: 2, stmts: 1, count: 0 },
  ];
  const changed = new Map([['server/x.go', new Set([3, 4, 20, 99])]]);
  assert.deepEqual(uncoveredChangedLines(blocks, changed), [{ file: 'server/x.go', line: 3 }, { file: 'server/x.go', line: 4 }]);
});
