import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { refinementVersion, rulesVersion, artifactVersion, checkpoints, refineQuestion, inspectQuestion, neutralArtifactCopy, generationSuffix } from '../inventory/wording-refinements.mjs';
import { fields } from './lib/thai-inventory-text.mjs';
import { englishProjection } from './lib/translate-thai-inventory.mjs';
import { englishWordingCheckpoints } from '../inventory/english-wording-checkpoints.mjs';

const root = new URL('../', import.meta.url);
const read = p => JSON.parse(fs.readFileSync(new URL(p, root), 'utf8'));
const write = (p, data) => fs.writeFileSync(new URL(p, root), JSON.stringify(data, null, 2) + '\n');
const hash = obj => createHash('sha256').update(JSON.stringify(obj)).digest('hex');
const audit = q => englishProjection(Object.fromEntries(Object.entries(q).filter(([key]) => !['userFacingDraft', 'artifactNeed'].includes(key))));
const structure = d => ({ interaction: d.interaction, format: d.format, keys: d.correctOptionIds, options: d.options?.map(o => [o.id, o.score]), parts: d.parts?.map(p => ({ id: p.id, keys: p.correctOptionIds, options: p.options.map(o => [o.id, o.score]) })) });
const dictionaryPath = 'inventory/th/reviewed-rewrites.json';
const dictionary = read(dictionaryPath);
const register = (en, th) => { if (en && th) dictionary[en] = th; };
const historyPath = 'exports/review-inventory/wording-refinement-history.json';
const history = fs.existsSync(new URL(historyPath, root)) ? read(historyPath) : { version: refinementVersion, items: [] };
const archived = new Set(history.items.map(x => x.questionId));
const report = { version: refinementVersion, rulesVersion, artifactVersion, scope: 'Entire bilingual review inventory, including draft and live-bank review views. Production scored items are not edited.', status: 'pending-human-audit', items: [] };
const staged = [];

for (const filename of ['questions.json', 'live-questions.json']) {
  const bank = read('exports/review-inventory/' + filename);
  for (const q of bank.questions) {
    const d = q.userFacingDraft;
    if (!d) throw new Error(`${q.id}: missing draft`);
    const before = structuredClone(d), artifactBefore = structuredClone(q.artifactNeed ?? null);
    const signature = structure(d), auditHash = hash(audit(q));
    d.th ??= {};
    const changes = [...new Set([...(d.ruleApplication?.version === refinementVersion ? d.ruleApplication.changes : []), ...refineQuestion(q, register)])];
    const saved = history.items.find(h => h.questionId === q.id);
    if (saved && d.englishWordingReview?.revision && before.englishWordingReview?.revision !== d.englishWordingReview.revision) {
      saved.revisions ??= [];
      if (!saved.revisions.some(r => r.revision === d.englishWordingReview.revision)) saved.revisions.push({ revision: d.englishWordingReview.revision, previousDraft: before, previousArtifactNeed: artifactBefore });
    }
    const simpleCore = q.layer === 'core' && q.casePatternId?.startsWith('D1-core-concepts-awareness-');
    if (simpleCore || englishWordingCheckpoints[q.id]?.artifactRequired === false) {
      const brief = ['The scenario provides the evidence needed to identify the described behavior. A separate image would repeat it.', 'สถานการณ์ให้หลักฐานที่จำเป็นต่อการระบุพฤติกรรมแล้ว ภาพแยกจะเป็นการแสดงข้อมูลซ้ำ'];
      q.artifactNeed = { need: 'not required', artifactType: 'none', artifactLabel: 'No artifact needed', artifactBrief: brief[0], rulesVersion: artifactVersion,
        th: { need: 'ไม่จำเป็นต้องมีภาพประกอบ', artifactLabel: 'ไม่ต้องสร้างภาพประกอบ', artifactBrief: brief[1] } };
      register(q.artifactNeed.need, q.artifactNeed.th.need); register(q.artifactNeed.artifactLabel, q.artifactNeed.th.artifactLabel); register(...brief);
    } else if (q.artifactNeed && neutralArtifactCopy[q.artifactNeed.artifactType]) {
      const a = q.artifactNeed, [en, th] = neutralArtifactCopy[a.artifactType];
      a.th ??= {}; a.artifactBrief = en; a.th.artifactBrief = th;
      a.generationPrompt = `${en} ${generationSuffix[0]}`;
      a.th.generationPrompt = `${th} ${generationSuffix[1]}`;
      if (a.prompt) {
        a.prompt = `${a.generationPrompt}\nQuestion context: ${d.context}\nQuestion: ${d.prompt}`;
        a.th.prompt = `${a.th.generationPrompt}\nบริบทคำถาม: ${d.th.context}\nคำถาม: ${d.th.prompt}`;
      }
      a.rulesVersion = artifactVersion;
      a.necessityReview = 'pending-question-specific-review';
      for (const key of ['artifactBrief', 'generationPrompt', 'prompt']) register(a[key], a.th[key]);
    }
    d.rewriteVersion = refinementVersion; d.rewriteRulesVersion = rulesVersion;
    d.rewriteReviewStatus = 'pending-human-audit';
    d.ruleApplication = { version: refinementVersion, status: 'applied-safe-wording-and-assessed', changes: [...new Set(changes)] };
    const issues = inspectQuestion(q);
    issues.push(...(englishWordingCheckpoints[q.id]?.issues ?? []));
    if (d.englishWordingReview?.thaiStatus === 'previous-revision-pending-sync') issues.push('English wording accepted; Thai retains its previous revision pending synchronization.');
    if (q.artifactNeed?.necessityReview) issues.push('Artifact type is a candidate, not proof of necessity. Inspect the specific item before generating an image.');
    if (q.sourceInventory === 'live') issues.push('Existing live-bank review copy assessed; substantive production wording and assets require separate item-level review.');
    d.ruleApplication.issues = issues;
    // Keep complete bilingual pairs so the strict translation command reproduces
    // the result, rather than assembling new Thai by English word substitution.
    for (const field of fields({ id: q.id, userFacingDraft: d.englishWordingReview?.thaiStatus === 'previous-revision-pending-sync' ? undefined : d, artifactNeed: q.artifactNeed })) {
      register(field.text, field.thaiObj[field.thaiKey]);
    }
    assert.deepEqual(structure(d), signature, `${q.id}: interaction, order, format or keys changed`);
    assert.equal(hash(audit(q)), auditHash, `${q.id}: audit source changed`);
    if (!archived.has(q.id)) {
      history.items.push({ questionId: q.id, source: filename, auditHash, structure: signature, previousDraft: before, previousArtifactNeed: artifactBefore });
      archived.add(q.id);
    }
    report.items.push({ id: q.id, source: filename, changes: [...new Set(changes)], reviewedCheckpoint: Boolean(checkpoints[q.id] || englishWordingCheckpoints[q.id]), artifactNeed: q.artifactNeed?.need ?? 'none', issues });
  }
  bank.translation ??= {};
  bank.translation.rulesVersion = `${rulesVersion}; English/Thai refinements ${refinementVersion}`;
  bank.translation.thStatus = 'machine-assisted-needs-review';
  staged.push([`exports/review-inventory/${filename}`, bank]);
}
// Validate the whole pass before persisting any inventory file.
// Shared option text must retain the selected checkpoint translation even when
// a later item still carries an older translation of the same English sentence.
for (const checkpoint of Object.values(checkpoints)) {
  for (const key of ['context', 'prompt', 'explanation']) register(...checkpoint[key]);
  for (const pair of checkpoint.labels) register(...pair);
}
write(dictionaryPath, dictionary);
write(historyPath, history);
for (const [file, data] of staged) write(file, data);
write('exports/review-inventory/wording-refinement-qa.json', report);
console.log(JSON.stringify({ status: report.status, processed: report.items.length, changedWording: report.items.filter(x => x.changes.length).length, withReviewIssues: report.items.filter(x => x.issues.length).length }));
