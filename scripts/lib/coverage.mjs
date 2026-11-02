// Pure helpers behind scripts/check-coverage.mjs. They parse coverage and diff
// output and apply the coverage rules in docs/TESTING.md; they never read files
// or run commands, so scripts/test-coverage.mjs can test them directly.

/**
 * Parses a Go cover profile into blocks with repository-relative paths.
 * `modulePath` is the `module` line of server/go.mod; `moduleDir` is where that
 * module lives in the repository ("server").
 */
export function parseGoProfile(text, modulePath, moduleDir) {
  const blocks = new Map();
  for (const line of text.split('\n')) {
    const match = /^(.+):(\d+)\.\d+,(\d+)\.\d+ (\d+) (\d+)$/.exec(line.trim());
    if (!match) continue;
    const [, source, start, end, stmts, count] = match;
    if (!source.startsWith(`${modulePath}/`)) throw new Error(`cover profile entry outside ${modulePath}: ${source}`);
    const file = `${moduleDir}/${source.slice(modulePath.length + 1)}`;
    // -race and -coverpkg can repeat a block; keep the highest count.
    const key = `${file}:${start}:${end}`;
    const previous = blocks.get(key);
    blocks.set(key, { file, startLine: Number(start), endLine: Number(end), stmts: Number(stmts), count: Math.max(Number(count), previous?.count ?? 0) });
  }
  return [...blocks.values()];
}

/** Parses lcov into per-file line, branch and function totals. */
export function parseLcov(text) {
  const files = [];
  let current = null;
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (line.startsWith('SF:')) current = { file: line.slice(3), lines: { found: 0, hit: 0 }, branches: { found: 0, hit: 0 }, functions: { found: 0, hit: 0 } };
    else if (!current) continue;
    else if (line.startsWith('LF:')) current.lines.found = Number(line.slice(3));
    else if (line.startsWith('LH:')) current.lines.hit = Number(line.slice(3));
    else if (line.startsWith('BRF:')) current.branches.found = Number(line.slice(4));
    else if (line.startsWith('BRH:')) current.branches.hit = Number(line.slice(4));
    else if (line.startsWith('FNF:')) current.functions.found = Number(line.slice(4));
    else if (line.startsWith('FNH:')) current.functions.hit = Number(line.slice(4));
    else if (line === 'end_of_record') { files.push(current); current = null; }
  }
  return files;
}

/** Percentage of `hit` over `found`; nothing to cover counts as fully covered. */
export const percent = ({ found, hit }) => (found === 0 ? 100 : (hit / found) * 100);

/**
 * Resolves an exclusion to the line range it covers: the anchor line through the
 * line that closes the brace it opens (the next line equal to the anchor's
 * indentation followed by "}"). With `after`, the anchor is the first matching
 * line after the one line equal to `after`, for anchors like `if err != nil {`
 * that repeat. Throws when a line is missing or ambiguous, so a stale exclusion
 * fails the check instead of silently excluding nothing.
 */
export function exclusionRange(source, anchor, after) {
  const lines = source.split('\n');
  const only = (text, from = 0) => lines.flatMap((line, index) => (index >= from && line.trim() === text.trim() ? [index] : []));
  let from = 0;
  if (after !== undefined) {
    const afterMatches = only(after);
    if (afterMatches.length !== 1) throw new Error(`exclusion "after" line ${JSON.stringify(after)} matches ${afterMatches.length} lines; it must match exactly one`);
    from = afterMatches[0] + 1;
  }
  const matches = only(anchor, from);
  if (after !== undefined) matches.splice(1);
  if (matches.length !== 1) throw new Error(`exclusion anchor ${JSON.stringify(anchor)} matches ${matches.length} lines; it must match exactly one`);
  const start = matches[0];
  const indent = /^\s*/.exec(lines[start])[0];
  const end = lines.findIndex((line, index) => index > start && line === `${indent}}`);
  if (end === -1) throw new Error(`exclusion anchor ${JSON.stringify(anchor)} opens no closing brace at the same indentation`);
  return { start: start + 1, end: end + 1 };
}

const inRanges = (line, ranges = []) => ranges.some(range => line >= range.start && line <= range.end);

/** Drops Go blocks that start inside an excluded range. `excluded` maps file → ranges. */
export function withoutExcluded(blocks, excluded) {
  return blocks.filter(block => !inRanges(block.startLine, excluded.get(block.file)));
}

/** Statement coverage per Go package directory, e.g. "server/internal/db". */
export function goPackageCoverage(blocks) {
  const packages = new Map();
  for (const block of blocks) {
    const dir = block.file.slice(0, block.file.lastIndexOf('/'));
    const totals = packages.get(dir) ?? { found: 0, hit: 0 };
    totals.found += block.stmts;
    if (block.count > 0) totals.hit += block.stmts;
    packages.set(dir, totals);
  }
  return [...packages].map(([dir, totals]) => ({ dir, ...totals, percent: percent(totals) })).sort((a, b) => a.dir.localeCompare(b.dir));
}

/** Added or changed line numbers per file, from `git diff -U0` output. */
export function changedLines(diff) {
  const changed = new Map();
  let file = null;
  for (const line of diff.split('\n')) {
    if (line.startsWith('+++ ')) {
      file = line === '+++ /dev/null' ? null : line.slice(4).replace(/^b\//, '');
      continue;
    }
    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line);
    if (!hunk || !file) continue;
    const start = Number(hunk[1]);
    const count = hunk[2] === undefined ? 1 : Number(hunk[2]);
    const lines = changed.get(file) ?? new Set();
    for (let n = start; n < start + count; n += 1) lines.add(n);
    changed.set(file, lines);
  }
  return changed;
}

/**
 * Changed lines that fall inside a Go block no test executed. Lines outside
 * every block (comments, declarations, blank lines) carry no statements.
 */
export function uncoveredChangedLines(blocks, changed) {
  const result = [];
  for (const block of blocks) {
    if (block.count > 0) continue;
    const lines = changed.get(block.file);
    if (!lines) continue;
    for (let n = block.startLine; n <= block.endLine; n += 1) if (lines.has(n)) result.push({ file: block.file, line: n });
  }
  const unique = new Map(result.map(entry => [`${entry.file}:${entry.line}`, entry]));
  return [...unique.values()].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}
