import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
export const sha256 = value => createHash('sha256').update(value).digest('hex');
export async function hashTree(root) {
  const files = [];
  async function visit(dir, prefix = '') {
    for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a,b) => a.name.localeCompare(b.name))) {
      const relative = `${prefix}${entry.name}`;
      if (entry.isDirectory()) await visit(path.join(dir, entry.name), `${relative}/`);
      else if (entry.isFile()) files.push([relative, sha256(await readFile(path.join(dir, entry.name)))]);
      else throw new Error(`Unsupported release asset: ${relative}`);
    }
  }
  await visit(root);
  return sha256(JSON.stringify(files));
}
