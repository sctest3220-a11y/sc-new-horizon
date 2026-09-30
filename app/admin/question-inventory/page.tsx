import Link from 'next/link';
import { headers } from 'next/headers';
import { ReviewerFeedback } from './reviewer-feedback';
import { QuestionReviewStats, ReviewFilterControls } from './review-controls';
import { ReviewSync } from './review-sync';

type ReviewOption = {
  id: string;
  label: string;
  thLabel?: string;
  score?: number;
};

type ReviewQuestion = {
  id: string;
  sourceInventory?: string;
  sourceBank?: string;
  layer: string;
  scope: string;
  scopeLabel: string;
  domain: string;
  competencyIds: string[];
  competencyLabel: string;
  difficulty: string;
  cognitiveTask: string;
  prompt: string;
  context: string;
  options: ReviewOption[];
  correctOptionIds: string[];
  rationale: string;
  recommendedFormat?: {
    format: string;
    interaction: string;
    reason: string;
    rewritePrompt: string;
    sampleParts?: {
      prompt: string;
      expectedEvidence: string;
    }[];
  };
  userFacingDraft?: {
    status: string;
    interaction: string;
    format: string;
    context: string;
    prompt: string;
    th?: {
      context?: string;
      prompt?: string;
      explanation?: string;
      rewriteNotes?: string;
    };
    options?: ReviewOption[];
    correctOptionIds?: string[];
    parts?: {
      id: string;
      prompt: string;
      thPrompt?: string;
      options: ReviewOption[];
      correctOptionIds: string[];
    }[];
    explanation: string;
    rewriteNotes: string;
  };
  artifactNeed?: ArtifactNeed;
  th?: {
    context?: string;
    prompt?: string;
    rationale?: string;
  };
  functionTracks?: string[];
  functionLabels?: string[];
  industryTracks?: string[];
  industryLabels?: string[];
  executiveRoles?: string[];
  executiveLabels?: string[];
  review?: {
    status?: string;
  };
};

type InventorySummary = {
  inventoryVersion: string;
  status: string;
  liveIntegration: boolean;
  draftCount: number;
  liveCount: number;
  artifactCounts: ArtifactNeedsPayload['counts'] | null;
};

// Light per-question record from index.json. Carries only what filtering,
// counting and search need; full records are fetched per visible question.
type IndexQuestion = Pick<
  ReviewQuestion,
  | 'id'
  | 'domain'
  | 'difficulty'
  | 'layer'
  | 'scopeLabel'
  | 'competencyLabel'
  | 'prompt'
  | 'sourceInventory'
  | 'sourceBank'
  | 'functionTracks'
  | 'industryTracks'
  | 'executiveRoles'
> & {
  recommendedFormat?: { format: string };
  userFacingDraft?: { format: string };
};

type ArtifactNeed = {
  id: string;
  need: string;
  artifactType: string;
  artifactLabel: string;
  artifactBrief: string;
  generationPrompt?: string;
  prompt?: string;
  th?: {
    need?: string;
    artifactLabel?: string;
    artifactBrief?: string;
    prompt?: string;
  };
};

type ArtifactNeedsPayload = {
  counts: {
    artifactCandidates: number;
    byNeed: Record<string, number>;
    byType: Record<string, number>;
  };
  candidates: ArtifactNeed[];
};

const domainLabels: Record<string, string> = {
  D1: 'Foundations',
  D2: 'Application',
  D3: 'Evaluation',
  D4: 'Governance',
  D5: 'Strategy',
  D6: 'Collaboration',
};

const fallbackProfileLabels: Record<string, string> = {
  customerService: 'Customer service',
  education: 'Education',
  finance: 'Finance',
  financial: 'Financial services',
  general: 'General',
  healthcare: 'Healthcare',
  marketing: 'Marketing',
  operations: 'Operations',
  people: 'People / HR',
  public: 'Public sector',
  retail: 'Retail',
  sales: 'Sales',
  technical: 'Technical / IT',
};

// The exports under exports/review-inventory are ~28 MB and this page renders in
// the Cloudflare worker runtime, which has no host filesystem. Both problems are
// solved by scripts/build-review-inventory-assets.mjs, which emits the inventory
// under public/review-inventory; we read it back over same-origin requests.
async function assetOrigin() {
  const requestHeaders = await headers();
  const host = requestHeaders.get('host') ?? 'localhost:3000';
  const forwardedProtocol = requestHeaders.get('x-forwarded-proto');
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  return `${forwardedProtocol ?? (isLocal ? 'http' : 'https')}://${host}`;
}

async function loadAsset<T>(origin: string, assetPath: string): Promise<T | null> {
  const response = await fetch(new URL(assetPath, origin));
  if (!response.ok) return null;
  return (await response.json()) as T;
}

// Must match safeFileName() in scripts/build-review-inventory-assets.mjs.
function detailFileName(id: string) {
  return id.replace(/[^A-Za-z0-9._-]/g, '_');
}

async function loadQuestionDetails(origin: string, ids: string[]) {
  const questions: ReviewQuestion[] = [];
  const batchSize = 12;
  for (let start = 0; start < ids.length; start += batchSize) {
    const batch = await Promise.all(
      ids
        .slice(start, start + batchSize)
        .map((id) => loadAsset<ReviewQuestion>(origin, `/review-inventory/detail/${detailFileName(id)}.json`)),
    );
    for (const question of batch) {
      if (question) questions.push(question);
    }
  }
  return questions;
}

function countBy<T extends string>(items: IndexQuestion[], getter: (item: IndexQuestion) => T) {
  return items.reduce<Record<string, number>>((counts, item) => {
    const key = getter(item) || 'Unspecified';
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function uniqueValues<T>(items: T[], getter: (item: T) => string | undefined) {
  return Array.from(new Set(items.map(getter).filter(Boolean))).sort();
}

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function titleCaseId(value: string) {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function labelForProfile(value: string) {
  return fallbackProfileLabels[value] ?? titleCaseId(value);
}

const thaiSentencePatterns: Array<[RegExp, string]> = [
  [/What is the AI tool doing in this (.*?)\?/g, 'เครื่องมือ AI กำลังทำอะไรใน$1นี้'],
  [/What is the AI tool doing in (.*?)\?/g, 'เครื่องมือ AI กำลังทำอะไรใน$1'],
  [/(.*?) uses AI to prepare an? (.*?)\. The assistant writes an answer using its language model, but it does not search (.*?)\. (.*?)\./g, '$1ใช้ AI ช่วยจัดทำ$2 โดย Assistant สร้างคำตอบด้วยโมเดลภาษา แต่ไม่ได้ค้นหาใน$3 $4.'],
  [/The assistant writes an answer using its language model, but it does not search (.*?)\./g, 'Assistant สร้างคำตอบด้วยโมเดลภาษา แต่ไม่ได้ค้นหาใน$1'],
  [/The assistant returns exact passages with record identifiers from (.*?)\./g, 'Assistant ดึงข้อความตรงจาก$1พร้อมรหัสอ้างอิงข้อมูล'],
  [/The system follows a fixed if-then rule and copies an approved sentence\./g, 'ระบบทำตามกฎ if-then ที่กำหนดไว้และคัดลอกประโยคที่อนุมัติแล้ว'],
  [/The workspace combines a language model, a search index, permissions, and a review screen\./g, 'Workspace ใช้โมเดลภาษา, search index, สิทธิ์ และหน้าจอ review ร่วมกัน'],
  [/(.*?) uses AI to prepare an? (.*?)\./g, '$1ใช้ AI เพื่อเตรียม$2'],
  [/(.*?) uses AI to prepare an? (.*?)\. The assistant writes an answer using its language model, but it does not search (.*?)\. Before the result is used, the team needs to follow this requirement: (.*?)\./g, '$1ใช้ AI เพื่อเตรียม$2 Assistant สร้างคำตอบด้วย language model แต่ไม่ได้ค้นหาข้อมูลจาก$3 ก่อนนำผลลัพธ์ไปใช้ ทีมต้องทำตามข้อกำหนดนี้: $4'],
  [/(.*?) uses AI to prepare an? (.*?)\. The assistant returns exact passages from (.*?), including their record identifiers, instead of writing a new explanation\. (.*?)\./g, '$1ใช้ AI เพื่อเตรียม$2 Assistant ดึงข้อความเดิมจาก$3พร้อมรหัสอ้างอิงข้อมูล แทนที่จะเขียนคำอธิบายใหม่ $4'],
  [/(.*?) uses AI to prepare an? (.*?)\. The system follows a fixed if-then rule and copies an approved sentence; it does not interpret the request with a language model\. (.*?)\./g, '$1ใช้ AI เพื่อเตรียม$2 ระบบทำตามกฎ if-then ที่กำหนดไว้และคัดลอกประโยคที่อนุมัติแล้ว โดยไม่ได้ใช้ language model ตีความคำขอ $3'],
  [/(.*?) uses AI to prepare an? (.*?)\. The workflow combines a language model, a search index, access permissions, and a review screen\. (.*?)\./g, '$1ใช้ AI เพื่อเตรียม$2 Workflow นี้ใช้ language model, search index, สิทธิ์การเข้าถึง และหน้าจอ review ร่วมกัน $3'],
  [/(.*?) uses AI to prepare an? (.*?)\. (.*?) (Only|Every|Customer|Staff|Recommendations|Employment|No payment|Performance|Refunds|Production|Each operational|Account actions|Returns promises|Eligibility decisions|Scaling decisions|Management|Workforce-impacting decisions|Benefits|Scale decisions)(.*?)\./g, '$1ใช้ AI เพื่อเตรียม$2 $3 $4$5.'],
  [/(.*?) uses AI to prepare an? (.*?)\. (.*?) Before the result is used, the team needs to follow this requirement: (.*?)\./g, '$1ใช้ AI เพื่อเตรียม$2 $3 ก่อนนำผลลัพธ์ไปใช้ ทีมต้องทำตามข้อกำหนดนี้: $4'],
  [/(.*?) is preparing an? (.*?) with AI\. The AI composes new draft wording from learned patterns instead of retrieving text from (.*?)\. That matters because (.*?)\./g, '$1กำลังเตรียม$2ด้วย AI. AI เขียนร่างข้อความใหม่จากรูปแบบที่เรียนรู้มา แทนที่จะดึงข้อความจาก$3. ประเด็นนี้สำคัญเพราะ$4'],
  [/(.*?) is preparing an? (.*?) with AI\. The AI returns exact passages from (.*?), including record identifiers, rather than writing a new explanation\. The team still has to follow this rule: (.*?)\./g, '$1กำลังเตรียม$2ด้วย AI. AI ดึงข้อความเดิมจาก$3พร้อมรหัสอ้างอิงข้อมูล แทนที่จะเขียนคำอธิบายใหม่. ทีมยังต้องทำตามกฎนี้: $4'],
  [/(.*?) is preparing an? (.*?) with AI\. The AI is not really interpreting the request; it follows a fixed if-then rule and copies an approved sentence\. The output still has to respect this rule: (.*?)\./g, '$1กำลังเตรียม$2ด้วย AI. AI ไม่ได้ตีความคำขอจริง ๆ แต่ทำตามกฎ if-then ที่กำหนดไว้ และคัดลอกประโยคที่อนุมัติแล้ว. ผลลัพธ์ยังต้องทำตามกฎนี้: $3'],
  [/(.*?) is preparing an? (.*?) with AI\. The workflow uses several parts together: a model, a search index, permissions, and a review screen\. The team needs to understand which setup fits the work because (.*?)\./g, '$1กำลังเตรียม$2ด้วย AI. Workflow นี้ใช้หลายส่วนร่วมกัน: Model, search index, สิทธิ์ และหน้าจอ review. ทีมต้องเข้าใจว่าการตั้งค่าแบบใดเหมาะกับงานนี้ เพราะ$3'],
  [/(.*?) is preparing an? (.*?) with AI\. (.*?) The team has to handle the AI output carefully because (.*?)\./g, '$1กำลังเตรียม$2ด้วย AI. $3 ทีมต้องจัดการผลลัพธ์จาก AI อย่างระมัดระวัง เพราะ$4'],
  [/Create a realistic (.*?)\\. Tailor it to this question: /g, 'สร้าง $1 ที่สมจริง โดยปรับให้เข้ากับคำถามนี้: '],
  [/The system creates new sentences from learned patterns; it has no connection to (.*?)\./g, 'ระบบสร้างประโยคใหม่จากรูปแบบที่เรียนรู้มา แต่ไม่ได้เชื่อมต่อกับ$1'],
  [/The system returns unchanged passages with record identifiers from (.*?)\./g, 'ระบบดึงข้อความเดิมกลับมาโดยไม่เปลี่ยนเนื้อหา พร้อมรหัสอ้างอิงข้อมูลจาก$1'],
  [/The system follows an explicit if-then rule and copies an approved sentence\./g, 'ระบบทำตามกฎ if-then ที่ชัดเจน และคัดลอกประโยคที่อนุมัติแล้ว'],
  [/The (.*?) contains invented details where the supplied records have blank fields\./g, '$1มีรายละเอียดที่ AI แต่งขึ้นในช่องที่ข้อมูลต้นทางเว้นว่างไว้'],
  [/Select all that apply\./g, 'เลือกได้มากกว่าหนึ่งข้อ'],
  [/Which experiment would best isolate the disputed source of performance\? Start by choosing the best first check, then rank follow-up actions during review\./g, 'การทดลองใดจะช่วยแยกสาเหตุของผลลัพธ์ที่ยังถกเถียงกันได้ดีที่สุด เริ่มจากเลือกสิ่งแรกที่ควรตรวจสอบ แล้วจัดลำดับขั้นตอนถัดไป'],
  [/Which experiment would best isolate the disputed source of performance\?/g, 'การทดลองใดจะช่วยแยกสาเหตุของผลลัพธ์ที่ยังถกเถียงกันได้ดีที่สุด'],
  [/What should the team test first\? Start by choosing the best first check, then rank follow-up actions during review\./g, 'ทีมควรทดสอบอะไรก่อน เริ่มจากเลือกสิ่งแรกที่ควรตรวจสอบ แล้วจัดลำดับขั้นตอนถัดไป'],
  [/What should the team test first\?/g, 'ทีมควรทดสอบอะไรก่อน'],
  [/Which next evaluation best addresses the identified uncertainty\?/g, 'การประเมินถัดไปแบบใดจะตอบความไม่แน่นอนที่พบได้ดีที่สุด'],
  [/Which operating rule is best supported by this failure pattern\? Start by choosing the best first check, then rank follow-up actions during review\./g, 'รูปแบบความผิดพลาดนี้สนับสนุนกฎการทำงานข้อใดมากที่สุด เริ่มจากเลือกสิ่งแรกที่ควรตรวจสอบ แล้วจัดลำดับขั้นตอนถัดไป'],
  [/Which operating rule is best supported by this failure pattern\?/g, 'รูปแบบความผิดพลาดนี้สนับสนุนกฎการทำงานข้อใดมากที่สุด'],
  [/Which evidence control would best prevent the observed recurring failure\?/g, 'การควบคุมหลักฐานแบบใดจะช่วยป้องกันปัญหาซ้ำที่พบได้ดีที่สุด'],
  [/Which prompt experiment best isolates the recurring defect\?/g, 'การทดลอง Prompt แบบใดจะช่วยแยกสาเหตุของปัญหาซ้ำได้ดีที่สุด'],
  [/Which security boundary is directly at issue\?/g, 'ขอบเขตความปลอดภัยใดเป็นประเด็นโดยตรง'],
  [/Which action addresses the immediate security gap\?/g, 'การดำเนินการใดแก้ช่องว่างความปลอดภัยเร่งด่วนได้ตรงที่สุด'],
  [/Which mechanism best addresses the stated need\? Select all that apply\./g, 'กลไกใดตอบความต้องการที่ระบุไว้ได้ดีที่สุด เลือกได้มากกว่าหนึ่งข้อ'],
  [/Which mechanism best addresses the stated need\?/g, 'กลไกใดตอบความต้องการที่ระบุไว้ได้ดีที่สุด'],
  [/Which interpretation avoids exceeding the evidence\?/g, 'การตีความใดไม่สรุปเกินหลักฐานที่มี'],
  [/Which conclusion follows from the test result\?/g, 'ข้อสรุปใดสอดคล้องกับผลการทดสอบนี้'],
  [/Which control architecture best addresses this systemic weakness\?/g, 'control architecture แบบใดแก้จุดอ่อนเชิงระบบนี้ได้ดีที่สุด'],
  [/Which statement correctly interprets the supplied evidence\?/g, 'ข้อความใดตีความหลักฐานที่ให้มาได้ถูกต้อง'],
  [/Which statement correctly interprets the supplied (.*?)\?/g, 'ข้อความใดตีความ$1ที่ให้มาได้ถูกต้อง'],
  [/Which interpretation best fits the supplied (.*?)\?/g, 'การตีความใดเหมาะกับ$1ที่ให้มามากที่สุด'],
  [/Which decision rule best addresses the (.*?)\?/g, 'กฎการตัดสินใจใดแก้$1ได้ดีที่สุด'],
  [/Which conclusion follows from the test results\?/g, 'ข้อสรุปใดสอดคล้องกับผลการทดสอบ'],
  [/Which conclusion is strongest given this (.*?)\?/g, 'ข้อสรุปใดหนักแน่นที่สุดจาก$1นี้'],
  [/Which conclusion is supported by this (.*?)\?/g, 'ข้อสรุปใดมี$1นี้สนับสนุน'],
  [/What should they check first\?/g, 'ควรตรวจสอบอะไรก่อน'],
  [/Which next step best addresses the principal feasibility (.*?)\?/g, 'ขั้นตอนถัดไปใดแก้$1ด้านความเป็นไปได้หลักได้ดีที่สุด'],
  [/Which change best meets the (.*?) while addressing the stated (.*?)\?/g, 'การเปลี่ยนแปลงใดตอบ$1ได้ดีที่สุด พร้อมจัดการ$2ที่ระบุไว้'],
  [/Which assessment best reflects the supplied data flow\?/g, 'การประเมินใดสะท้อน data flow ที่ให้มาได้ดีที่สุด'],
  [/Which system-level control addresses the lifecycle weakness\?/g, 'control ระดับระบบใดแก้จุดอ่อนใน lifecycle ได้ดีที่สุด'],
  [/Which statement follows from the exercise\?/g, 'ข้อความใดสอดคล้องกับโจทย์นี้'],
  [/What should the (.*?) do under the supplied exercise rule\?/g, '$1ควรทำอย่างไรภายใต้กฎของโจทย์นี้'],
  [/Which use-case assessment is missing\?/g, 'การประเมิน use case ข้อใดยังขาดอยู่'],
  [/Which calculation or measurement is appropriate\?/g, 'การคำนวณหรือการวัดแบบใดเหมาะสม'],
  [/Which adjustment is necessary before accepting the value claim\?/g, 'ต้องปรับอะไร ก่อนยอมรับ claim เรื่อง value นี้'],
  [/Which implementation fits the stated requirement for (.*?)\?/g, 'การตั้งค่าแบบใดเหมาะกับข้อกำหนดของ $1 มากที่สุด'],
  [/What setup best fits (.*?)\? Select all that apply\./g, 'การตั้งค่าแบบใดเหมาะกับ $1 มากที่สุด เลือกได้มากกว่าหนึ่งข้อ'],
  [/What setup best fits (.*?)\?/g, 'การตั้งค่าแบบใดเหมาะกับ $1 มากที่สุด'],
  [/Which check should resolve the specific evidence gap first\?/g, 'ควรตรวจสอบอะไรเป็นอันดับแรกเพื่อปิดช่องว่างของหลักฐานนี้'],
  [/Which description best matches the system used for (.*?)\?/g, 'คำอธิบายใดตรงกับระบบที่ใช้กับ $1 มากที่สุด'],
  [/What should the (.*?) do about the extra detail\?/g, '$1 ควรทำอย่างไรกับรายละเอียดเพิ่มเติมนี้'],
  [/Start by choosing the best first check, then rank follow-up actions during review\./g, 'เริ่มจากเลือกสิ่งแรกที่ควรตรวจสอบ แล้วจัดลำดับขั้นตอนถัดไป'],
  [/Reviewers should convert sibling options into an explicit sequence before live use\./g, 'ผู้รีวิวควรปรับตัวเลือกให้เป็นลำดับขั้นตอนที่ชัดเจนก่อนนำไปใช้จริง'],
];

const thaiExactPhrases: Record<string, string> = {
  'Which prompt repair most directly fixes the observed failure?': 'ควรแก้ Prompt อย่างไรจึงจะแก้ปัญหาที่พบได้ตรงจุดที่สุด',
  'Which prompt repair most directly fixes the observed failure? Select all that apply.': 'ควรแก้ Prompt อย่างไรจึงจะแก้ปัญหาที่พบได้ตรงจุดที่สุด เลือกได้มากกว่าหนึ่งข้อ',
  'The text uses expert vocabulary for an audience new to the topic.': 'เนื้อหาใช้คำศัพท์เฉพาะที่ยากเกินไปสำหรับผู้อ่านที่ยังไม่คุ้นเคยกับหัวข้อนี้',
  'The content is accurate, but a downstream form rejects inconsistent field names.': 'เนื้อหาถูกต้อง แต่แบบฟอร์มในขั้นตอนถัดไปไม่รับข้อมูล เพราะชื่อช่องข้อมูลไม่เหมือนกันทุกครั้ง',
  'The response summarizes the whole source although only differences between versions are needed.': 'คำตอบสรุปข้อมูลต้นฉบับทั้งหมด ทั้งที่ผู้ใช้ต้องการเฉพาะส่วนที่แตกต่างกันระหว่างแต่ละเวอร์ชัน',
  'The service briefing contains invented details where the supplied records have blank fields.': 'สรุปบริการมีรายละเอียดที่ AI แต่งขึ้นในช่องที่ข้อมูลต้นทางเว้นว่างไว้',
  'The workshop guide contains invented details where the supplied records have blank fields.': 'คู่มือ workshop มีรายละเอียดที่ AI แต่งขึ้นในช่องที่ข้อมูลต้นทางเว้นว่างไว้',
  'The evidence summary contains invented details where the supplied records have blank fields.': 'สรุปหลักฐานมีรายละเอียดที่ AI แต่งขึ้นในช่องที่ข้อมูลต้นทางเว้นว่างไว้',
  'The coordination plan contains invented details where the supplied records have blank fields.': 'แผนประสานงานมีรายละเอียดที่ AI แต่งขึ้นในช่องที่ข้อมูลต้นทางเว้นว่างไว้',
  'The project update contains invented details where the supplied records have blank fields.': 'รายงานอัปเดตโครงการมีรายละเอียดที่ AI แต่งขึ้นในช่องที่ข้อมูลต้นทางเว้นว่างไว้',
  'The practice exercise contains invented details where the supplied records have blank fields.': 'แบบฝึกหัดมีรายละเอียดที่ AI แต่งขึ้นในช่องที่ข้อมูลต้นทางเว้นว่างไว้',
  'The release note contains invented details where the supplied records have blank fields.': 'บันทึกประจำรุ่นมีรายละเอียดที่ AI แต่งขึ้นในช่องที่ข้อมูลต้นทางเว้นว่างไว้',
  'Require missing fields to be marked unknown and never inferred.': 'กำหนดให้ระบุช่องที่ไม่มีข้อมูลว่า “ไม่ทราบ” และห้าม AI คาดเดา',
  'Define the audience and request explanations of unfamiliar terms.': 'ระบุกลุ่มผู้อ่าน และขอให้อธิบายคำศัพท์ที่ผู้อ่านอาจไม่คุ้นเคย',
  'Ask for a version comparison with unchanged content omitted.': 'ขอให้เปรียบเทียบแต่ละเวอร์ชัน โดยไม่ต้องแสดงเนื้อหาส่วนที่ไม่เปลี่ยนแปลง',
  'Specify the exact schema and validate every required field.': 'กำหนดโครงสร้างข้อมูลและชื่อช่องให้ชัดเจน พร้อมตรวจสอบว่ามีช่องที่จำเป็นครบถ้วน',
  'The repair addresses fabrication at the missing-data boundary.': 'วิธีนี้แก้ปัญหา AI แต่งข้อมูลขึ้นมาเมื่อข้อมูลต้นทางไม่มีรายละเอียด',
  'A machine-consumed output needs a stable, checkable structure.': 'ข้อมูลที่จะส่งให้ระบบอื่นประมวลผลต้องมีโครงสร้างคงที่และตรวจสอบได้',
  'The task needs a narrower operation rather than more source material.': 'งานนี้ต้องระบุขอบเขตให้แคบและชัดเจนขึ้น ไม่ได้ต้องการข้อมูลต้นทางเพิ่ม',
  'The audience requirement changes how the same facts should be communicated.': 'เมื่อกลุ่มผู้อ่านต่างกัน วิธีอธิบายข้อมูลชุดเดียวกันก็ควรเปลี่ยนให้เหมาะสม',
  'Generating an answer without retrieving supporting sources.': 'สร้างคำตอบโดยไม่ค้นหาแหล่งข้อมูลสนับสนุน',
  'Retrieving exact passages from the approved sources.': 'ดึงข้อความตรงจากแหล่งข้อมูลที่อนุมัติแล้ว',
  'Following a fixed rule to select approved text.': 'ทำตามกฎที่กำหนดไว้เพื่อเลือกข้อความที่อนุมัติแล้ว',
  'Coordinating a model, search, permissions, and review tools.': 'ประสานการทำงานของ Model, ระบบค้นหา, สิทธิ์ และเครื่องมือ review',
  'Breaking the input into tokens that the model can process.': 'แบ่ง input เป็น token ที่ Model ประมวลผลได้',
  'Representing meaning numerically so related content can be found.': 'แทนความหมายด้วยตัวเลขเพื่อค้นหาเนื้อหาที่เกี่ยวข้อง',
  'Retrieving relevant sources before generating the answer.': 'ค้นหาแหล่งข้อมูลที่เกี่ยวข้องก่อนสร้างคำตอบ',
  'Updating the model using additional reviewed examples.': 'ปรับ Model ด้วยตัวอย่างเพิ่มเติมที่ผ่านการ review แล้ว',
  'Using an authorized connector to access another system.': 'ใช้ connector ที่ได้รับอนุญาตเพื่อเข้าถึงระบบอื่น',
  'Using an agent loop to plan, act, check results, and stop.': 'ใช้ Agent loop เพื่อวางแผน ลงมือทำ ตรวจผล และหยุดตามเงื่อนไข',
  'Loading saved information from application memory.': 'โหลดข้อมูลที่บันทึกไว้จาก memory ของแอปพลิเคชัน',
  'Reaching the limit of what the model can keep in its current input.': 'ถึงขีดจำกัดข้อมูลที่ Model เก็บไว้ใน input ปัจจุบันได้',
  'The assistant is generating text, but the answer is not grounded in the approved sources.': 'Assistant กำลังสร้างข้อความ แต่คำตอบไม่ได้อ้างอิงแหล่งข้อมูลที่อนุมัติแล้ว',
  'The assistant is finding existing records rather than writing new content.': 'Assistant กำลังค้นหาข้อมูลเดิม ไม่ได้เขียนเนื้อหาใหม่',
  'The system selects text using a defined rule rather than asking a language model to generate it.': 'ระบบเลือกข้อความตามกฎที่กำหนดไว้ แทนที่จะให้ language model สร้างข้อความ',
  'The application combines several components to complete the workflow.': 'แอปพลิเคชันใช้หลายส่วนประกอบร่วมกันเพื่อทำ Workflow ให้เสร็จ',
  'Retrieve the original passage from the approved sources.': 'ดึงข้อความต้นฉบับจากแหล่งข้อมูลที่อนุมัติแล้ว',
  'Use a workflow with retrieval and gated tool steps.': 'ใช้ Workflow ที่ค้นหาข้อมูลและควบคุมขั้นตอนการใช้เครื่องมือด้วยจุดอนุมัติ',
  'Use a lookup table with explicit category rules.': 'ใช้ตาราง lookup พร้อมกฎหมวดหมู่ที่ชัดเจน',
  'Use a generative drafting assistant with review.': 'ใช้ Assistant ช่วยร่างข้อความ และให้คน review ก่อนใช้งาน',
  'The assistant writes an answer using its language model, but it does not search approved project records.': 'Assistant สร้างคำตอบด้วยโมเดลภาษา แต่ไม่ได้ค้นหาข้อมูลโครงการที่อนุมัติแล้ว',
  'The assistant writes an answer using its language model, but it does not search reviewed learning materials.': 'Assistant สร้างคำตอบด้วยโมเดลภาษา แต่ไม่ได้ค้นหาสื่อการเรียนรู้ที่ผ่านการตรวจทานแล้ว',
  'The assistant writes an answer using its language model, but it does not search approved service records.': 'Assistant สร้างคำตอบด้วยโมเดลภาษา แต่ไม่ได้ค้นหาข้อมูลบริการที่อนุมัติแล้ว',
  'The assistant writes an answer using its language model, but it does not search maintained knowledge articles.': 'Assistant สร้างคำตอบด้วยโมเดลภาษา แต่ไม่ได้ค้นหาบทความความรู้ที่ดูแลให้เป็นปัจจุบัน',
  'The assistant writes an answer using its language model, but it does not search documented source extracts.': 'Assistant สร้างคำตอบด้วยโมเดลภาษา แต่ไม่ได้ค้นหาข้อความตัดตอนจากแหล่งข้อมูลที่บันทึกไว้',
  'The assistant writes an answer using its language model, but it does not search approved volunteer schedules.': 'Assistant สร้างคำตอบด้วยโมเดลภาษา แต่ไม่ได้ค้นหาตารางอาสาสมัครที่อนุมัติแล้ว',
  'The assistant writes an answer using its language model, but it does not search reviewed training examples.': 'Assistant สร้างคำตอบด้วยโมเดลภาษา แต่ไม่ได้ค้นหาตัวอย่างการฝึกอบรมที่ผ่านการตรวจทานแล้ว',
  'The assistant writes an answer using its language model, but it does not search approved release records.': 'Assistant สร้างคำตอบด้วยโมเดลภาษา แต่ไม่ได้ค้นหาข้อมูล release ที่อนุมัติแล้ว',
  'The assistant returns exact passages with record identifiers from approved project records.': 'Assistant ดึงข้อความตรงจากข้อมูลโครงการที่อนุมัติแล้ว พร้อมรหัสอ้างอิงข้อมูล',
  'The workspace combines a language model, a search index, permissions, and a review screen.': 'Workspace ใช้โมเดลภาษา, search index, สิทธิ์ และหน้าจอ review ร่วมกัน',
  'language model': 'โมเดลภาษา',
  'project team': 'ทีมโครงการ',
  'Project team': 'ทีมโครงการ',
  'project update': 'รายงานอัปเดตโครงการ',
  'approved project records': 'ข้อมูลโครงการที่อนุมัติแล้ว',
  'internal support team': 'ทีมสนับสนุนภายใน',
  'Internal support team': 'ทีมสนับสนุนภายใน',
  'support response': 'คำตอบสำหรับงาน support',
  'maintained knowledge articles': 'บทความความรู้ที่ดูแลให้เป็นปัจจุบัน',
  'community learning group': 'กลุ่มการเรียนรู้ชุมชน',
  'Community learning group': 'กลุ่มการเรียนรู้ชุมชน',
  'workshop guide': 'คู่มือ workshop',
  'reviewed learning materials': 'สื่อการเรียนรู้ที่ผ่านการตรวจทานแล้ว',
  'small business': 'ธุรกิจขนาดเล็ก',
  'Small business': 'ธุรกิจขนาดเล็ก',
  'service briefing': 'สรุปบริการ',
  'approved service records': 'ข้อมูลบริการที่อนุมัติแล้ว',
  'research group': 'ทีมวิจัย',
  'Research group': 'ทีมวิจัย',
  'evidence summary': 'สรุปหลักฐาน',
  'documented source extracts': 'ข้อความตัดตอนจากแหล่งข้อมูลที่บันทึกไว้',
  'volunteer organization': 'องค์กรอาสาสมัคร',
  'Volunteer organization': 'องค์กรอาสาสมัคร',
  'coordination plan': 'แผนประสานงาน',
  'approved volunteer schedules': 'ตารางอาสาสมัครที่อนุมัติแล้ว',
  'training team': 'ทีมฝึกอบรม',
  'Training team': 'ทีมฝึกอบรม',
  'practice exercise': 'แบบฝึกหัด',
  'reviewed training examples': 'ตัวอย่างการฝึกอบรมที่ผ่านการตรวจทานแล้ว',
  'product team': 'ทีมผลิตภัณฑ์',
  'Product team': 'ทีมผลิตภัณฑ์',
  'release note': 'บันทึก release',
  'approved release records': 'ข้อมูล release ที่อนุมัติแล้ว',
  'cross-functional team': 'ทีมข้ามสายงาน',
  'operating brief': 'สรุปการดำเนินงาน',
  'approved project and service records': 'ข้อมูลโครงการและบริการที่อนุมัติแล้ว',
  'people or hr': 'ทีม People / HR',
  'employee service response': 'คำตอบบริการพนักงาน',
  'approved HR procedures and anonymized case records': 'ขั้นตอน HR ที่อนุมัติแล้วและข้อมูลเคสที่ไม่ระบุตัวตน',
  'finance team': 'ทีมการเงิน',
  'reconciliation recommendation': 'คำแนะนำการกระทบยอด',
  'approved ledger extracts and reconciled invoice records': 'ข้อมูล ledger ที่อนุมัติแล้วและข้อมูล invoice ที่กระทบยอดแล้ว',
  'marketing team': 'ทีมการตลาด',
  'campaign content recommendation': 'คำแนะนำเนื้อหาแคมเปญ',
  'approved campaign evidence and licensed asset records': 'หลักฐานแคมเปญที่อนุมัติแล้วและข้อมูล asset ที่มีสิทธิ์ใช้งาน',
  'sales team': 'ทีมขาย',
  'account proposal': 'ข้อเสนอลูกค้า',
  'approved CRM extracts and current commercial terms': 'ข้อมูล CRM ที่อนุมัติแล้วและเงื่อนไขการค้าที่เป็นปัจจุบัน',
  'customer service team': 'ทีมบริการลูกค้า',
  'case resolution response': 'คำตอบเพื่อแก้ไขเคส',
  'approved service policies and case history': 'Policy บริการที่อนุมัติแล้วและประวัติเคส',
  'technical team': 'ทีมเทคนิค',
  'change recommendation': 'คำแนะนำการเปลี่ยนแปลง',
  'approved repository records and test results': 'ข้อมูล repository ที่อนุมัติแล้วและผลทดสอบ',
  'operations team': 'ทีม Operations',
  'handoff plan': 'แผนส่งต่องาน',
  'approved work orders and current service schedules': 'work order ที่อนุมัติแล้วและตารางบริการปัจจุบัน',
  'education': 'ทีมการศึกษา',
  'learner support plan': 'แผนสนับสนุนผู้เรียน',
  'approved course guidance and anonymized learner records': 'คำแนะนำหลักสูตรที่อนุมัติแล้วและข้อมูลผู้เรียนที่ไม่ระบุตัวตน',
  'financial services': 'ทีมบริการทางการเงิน',
  'customer case recommendation': 'คำแนะนำเคสลูกค้า',
  'approved product terms and anonymized transaction evidence': 'เงื่อนไขผลิตภัณฑ์ที่อนุมัติแล้วและหลักฐานธุรกรรมที่ไม่ระบุตัวตน',
  'healthcare admin team': 'ทีมธุรการสุขภาพ',
  'appointment service response': 'คำตอบบริการนัดหมาย',
  'approved scheduling guidance and anonymized service records': 'คำแนะนำการนัดหมายที่อนุมัติแล้วและข้อมูลบริการที่ไม่ระบุตัวตน',
  'retail': 'ทีมค้าปลีก',
  'returns campaign recommendation': 'คำแนะนำแคมเปญคืนสินค้า',
  'approved product, returns, and licensed media records': 'ข้อมูลผลิตภัณฑ์ การคืนสินค้า และสื่อที่มีสิทธิ์ใช้งานซึ่งอนุมัติแล้ว',
  'public services': 'ทีมบริการภาครัฐ',
  'service access explanation': 'คำอธิบายการเข้าถึงบริการ',
  'approved service criteria and anonymized case records': 'เกณฑ์บริการที่อนุมัติแล้วและข้อมูลเคสที่ไม่ระบุตัวตน',
  'ceo': 'CEO',
  'enterprise investment recommendation': 'คำแนะนำการลงทุนระดับองค์กร',
  'portfolio results and approved operating plans': 'ผล portfolio และแผนดำเนินงานที่อนุมัติแล้ว',
  'board': 'คณะกรรมการ',
  'oversight recommendation': 'คำแนะนำด้าน oversight',
  'assurance reports and approved risk records': 'รายงาน assurance และข้อมูลความเสี่ยงที่อนุมัติแล้ว',
  'people executive': 'ผู้บริหาร People',
  'workforce adoption recommendation': 'คำแนะนำการนำไปใช้ใน workforce',
  'anonymized workforce feedback and approved people policies': 'feedback workforce ที่ไม่ระบุตัวตนและ People policy ที่อนุมัติแล้ว',
  'finance team executive': 'ผู้บริหารการเงิน',
  'funding recommendation': 'คำแนะนำการจัดสรรเงินทุน',
  'validated business cases and approved financial records': 'business case ที่ผ่านการตรวจสอบแล้วและข้อมูลการเงินที่อนุมัติแล้ว',
  'technology executive': 'ผู้บริหารเทคโนโลยี',
  'platform architecture recommendation': 'คำแนะนำสถาปัตยกรรม platform',
  'architecture assessments and approved security findings': 'การประเมินสถาปัตยกรรมและ findings ความปลอดภัยที่อนุมัติแล้ว',
  'transformation executive': 'ผู้บริหาร transformation',
  'operating model recommendation': 'คำแนะนำ operating model',
  'pilot outcomes and approved change plans': 'ผลลัพธ์ pilot และแผนการเปลี่ยนแปลงที่อนุมัติแล้ว',
  'Only the current approved version may be circulated.': 'เผยแพร่ได้เฉพาะเวอร์ชันล่าสุดที่ได้รับอนุมัติแล้วเท่านั้น',
  'only the current approved version can be circulated': 'เผยแพร่ได้เฉพาะเวอร์ชันล่าสุดที่อนุมัติแล้วเท่านั้น',
  'the current approved version can be circulated': 'เผยแพร่ได้เฉพาะเวอร์ชันล่าสุดที่อนุมัติแล้วเท่านั้น',
  'Staff must approve the response before it is sent.': 'พนักงานต้องอนุมัติคำตอบก่อนส่งออกไป',
  'staff has to approve the response before it is sent': 'พนักงานต้องอนุมัติคำตอบก่อนส่งออกไป',
  'The guide must work for readers with no AI background.': 'คู่มือนี้ต้องใช้ได้กับผู้อ่านที่ไม่มีพื้นฐานด้าน AI',
  'The guide has to work for readers with no AI background.': 'คู่มือนี้ต้องใช้ได้กับผู้อ่านที่ไม่มีพื้นฐานด้าน AI',
  'The guide has to work for readers with no AI background': 'คู่มือนี้ต้องใช้ได้กับผู้อ่านที่ไม่มีพื้นฐานด้าน AI',
  'the guide has to work for readers with no AI background': 'คู่มือนี้ต้องใช้ได้กับผู้อ่านที่ไม่มีพื้นฐานด้าน AI',
  'Customer identifiers must stay out of the briefing.': 'ต้องไม่นำข้อมูลระบุตัวลูกค้าใส่ในสรุปนี้',
  'Customer identifiers has to stay out of the briefing.': 'ต้องไม่นำข้อมูลระบุตัวลูกค้าใส่ในสรุปนี้',
  'Customer identifiers has to stay out of the briefing': 'ต้องไม่นำข้อมูลระบุตัวลูกค้าใส่ในสรุปนี้',
  'customer identifiers has to stay out of the briefing': 'ต้องไม่นำข้อมูลระบุตัวลูกค้าใส่ในสรุปนี้',
  'Every material factual claim needs traceable evidence.': 'ข้อเท็จจริงสำคัญทุกข้อ ต้องมีหลักฐานที่ตรวจสอบย้อนกลับได้',
  'every material factual claim needs traceable evidence': 'ข้อเท็จจริงสำคัญทุกข้อต้องมีหลักฐานที่ตรวจสอบย้อนกลับได้',
  'every material factual claim needs traceable evidence.': 'ข้อเท็จจริงสำคัญทุกข้อต้องมีหลักฐานที่ตรวจสอบย้อนกลับได้',
  'Named people must confirm changes to their assignments.': 'ผู้ที่ถูกระบุชื่อ ต้องยืนยันการเปลี่ยนแปลงงานของตนเอง',
  'Named people has to confirm changes to their assignments.': 'ผู้ที่ถูกระบุชื่อ ต้องยืนยันการเปลี่ยนแปลงงานของตนเอง',
  'Named people has to confirm changes to their assignments': 'ผู้ที่ถูกระบุชื่อ ต้องยืนยันการเปลี่ยนแปลงงานของตนเอง',
  'named people has to confirm changes to their assignments': 'ผู้ที่ถูกระบุชื่อ ต้องยืนยันการเปลี่ยนแปลงงานของตนเอง',
  'Examples must be suitable for mixed levels of experience.': 'ตัวอย่างต้องเหมาะกับผู้ใช้ที่มีประสบการณ์หลายระดับ',
  'Examples has to be suitable for mixed levels of experience.': 'ตัวอย่างต้องเหมาะกับผู้ใช้ที่มีประสบการณ์หลายระดับ',
  'Examples has to be suitable for mixed levels of experience': 'ตัวอย่างต้องเหมาะกับผู้ใช้ที่มีประสบการณ์หลายระดับ',
  'examples has to be suitable for mixed levels of experience': 'ตัวอย่างต้องเหมาะกับผู้ใช้ที่มีประสบการณ์หลายระดับ',
  'Unreleased capabilities must not be described as available.': 'ห้ามอธิบายความสามารถที่ยังไม่ release ว่าพร้อมใช้งานแล้ว',
  'unreleased capabilities has to not be described as available': 'ต้องไม่อธิบายความสามารถที่ยังไม่ release ว่าพร้อมใช้งานแล้ว',
  'Recommendations must distinguish facts from assumptions.': 'คำแนะนำต้องแยกข้อเท็จจริงออกจากสมมติฐาน',
  'recommendations has to distinguish facts from assumptions': 'คำแนะนำต้องแยกข้อเท็จจริงออกจากสมมติฐาน',
  'Employment decisions require a named human decision maker.': 'การตัดสินใจเกี่ยวกับการจ้างงานต้องมีผู้ตัดสินใจที่เป็นคนและระบุชื่อได้',
  'employment decisions need a named human decision maker': 'การตัดสินใจเกี่ยวกับการจ้างงานต้องมีผู้ตัดสินใจที่เป็นคนและระบุชื่อได้',
  'No payment or journal entry may be released by the assistant.': 'Assistant ห้ามปล่อย payment หรือ journal entry เอง',
  'no payment or journal entry can be released by the assistant': 'Assistant ห้ามปล่อย payment หรือ journal entry เอง',
  'Performance claims and asset rights must be checked before publication.': 'ต้องตรวจสอบ performance claim และสิทธิ์ของ asset ก่อนเผยแพร่',
  'performance claims and asset rights has to be checked before publication': 'ต้องตรวจสอบ performance claim และสิทธิ์ของ asset ก่อนเผยแพร่',
  'Only the account owner may approve pricing and delivery promises.': 'เฉพาะเจ้าของ account เท่านั้นที่อนุมัติราคาและคำมั่นด้าน delivery ได้',
  'only the account owner can approve pricing and delivery promises': 'เฉพาะเจ้าของ account เท่านั้นที่อนุมัติราคาและคำมั่นด้าน delivery ได้',
  'Refunds and exceptions need the designated approver.': 'refund และ exception ต้องได้รับอนุมัติจากผู้มีอำนาจที่กำหนดไว้',
  'refunds and exceptions need the designated approver': 'refund และ exception ต้องได้รับอนุมัติจากผู้มีอำนาจที่กำหนดไว้',
  'Production changes need review and a tested recovery path.': 'การเปลี่ยนแปลง production ต้องผ่าน review และมี recovery path ที่ทดสอบแล้ว',
  'production changes need review and a tested recovery path': 'การเปลี่ยนแปลง production ต้องผ่าน review และมี recovery path ที่ทดสอบแล้ว',
  'Each operational exception needs an owner and escalation route.': 'exception ด้าน operations ทุกกรณีต้องมี owner และ escalation route',
  'each operational exception needs an owner and escalation route': 'exception ด้าน operations ทุกกรณีต้องมี owner และ escalation route',
  'Staff review learner-impacting recommendations; no student identifiers may leave the approved workspace.': 'พนักงานต้อง review คำแนะนำที่มีผลต่อผู้เรียน และห้ามนำข้อมูลระบุตัวนักเรียนออกนอก workspace ที่อนุมัติแล้ว',
  'Account actions require independent verification and an authorized approver.': 'การดำเนินการกับ account ต้องมีการตรวจสอบอิสระและผู้อนุมัติที่ได้รับมอบอำนาจ',
  'The assistant supports administration only; clinical questions go to a qualified clinician.': 'Assistant สนับสนุนเฉพาะงานธุรการ คำถามทางคลินิกต้องส่งให้ clinician ที่มีคุณสมบัติเหมาะสม',
  'Returns promises must match the current approved terms.': 'คำสัญญาเรื่องการคืนสินค้าต้องตรงกับเงื่อนไขล่าสุดที่อนุมัติแล้ว',
  'Eligibility decisions require authorized staff and a usable review route.': 'การตัดสินสิทธิ์ต้องทำโดยพนักงานที่ได้รับอนุญาต และต้องมีช่องทาง review ที่ใช้งานได้',
  'Scaling decisions need explicit accountable owners and measurable outcomes.': 'การตัดสินใจ scale ต้องมี owner ที่รับผิดชอบชัดเจนและผลลัพธ์ที่วัดได้',
  'scaling decisions need explicit accountable owners and measurable outcomes': 'การตัดสินใจ scale ต้องมี owner ที่รับผิดชอบชัดเจนและผลลัพธ์ที่วัดได้',
  'Management executes controls; the board requires evidence of their effectiveness.': 'ฝ่าย management เป็นผู้ดำเนิน controls ส่วน board ต้องการหลักฐานว่า controls มีประสิทธิผล',
  'management executes controls; the board needs evidence of their effectiveness': 'ฝ่าย management เป็นผู้ดำเนิน controls ส่วน board ต้องการหลักฐานว่า controls มีประสิทธิผล',
  'Workforce-impacting decisions need employee input and named human accountability.': 'การตัดสินใจที่กระทบ workforce ต้องมี input จากพนักงานและมีคนที่รับผิดชอบชัดเจน',
  'workforce-impacting decisions need employee input and named human accountability': 'การตัดสินใจที่กระทบ workforce ต้องมี input จากพนักงานและมีคนที่รับผิดชอบชัดเจน',
  'Benefits must be attributable and funding gates independently checkable.': 'ประโยชน์ต้องระบุแหล่งที่มาได้ และ funding gate ต้องตรวจสอบได้อย่างอิสระ',
  'benefits has to be attributable and funding gates independently checkable': 'ประโยชน์ต้องระบุแหล่งที่มาได้ และ funding gate ต้องตรวจสอบได้อย่างอิสระ',
  'Production expansion requires testable boundaries and a recovery owner.': 'การขยาย production ต้องมีขอบเขตที่ทดสอบได้และมี recovery owner',
  'production expansion needs testable boundaries and a recovery owner': 'การขยาย production ต้องมีขอบเขตที่ทดสอบได้และมี recovery owner',
  'Scale decisions must account for workflow ownership and adoption evidence.': 'การตัดสินใจ scale ต้องคำนึงถึง ownership ของ Workflow และหลักฐานการ adoption',
  'scale decisions has to account for workflow ownership and adoption evidence': 'การตัดสินใจ scale ต้องคำนึงถึง ownership ของ Workflow และหลักฐานการ adoption',
  'Draft quality is stable, but completed actions vary across staff roles.': 'คุณภาพของร่างค่อนข้างคงที่ แต่ผลการดำเนินงานแตกต่างกันตามบทบาทของพนักงาน',
  'A sponsor credits a new index, but the model and review checklist also changed.': 'ผู้สนับสนุนบอกว่าผลลัพธ์ดีขึ้นเพราะ index ใหม่ แต่ Model และ checklist การรีวิวก็เปลี่ยนไปด้วย',
  'A sponsor credits a new index, but the Model and review checklist also changed.': 'ผู้สนับสนุนบอกว่าผลลัพธ์ดีขึ้นเพราะ index ใหม่ แต่ Model และ checklist การรีวิวก็เปลี่ยนไปด้วย',
  'All component tests pass, but records are lost between drafting and approval.': 'การทดสอบแต่ละส่วนผ่านทั้งหมด แต่ข้อมูลสูญหายระหว่างขั้นตอนร่างและขั้นตอนอนุมัติ',
  'The system returns unchanged passages with record identifiers from reviewed learning materials.': 'ระบบดึงข้อความเดิมกลับมาโดยไม่เปลี่ยนเนื้อหา พร้อมรหัสอ้างอิงข้อมูลจากสื่อการเรียนรู้ที่ผ่านการตรวจทานแล้ว',
  'The system returns unchanged passages with record identifiers': 'ระบบดึงข้อความเดิมกลับมาโดยไม่เปลี่ยนเนื้อหา พร้อมรหัสอ้างอิงข้อมูล',
  'The observed operation retrieves records without composing new content.': 'สิ่งที่เห็นคือระบบดึงข้อมูลกลับมา โดยไม่ได้สร้างเนื้อหาใหม่',
  'The system follows an explicit if-then rule and copies an approved sentence.': 'ระบบทำตามกฎ if-then ที่ชัดเจน และคัดลอกประโยคที่อนุมัติแล้ว',
  'The output is chosen by a defined rule rather than learned generation.': 'ผลลัพธ์ถูกเลือกโดยกฎที่กำหนดไว้ ไม่ใช่การสร้างจากสิ่งที่ Model เรียนรู้',
  'Management executes controls; the board requires evidence of their effectiveness.': 'ฝ่าย management เป็นผู้ดำเนิน controls ส่วน board ต้องการหลักฐานว่า controls มีประสิทธิผล',
  'The business case counts saved staff hours as cash savings without a cost-reduction plan.': 'business case นับชั่วโมงทำงานที่ประหยัดได้เป็นเงินสดที่ประหยัดได้ ทั้งที่ยังไม่มีแผนลดต้นทุน',
  'The business case': 'business case',
  'Exercise rule': 'กฎของโจทย์',
  'The system creates new sentences from learned patterns': 'ระบบสร้างประโยคใหม่จากรูปแบบที่เรียนรู้มา',
  'The system must inspect a record, draft a response, and request approval before a write.': 'ระบบต้องตรวจข้อมูลหนึ่งรายการ ร่างคำตอบ และขออนุมัติก่อนเขียนข้อมูล',
  'Every output must reproduce the same approved sentence when the same category is selected.': 'ทุกผลลัพธ์ต้องแสดงประโยคที่อนุมัติแล้วเหมือนเดิม เมื่อเลือกหมวดหมู่เดียวกัน',
  'Staff need varied wording from non-sensitive notes, and will approve every final draft.': 'พนักงานต้องการข้อความที่หลากหลายจากบันทึกที่ไม่อ่อนไหว และจะอนุมัติร่างสุดท้ายทุกครั้ง',
  'Staff need the exact current clause and its record identifier, without paraphrasing.': 'พนักงานต้องการข้อกำหนดล่าสุดแบบตรงตัว พร้อมรหัสอ้างอิงข้อมูล โดยไม่เรียบเรียงใหม่',
  'A stable output style fails despite tested prompts; many reviewed examples are available.': 'รูปแบบผลลัพธ์ยังไม่คงที่ แม้ทดสอบ Prompt แล้ว และมีตัวอย่างที่รีวิวแล้วจำนวนมาก',
  'A long request fails before generation because it exceeds the input allowance.': 'คำขอที่ยาวเกินไปล้มเหลวก่อนเริ่มสร้างคำตอบ เพราะเกินขีดจำกัด input',
  'A correct result comes from a cached record, but the current record has changed.': 'ผลลัพธ์เดิมเคยถูกต้องเพราะใช้ข้อมูลใน cache แต่ข้อมูลล่าสุดเปลี่ยนไปแล้ว',
  'Two independent current records conflict on a material value.': 'ข้อมูลล่าสุดจากสองแหล่งที่เป็นอิสระต่อกันขัดแย้งกันในค่าที่สำคัญ',
  'The workspace includes the model and surrounding operational components.': 'workspace นี้มีทั้ง Model และส่วนประกอบการทำงานที่เกี่ยวข้อง',
  'The workspace includes the Model and surrounding operational components.': 'workspace นี้มีทั้ง Model และส่วนประกอบการทำงานที่เกี่ยวข้อง',
  'The task combines evidence, generation, and controlled actions.': 'งานนี้รวมทั้งหลักฐาน การสร้างคำตอบ และการดำเนินการแบบมีการควบคุม',
  'A deterministic requirement is met directly by controlled rules.': 'ข้อกำหนดที่ตายตัวควรใช้กฎที่ควบคุมได้โดยตรง',
  'Language variation is useful here and a reviewer owns the final text.': 'กรณีนี้ควรใช้ภาษาที่หลากหลายได้ แต่ผู้รีวิวต้องรับผิดชอบข้อความสุดท้าย',
  'Verbatim current evidence is a retrieval task.': 'เมื่อต้องใช้หลักฐานล่าสุดแบบตรงตัว งานนี้ควรใช้ retrieval',
  'Role-dependent execution suggests the authorization layer needs isolation.': 'เมื่อผลการดำเนินงานต่างกันตามบทบาท ควรแยกทดสอบชั้นสิทธิ์อนุมัติ',
  'Stable behavior and reviewed examples make a controlled fine-tuning trial reasonable.': 'เมื่อพฤติกรรมคงที่และมีตัวอย่างที่รีวิวแล้ว การทดลอง fine-tuning แบบควบคุมตัวแปรจึงเหมาะสม',
  'The immediate issue is the processing limit, not missing training.': 'ปัญหาเร่งด่วนคือขีดจำกัดการประมวลผล ไม่ใช่การขาดข้อมูลฝึก',
  'The supporting state changed after the successful result.': 'ข้อมูลที่ใช้สนับสนุนเปลี่ยนไปหลังจากผลลัพธ์เดิมเคยถูกต้อง',
  'Choosing the more fluent summary would conceal unresolved evidence.': 'การเลือกสรุปที่อ่านลื่นกว่าอาจซ่อนหลักฐานที่ยังขัดแย้งกัน',
  'it has no connection to': 'ไม่ได้เชื่อมต่อกับ',
  'What is the AI tool doing in this': 'AI tool กำลังทำอะไรใน',
  'Plain-language draft generated from the coverage item; still requires human review before pilot use.': 'ร่างภาษาง่ายที่สร้างจากรายการครอบคลุมทักษะนี้ ยังต้องให้คนรีวิวก่อนใช้ใน pilot',
  'Split the original combined answer into two decisions so users do not have to decode long compound options.': 'แยกคำตอบเดิมที่รวมหลายเรื่องออกเป็นสองการตัดสินใจ เพื่อไม่ให้ผู้ใช้ต้องตีความตัวเลือกยาว ๆ ที่ซ้อนกัน',
  'This is still a draft: reviewers should add one more defensible correct action before live use.': 'รายการนี้ยังเป็นร่าง: ผู้รีวิวควรเพิ่มคำตอบที่ถูกต้องอีกหนึ่งข้อซึ่งอธิบายเหตุผลได้ ก่อนนำไปใช้จริง',
  'The experiment must isolate the index rather than several changes together.': 'การทดลองต้องแยกผลของ index ออกมาให้ชัด ไม่ใช่เปรียบเทียบหลายสิ่งที่เปลี่ยนพร้อมกัน',
  'The best first check is "Compare indexes while fixing model and review criteria.".': 'สิ่งแรกที่ควรตรวจสอบคือ "เปรียบเทียบ index โดยคง Model และเกณฑ์ตรวจทานไว้เหมือนเดิม"',
  'Component success does not verify the end-to-end transfer of state.': 'การที่แต่ละส่วนทดสอบผ่าน ไม่ได้ยืนยันว่าข้อมูลถูกส่งต่อครบตลอดกระบวนการ',
  'The best first check is "Trace one record through every application handoff.".': 'สิ่งแรกที่ควรตรวจสอบคือ "ติดตามข้อมูลหนึ่งรายการผ่านทุกจุดส่งต่อของแอปพลิเคชัน"',
  'A rules-based automation selecting text.': 'ระบบอัตโนมัติแบบใช้กฎที่เลือกข้อความตามเงื่อนไข',
  'An application coordinating several components.': 'แอปพลิเคชันที่ประสานการทำงานของหลายส่วนประกอบ',
  'A generative model producing a draft.': 'Model แบบสร้างเนื้อหาที่กำลังสร้างร่างคำตอบ',
  'A search system retrieving existing text.': 'ระบบค้นหาที่ดึงข้อความเดิมกลับมาใช้',
  'Creating plausible text does not establish access to current records.': 'การสร้างข้อความที่ดูน่าเชื่อถือไม่ได้แปลว่าระบบเข้าถึงข้อมูลล่าสุดได้จริง',
  'Use a lookup table with explicit category rules.': 'ใช้ตาราง lookup พร้อมกฎหมวดหมู่ที่ชัดเจน',
  'Use a generative drafting assistant with review.': 'ใช้ผู้ช่วยสร้างร่างด้วย AI พร้อมขั้นตอนตรวจทาน',
  'Use search that returns the original source passage.': 'ใช้การค้นหาที่คืนข้อความต้นทางเดิม',
  'Use an application with retrieval and gated tool steps.': 'ใช้แอปพลิเคชันที่มี retrieval และขั้นตอนใช้ tool แบบมีเงื่อนไขอนุมัติ',
  'Investigate the action permission boundary.': 'ตรวจสอบขอบเขตสิทธิ์ในการดำเนินการ',
  'Correct the deterministic routing rule.': 'แก้กฎ routing แบบกำหนดตายตัว',
  'The retrieval configuration explains a relevant difference.': 'การตั้งค่า retrieval อธิบายความแตกต่างที่เกี่ยวข้องได้',
  'The model choice warrants a controlled capability comparison.': 'การเลือก Model ควรตรวจสอบด้วยการเปรียบเทียบความสามารถแบบควบคุมตัวแปร',
  'Test role permissions with identical approved actions.': 'ทดสอบสิทธิ์ของแต่ละบทบาทด้วยชุดการกระทำที่อนุมัติแล้วเหมือนกัน',
  'Trace one record through every application handoff.': 'ติดตามข้อมูลหนึ่งรายการผ่านทุกจุดส่งต่อของแอปพลิเคชัน',
  'Compare models with identical retrieved passages and tasks.': 'เปรียบเทียบ Model โดยใช้ข้อความที่ค้นคืนและงานชุดเดียวกัน',
  'Compare indexes while fixing model and review criteria.': 'เปรียบเทียบ index โดยคง Model และเกณฑ์ตรวจทานไว้เหมือนเดิม',
  'An embedding used for similarity.': 'Embedding ที่ใช้วัดความคล้ายกัน',
  'Retrieval used to ground generation.': 'Retrieval ที่ใช้เป็นหลักฐานให้การสร้างคำตอบ',
  'Tokenization of the input.': 'การแบ่ง input เป็น token',
  'Fine-tuning on additional examples.': 'การ fine-tune ด้วยตัวอย่างเพิ่มเติม',
  'Measure tokens and reduce or split the input.': 'วัดจำนวน token แล้วลดหรือแบ่ง input',
  'Retrieve the current procedure when answering.': 'ค้นคืนขั้นตอนล่าสุดตอนตอบคำถาม',
  'Evaluate fine-tuning against the prompt baseline.': 'ประเมินผล fine-tuning เทียบกับ baseline ของ Prompt',
  'Use semantic retrieval with tested embeddings.': 'ใช้ semantic retrieval พร้อม embedding ที่ผ่านการทดสอบ',
  'Semantic retrieval needs an exact-match path.': 'Semantic retrieval ต้องมีเส้นทางค้นหาแบบ exact match ร่วมด้วย',
  'Behavior tuning did not supply current factual evidence.': 'การปรับพฤติกรรมไม่ได้ให้หลักฐานข้อเท็จจริงที่เป็นปัจจุบัน',
  'The answer failed to use available grounding evidence.': 'คำตอบไม่ได้ใช้หลักฐานอ้างอิงที่มีอยู่',
  'The retrieval corpus has a freshness failure.': 'ชุดข้อมูล retrieval มีปัญหาเรื่องความเป็นปัจจุบัน',
  'Measure passage recall and answer faithfulness separately.': 'วัด passage recall และความตรงตามหลักฐานของคำตอบแยกกัน',
  'Evaluate hybrid retrieval on identifier and semantic slices.': 'ประเมิน hybrid retrieval แยกตาม identifier และ semantic slice',
  'Compare compression strategies on exception retention and cost.': 'เปรียบเทียบกลยุทธ์ compression ด้านการรักษาข้อยกเว้นและต้นทุน',
  'Use held-out tasks and compare with the untuned baseline.': 'ใช้ชุดงานที่กันไว้ทดสอบ แล้วเปรียบเทียบกับ baseline ที่ยังไม่ได้ tune',
  'The information may be out of date.': 'ข้อมูลอาจล้าสมัย',
  'The answer lacks access to the claimed evidence.': 'คำตอบไม่มีการเข้าถึงหลักฐานที่อ้างถึง',
  'A plausible statement may be fabricated.': 'ข้อความที่ดูน่าเชื่อถืออาจถูกแต่งขึ้น',
  'The available evidence does not support a stable estimate.': 'หลักฐานที่มีอยู่ยังไม่พอสำหรับการประเมินที่น่าเชื่อถือ',
  'Present the uncertainty and request the missing decision.': 'แสดงความไม่แน่นอนและขอการตัดสินใจที่ยังขาดอยู่',
  'Obtain the current approved procedure and answer again.': 'นำขั้นตอนล่าสุดที่อนุมัติแล้วมาใช้ แล้วตอบใหม่',
  'Check the source and remove the claim if unsupported.': 'ตรวจสอบแหล่งข้อมูล และลบข้อกล่าวอ้างหากไม่มีหลักฐานรองรับ',
  'Provide an approved extract or state that it cannot be checked.': 'ให้ข้อความตัดตอนที่อนุมัติแล้ว หรือระบุว่าตรวจสอบไม่ได้',
  'The conflict remains unresolved and should be surfaced.': 'ความขัดแย้งยังไม่ถูกแก้ไขและควรถูกแสดงให้เห็น',
  'Repeated agreement is not independent verification.': 'การเห็นตรงกันซ้ำ ๆ ไม่ใช่การตรวจสอบแบบอิสระ',
  'Past correctness does not establish present correctness.': 'ความถูกต้องในอดีตไม่ได้ยืนยันว่าปัจจุบันยังถูกต้อง',
  'The benchmark does not establish performance on this exception.': 'benchmark นี้ยังไม่ยืนยันประสิทธิภาพกับกรณียกเว้นนี้',
  'Test abstention and block decisions with missing critical inputs.': 'ทดสอบการงดตอบและการบล็อกการตัดสินใจเมื่อข้อมูลสำคัญหายไป',
  'Route that exception class to a reviewer and evaluate it separately.': 'ส่งกรณียกเว้นประเภทนี้ให้ผู้รีวิว และประเมินแยกต่างหาก',
  'Add source-version checks and update-triggered evaluations.': 'เพิ่มการตรวจเวอร์ชันแหล่งข้อมูล และการประเมินเมื่อมีการอัปเดต',
  'Require resolvable evidence for material claims before release.': 'กำหนดให้ข้อกล่าวอ้างสำคัญต้องมีหลักฐานที่ตรวจสอบได้ก่อนเผยแพร่',
};

const thaiPhrases: Array<[RegExp, string]> = [
  [/A (.*?) is using AI to prepare an? (.*?)\./g, '$1 กำลังใช้ AI เพื่อเตรียม $2'],
  [/An? (.*?) is using AI to prepare an? (.*?)\./g, '$1 กำลังใช้ AI เพื่อเตรียม $2'],
  [/(.*?) is preparing an? (.*?) with AI\./g, '$1 กำลังเตรียม $2 ด้วย AI'],
  [/They should only rely on (.*?)\./g, 'ควรใช้ข้อมูลจาก $1 เท่านั้น'],
  [/Important rule: /g, 'กฎสำคัญ: '],
  [/What happens: /g, 'สิ่งที่เกิดขึ้น: '],
  [/Extra detail: /g, 'รายละเอียดเพิ่มเติม: '],
  [/Additional detail: /g, 'รายละเอียดเพิ่มเติม: '],
  [/Scenario: /g, 'สถานการณ์: '],
  [/ needs an? /g, ' ต้องการ '],
  [/Use: /g, 'ข้อมูลที่ใช้: '],
  [/Rule: /g, 'กฎ: '],
  [/Risk: /g, 'ความเสี่ยง: '],
  [/Evidence: /g, 'หลักฐาน: '],
  [/Select all safe actions\./g, 'เลือกทุกทางเลือกที่ปลอดภัย'],
  [/Artifact generation prompt/g, 'Prompt สำหรับสร้าง artifact'],
  [/requires artifact/g, 'ต้องมี artifact'],
  [/artifact helpful/g, 'artifact ช่วยให้ตอบชัดขึ้น'],
  [/Answer both parts\./g, 'ตอบทั้งสองส่วน'],
  [/The best first check is/g, 'สิ่งแรกที่ควรตรวจสอบคือ'],
  [/best first check/g, 'สิ่งแรกที่ควรตรวจสอบ'],
  [/follow-up actions/g, 'ขั้นตอนถัดไป'],
  [/during review/g, 'ระหว่างการรีวิว'],
  [/experiment/g, 'การทดลอง'],
  [/evaluation/g, 'การประเมิน'],
  [/performance/g, 'ผลลัพธ์'],
  [/recurring failure/g, 'ปัญหาซ้ำ'],
  [/recurring defect/g, 'ข้อผิดพลาดซ้ำ'],
  [/observed/g, 'ที่พบ'],
  [/disputed/g, 'ที่ยังถกเถียงกัน'],
  [/identified uncertainty/g, 'ความไม่แน่นอนที่พบ'],
  [/best supported/g, 'มีหลักฐานสนับสนุนดีที่สุด'],
  [/safest/g, 'ปลอดภัยที่สุด'],
  [/privacy/g, 'ความเป็นส่วนตัว'],
  [/approval/g, 'การอนุมัติ'],
  [/source/g, 'แหล่งข้อมูล'],
  [/evidence/g, 'หลักฐาน'],
  [/risk/g, 'ความเสี่ยง'],
  [/team/g, 'ทีม'],
  [/leader/g, 'ผู้นำ'],
  [/customer/g, 'ลูกค้า'],
  [/staff roles/g, 'บทบาทของพนักงาน'],
  [/current approved version/g, 'เวอร์ชันล่าสุดที่อนุมัติแล้ว'],
  [/approved records/g, 'ข้อมูลที่อนุมัติแล้ว'],
  [/approved/g, 'ที่อนุมัติแล้ว'],
  [/records/g, 'ข้อมูล'],
  [/draft quality/g, 'คุณภาพของร่าง'],
  [/completed actions/g, 'ผลการดำเนินงาน'],
  [/stable/g, 'คงที่'],
  [/vary across/g, 'แตกต่างกันตาม'],
  [/may be circulated/g, 'สามารถเผยแพร่ได้'],
  [/current/g, 'ล่าสุด'],
  [/policy/g, 'Policy'],
  [/reviewers/g, 'ผู้รีวิว'],
  [/reviewer/g, 'ผู้รีวิว'],
  [/review/g, 'review'],
  [/owner/g, 'owner'],
  [/scale/g, 'scale'],
  [/workforce/g, 'workforce'],
  [/exception/g, 'exception'],
  [/production/g, 'production'],
  [/Assistant/g, 'Assistant'],
  [/account/g, 'account'],
  [/input/g, 'input'],
  [/claim/g, 'claim'],
  [/journal entry/g, 'journal entry'],
  [/operating model/g, 'operating model'],
  [/transformation/g, 'transformation'],
  [/ownership/g, 'ownership'],
  [/adoption/g, 'adoption'],
  [/platform/g, 'platform'],
  [/findings/g, 'findings'],
  [/ledger/g, 'ledger'],
  [/invoice/g, 'invoice'],
  [/portfolio/g, 'portfolio'],
  [/payment/g, 'payment'],
  [/recovery path/g, 'recovery path'],
  [/work order/g, 'work order'],
  [/operations/g, 'operations'],
  [/escalation route/g, 'escalation route'],
  [/business case/g, 'business case'],
  [/recovery owner/g, 'recovery owner'],
  [/oversight/g, 'oversight'],
  [/assurance/g, 'assurance'],
  [/executive/g, 'executive'],
  [/funding gate/g, 'funding gate'],
  [/issue/g, 'ประเด็น'],
  [/task/g, 'งาน'],
  [/action/g, 'การดำเนินการ'],
  [/gap/g, 'ช่องว่าง'],
  [/failure/g, 'ความล้มเหลว'],
  [/route/g, 'เส้นทาง'],
  [/require/g, 'ต้องการ'],
  [/requires/g, 'ต้องการ'],
  [/cost/g, 'ต้นทุน'],
  [/value/g, 'value'],
  [/assumption/g, 'สมมติฐาน'],
  [/dependency/g, 'dependency'],
  [/uncertainty/g, 'ความไม่แน่นอน'],
  [/changes/g, 'การเปลี่ยนแปลง'],
  [/date/g, 'วันที่'],
  [/repeated/g, 'ซ้ำ'],
  [/control architecture/g, 'control architecture'],
  [/constraint/g, 'ข้อจำกัด'],
  [/correction process/g, 'กระบวนการแก้ไข'],
  [/process/g, 'กระบวนการ'],
  [/failed/g, 'ล้มเหลว'],
  [/permissions/g, 'สิทธิ์'],
  [/group/g, 'กลุ่ม'],
  [/does not/g, 'ไม่ได้'],
  [/service/g, 'บริการ'],
  [/needs/g, 'ต้องการ'],
  [/limit/g, 'ขีดจำกัด'],
  [/rule/g, 'กฎ'],
  [/clause/g, 'ข้อกำหนด'],
  [/execution/g, 'การดำเนินงาน'],
  [/master/g, 'master'],
  [/access/g, 'การเข้าถึง'],
  [/requests/g, 'คำขอ'],
  [/data flow/g, 'data flow'],
  [/lifecycle weakness/g, 'จุดอ่อนใน lifecycle'],
  [/outcome/g, 'ผลลัพธ์'],
  [/improvement/g, 'การปรับปรุง'],
  [/measurement/g, 'การวัดผล'],
  [/clinician/g, 'clinician'],
  [/draft/g, 'ร่าง'],
  [/record/g, 'ข้อมูล'],
  [/case/g, 'เคส'],
  [/comparison/g, 'การเปรียบเทียบ'],
  [/authority/g, 'อำนาจอนุมัติ'],
  [/rollout/g, 'rollout'],
  [/output/g, 'ผลลัพธ์'],
  [/request/g, 'คำขอ'],
  [/sentence/g, 'ประโยค'],
  [/identifiers/g, 'รหัสอ้างอิง'],
  [/passages/g, 'ข้อความต้นทาง'],
  [/interpreting/g, 'ตีความ'],
  [/retrieving text/g, 'ดึงข้อความ'],
  [/writing a new explanation/g, 'เขียนคำอธิบายใหม่'],
  [/search index/g, 'search index'],
  [/review screen/g, 'หน้าจอ review'],
  [/setup/g, 'การตั้งค่า'],
  [/fits the work/g, 'เหมาะกับงาน'],
  [/several parts together/g, 'หลายส่วนร่วมกัน'],
  [/carefully/g, 'อย่างระมัดระวัง'],
  [/ from /g, 'จาก'],
  [/กับthe /g, 'กับ'],
  [/จากAI/g, 'จาก AI'],
  [/realistic/g, 'สมจริง'],
  [/timestamps/g, 'เวลา'],
  [/permission scope/g, 'ขอบเขตสิทธิ์'],
  [/approval gate/g, 'จุดอนุมัติ'],
  [/retry count/g, 'จำนวน retry'],
  [/handoff/g, 'การส่งต่อ'],
  [/source comparison/g, 'การเปรียบเทียบแหล่งข้อมูล'],
  [/version/g, 'เวอร์ชัน'],
  [/document comparison/g, 'การเปรียบเทียบเอกสาร'],
  [/business email/g, 'อีเมลธุรกิจ'],
  [/support-ticket/g, 'ticket งาน support'],
  [/spreadsheet/g, 'spreadsheet'],
  [/baseline/g, 'baseline'],
  [/confidence/g, 'confidence'],
  [/misleading metric/g, 'metric ที่ทำให้เข้าใจผิด'],
  [/workflow/gi, 'Workflow'],
  [/dashboard/gi, 'Dashboard'],
  [/prompt/gi, 'Prompt'],
  [/model/gi, 'Model'],
  [/agent/gi, 'Agent'],
];

function replaceExactThaiPhrases(value: string) {
  return Object.entries(thaiExactPhrases).reduce((text, [source, target]) => text.split(source).join(target), value);
}

function th(value: string | undefined) {
  if (!value) return '';
  const withSentences = thaiSentencePatterns.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
  const withExact = replaceExactThaiPhrases(withSentences);
  return thaiPhrases
    .reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), withExact)
    .replace(/ใน\s+/g, 'ใน')
    .replace(/จาก\s+/g, 'จาก')
    .replace(/กับ\s+/g, 'กับ')
    .replace(/กับthe\s+/g, 'กับ')
    .replace(/จากAI/g, 'จาก AI')
    .replace(/workshopด้วย/g, 'workshop ด้วย')
    .replace(/supportด้วย/g, 'support ด้วย')
    .replace(/releaseด้วย/g, 'release ด้วย')
    .replace(/workshopนี้/g, 'workshop นี้')
    .replace(/supportนี้/g, 'support นี้')
    .replace(/releaseนี้/g, 'release นี้')
    .replace(/ในcache/g, 'ใน cache')
    .replace(/;\s*/g, ' แต่')
    .replace(/\s+\./g, '.');
}

function localizedText(english: string | undefined, thai: string | undefined, language: string) {
  if (language === 'th') return thai || th(english);
  return english || '';
}

function localizedOption(option: ReviewOption, language: string) {
  return localizedText(option.label, option.thLabel, language);
}

function buildLanguageHref(searchParams: Record<string, string | string[] | undefined> | undefined, language: string) {
  const params = new URLSearchParams();
  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (!value || key === 'lang') return;
    params.set(key, Array.isArray(value) ? value[0] : value);
  });
  params.set('lang', language);
  return `/admin/question-inventory?${params.toString()}`;
}

function buildPageHref(searchParams: Record<string, string | string[] | undefined> | undefined, page: number) {
  const params = new URLSearchParams();
  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (!value || key === 'page') return;
    params.set(key, Array.isArray(value) ? value[0] : value);
  });
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return `/admin/question-inventory${query ? `?${query}` : ''}`;
}

function safeDomId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-');
}

function renderUserFacingDraft(question: ReviewQuestion, questionLanguage: 'en' | 'th') {
  if (!question.userFacingDraft) {
    return (
      <>
        <p>{localizedText(question.context, question.th?.context, questionLanguage)}</p>
        <h2>{localizedText(question.prompt, question.th?.prompt, questionLanguage)}</h2>
      </>
    );
  }

  return (
    <div className="inventory-user-facing">
      <span>{questionLanguage === 'th' ? 'ฉบับร่างสำหรับผู้ใช้' : 'User-facing rewrite draft'}</span>
      <p>{localizedText(question.userFacingDraft.context, question.userFacingDraft.th?.context, questionLanguage)}</p>
      <h2>{localizedText(question.userFacingDraft.prompt, question.userFacingDraft.th?.prompt, questionLanguage)}</h2>
      {question.userFacingDraft.parts?.length ? (
        <div className="inventory-parts">
          {question.userFacingDraft.parts.map((part) => (
            <div key={part.id}>
              <h3>{localizedText(part.prompt, part.thPrompt, questionLanguage)}</h3>
              <ol className="inventory-options">
                {part.options.map((option) => (
                  <li key={option.id} className={part.correctOptionIds.includes(option.id) ? 'is-correct' : undefined}>
                    <strong>{option.id.toUpperCase()}.</strong> {localizedOption(option, questionLanguage)}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      ) : question.userFacingDraft.interaction === 'rank' ? (
        <div className="inventory-nonmcq">
          <strong>{questionLanguage === 'th' ? 'รูปแบบที่ควรใช้: จัดลำดับคำตอบ' : 'Proposed format: ranking task'}</strong>
          <p>{questionLanguage === 'th' ? 'ให้ผู้ใช้ลากหรือจัดลำดับทางเลือกจากควรทำก่อน ไปควรทำทีหลัง' : 'Reviewer should convert these choices into a drag-to-rank sequence from first action to later action.'}</p>
          <ol className="inventory-options">
            {(question.userFacingDraft.options || []).map((option) => (
              <li key={option.id} className={question.userFacingDraft?.correctOptionIds?.includes(option.id) ? 'is-correct' : undefined}>
                <strong>{option.id.toUpperCase()}.</strong> {localizedOption(option, questionLanguage)}
              </li>
            ))}
          </ol>
        </div>
      ) : question.userFacingDraft.interaction === 'match' ? (
        <div className="inventory-nonmcq">
          <strong>{questionLanguage === 'th' ? 'รูปแบบที่ควรใช้: จับคู่' : 'Proposed format: matching task'}</strong>
          <p>{questionLanguage === 'th' ? 'ให้ผู้ใช้จับคู่ข้อสังเกตกับแนวคิด AI ที่ถูกต้อง' : 'Reviewer should turn these into observation-to-concept pairs instead of a single MCQ.'}</p>
          <ol className="inventory-options">
            {(question.userFacingDraft.options || []).map((option) => (
              <li key={option.id} className={question.userFacingDraft?.correctOptionIds?.includes(option.id) ? 'is-correct' : undefined}>
                <strong>{option.id.toUpperCase()}.</strong> {localizedOption(option, questionLanguage)}
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <ol className="inventory-options">
          {(question.userFacingDraft.options || []).map((option) => (
            <li key={option.id} className={question.userFacingDraft?.correctOptionIds?.includes(option.id) ? 'is-correct' : undefined}>
              <strong>{option.id.toUpperCase()}.</strong> {localizedOption(option, questionLanguage)}
            </li>
          ))}
        </ol>
      )}
      <p className="inventory-rationale"><strong>{questionLanguage === 'th' ? 'หมายเหตุการเขียนใหม่:' : 'Rewrite note:'}</strong> {localizedText(question.userFacingDraft.rewriteNotes, question.userFacingDraft.th?.rewriteNotes, questionLanguage)}</p>
      <p className="inventory-rationale"><strong>{questionLanguage === 'th' ? 'คำอธิบาย:' : 'Explanation:'}</strong> {localizedText(question.userFacingDraft.explanation, question.userFacingDraft.th?.explanation, questionLanguage)}</p>
    </div>
  );
}

export default async function QuestionInventoryPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const origin = await assetOrigin();
  const summary = await loadAsset<InventorySummary>(origin, '/review-inventory/summary.json');
  const allQuestions = (await loadAsset<IndexQuestion[]>(origin, '/review-inventory/index.json')) ?? [];

  if (!summary || !allQuestions.length) {
    return (
      <main className="inventory-page">
        <section className="inventory-hero">
          <div>
            <div className="inventory-nav-links">
              <Link href="/" className="inventory-back-link">Main page</Link>
              <Link href="/?view=assessment" className="inventory-back-link inventory-assessment-link">Open assessment</Link>
            </div>
            <h1>Question Inventory</h1>
            <p>
              The review inventory assets have not been generated yet. Run{' '}
              <code>node scripts/build-review-inventory-assets.mjs</code> (or restart{' '}
              <code>pnpm dev</code>, which runs it for you) to build them from
              <code>exports/review-inventory</code>.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const artifactCounts = summary.artifactCounts;
  const domain = normalizeParam(searchParams?.domain) || 'all';
  const difficulty = normalizeParam(searchParams?.difficulty) || 'all';
  const layer = normalizeParam(searchParams?.layer) || 'all';
  const source = normalizeParam(searchParams?.source) || 'all';
  const role = normalizeParam(searchParams?.role) || 'all';
  const industry = normalizeParam(searchParams?.industry) || 'all';
  const executive = normalizeParam(searchParams?.executive) || 'all';
  const format = normalizeParam(searchParams?.format) || 'all';
  const language = normalizeParam(searchParams?.lang) === 'th' ? 'th' : 'en';
  const queryInput = (normalizeParam(searchParams?.q) || '').trim();
  const query = queryInput
    .toLowerCase()
    .replace(/^[\s"'`]+|[\s,;:."'`]+$/g, '');
  const requestedPage = Number.parseInt(normalizeParam(searchParams?.page) || '1', 10);

  const filtered = allQuestions.filter((question) => {
    const matchesDomain = domain === 'all' || question.domain === domain;
    const matchesDifficulty = difficulty === 'all' || question.difficulty === difficulty;
    const matchesLayer = layer === 'all' || question.layer === layer;
    const matchesSource = source === 'all' || question.sourceInventory === source;
    const matchesRole = role === 'all' || question.functionTracks?.includes(role);
    const matchesIndustry = industry === 'all' || question.industryTracks?.includes(industry);
    const matchesExecutive = executive === 'all' || question.executiveRoles?.includes(executive);
    const matchesFormat = format === 'all' || question.recommendedFormat?.format === format || question.userFacingDraft?.format === format;
    const matchesQuery =
      !query ||
      question.id.toLowerCase().includes(query) ||
      question.prompt.toLowerCase().includes(query) ||
      question.competencyLabel.toLowerCase().includes(query) ||
      question.scopeLabel.toLowerCase().includes(query) ||
      question.sourceBank?.toLowerCase().includes(query);
    return matchesDomain && matchesDifficulty && matchesLayer && matchesSource && matchesRole && matchesIndustry && matchesExecutive && matchesFormat && matchesQuery;
  });

  const pageSize = 20;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Number.isFinite(requestedPage) ? Math.min(pageCount, Math.max(1, requestedPage)) : 1;
  const pageStart = (currentPage - 1) * pageSize;
  const visibleQuestions = await loadQuestionDetails(origin, filtered.slice(pageStart, pageStart + pageSize).map((question) => question.id));
  const domainCounts = countBy(allQuestions, (question) => question.domain);
  const difficultyCounts = countBy(allQuestions, (question) => question.difficulty);
  const layerCounts = countBy(allQuestions, (question) => question.layer);
  const domains = uniqueValues(allQuestions, (question) => question.domain);
  const difficulties = uniqueValues(allQuestions, (question) => question.difficulty);
  const layers = uniqueValues(allQuestions, (question) => question.layer);
  const sourceOptions = uniqueValues(allQuestions, (question) => question.sourceInventory ?? 'draft');
  const roleOptions = uniqueValues(allQuestions.flatMap((question) => question.functionTracks ?? []), (item) => item);
  const industryOptions = uniqueValues(allQuestions.flatMap((question) => question.industryTracks ?? []), (item) => item);
  const executiveOptions = uniqueValues(allQuestions.flatMap((question) => question.executiveRoles ?? []), (item) => item);
  const formatOptions = uniqueValues(allQuestions, (question) => question.recommendedFormat?.format ?? question.userFacingDraft?.format ?? 'unmapped');

  return (
    <main className="inventory-page">
      <section className="inventory-hero">
        <div>
          <div className="inventory-nav-links">
            <Link href="/" className="inventory-back-link">Main page</Link>
            <Link href="/?view=assessment" className="inventory-back-link inventory-assessment-link">Open assessment</Link>
          </div>
          <p className="eyebrow">Draft question review inventory</p>
          <h1>Question Inventory</h1>
          <p>
            Review existing live questions and the 3,328 draft item variants before selecting candidates for pilot or rewrite.
          </p>
          <div className="inventory-language-switch" aria-label="Review language">
            <Link className={language === 'en' ? 'is-active' : undefined} href={buildLanguageHref(searchParams, 'en')}>English</Link>
            <Link className={language === 'th' ? 'is-active' : undefined} href={buildLanguageHref(searchParams, 'th')}>ไทย</Link>
          </div>
        </div>
        <div className="inventory-status-card">
          <span>Inventory version</span>
          <strong>{summary.inventoryVersion}</strong>
          <small>{summary.draftCount.toLocaleString()} draft · {summary.liveCount.toLocaleString()} live</small>
        </div>
      </section>

      <section className="inventory-panel rewrite-warning-panel">
        <div>
          <span>Live readiness warning</span>
          <strong>These generated drafts are not user-ready yet.</strong>
          <p>
            This page shows the current coverage inventory. Many items still need a real human-facing rewrite
            before they should appear in the live assessment.
          </p>
        </div>
        <div>
          <span>Rewrite standard</span>
          <p>
            Use plain scenarios, concrete answer choices, realistic artifacts, and varied formats such as
            multi-part, select-all, matching, ranking, and artifact review.
          </p>
          <small>
            See: exports/review-inventory/user-facing-rewrite-samples.md
          </small>
        </div>
      </section>

      <section className="inventory-kpis" aria-label="Inventory totals">
        <div><span>Total questions</span><strong>{allQuestions.length.toLocaleString()}</strong></div>
        <div><span>Filtered</span><strong>{filtered.length.toLocaleString()}</strong></div>
        <div><span>Shown</span><strong>{visibleQuestions.length.toLocaleString()}</strong><small>first 80 for page speed</small></div>
        <div><span>Live bank</span><strong>{summary.liveCount.toLocaleString()}</strong></div>
        <div><span>Artifact candidates</span><strong>{artifactCounts?.artifactCandidates.toLocaleString() || 'Not scanned'}</strong></div>
      </section>

      {artifactCounts ? (
        <section className="inventory-panel artifact-summary-panel">
          <div>
            <span>Requires artifact</span>
            <strong>{(artifactCounts.byNeed['requires artifact'] || 0).toLocaleString()}</strong>
          </div>
          <div>
            <span>Artifact helpful</span>
            <strong>{(artifactCounts.byNeed['artifact helpful'] || 0).toLocaleString()}</strong>
          </div>
          <div>
            <span>Top artifact types</span>
            <p>
              {Object.entries(artifactCounts.byType)
                .sort((left, right) => right[1] - left[1])
                .slice(0, 4)
                .map(([label, count]) => `${label}: ${count}`)
                .join(' · ')}
            </p>
          </div>
        </section>
      ) : null}

      <section className="inventory-panel">
        <form className="inventory-filters">
          <label>
            <span>Source</span>
            <select name="source" defaultValue={source}>
              <option value="all">All sources</option>
              {sourceOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Domain</span>
            <select name="domain" defaultValue={domain}>
              <option value="all">All domains</option>
              {domains.map((item) => (
                <option key={item} value={item}>{item} {domainLabels[item] || ''} ({domainCounts[item]})</option>
              ))}
            </select>
          </label>
          <label>
            <span>Difficulty</span>
            <select name="difficulty" defaultValue={difficulty}>
              <option value="all">All difficulties</option>
              {difficulties.map((item) => (
                <option key={item} value={item}>{item} ({difficultyCounts[item]})</option>
              ))}
            </select>
          </label>
          <label>
            <span>Layer</span>
            <select name="layer" defaultValue={layer}>
              <option value="all">All layers</option>
              {layers.map((item) => (
                <option key={item} value={item}>{item} ({layerCounts[item]})</option>
              ))}
            </select>
          </label>
          <label>
            <span>Format</span>
            <select name="format" defaultValue={format}>
              <option value="all">All formats</option>
              {formatOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Role / function</span>
            <select name="role" defaultValue={role}>
              <option value="all">All roles</option>
              {roleOptions.map((item) => (
                <option key={item} value={item}>{labelForProfile(item)}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Industry</span>
            <select name="industry" defaultValue={industry}>
              <option value="all">All industries</option>
              {industryOptions.map((item) => (
                <option key={item} value={item}>{labelForProfile(item)}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Executive</span>
            <select name="executive" defaultValue={executive}>
              <option value="all">All executive roles</option>
              {executiveOptions.map((item) => (
                <option key={item} value={item}>{labelForProfile(item)}</option>
              ))}
            </select>
          </label>
          <label className="inventory-search">
            <span>Search</span>
            <input name="q" defaultValue={queryInput} placeholder="Prompt, competency, ID, or scope" />
          </label>
          <button type="submit">Apply filters</button>
        </form>
      </section>

      <ReviewFilterControls questionIds={visibleQuestions.map((question) => question.id)} />

      <section className="inventory-panel inventory-filter-result-panel">
        <strong>{filtered.length.toLocaleString()} questions match the server filters.</strong>
        <span>Showing {filtered.length ? pageStart + 1 : 0}-{Math.min(pageStart + pageSize, filtered.length)} on page {currentPage} of {pageCount}.</span>
        <nav className="inventory-pagination" aria-label="Question inventory pages">
          {currentPage > 1 ? <Link href={buildPageHref(searchParams, currentPage - 1)}>Previous</Link> : <span>Previous</span>}
          <strong>{currentPage} / {pageCount}</strong>
          {currentPage < pageCount ? <Link href={buildPageHref(searchParams, currentPage + 1)}>Next</Link> : <span>Next</span>}
        </nav>
      </section>

      <ReviewSync />

      <section className="inventory-grid">
        {visibleQuestions.map((question) => (
          <article className="inventory-question-card" key={question.id} data-question-id={question.id}>
            {(() => {
              const artifactNeed = question.artifactNeed;
              return artifactNeed ? (
                <div className="inventory-artifact-note">
                  <strong>{localizedText(artifactNeed.need, artifactNeed.th?.need, language)}: {localizedText(artifactNeed.artifactLabel, artifactNeed.th?.artifactLabel, language)}</strong>
                  <p>{localizedText(artifactNeed.artifactBrief, artifactNeed.th?.artifactBrief, language)}</p>
                  {(artifactNeed.prompt || artifactNeed.generationPrompt) ? (
                    <details>
                      <summary>{language === 'th' ? 'Prompt สำหรับสร้าง artifact' : 'Artifact generation prompt'}</summary>
                      <p>{localizedText(artifactNeed.prompt || artifactNeed.generationPrompt, artifactNeed.th?.prompt, language)}</p>
                    </details>
                  ) : null}
                </div>
              ) : null;
            })()}
            <div className="inventory-question-meta">
              <span>{question.domain} {domainLabels[question.domain]}</span>
              <span>{question.difficulty}</span>
              <span>{question.layer}</span>
              <span>{question.scopeLabel}</span>
              <span>{question.sourceInventory}</span>
              {question.recommendedFormat ? <span>{question.recommendedFormat.format}</span> : null}
            </div>
            <QuestionReviewStats questionId={question.id} />
            <div className="inventory-question-language">
              <input
                type="radio"
                id={`${safeDomId(question.id)}-lang-en`}
                name={`${safeDomId(question.id)}-language`}
                defaultChecked={language === 'en'}
              />
              <input
                type="radio"
                id={`${safeDomId(question.id)}-lang-th`}
                name={`${safeDomId(question.id)}-language`}
                defaultChecked={language === 'th'}
              />
              <div className="inventory-question-language-tabs">
                <label htmlFor={`${safeDomId(question.id)}-lang-en`}>English</label>
                <label htmlFor={`${safeDomId(question.id)}-lang-th`}>ไทย</label>
              </div>
              <div className="inventory-language-pane inventory-language-pane-en">
                {renderUserFacingDraft(question, 'en')}
              </div>
              <div className="inventory-language-pane inventory-language-pane-th">
                {renderUserFacingDraft(question, 'th')}
              </div>
            </div>
            <dl>
              <div><dt>ID</dt><dd>{question.id}</dd></div>
              <div><dt>Source</dt><dd>{question.sourceBank}</dd></div>
              <div><dt>Competency</dt><dd>{question.competencyLabel}</dd></div>
              <div><dt>Task</dt><dd>{question.cognitiveTask}</dd></div>
              <div><dt>Review</dt><dd>{question.review?.status || 'Pending'}</dd></div>
              <div><dt>Roles</dt><dd>{question.functionLabels?.join(', ') || question.functionTracks?.map(labelForProfile).join(', ') || 'All/general'}</dd></div>
              <div><dt>Industries</dt><dd>{question.industryLabels?.join(', ') || question.industryTracks?.map(labelForProfile).join(', ') || 'All/general'}</dd></div>
              <div><dt>Executive</dt><dd>{question.executiveLabels?.join(', ') || question.executiveRoles?.map(labelForProfile).join(', ') || 'Not role-specific'}</dd></div>
            </dl>
            <ReviewerFeedback questionId={question.id} />
            {question.recommendedFormat ? (
              <div className="inventory-format-note">
                <strong>Recommended live format: {question.recommendedFormat.format}</strong>
                <p>{question.recommendedFormat.reason}</p>
                <small>{question.recommendedFormat.rewritePrompt}</small>
                {question.recommendedFormat.sampleParts?.length ? (
                  <ol>
                    {question.recommendedFormat.sampleParts.map((part) => (
                      <li key={part.prompt}>
                        <b>{part.prompt}</b>
                        <span>{part.expectedEvidence}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </div>
            ) : null}
            <details className="inventory-original">
              <summary>Original audit wording</summary>
              <h3>{localizedText(question.prompt, question.th?.prompt, language)}</h3>
              <p>{localizedText(question.context, question.th?.context, language)}</p>
              <ol className="inventory-options">
                {question.options.map((option) => (
                  <li key={option.id} className={question.correctOptionIds.includes(option.id) ? 'is-correct' : undefined}>
                    <strong>{option.id.toUpperCase()}.</strong> {localizedOption(option, language)}
                  </li>
                ))}
              </ol>
              <p className="inventory-rationale"><strong>{language === 'th' ? 'เหตุผล:' : 'Rationale:'}</strong> {localizedText(question.rationale, question.th?.rationale, language)}</p>
            </details>
          </article>
        ))}
        {!visibleQuestions.length ? (
          <article className="inventory-question-card inventory-empty-state">
            <h2>No questions match these filters yet.</h2>
            <p>Try broadening the source, role, industry, difficulty, or search filters.</p>
          </article>
        ) : null}
      </section>
      {visibleQuestions.length ? (
        <nav className="inventory-pagination inventory-pagination-footer" aria-label="Question inventory pages">
          {currentPage > 1 ? <Link href={buildPageHref(searchParams, currentPage - 1)}>Previous</Link> : <span>Previous</span>}
          <strong>Page {currentPage} of {pageCount}</strong>
          {currentPage < pageCount ? <Link href={buildPageHref(searchParams, currentPage + 1)}>Next</Link> : <span>Next</span>}
        </nav>
      ) : null}
    </main>
  );
}
