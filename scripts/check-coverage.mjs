// Enforces the coverage rules in docs/TESTING.md. Run through `pnpm test:coverage`,
// which produces the two inputs first:
//   node scripts/check-coverage.mjs --go server/coverage.out --lcov coverage/logic.lcov
//
// 1. Every Go package reaches GO_PACKAGE_FLOOR % of statements.
// 2. Every Go line added or changed since COVERAGE_BASE runs under test (100%).
// 3. Every logic module reaches LOGIC_FLOOR % of lines, branches and functions.
// Exclusions come from coverage-exclusions.json and apply to rules 1 and 2.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { changedLines, exclusionRange, goPackageCoverage, parseGoProfile, parseLcov, percent, uncoveredChangedLines, withoutExcluded } from './lib/coverage.mjs';

const COVERAGE_BASE = '03275d627a94882de77797d5cf68dea61d9c981e';
const GO_PACKAGE_FLOOR = 90;
const LOGIC_FLOOR = 90;
// Logic modules: pure code with no React and no runtime app imports.
const LOGIC_MODULES = [/^app\/[\w-]+-model\.ts$/, /^app\/connected-labs\.ts$/, /^app\/api-client\.ts$/, /^scripts\/lib\/coverage\.mjs$/];

const root = path.resolve(import.meta.dirname, '..');
const args = Object.fromEntries(process.argv.slice(2).flatMap((arg, i, all) => (arg.startsWith('--') ? [[arg.slice(2), all[i + 1]]] : [])));
if (!args.go || !args.lcov) {
  console.error('usage: node scripts/check-coverage.mjs --go <cover profile> --lcov <lcov file>');
  process.exit(2);
}
const read = file => fs.readFileSync(path.resolve(root, file), 'utf8');
const git = (...gitArgs) => execFileSync('git', gitArgs, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const failures = [];
const fmt = n => n.toFixed(1).padStart(5);

// Exclusions, resolved to line ranges per file.
const excluded = new Map();
for (const entry of JSON.parse(read('coverage-exclusions.json')).exclusions) {
  if (!entry.reason?.trim()) throw new Error(`exclusion in ${entry.file} has no reason`);
  const range = exclusionRange(read(entry.file), entry.anchor, entry.after);
  excluded.set(entry.file, [...(excluded.get(entry.file) ?? []), range]);
}

// Go: package floor.
const modulePath = /^module\s+(\S+)/m.exec(read('server/go.mod'))[1];
const goBlocks = withoutExcluded(parseGoProfile(read(args.go), modulePath, 'server'), excluded);
console.log(`Go packages (floor ${GO_PACKAGE_FLOOR}%):`);
for (const pkg of goPackageCoverage(goBlocks)) {
  const ok = pkg.percent >= GO_PACKAGE_FLOOR;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${fmt(pkg.percent)}%  ${pkg.dir}`);
  if (!ok) failures.push(`${pkg.dir}: ${pkg.percent.toFixed(1)}% of statements, below ${GO_PACKAGE_FLOOR}%`);
}

// Go: every changed line since the base commit, including uncommitted and new files.
const changed = changedLines(git('diff', '--no-color', '-U0', COVERAGE_BASE, '--', 'server'));
for (const file of git('ls-files', '--others', '--exclude-standard', '--', 'server').split('\n').filter(Boolean)) {
  changed.set(file, new Set(read(file).split('\n').map((_, i) => i + 1)));
}
const uncovered = uncoveredChangedLines(goBlocks, changed);
console.log(`Go lines changed since ${COVERAGE_BASE.slice(0, 7)} (must be 100% covered): ${uncovered.length ? `${uncovered.length} uncovered` : 'all covered'}`);
for (const { file, line } of uncovered) failures.push(`${file}:${line} changed since ${COVERAGE_BASE.slice(0, 7)} but never runs under test`);

// Logic modules: lines, branches and functions.
const lcov = new Map(parseLcov(read(args.lcov)).map(entry => [path.relative(root, path.resolve(root, entry.file)), entry]));
const logicFiles = ['app', 'scripts/lib'].flatMap(dir => fs.readdirSync(path.join(root, dir)).map(name => `${dir}/${name}`)).filter(file => LOGIC_MODULES.some(pattern => pattern.test(file)));
console.log(`Logic modules (floor ${LOGIC_FLOOR}% of lines, branches and functions):`);
for (const file of logicFiles) {
  const entry = lcov.get(file);
  if (!entry) {
    console.log(`  FAIL   no coverage  ${file}`);
    failures.push(`${file}: no test loads this logic module`);
    continue;
  }
  const metrics = { lines: percent(entry.lines), branches: percent(entry.branches), functions: percent(entry.functions) };
  const low = Object.entries(metrics).filter(([, value]) => value < LOGIC_FLOOR);
  console.log(`  ${low.length ? 'FAIL' : 'ok  '} ${fmt(metrics.lines)}% lines ${fmt(metrics.branches)}% branches ${fmt(metrics.functions)}% functions  ${file}`);
  for (const [metric, value] of low) failures.push(`${file}: ${value.toFixed(1)}% of ${metric}, below ${LOGIC_FLOOR}%`);
}

if (failures.length) {
  console.error(`\nCoverage check failed:\n${failures.map(f => `  - ${f}`).join('\n')}`);
  process.exit(1);
}
console.log('\nCoverage check passed.');
