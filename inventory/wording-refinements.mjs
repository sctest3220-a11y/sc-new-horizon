// Wording-only changes for bilingual review drafts. Audit records are immutable.
import { englishWordingCheckpoints, applyEnglishWordingCheckpoint } from './english-wording-checkpoints.mjs';
import { applyFeedbackCheckpoint } from './feedback-checkpoints.mjs';
export const refinementVersion = '2026-10-01.1';
export const rulesVersion = '2.1 + provisional 2.2-draft';
export const artifactVersion = '1.3';

const core = 'NH-CORE-GENERAL-D1-CORE-CONCEPTS-AWARENESS-';
export const checkpoints = {
  [core + '02']: {
    context: ['A community learning group uses an AI tool to prepare a workshop guide for people with no AI background.\n\nThe AI tool returns passages copied word for word from reviewed learning materials. Each passage includes an ID identifying the source it came from.', 'กลุ่มเรียนรู้ในชุมชนใช้เครื่องมือ AI จัดทำคู่มือฝึกปฏิบัติสำหรับผู้ที่ไม่มีพื้นฐาน AI\n\nเครื่องมือ AI แสดงข้อความตามต้นฉบับจากสื่อการเรียนรู้ที่ผ่านการตรวจทาน แต่ละข้อความมีรหัสระบุแหล่งที่มา'],
    prompt: ['Which description best matches what the tool is doing?', 'ข้อใดอธิบายการทำงานของเครื่องมือ AI นี้ได้ตรงที่สุด'],
    labels: [
      ['Coordinating a language model, search, access permissions and review tools.', 'ใช้โมเดลภาษา การค้นหา สิทธิ์การเข้าถึง และเครื่องมือตรวจทานร่วมกัน'],
      ['Following a fixed rule to select approved text.', 'เลือกข้อความที่ผ่านการอนุมัติตามกฎที่กำหนดไว้'],
      ['Generating an answer without retrieving supporting sources.', 'สร้างคำตอบโดยไม่ดึงข้อมูลจากแหล่งสนับสนุน'],
      ['Retrieving exact passages from reviewed sources.', 'ดึงข้อความตามต้นฉบับจากแหล่งข้อมูลที่ผ่านการตรวจทาน'],
    ],
    explanation: ['The AI tool returns existing source passages with their IDs. This describes retrieval. The scenario does not establish a fixed selection rule, new text generation or coordination of all the components in A. Other processes can coexist with retrieval; D best describes the observed behavior.', 'เครื่องมือ AI แสดงข้อความที่มีอยู่ในแหล่งข้อมูลพร้อมรหัสอ้างอิง จึงเป็นการดึงข้อมูล สถานการณ์ไม่ได้ระบุว่ามีกฎเลือกข้อความตายตัว การสร้างข้อความใหม่ หรือการใช้ส่วนประกอบทั้งหมดในข้อ A ร่วมกัน กระบวนการอื่นอาจทำงานร่วมกับการดึงข้อมูลได้ แต่ข้อ D ตรงกับพฤติกรรมที่แสดงที่สุด'],
  },
  [core + '03']: {
    context: ['A small business uses an automated tool to prepare a service report from approved service records. The report must leave out details that identify customers.\n\nWhen preset conditions are met, the tool automatically inserts pre-approved text into the report.', 'ธุรกิจขนาดเล็กใช้เครื่องมืออัตโนมัติจัดทำรายงานบริการจากบันทึกบริการที่ผ่านการอนุมัติ รายงานต้องไม่มีรายละเอียดที่ระบุตัวลูกค้าได้\n\nเมื่อเข้าเงื่อนไขที่กำหนดไว้ เครื่องมือจะแทรกข้อความที่ผ่านการอนุมัติลงในรายงานโดยอัตโนมัติ'],
    prompt: ['Which description best explains how the tool selects text for the report?', 'ข้อใดอธิบายวิธีที่เครื่องมือเลือกข้อความสำหรับรายงานได้ตรงที่สุด'],
    labels: [
      ['Following a fixed rule to select approved text.', 'เลือกข้อความที่ผ่านการอนุมัติตามกฎที่กำหนดไว้'],
      ['Generating an answer without retrieving supporting sources.', 'สร้างคำตอบโดยไม่ดึงข้อมูลจากแหล่งสนับสนุน'],
      ['Coordinating a language model, search, access permissions and review tools.', 'ใช้โมเดลภาษา การค้นหา สิทธิ์การเข้าถึง และเครื่องมือตรวจทานร่วมกัน'],
      ['Retrieving exact passages from approved sources.', 'ดึงข้อความตามต้นฉบับจากแหล่งข้อมูลที่ผ่านการอนุมัติ'],
    ],
    explanation: ['The preset condition determines which approved text is inserted. A best describes that selection method. The process may also retrieve text, but insertion alone does not establish language-model generation. The privacy requirement is a report requirement; the source does not say it was given in a prompt.', 'เงื่อนไขที่กำหนดไว้เป็นตัวตัดสินว่าจะใส่ข้อความที่อนุมัติไว้ข้อความใด ข้อ A จึงตรงกับวิธีเลือกข้อความที่สุด กระบวนการนี้อาจดึงข้อมูลด้วย แต่การแทรกข้อความไม่ได้ยืนยันว่ามีโมเดลภาษาสร้างข้อความ ข้อกำหนดเรื่องข้อมูลลูกค้าเป็นข้อกำหนดของรายงาน โดยต้นฉบับไม่ได้ระบุว่าใส่ไว้ใน Prompt'],
  },
  [core + '04']: {
    context: ['An internal support team uses an AI tool to prepare support responses.\n\nThe AI tool searches up-to-date support articles and uses a large language model (LLM) to draft a response. It also manages access permissions and provides a screen for staff to review the draft. Staff must approve the response before it is sent.', 'ทีมสนับสนุนภายในใช้เครื่องมือ AI ร่างคำตอบให้บริการ\n\nเครื่องมือ AI ค้นบทความสนับสนุนที่เป็นปัจจุบันและใช้โมเดลภาษาขนาดใหญ่ (LLM) ร่างคำตอบ เครื่องมือ AI ยังจัดการสิทธิ์การเข้าถึงและมีหน้าจอให้เจ้าหน้าที่ตรวจทานร่าง เจ้าหน้าที่ต้องอนุมัติคำตอบก่อนส่ง'],
    prompt: ['Which description best matches how the AI tool works as a whole?', 'ข้อใดอธิบายการทำงานโดยรวมของเครื่องมือ AI นี้ได้ตรงที่สุด'],
    labels: [
      ['Following a fixed rule to select approved text.', 'เลือกข้อความที่ผ่านการอนุมัติตามกฎที่กำหนดไว้'],
      ['Coordinating a large language model (LLM), search, access permissions and review tools.', 'ใช้โมเดลภาษาขนาดใหญ่ (LLM) การค้นหา สิทธิ์การเข้าถึง และเครื่องมือตรวจทานร่วมกัน'],
      ['Generating an answer without retrieving supporting sources.', 'สร้างคำตอบโดยไม่ดึงข้อมูลจากแหล่งสนับสนุน'],
      ['Retrieving exact passages from approved sources.', 'ดึงข้อความตามต้นฉบับจากแหล่งข้อมูลที่ผ่านการอนุมัติ'],
    ],
    explanation: ['The application brings together several components: searching for information, drafting a response, managing access and supporting staff review. B describes the complete workflow. Retrieving passages, as described in D, would explain only part of it.', 'แอปพลิเคชันใช้การค้นข้อมูล การร่างคำตอบ การจัดการสิทธิ์ และการตรวจทานโดยเจ้าหน้าที่ร่วมกัน ข้อ B อธิบายการทำงานทั้งหมด ส่วนการดึงข้อความในข้อ D อธิบายได้เพียงส่วนหนึ่ง'],
  },
};

// Sentence-level, bilingual edits with narrow evidence conditions. Never infer
// prompt contents, replace all models with LLMs, or invent a missing metric.
export function refineQuestion(question, register) {
  const d = question.userFacingDraft;
  if (!d) return [];
  const feedbackChanges = applyFeedbackCheckpoint(question, register);
  if (feedbackChanges !== null) return feedbackChanges;
  if (englishWordingCheckpoints[question.id]) return applyEnglishWordingCheckpoint(question);
  const changes = [];
  const checkpoint = checkpoints[question.id];
  const setPair = (obj, key, thObj, thKey, [en, th]) => {
    if (obj[key] !== en || thObj[thKey] !== th) changes.push(key);
    obj[key] = en; thObj[thKey] = th; register(en, th);
  };
  if (checkpoint) {
    for (const key of ['context', 'prompt', 'explanation']) setPair(d, key, d.th, key, checkpoint[key]);
    d.options.forEach((o, i) => setPair(o, 'label', o, 'thLabel', checkpoint.labels[i]));
    d.wordingReviewSource = 'docs/QUESTION_REWRITE_RULE_REVIEW_LOG.md#core-concepts-wording-checkpoints---1-october-2026';
    return changes;
  }
  // Previously selected wording must not be overwritten by a general rule pass.
  if (d.reviewedWordingSource) return changes;
  const source = question.sourceScenario;
  // The historical live-bank export has different source semantics: inspect and
  // report it, but do not assume every mention of an assistant is an AI actor.
  if (!source) return changes;
  const fixed = /follows a fixed if-then rule and copies an approved sentence/.test(source.evidence);
  const fields = [[d, 'context', d.th, 'context'], [d, 'prompt', d.th, 'prompt'], [d, 'explanation', d.th, 'explanation'],
    ...(d.options ?? []).map(o => [o, 'label', o, 'thLabel']),
    ...(d.parts ?? []).flatMap(p => [[p, 'prompt', p, 'thPrompt'], ...p.options.map(o => [o, 'label', o, 'thLabel'])])];
  for (const [obj, key, thObj, thKey] of fields) {
    const old = obj[key], oldTh = thObj[thKey]; let en = old, th = oldTh;
    if (typeof en !== 'string' || typeof th !== 'string') continue;
    if (key === 'context' && /\b[Tt]he assistant\b/.test(en)) {
      en = en.replace(/\bThe assistant\b/g, 'The AI tool').replace(/\bthe assistant\b/g, 'the AI tool');
      th = th.replaceAll('ผู้ช่วย', 'เครื่องมือ AI ');
    }
    if (fixed && key === 'context') {
      en = en.replace('uses AI to prepare', 'uses an automated tool to prepare');
      th = th.replace('ใช้ AI เพื่อจัดทำ', 'ใช้เครื่องมืออัตโนมัติเพื่อจัดทำ');
      en = en.replace('The system follows a fixed if-then rule and copies an approved sentence.', 'When a preset condition is met, the system automatically inserts pre-approved text.');
      th = th.replace('ระบบทำตามกฎถ้า-แล้วตายตัวและคัดลอกประโยคที่อนุมัติ', 'เมื่อเข้าเงื่อนไขที่กำหนดไว้ ระบบจะแทรกข้อความที่ผ่านการอนุมัติโดยอัตโนมัติ');
    }
    if (fixed && key === 'prompt') {
      en = en.replace('What is the AI tool doing in', 'How does the automated tool select text for');
      th = th.replace('เครื่องมือ AI ทำอะไรใน', 'เครื่องมืออัตโนมัติเลือกข้อความอย่างไรสำหรับ');
    }
    if (source.deliverable === 'service briefing') {
      en = en.replaceAll('service briefing', 'service report').replaceAll('Customer identifiers must stay out of the briefing.', 'The report must leave out details that identify customers.');
      th = th.replaceAll('สรุปข้อมูลบริการ', 'รายงานบริการ').replaceAll('สรุปข้อมูลต้องไม่มีข้อมูลระบุตัวลูกค้า', 'รายงานต้องไม่มีรายละเอียดที่ระบุตัวลูกค้าได้');
    }
    if (key === 'context') th = th.replace(/เครื่องมือ AI(?=[\u0e00-\u0e7f])/g, 'เครื่องมือ AI ');
    if (en !== old || th !== oldTh) setPair(obj, key, thObj, thKey, [en, th]);
  }
  return changes;
}

export function inspectQuestion(q) {
  const d = q.userFacingDraft, issues = [];
  if (!d) return ['No user-facing draft is available.'];
  if (d.format === 'matching' && d.interaction !== 'match') issues.push('Format label says matching, but the selected interaction is a single choice. Interaction and label preserved pending explicit format decision.');
  if (d.interaction === 'rank' && !d.rankingKey) issues.push('Check that the complete ranking key and scoring are defined before release.');
  if (d.interaction === 'multi' && d.correctOptionIds?.length === 1) issues.push('Selected multi-select has one correct answer; no extra key was invented.');
  if (d.interaction === 'parts' && !d.scoring) issues.push('Per-part scoring is not defined in this draft; do not transfer audit combined-choice scores.');
  const text = [d.context, d.prompt, ...(d.parts ?? []).flatMap(p => [p.prompt, ...p.options.map(o => o.label)]), ...(d.options ?? []).map(o => o.label)].join('\n');
  if (/both interpretations|missing exception/i.test(text) && !/interpretation|exception/i.test(d.context)) issues.push('An option may refer to interpretations or an exception not established in the scenario.');
  if (/estimates?/i.test(text) && !/estimate (?:the|a|an)|refund amount|forecast|cost|time|value|demand|revenue|probability|sales/i.test(text)) issues.push('The object of an estimate may be unspecified; do not invent an amount or time.');
  if (/uses AI to prepare/.test(d.context) && /fixed if-then/.test(q.sourceScenario?.evidence ?? '')) issues.push('Check whether the actor should be described as automation rather than AI.');
  return issues;
}

export const neutralArtifactCopy = {
  'source-comparison-pack': ['Source excerpts with document IDs, versions, dates and scope needed for the question. Present all excerpts neutrally.', 'ข้อความจากแหล่งข้อมูลพร้อมรหัสเอกสาร รุ่น วันที่ และขอบเขตที่จำเป็นต่อคำถาม แสดงทุกข้อความอย่างเป็นกลาง'],
  'workflow-trace': ['A workflow record showing the relevant actions, permissions, approvals and outcomes without marking the correct diagnosis.', 'บันทึกขั้นตอนงานที่แสดงการกระทำ สิทธิ์ การอนุมัติ และผลลัพธ์ที่เกี่ยวข้อง โดยไม่ระบุคำวินิจฉัยที่ถูกต้อง'],
  'media-asset-review': ['A task brief, proposed media and relevant source or permission records. Show the objective and intended use clearly.', 'สรุปงาน สื่อที่เสนอ และแหล่งข้อมูลหรือสิทธิ์ใช้งานที่เกี่ยวข้อง ระบุเป้าหมายและการใช้งานที่ต้องการให้ชัดเจน'],
  'security-audit-log': ['A realistic access or audit record containing only the identities, scopes, actions and authorization evidence needed for the decision.', 'บันทึกการเข้าถึงหรือการตรวจสอบที่สมจริง มีเฉพาะตัวตน ขอบเขต การกระทำ และหลักฐานการอนุญาตที่จำเป็นต่อการตัดสินใจ'],
  'data-chart-dashboard': ['A clearly labeled table or chart with the task outcome, units, comparison basis and relevant sample or scope. Check all calculations.', 'ตารางหรือกราฟที่มีป้ายกำกับชัดเจน ระบุผลของงาน หน่วย ฐานเปรียบเทียบ และกลุ่มตัวอย่างหรือขอบเขตที่เกี่ยวข้อง ตรวจการคำนวณทั้งหมด'],
  'communication-thread': ['A realistic message or ticket containing only the communication evidence needed for this question, with clear speakers and sequence.', 'ข้อความหรือคำขอรับบริการที่สมจริง มีเฉพาะหลักฐานการสื่อสารที่จำเป็นต่อคำถาม พร้อมระบุผู้พูดและลำดับให้ชัดเจน'],
  'policy-excerpt': ['A policy excerpt with the version, scope and applicable terms required to answer the question, without answer-revealing annotations.', 'ข้อความนโยบายพร้อมรุ่น ขอบเขต และเงื่อนไขที่จำเป็นต่อคำถาม โดยไม่มีคำอธิบายกำกับที่บอกคำตอบ'],
};
export const generationSuffix = [
  'Use only facts supported by the scenario. Label any proposed fictional additions for review. Do not add highlighted errors, warning verdicts, invented risks or corrective answers. Define labels and scores. Avoid repeating the scenario. Preserve equivalent English and Thai evidence and record unverified release checks.',
  'ใช้เฉพาะข้อเท็จจริงที่สถานการณ์รองรับ ระบุข้อมูลสมมติที่เสนอเพิ่มเพื่อให้ตรวจทาน ห้ามเน้นจุดผิด ใส่คำตัดสินเตือน แต่งความเสี่ยง หรือบอกวิธีแก้ที่เป็นคำตอบ อธิบายป้ายกำกับและคะแนน หลีกเลี่ยงข้อมูลซ้ำกับสถานการณ์ รักษาหลักฐานภาษาอังกฤษและไทยให้เทียบเท่ากัน และบันทึกการตรวจความพร้อมเผยแพร่ที่ยังไม่ได้ทำ',
];
