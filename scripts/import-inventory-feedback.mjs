import { readFile, writeFile, mkdir, rename, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mergeFeedback } from './lib/inventory-feedback.mjs';
const [input, reviewer, ...extra] = process.argv.slice(2);
if (!input || !reviewer || extra.length) throw new Error('Usage: node scripts/import-inventory-feedback.mjs <download.json> <reviewer-alias>');
const root = fileURLToPath(new URL('../', import.meta.url));
if ((await stat(input)).size > 50_000_000) throw new Error('Feedback export exceeds 50 MB.');
const incoming = JSON.parse(await readFile(input, 'utf8'));
// Validate before using the reviewer alias in any path.
mergeFeedback(null, incoming, reviewer);
const directory = path.join(root, 'exports/review-feedback/cloudflare');
const target = path.join(directory, `${reviewer}.json`);
let existing = null;
try { existing = JSON.parse(await readFile(target, 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const { store, added } = mergeFeedback(existing, incoming, reviewer);
const serialized = `${JSON.stringify(store, null, 2)}\n`;
if (JSON.stringify(existing) !== JSON.stringify(store)) {
  await mkdir(directory, { recursive: true });
  const temporary = `${target}.${process.pid}.tmp`;
  await writeFile(temporary, serialized, { flag: 'wx' });
  await rename(temporary, target);
}
console.log(`${added} new reviews imported into ${target}. Review the diff and commit through a feedback PR. Question files were not modified.`);
