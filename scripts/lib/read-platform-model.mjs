import fs from 'node:fs/promises';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';

/** Read only the data section; never render React or access browser storage. */
export async function readPlatformModel() {
  const source = await fs.readFile(new URL('../../app/page.tsx', import.meta.url), 'utf8');
  const boundary = source.indexOf('const learningCatalog:');
  if (boundary < 0) throw new Error('Platform data boundary changed; update the inventory reader.');
  const data = source.slice(0, boundary).replace(/^import .*?;\s*/gmu, '');
  const js = stripTypeScriptTypes(data);
  return vm.runInNewContext(`${js}\nJSON.parse(JSON.stringify({
    competencyDefinitions, functionPriorityCompetencies, industryPriorityCompetencies,
    executivePriorityCompetencies, functionLabels, industryLabels, executiveLabels,
    domains, allAssessmentItems
  }))`, {}, { timeout: 10000 });
}
