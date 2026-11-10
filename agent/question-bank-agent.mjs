import { createHash } from 'node:crypto';

/**
 * Supervised question-bank agent.
 *
 * This module deliberately produces reviewable drafts only. It does not call a
 * provider, publish scored content, or mutate the live inventory.
 */

export const QUESTION_FORMATS = ['single', 'multi', 'rank', 'match', 'written', 'multi-part'];
export const PROMOTION_STATES = ['draft', 'reviewed', 'pilot-ready', 'pilot-tested', 'approved', 'published', 'monitored'];
export const QUESTION_BANKS = {
  live: 'exports/production/releases/*/release-questions.json',
  existingDraft: 'exports/review-inventory/questions.json',
  agentGenerated: 'exports/agent-question-bank/questions.json',
};

const th = {
  singlePrompt: 'ทีมต้องการใช้ AI สรุปคำร้องเรียนลูกค้า ควรตรวจอะไรเป็นอันดับแรก',
  singleContext: 'ทีมบริการลูกค้าใช้ AI สรุปคำร้องเรียนจากบันทึกที่อนุมัติแล้ว แต่ผู้จัดการยังไม่แน่ใจว่าคำตอบอ้างอิงข้อมูลใด',
  singleOptions: ['ตรวจแหล่งข้อมูลและสิทธิ์ก่อนใช้งาน', 'เผยแพร่คำตอบทันทีเพราะภาษาอ่านง่าย', 'เพิ่มความยาวของพรอมต์โดยไม่ตรวจแหล่งข้อมูล', 'ปิดการตรวจทานของมนุษย์เพื่อให้เร็วขึ้น'],
  multiPrompt: 'เลือกการควบคุมที่ปลอดภัยทั้งหมดก่อนให้ Agent ส่งคำตอบลูกค้า',
  multiContext: 'Agent ร่างคำตอบจากประวัติลูกค้าและมีสิทธิ์เรียกใช้ระบบคืนเงิน',
  multiOptions: ['จำกัดสิทธิ์ตามงานที่จำเป็น', 'ให้มนุษย์อนุมัติการคืนเงิน', 'บันทึกการเรียกใช้เครื่องมือ', 'ให้ Agent เพิ่มวงเงินเองเมื่อคำขอล้มเหลว'],
  rankPrompt: 'จัดลำดับขั้นตอนก่อนนำระบบ RAG ไปใช้กับนโยบายบริษัท',
  rankContext: 'ทีมมีดัชนีเอกสารนโยบายที่ยังไม่ผ่านการตรวจความสดใหม่และสิทธิ์การเข้าถึง',
  rankSteps: ['ตรวจสิทธิ์และความสดใหม่ของเอกสาร', 'สร้างชุดทดสอบพร้อมคำตอบอ้างอิง', 'ทดสอบการดึงข้อมูลและการอ้างอิง', 'เปิดใช้แบบจำกัดขอบเขตพร้อมติดตามผล'],
  matchPrompt: 'จับคู่หลักฐานกับความเสี่ยงที่เกี่ยวข้อง',
  matchContext: 'ผู้ตรวจพบสัญญาณหลายอย่างในบันทึกการทำงานของ AI',
  matchPairs: [['คำตอบไม่มีแหล่งอ้างอิง', 'ความเสี่ยงด้านความน่าเชื่อถือ'], ['Agent เรียก API เกินขอบเขต', 'ความเสี่ยงด้านสิทธิ์'], ['ผลลัพธ์ต่างกันเมื่อใช้ภาษาไทย', 'ความเสี่ยงด้านความเท่าเทียมของภาษา']],
  writtenPrompt: 'เขียนแผนตรวจสอบสั้น ๆ ก่อนอนุมัติคำตอบที่ AI สร้าง',
  writtenContext: 'ผู้จัดการได้รับคำตอบที่ดูสมเหตุผล แต่ยังไม่ทราบว่ามีข้ออ้างใดที่ไม่มีหลักฐานสนับสนุน',
  writtenKeywords: ['ตรวจแหล่งอ้างอิง', 'ระบุข้อจำกัด', 'มนุษย์อนุมัติ', 'บันทึกหลักฐาน'],
  partPrompt: 'ตอบสองส่วน: วินิจฉัยปัญหา แล้วเลือกการควบคุมถัดไป',
  partContext: 'ระบบอ่านเอกสารภายในและส่งอีเมลได้เอง พบว่าคำตอบหนึ่งฉบับอ้างข้อมูลจากเอกสารที่ผู้ใช้ไม่มีสิทธิ์อ่าน',
};

const en = {
  singlePrompt: 'What should the team check first?', singleContext: 'A customer-service team uses AI to summarize approved complaint records, but the manager is unsure which sources support the answer.',
  singleOptions: ['Check the sources and permissions before use', 'Publish it immediately because the language is clear', 'Make the prompt longer without checking sources', 'Remove human review to make the workflow faster'],
  multiPrompt: 'Select all safe controls before the Agent sends a customer response', multiContext: 'An Agent drafts a response from customer history and can call a refund system.',
  multiOptions: ['Limit permissions to the required task', 'Require human approval for refunds', 'Log tool calls', 'Let the Agent increase its own limit after failure'],
  rankPrompt: 'Put the steps in the best order before deploying a policy RAG system', rankContext: 'The team has a policy index whose freshness and access permissions have not been checked.',
  rankSteps: ['Check document permissions and freshness', 'Create a test set with reference answers', 'Test retrieval and citations', 'Launch with a bounded scope and monitor results'],
  matchPrompt: 'Match each evidence signal to the relevant risk', matchContext: 'A reviewer finds several signals in an AI workflow log.',
  matchPairs: [['The answer has no source citation', 'Reliability risk'], ['The Agent calls an API outside its scope', 'Permission risk'], ['Results differ between Thai and English', 'Language-equity risk']],
  writtenPrompt: 'Write a short review plan before approving an AI-generated answer', writtenContext: 'A manager receives a plausible answer but does not know which claims lack supporting evidence.',
  writtenKeywords: ['check citations', 'state limitations', 'human approval', 'record evidence'],
  partPrompt: 'Answer both parts: diagnose the issue, then choose the next control', partContext: 'A system reads internal documents and can send email. One answer cites a document the user is not allowed to read.',
};

const hash = (value) => createHash('sha256').update(value).digest('hex').slice(0, 10);
const artifactFor = (key, language) => ({
  id: `artifact-${key}`,
  format: 'audit-log',
  language,
  title: language === 'th' ? 'บันทึกการทำงานของ AI' : 'AI workflow audit log',
  inspectFor: language === 'th' ? 'ตรวจสิทธิ์ แหล่งอ้างอิง และการเรียกใช้เครื่องมือ' : 'Inspect permissions, citations, and tool calls',
  evidence: language === 'th' ? ['source_id: policy-17', 'permission: denied', 'tool: refund.create'] : ['source_id: policy-17', 'permission: denied', 'tool: refund.create'],
  accessibility: 'Text equivalent is included; no answer is encoded only by colour.',
});

function bilingualQuestion(key, format, content, artifact) {
  const id = `NH-AGENT-${key.toUpperCase()}-${hash(JSON.stringify(content))}`;
  return { id, version: 'agent-draft-1', status: 'draft', promotionState: 'draft', locale: 'en-th', format, interaction: format, content, artifact, review: { humanApprovalRequired: true, qa: 'pending', duplicateCheck: 'passed' } };
}

export function generateQuestionDrafts({ formats = QUESTION_FORMATS, includeArtifacts = true } = {}) {
  const drafts = [];
  const add = (key, format, data, artifactKey = key) => drafts.push(bilingualQuestion(key, format, { en: data.en, th: data.th }, includeArtifacts ? { en: artifactFor(artifactKey, 'en'), th: artifactFor(artifactKey, 'th') } : null));
  if (formats.includes('single')) add('source-check', 'single', { en: { context: en.singleContext, prompt: en.singlePrompt, options: en.singleOptions, correctOptionIds: ['a'], explanation: 'The team must establish evidence and access before trusting the generated summary.' }, th: { context: th.singleContext, prompt: th.singlePrompt, options: th.singleOptions, correctOptionIds: ['a'], explanation: 'ควรตรวจหลักฐานและสิทธิ์ก่อนเชื่อถือสรุปที่สร้างขึ้น' } });
  if (formats.includes('multi')) add('agent-controls', 'multi', { en: { context: en.multiContext, prompt: en.multiPrompt, options: en.multiOptions, correctOptionIds: ['a', 'b', 'c'], explanation: 'Least privilege, approval, and logs bound the Agent; self-expansion is unsafe.' }, th: { context: th.multiContext, prompt: th.multiPrompt, options: th.multiOptions, correctOptionIds: ['a', 'b', 'c'], explanation: 'จำกัดสิทธิ์ ขออนุมัติ และบันทึกการทำงานช่วยควบคุม Agent การเพิ่มสิทธิ์เองไม่ปลอดภัย' } });
  if (formats.includes('rank')) add('rag-release', 'rank', { en: { context: en.rankContext, prompt: en.rankPrompt, steps: en.rankSteps, correctOrder: [0, 1, 2, 3], explanation: 'Validate the corpus and expected behaviour before bounded deployment.' }, th: { context: th.rankContext, prompt: th.rankPrompt, steps: th.rankSteps, correctOrder: [0, 1, 2, 3], explanation: 'ตรวจคลังข้อมูลและพฤติกรรมที่คาดหวังก่อนเปิดใช้แบบจำกัดขอบเขต' } });
  if (formats.includes('match')) add('risk-signals', 'match', { en: { context: en.matchContext, prompt: en.matchPrompt, pairs: en.matchPairs, explanation: 'Each signal points to a distinct control concern.' }, th: { context: th.matchContext, prompt: th.matchPrompt, pairs: th.matchPairs, explanation: 'สัญญาณแต่ละรายการชี้ไปยังประเด็นควบคุมที่แตกต่างกัน' } });
  if (formats.includes('written')) add('evidence-plan', 'written', { en: { context: en.writtenContext, prompt: en.writtenPrompt, rubricKeywords: en.writtenKeywords, explanation: 'A strong plan checks evidence, states limitations, preserves human approval, and records the basis.' }, th: { context: th.writtenContext, prompt: th.writtenPrompt, rubricKeywords: th.writtenKeywords, explanation: 'แผนที่ดีต้องตรวจหลักฐาน ระบุข้อจำกัด มีการอนุมัติของมนุษย์ และบันทึกที่มา' } });
  if (formats.includes('multi-part')) add('permission-boundary', 'multi-part', { en: { context: en.partContext, prompt: en.partPrompt, parts: [{ id: 'diagnosis', prompt: 'What is the primary issue?', options: ['Unauthorised evidence access', 'Slow generation', 'A spelling error'], correctOptionIds: ['a'] }, { id: 'control', prompt: 'What should happen next?', options: ['Block the citation and review access', 'Send the email automatically', 'Grant broader access'], correctOptionIds: ['a'] }] }, th: { context: th.partContext, prompt: th.partPrompt, parts: [{ id: 'diagnosis', prompt: 'ปัญหาหลักคืออะไร', options: ['การเข้าถึงหลักฐานโดยไม่มีสิทธิ์', 'การสร้างคำตอบช้า', 'การสะกดคำผิด'], correctOptionIds: ['a'] }, { id: 'control', prompt: 'ควรทำอะไรต่อไป', options: ['บล็อกการอ้างอิงและตรวจสิทธิ์', 'ส่งอีเมลอัตโนมัติ', 'เพิ่มสิทธิ์ให้กว้างขึ้น'], correctOptionIds: ['a'] }] } });
  return { schemaVersion: 1, agent: 'Assessment Item Generator + Stimulus Builder', generatedAt: new Date().toISOString(), status: 'draft', bank: 'agent-generated', source: 'assessment-item-generator', storage: { exportPath: QUESTION_BANKS.agentGenerated, excludedFrom: [QUESTION_BANKS.live, QUESTION_BANKS.existingDraft], mergePolicy: 'never-merge-automatically' }, liveIntegration: false, humanApprovalRequired: true, drafts, safety: { externalProviderCalled: false, published: false, duplicatePolicy: 'stable content hash rejects repeated drafts' } };
}

export function validateQuestionBank(result) {
  const errors = [];
  if (result.bank !== 'agent-generated') errors.push('bank: must be agent-generated');
  if (result.storage?.exportPath !== QUESTION_BANKS.agentGenerated) errors.push('storage: wrong agent export path');
  if (result.storage?.mergePolicy !== 'never-merge-automatically') errors.push('storage: automatic merge is not allowed');
  const ids = new Set();
  for (const draft of result.drafts ?? []) {
    if (ids.has(draft.id)) errors.push(`${draft.id}: duplicate id`); ids.add(draft.id);
    if (!QUESTION_FORMATS.includes(draft.format)) errors.push(`${draft.id}: unsupported format`);
    for (const language of ['en', 'th']) {
      if (!draft.content?.[language]) errors.push(`${draft.id}: missing ${language} content`);
      if (!draft.artifact?.[language]) errors.push(`${draft.id}: missing ${language} artifact`);
    }
    if (draft.promotionState !== 'draft' || draft.review?.humanApprovalRequired !== true) errors.push(`${draft.id}: publish protection missing`);
  }
  return { valid: errors.length === 0, errors, count: result.drafts?.length ?? 0 };
}
