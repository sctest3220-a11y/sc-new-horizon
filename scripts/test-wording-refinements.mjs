import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { refineQuestion, checkpoints, refinementVersion } from '../inventory/wording-refinements.mjs';
import { artifactRules } from '../inventory/artifact-needs.mjs';
import { englishProjection, translate } from './lib/translate-thai-inventory.mjs';
import { fields } from './lib/thai-inventory-text.mjs';
const read = file => JSON.parse(fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'));
const bank = ['questions.json', 'live-questions.json'].flatMap(f => read('exports/review-inventory/' + f).questions);
const byId = new Map(bank.map(q => [q.id, q]));
const history = read('exports/review-inventory/wording-refinement-history.json');
const structure = d => ({ interaction: d.interaction, format: d.format, keys: d.correctOptionIds, options: d.options?.map(o => [o.id, o.score]), parts: d.parts?.map(p => ({id:p.id, keys:p.correctOptionIds, options:p.options.map(o=>[o.id,o.score])})) });

test('all assessed inventory records preserve audit facts, interactions, keys and scores', () => {
  assert.equal(history.items.length, bank.length);
  for (const h of history.items) {
    const q = byId.get(h.questionId);
    const audit = englishProjection(Object.fromEntries(Object.entries(q).filter(([key]) => !['userFacingDraft','artifactNeed'].includes(key))));
    assert.equal(createHash('sha256').update(JSON.stringify(audit)).digest('hex'), h.auditHash, q.id);
    assert.deepEqual(JSON.parse(JSON.stringify(structure(q.userFacingDraft))), h.structure, q.id);
    assert.equal(q.userFacingDraft.ruleApplication.version, refinementVersion, q.id);
  }
});

test('reviewed core wording and bilingual meanings survive generation', () => {
  for (const [id, c] of Object.entries(checkpoints)) {
    const q = byId.get(id), d = q.userFacingDraft;
    for (const field of ['context','prompt','explanation']) {
      assert.equal(d[field], c[field][0]); assert.equal(d.th[field], c[field][1]);
      assert.equal(translate(d[field]), d.th[field]);
    }
    d.options.forEach((o, i) => assert.equal(o.thLabel, c.labels[i][1]));
    assert.equal(q.artifactNeed.need, 'not required');
    assert.equal(q.artifactNeed.generationPrompt, undefined);
  }
  const d = byId.get('NH-CORE-GENERAL-D1-CORE-CONCEPTS-AWARENESS-03').userFacingDraft;
  assert.match(d.context, /When preset conditions are met/);
  assert.doesNotMatch(d.context, /uses AI|all personal|prompt/i);
  assert.equal(d.correctOptionIds[0], 'a');
});

test('narrow terminology change does not turn every language model into an LLM', () => {
  assert.match(byId.get('NH-CORE-GENERAL-D1-CORE-CONCEPTS-AWARENESS-04').userFacingDraft.context, /large language model \(LLM\)/);
  assert.doesNotMatch(byId.get('NH-CORE-GENERAL-D1-CORE-CONCEPTS-AWARENESS-02').userFacingDraft.options[0].label, /large language model/);
});

test('wording pass is repeatable and preserves prior reviewed checkpoints', () => {
  for (const q of bank) {
    const copy = structuredClone(q);
    refineQuestion(copy, () => {});
    assert.deepEqual(copy, q, q.id);
  }
});

test('artifact generation uses neutral instructions and complete Thai evidence', () => {
  for (const rule of artifactRules) {
    assert.doesNotMatch(rule.generationPrompt, /with a highlighted mismatch|marked failure|claim highlighted|one misleading metric|one risky ambiguity/);
    assert.match(rule.generationPrompt, /Use only facts supported/);
  }
  for (const q of bank) {
    for (const f of fields(q)) {
      assert.ok(/[\u0e00-\u0e7f]/.test(f.thaiObj[f.thaiKey]), `${q.id}:${f.key}`);
      assert.doesNotMatch(f.thaiObj[f.thaiKey], /\uFFFD|\{\{/);
    }
    if (q.artifactNeed?.rulesVersion === '1.3' && q.artifactNeed.generationPrompt) {
      assert.match(q.artifactNeed.generationPrompt, /Do not add highlighted errors/);
      assert.match(q.artifactNeed.th.generationPrompt, /ห้ามเน้นจุดผิด/);
    }
  }
});
