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

const defaultScoring = (format) => format === 'written'
  ? { maxPoints: 4, method: 'rubric', partialCredit: true, rubric: ['Evidence/source check', 'Risk or limitation identified', 'Human control or next step', 'Clear, actionable reasoning'] }
  : format === 'multi'
    ? { maxPoints: 3, method: 'per-option', partialCredit: true, penalty: 'No penalty below zero; unsafe selections receive zero for the item' }
    : format === 'rank'
      ? { maxPoints: 4, method: 'position-match', partialCredit: true }
      : { maxPoints: 1, method: 'exact-match', partialCredit: false };

function bilingualQuestion(key, format, content, artifact, metadata = {}) {
  const id = `NH-AGENT-${key.toUpperCase()}-${hash(JSON.stringify(content))}`;
  return { id, version: 'agent-draft-1', status: 'draft', promotionState: 'draft', locale: 'en-th', format, interaction: format, category: metadata.category ?? 'AI governance', domain: metadata.domain ?? 'D4', difficulty: metadata.difficulty ?? 'applied', role: metadata.role ?? 'cross-functional operator', competency: metadata.competency ?? 'Evidence-based AI decisions', content, answerKey: metadata.answerKey ?? null, scoring: metadata.scoring ?? defaultScoring(format), artifact, review: { humanApprovalRequired: true, qa: 'pending', duplicateCheck: 'passed' } };
}

export function generateQuestionDrafts({ formats = QUESTION_FORMATS, includeArtifacts = true } = {}) {
  const drafts = [];
  const add = (key, format, data, artifactKey = key, metadata = {}) => drafts.push(bilingualQuestion(key, format, { en: data.en, th: data.th }, includeArtifacts ? { en: artifactFor(artifactKey, 'en'), th: artifactFor(artifactKey, 'th') } : null, metadata));
  if (formats.includes('single')) add('source-check', 'single', { en: { context: en.singleContext, prompt: en.singlePrompt, options: en.singleOptions, correctOptionIds: ['a'], explanation: 'The team must establish evidence and access before trusting the generated summary.' }, th: { context: th.singleContext, prompt: th.singlePrompt, options: th.singleOptions, correctOptionIds: ['a'], explanation: 'ควรตรวจหลักฐานและสิทธิ์ก่อนเชื่อถือสรุปที่สร้างขึ้น' } });
  if (formats.includes('multi')) add('agent-controls', 'multi', { en: { context: en.multiContext, prompt: en.multiPrompt, options: en.multiOptions, correctOptionIds: ['a', 'b', 'c'], explanation: 'Least privilege, approval, and logs bound the Agent; self-expansion is unsafe.' }, th: { context: th.multiContext, prompt: th.multiPrompt, options: th.multiOptions, correctOptionIds: ['a', 'b', 'c'], explanation: 'จำกัดสิทธิ์ ขออนุมัติ และบันทึกการทำงานช่วยควบคุม Agent การเพิ่มสิทธิ์เองไม่ปลอดภัย' } });
  if (formats.includes('rank')) add('rag-release', 'rank', { en: { context: en.rankContext, prompt: en.rankPrompt, steps: en.rankSteps, correctOrder: [0, 1, 2, 3], explanation: 'Validate the corpus and expected behaviour before bounded deployment.' }, th: { context: th.rankContext, prompt: th.rankPrompt, steps: th.rankSteps, correctOrder: [0, 1, 2, 3], explanation: 'ตรวจคลังข้อมูลและพฤติกรรมที่คาดหวังก่อนเปิดใช้แบบจำกัดขอบเขต' } });
  if (formats.includes('match')) add('risk-signals', 'match', { en: { context: en.matchContext, prompt: en.matchPrompt, pairs: en.matchPairs, explanation: 'Each signal points to a distinct control concern.' }, th: { context: th.matchContext, prompt: th.matchPrompt, pairs: th.matchPairs, explanation: 'สัญญาณแต่ละรายการชี้ไปยังประเด็นควบคุมที่แตกต่างกัน' } });
  if (formats.includes('written')) add('evidence-plan', 'written', { en: { context: en.writtenContext, prompt: en.writtenPrompt, rubricKeywords: en.writtenKeywords, explanation: 'A strong plan checks evidence, states limitations, preserves human approval, and records the basis.' }, th: { context: th.writtenContext, prompt: th.writtenPrompt, rubricKeywords: th.writtenKeywords, explanation: 'แผนที่ดีต้องตรวจหลักฐาน ระบุข้อจำกัด มีการอนุมัติของมนุษย์ และบันทึกที่มา' } });
  if (formats.includes('multi-part')) add('permission-boundary', 'multi-part', { en: { context: en.partContext, prompt: en.partPrompt, parts: [{ id: 'diagnosis', prompt: 'What is the primary issue?', options: ['Unauthorised evidence access', 'Slow generation', 'A spelling error'], correctOptionIds: ['a'] }, { id: 'control', prompt: 'What should happen next?', options: ['Block the citation and review access', 'Send the email automatically', 'Grant broader access'], correctOptionIds: ['a'] }] }, th: { context: th.partContext, prompt: th.partPrompt, parts: [{ id: 'diagnosis', prompt: 'ปัญหาหลักคืออะไร', options: ['การเข้าถึงหลักฐานโดยไม่มีสิทธิ์', 'การสร้างคำตอบช้า', 'การสะกดคำผิด'], correctOptionIds: ['a'] }, { id: 'control', prompt: 'ควรทำอะไรต่อไป', options: ['บล็อกการอ้างอิงและตรวจสิทธิ์', 'ส่งอีเมลอัตโนมัติ', 'เพิ่มสิทธิ์ให้กว้างขึ้น'], correctOptionIds: ['a'] }] } });
  if (formats.includes('single')) add('privacy-purpose', 'single', { en: { context: 'A team wants to reuse customer support transcripts to train a new marketing model. The original notice covered service improvement only.', prompt: 'What should the product manager do first?', options: ['Check purpose limitation and obtain an approved basis', 'Reuse the transcripts because the company already owns them', 'Remove the customer names and proceed without review', 'Ask the model to decide whether reuse is acceptable'], correctOptionIds: ['a'], explanation: 'A new purpose requires a documented legal, policy, and governance check before reuse.' }, th: { context: 'ทีมต้องการนำบันทึกบริการลูกค้าไปฝึก Model การตลาดใหม่ แต่ประกาศเดิมครอบคลุมเฉพาะการปรับปรุงบริการ', prompt: 'Product Manager ควรทำอะไรเป็นอันดับแรก', options: ['ตรวจข้อจำกัดด้านวัตถุประสงค์และขอฐานการใช้ที่อนุมัติ', 'นำไปใช้เพราะบริษัทเป็นเจ้าของข้อมูลแล้ว', 'ลบชื่อลูกค้าแล้วใช้ได้โดยไม่ต้องตรวจทาน', 'ให้ Model ตัดสินว่าการใช้ซ้ำยอมรับได้หรือไม่'], correctOptionIds: ['a'], explanation: 'วัตถุประสงค์ใหม่ต้องผ่านการตรวจด้านกฎหมาย นโยบาย และธรรมาภิบาลก่อน' } }, 'privacy-purpose', { category: 'Privacy and responsible AI', domain: 'D4', difficulty: 'proficient', role: 'product manager', competency: 'Purpose limitation and data governance' });
  if (formats.includes('multi')) add('eval-quality', 'multi', { en: { context: 'An analyst compares two AI summarizers using only five easy examples.', prompt: 'Which changes would make the evaluation more credible? Select all that apply.', options: ['Use a representative and difficult test set', 'Define success criteria before comparing models', 'Report failures and uncertainty, not only the average', 'Choose the model with the most confident wording'], correctOptionIds: ['a', 'b', 'c'], explanation: 'Coverage, predeclared criteria, and failure reporting reduce misleading evaluation.' }, th: { context: 'นักวิเคราะห์เปรียบเทียบระบบสรุป AI สองระบบโดยใช้ตัวอย่างง่ายเพียงห้ารายการ', prompt: 'ข้อใดทำให้การประเมินน่าเชื่อถือขึ้น เลือกได้หลายข้อ', options: ['ใช้ชุดทดสอบที่ครอบคลุมและมีกรณียาก', 'กำหนดเกณฑ์ความสำเร็จก่อนเปรียบเทียบ Model', 'รายงานความล้มเหลวและความไม่แน่นอน ไม่ใช่เฉพาะค่าเฉลี่ย', 'เลือก Model ที่ใช้ถ้อยคำมั่นใจที่สุด'], correctOptionIds: ['a', 'b', 'c'], explanation: 'ความครอบคลุม เกณฑ์ที่กำหนดล่วงหน้า และการรายงานความล้มเหลวช่วยลดการประเมินที่ทำให้เข้าใจผิด' } }, 'eval-quality', { category: 'Evaluation and measurement', domain: 'D3', difficulty: 'proficient', role: 'AI analyst', competency: 'Evaluation design' });
  if (formats.includes('rank')) add('incident-response', 'rank', { en: { context: 'A production Agent sent a message using an unapproved customer record.', prompt: 'Rank the response steps from first to last.', steps: ['Stop or contain the affected action', 'Preserve logs and identify the scope', 'Notify the responsible owner and assess impact', 'Correct the workflow and verify the fix'], correctOrder: [0, 1, 2, 3], explanation: 'Containment and evidence preservation come before remediation and verification.' }, th: { context: 'Agent ในระบบจริงส่งข้อความโดยใช้บันทึกลูกค้าที่ไม่ได้รับอนุมัติ', prompt: 'จัดลำดับขั้นตอนตอบสนองจากก่อนถึงหลัง', steps: ['หยุดหรือจำกัดการทำงานที่ได้รับผลกระทบ', 'เก็บ Log และระบุขอบเขต', 'แจ้งเจ้าของงานและประเมินผลกระทบ', 'แก้ Workflow และตรวจยืนยันการแก้ไข'], correctOrder: [0, 1, 2, 3], explanation: 'ต้องจำกัดเหตุการณ์และเก็บหลักฐานก่อนแก้ไขและตรวจยืนยัน' } }, 'incident-response', { category: 'Safety and incident response', domain: 'D4', difficulty: 'advanced', role: 'risk and compliance reviewer', competency: 'Incident containment and auditability' });
  if (formats.includes('written')) add('executive-decision', 'written', { en: { context: 'An executive sponsor wants to automate a high-impact eligibility decision because a pilot improved speed. The pilot has no subgroup analysis or appeal process.', prompt: 'Write the recommendation you would give before scale-up.', rubricKeywords: ['request subgroup or fairness analysis', 'define human review or appeal', 'check evidence beyond speed', 'recommend bounded pilot or no-go'], explanation: 'Speed alone is insufficient for a high-impact decision; the recommendation must address fairness, recourse, and evidence quality.' }, th: { context: 'ผู้บริหารต้องการทำให้การตัดสินสิทธิ์ที่มีผลกระทบสูงเป็นอัตโนมัติเพราะ Pilot เร็วขึ้น แต่ยังไม่มีการวิเคราะห์กลุ่มย่อยหรือช่องทางอุทธรณ์', prompt: 'เขียนคำแนะนำก่อนขยายระบบ', rubricKeywords: ['ขอวิเคราะห์ความเป็นธรรมของกลุ่มย่อย', 'กำหนดการตรวจทานหรืออุทธรณ์โดยมนุษย์', 'ตรวจหลักฐานนอกเหนือจากความเร็ว', 'เสนอ Pilot แบบจำกัดหรือไม่อนุมัติ'], explanation: 'ความเร็วอย่างเดียวไม่พอสำหรับการตัดสินใจที่มีผลกระทบสูง ต้องพิจารณาความเป็นธรรม สิทธิอุทธรณ์ และคุณภาพหลักฐาน' } }, 'executive-decision', { category: 'Leadership and responsible adoption', domain: 'D6', difficulty: 'advanced', role: 'executive sponsor', competency: 'Governance trade-offs' });
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
