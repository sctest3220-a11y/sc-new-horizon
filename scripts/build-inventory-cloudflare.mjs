import { cp, mkdir, readFile, writeFile, symlink, rm } from 'node:fs/promises';
import { sha256, hashTree } from './lib/inventory-release.mjs';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'work/inventory-cloudflare');
// A release always rebuilds assets; filesystem mtimes are not a version control.
await rm(path.join(root, 'public/review-inventory'), { recursive: true, force: true });
execFileSync(process.execPath, ['scripts/build-review-inventory-assets.mjs'], { cwd: root, stdio: 'inherit' });
await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'app/admin/question-inventory'), { recursive: true });
await mkdir(path.join(output, 'app/api/results'), { recursive: true });
await mkdir(path.join(output, 'public'), { recursive: true });
for (const name of ['app/admin/question-inventory', 'app/globals.css', 'tsconfig.json', 'public/review-inventory', 'public/stimuli']) {
  await cp(path.join(root, name), path.join(output, name), { recursive: true });
}
await cp(path.join(root, 'deploy/inventory-preview/review-sync.tsx'), path.join(output, 'app/admin/question-inventory/review-sync.tsx'));
await cp(path.join(root, 'app/api/results/route.ts'), path.join(output, 'app/api/results/route.ts'));
const pagePath = path.join(output, 'app/admin/question-inventory/page.tsx');
let page = await readFile(pagePath, 'utf8');
if (!page.includes('await fetch(new URL(assetPath, origin))')) throw new Error('Inventory asset loader changed; review deployment adapter.');
page = page.replace("import Link from 'next/link';", "function Link(props: React.ComponentProps<'a'>) { return <a {...props} />; }")
  .replace("import { headers } from 'next/headers';", "import { headers } from 'next/headers';")
  .replace(/\s*<Link href="\/">Assessment<\/Link>/g, '')
  .replace(/\s*<Link href="\/\?view=admin">Admin<\/Link>/g, '')
  .replace(/<div className="inventory-nav-links">[\s\S]*?<\/div>/g, '<p className="eyebrow">Cloudflare test preview · Draft content · Inventory only</p>');
await writeFile(pagePath, page);
await writeFile(path.join(output, 'app/layout.tsx'), `import './globals.css';
export const metadata = { title: 'Question Inventory | New Horizon Test', robots: { index: false, follow: false } };
export default function Layout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
`);
await writeFile(path.join(output, 'app/page.tsx'), `import { redirect } from 'next/navigation';\nexport default function Home() { redirect('/admin/question-inventory'); }\n`);
await writeFile(path.join(output, 'package.json'), JSON.stringify({ name: 'new-horizon-question-inventory-test', private: true, type: 'module' }));
await symlink(path.join(root, 'node_modules'), path.join(output, 'node_modules'), 'dir');
await writeFile(path.join(output, 'wrangler.json'), JSON.stringify({ name: 'new-horizon-question-inventory-test', main: 'vinext/server/app-router-entry', compatibility_date: '2026-05-15', compatibility_flags: ['nodejs_compat'], workers_dev: true, assets: { binding: 'ASSETS', directory: '../../public' }, d1_databases: [{ binding: 'RESULTS_DB', database_name: 'new-horizon-inventory-results', database_id: '17983c70-a2ec-40f6-afbc-50722fb2b9a3' }] }, null, 2));
await writeFile(path.join(output, 'vite.config.ts'), `import { defineConfig } from 'vite';
import vinext from 'vinext';
import tailwindcss from '@tailwindcss/postcss';
export default defineConfig(async () => {
  process.env.WRANGLER_LOG_PATH ??= ${JSON.stringify(path.join(tmpdir(), 'horizon-wrangler'))};
  const { cloudflare } = await import('@cloudflare/vite-plugin');
  return { css: { postcss: { plugins: [tailwindcss()] } }, define: { 'process.env.__NEXT_APP_NAV_FAIL_HANDLING': 'false' }, plugins: [vinext(), cloudflare({ viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] } })] };
});\n`);
await writeFile(path.join(output, 'public/robots.txt'), 'User-agent: *\nDisallow: /\n');
const hashes = {};
for (const name of ['questions.json', 'live-questions.json', 'artifact-needs.json']) {
  hashes[name] = sha256(await readFile(path.join(root, 'exports/review-inventory', name)));
}
const summary = JSON.parse(await readFile(path.join(output, 'public/review-inventory/summary.json'), 'utf8'));
const contentVersion = sha256(JSON.stringify({ inventory: await hashTree(path.join(output, 'public/review-inventory')), stimuli: await hashTree(path.join(output, 'public/stimuli')) }));
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const sourceDirty = Boolean(execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim());
const viewHash = await hashTree(path.join(output, 'app'));
const release = { schemaVersion: 2, releaseId: `${sourceCommit.slice(0, 12)}-${contentVersion.slice(0, 12)}-${viewHash.slice(0, 12)}${sourceDirty ? '-dirty' : ''}`, contentVersion, sourceCommit, sourceDirty, createdAt: new Date().toISOString(), status: 'draft-technical-test', feedback: 'browser-local', inventoryVersion: summary.inventoryVersion, draftCount: summary.draftCount, liveCount: summary.liveCount, sha256: hashes };
await writeFile(path.join(output, 'public/review-release.json'), JSON.stringify(release, null, 2));
await writeFile(path.join(output, 'app/admin/question-inventory/release.json'), JSON.stringify(release));
// Only review-sync.tsx owns browser feedback storage. The feedback form and
// controls now persist through the results API, so they intentionally do not
// contain the legacy localStorage marker this preview adapter rewrites.
for (const component of ['review-sync.tsx']) {
  const target = path.join(output, 'app/admin/question-inventory', component);
  const source = await readFile(target, 'utf8');
  if (!source.includes('new-horizon-review:')) throw new Error(`Feedback storage adapter changed: ${component}`);
  await writeFile(target, source.replaceAll('new-horizon-review:', `new-horizon-review-v2:${contentVersion}:`));
}
// Avoid a cached manifest or document obscuring a newly deployed release.
await writeFile(path.join(output, 'public/_headers'), '/review-release.json\n  Cache-Control: no-store\n/admin/question-inventory\n  Cache-Control: no-store\n');
console.log(`Inventory-only Cloudflare source prepared at ${output}`);
execFileSync(process.execPath, [path.join(root, 'node_modules/vinext/dist/cli.js'), 'build'], { cwd: output, stdio: 'inherit' });
