import type { Bilingual, ConnectedLabId, LabDraft } from './watch-model';

type LabChoice = { id: string; label: Bilingual; feedback: Bilingual };
export type LabCriterion = { id: string; prompt: Bilingual; correct: string; choices: LabChoice[] };
export type ConnectedLab = {
  id: ConnectedLabId; version: string; title: Bilingual; minutes: number; goal: Bilingual;
  evidenceTitle: Bilingual; evidence: Bilingual[]; instructions: Bilingual;
  criteria: LabCriterion[]; takeaway: Bilingual; debrief: Bilingual;
};
const b = (en: string, th: string): Bilingual => ({ en, th });

export const connectedLabs: Record<ConnectedLabId, ConnectedLab> = {
  'agent-boundaries': {
    id: 'agent-boundaries', version: 'agent-boundaries@1', title: b('Set the agent’s approval boundary', 'กำหนดจุดอนุมัติให้ Agent'), minutes: 4,
    goal: b('Match tool permissions and human review to the action an agent can take.', 'กำหนดสิทธิ์เครื่องมือและการตรวจสอบโดยคนให้เหมาะกับสิ่งที่ Agent ทำได้'),
    evidenceTitle: b('Pilot configuration: refund assistant', 'การตั้งค่า Pilot: ผู้ช่วยคืนเงิน'),
    evidence: [
      b('Task: read the approved policy and ticket, then draft a customer reply.', 'งาน: อ่านนโยบายที่อนุมัติแล้วและ Ticket จากนั้นร่างคำตอบให้ลูกค้า'),
      b('Enabled tools: read_ticket, read_policy, draft_reply, send_reply, issue_refund.', 'เครื่องมือที่เปิดใช้: read_ticket, read_policy, draft_reply, send_reply, issue_refund'),
      b('Policy: refunds above ฿2,000 or any exception require a manager’s approval before action.', 'นโยบาย: คืนเงินเกิน ฿2,000 หรือกรณียกเว้นทุกกรณี ต้องให้ผู้จัดการอนุมัติก่อนดำเนินการ'),
      b('Ticket: ฿2,400 requested; customer is outside the normal return window. The model proposes “issue refund, then send confirmation.” No approval is recorded.', 'Ticket: ลูกค้าขอคืนเงิน ฿2,400 และพ้นกำหนดคืนสินค้าปกติแล้ว Model เสนอให้ “คืนเงินแล้วส่งข้อความยืนยัน” แต่ยังไม่มีบันทึกการอนุมัติ'),
    ],
    instructions: b('Choose one action for each decision. Explain your thinking in the optional note, check the two criteria, then revise if needed.', 'เลือกหนึ่งคำตอบในแต่ละข้อ เขียนเหตุผลเพิ่มเติมได้ ตรวจสอบเกณฑ์ทั้งสองข้อ แล้วแก้ไขได้ตามคำแนะนำ'),
    criteria: [
      { id: 'permissions', prompt: b('Which tool configuration fits this drafting pilot?', 'การตั้งค่าเครื่องมือแบบใดเหมาะกับ Pilot สำหรับร่างคำตอบนี้?'), correct: 'draft-only', choices: [
        { id: 'draft-only', label: b('Allow reading and drafting; disable send_reply and issue_refund for the agent.', 'ให้อ่านและร่างได้ แต่ปิด send_reply และ issue_refund สำหรับ Agent'), feedback: b('This enforces the pilot’s drafting scope at the tool boundary. A careful prompt alone would not do that.', 'วิธีนี้บังคับขอบเขตการร่างที่สิทธิ์เครื่องมือ แค่เขียน Prompt ให้ระวังไม่สามารถบังคับได้เหมือนกัน') },
        { id: 'prompt-only', label: b('Keep every tool and add “always be careful” to the prompt.', 'เปิดทุกเครื่องมือไว้ แล้วเพิ่ม “ระวังเสมอ” ใน Prompt'), feedback: b('The tool account could still send or refund. A vague instruction does not enforce the drafting-only scope.', 'บัญชีเครื่องมือยังส่งข้อความหรือคืนเงินได้ คำสั่งกว้าง ๆ ไม่ได้จำกัดขอบเขตให้ร่างอย่างเดียว') },
        { id: 'after-review', label: b('Keep every tool and review completed refunds at the end of the week.', 'เปิดทุกเครื่องมือไว้ แล้วตรวจรายการคืนเงินตอนสิ้นสัปดาห์'), feedback: b('After-the-fact review would discover an action only after money or messages had already gone out.', 'การตรวจย้อนหลังพบปัญหาได้หลังเงินหรือข้อความถูกส่งไปแล้ว') },
      ] },
      { id: 'escalation', prompt: b('What should happen to this specific ticket?', 'Ticket นี้ควรดำเนินการอย่างไร?'), correct: 'manager', choices: [
        { id: 'auto', label: b('Refund automatically because the proposed reply sounds reasonable.', 'คืนเงินอัตโนมัติเพราะคำตอบที่เสนอฟังดูสมเหตุสมผล'), feedback: b('The amount exceeds ฿2,000 and the return is an exception. The proposal is not an approval.', 'ยอดเกิน ฿2,000 และเป็นกรณียกเว้น ข้อเสนอของ Model ไม่ใช่การอนุมัติ') },
        { id: 'manager', label: b('Prepare a draft and escalate both the amount and exception to a manager before action.', 'เตรียมร่าง แล้วส่งทั้งประเด็นยอดเงินและข้อยกเว้นให้ผู้จัดการก่อนดำเนินการ'), feedback: b('Both policy conditions apply. Keep the draft separate from the approval and record the manager’s decision.', 'เข้าเงื่อนไขนโยบายทั้งสองข้อ ต้องแยกร่างออกจากการอนุมัติและบันทึกการตัดสินใจของผู้จัดการ') },
        { id: 'split', label: b('Split the payment into two smaller refunds to stay below the threshold.', 'แบ่งคืนเงินเป็นสองยอดเพื่อให้แต่ละยอดต่ำกว่าเกณฑ์'), feedback: b('Splitting the payment evades the approval rule and does not resolve the exception.', 'การแบ่งยอดเป็นการเลี่ยงกฎอนุมัติ และไม่ได้แก้ประเด็นข้อยกเว้น') },
      ] },
    ],
    takeaway: b('Define the task → restrict tools → detect exceptions → obtain approval → record the action.', 'กำหนดงาน → จำกัดเครื่องมือ → ตรวจข้อยกเว้น → ขออนุมัติ → บันทึกการดำเนินการ'),
    debrief: b('A useful agent can prepare work without being authorized to execute it. Test the tool boundary as well as the written instruction.', 'Agent ช่วยเตรียมงานได้โดยไม่ต้องมีสิทธิ์ลงมือทำทุกอย่าง ควรทดสอบสิทธิ์เครื่องมือควบคู่กับคำสั่งที่เขียนไว้'),
  },
  'evidence-check': {
    id: 'evidence-check', version: 'evidence-check@1', title: b('Check an AI claim against the evidence', 'ตรวจข้ออ้างของ AI เทียบกับหลักฐาน'), minutes: 4,
    goal: b('Separate a measured result from a broader claim and choose a test that can support the next decision.', 'แยกผลที่วัดได้ออกจากข้ออ้างที่กว้างกว่า แล้วเลือกการทดสอบเพื่อรองรับการตัดสินใจต่อไป'),
    evidenceTitle: b('Pilot report: automated support assistant', 'รายงาน Pilot: ผู้ช่วยตอบลูกค้าอัตโนมัติ'),
    evidence: [
      b('Headline generated by AI: “The assistant resolves 90% of all customer tickets safely.”', 'พาดหัวที่ AI สร้าง: “ผู้ช่วยแก้ไข Ticket ลูกค้าทุกประเภทได้อย่างปลอดภัย 90%”'),
      b('Test sample: 20 routine password-reset tickets. Human reviewers accepted 18 draft replies.', 'กลุ่มทดสอบ: Ticket รีเซ็ตรหัสผ่านทั่วไป 20 รายการ ผู้ตรวจรับร่างคำตอบ 18 รายการ'),
      b('Excluded: refunds, account takeovers, policy exceptions, and non-English tickets.', 'ไม่รวม: การคืนเงิน การยึดบัญชี ข้อยกเว้นนโยบาย และ Ticket ที่ไม่ใช่ภาษาอังกฤษ'),
      b('The assistant drafted replies only. Reviewers sent them. The pilot did not measure autonomous resolution or rare safety failures.', 'ผู้ช่วยร่างคำตอบเท่านั้น ผู้ตรวจเป็นคนส่ง Pilot ไม่ได้วัดการแก้ปัญหาอัตโนมัติหรือเหตุด้านความปลอดภัยที่พบได้น้อย'),
    ],
    instructions: b('Choose one answer per criterion using only this report. Your note is for reflection and is not automatically graded.', 'เลือกหนึ่งคำตอบต่อเกณฑ์โดยใช้รายงานนี้เท่านั้น บันทึกของคุณใช้ทบทวนและไม่ได้ตรวจให้คะแนนอัตโนมัติ'),
    criteria: [
      { id: 'claim', prompt: b('Which statement is supported by the measured evidence?', 'ข้อความใดมีหลักฐานจากผลที่วัดได้รองรับ?'), correct: 'bounded', choices: [
        { id: 'all', label: b('The assistant resolves 90% of all customer tickets without supervision.', 'ผู้ช่วยแก้ Ticket ทุกประเภทได้ 90% โดยไม่ต้องมีคนดูแล'), feedback: b('The test covered one routine task and only draft acceptance. It did not measure autonomous resolution.', 'การทดสอบครอบคลุมงานทั่วไปชนิดเดียวและวัดการรับร่าง ไม่ได้วัดการแก้ปัญหาอัตโนมัติ') },
        { id: 'bounded', label: b('Reviewers accepted 18 of 20 password-reset drafts; other tasks and autonomous resolution remain untested.', 'ผู้ตรวจรับร่างรีเซ็ตรหัสผ่าน 18 จาก 20 รายการ งานอื่นและการแก้ปัญหาอัตโนมัติยังไม่ได้ทดสอบ'), feedback: b('18 ÷ 20 is 90%, but the denominator and task boundary matter. This wording preserves both.', '18 ÷ 20 เท่ากับ 90% แต่ต้องบอกตัวหารและขอบเขตงานด้วย ข้อความนี้รักษาข้อมูลทั้งสองส่วนไว้') },
        { id: 'unsafe', label: b('The assistant is unsafe for every customer-support task.', 'ผู้ช่วยไม่ปลอดภัยสำหรับงานบริการลูกค้าทุกประเภท'), feedback: b('The sample does not support that conclusion either. Lack of evidence for broad use is not proof of universal failure.', 'กลุ่มตัวอย่างก็ไม่รองรับข้อสรุปนี้เช่นกัน การไม่มีหลักฐานสำหรับการใช้งานกว้าง ๆ ไม่ได้พิสูจน์ว่าล้มเหลวทุกกรณี') },
      ] },
      { id: 'next-test', prompt: b('Which next test best addresses the gaps before wider use?', 'การทดสอบใดช่วยตอบช่องว่างก่อนขยายการใช้งานได้ดีที่สุด?'), correct: 'representative', choices: [
        { id: 'repeat', label: b('Repeat the same 20 tickets and average the model’s confidence.', 'ใช้ Ticket เดิม 20 รายการซ้ำ แล้วเฉลี่ยความมั่นใจของ Model'), feedback: b('Repeated examples and self-reported confidence do not cover excluded tasks or measure the missing outcomes.', 'การใช้ตัวอย่างเดิมและความมั่นใจของ Model ไม่ครอบคลุมงานที่ถูกตัดออกหรือผลลัพธ์ที่ยังไม่ได้วัด') },
        { id: 'launch', label: b('Enable automatic sends for every customer and count complaints later.', 'เปิดส่งอัตโนมัติให้ลูกค้าทุกคน แล้วค่อยนับข้อร้องเรียน'), feedback: b('That expands exposure before testing the exclusions and approval boundary. Complaints alone also miss silent errors.', 'วิธีนี้ขยายการใช้งานก่อนทดสอบกรณีที่ตัดออกและขอบเขตอนุมัติ อีกทั้งข้อร้องเรียนอาจไม่พบข้อผิดพลาดที่ไม่มีคนรายงาน') },
        { id: 'representative', label: b('Run a bounded, human-reviewed test across intended task types and languages, with error and escalation criteria.', 'ทดสอบในขอบเขตจำกัดโดยมีคนตรวจ ครอบคลุมประเภทงานและภาษาที่จะใช้ พร้อมเกณฑ์ข้อผิดพลาดและการส่งต่อ'), feedback: b('This addresses coverage and defines what success or failure means before expanding authority.', 'วิธีนี้ตรวจความครอบคลุมและกำหนดความสำเร็จหรือความล้มเหลวก่อนขยายอำนาจการทำงาน') },
      ] },
    ],
    takeaway: b('Check the denominator → name the task → inspect exclusions → distinguish drafts from actions → test the remaining gaps.', 'ตรวจตัวหาร → ระบุงาน → ตรวจกรณีที่ไม่รวม → แยกร่างจากการลงมือทำ → ทดสอบช่องว่างที่เหลือ'),
    debrief: b('A correct percentage can still support a misleading headline. Keep the claim within the scope of what was measured.', 'เปอร์เซ็นต์ที่คำนวณถูกก็อาจถูกใช้ในพาดหัวที่ทำให้เข้าใจผิดได้ ต้องจำกัดข้ออ้างให้อยู่ในขอบเขตที่วัดจริง'),
  },
};

export function emptyLabDraft(lab: ConnectedLab): LabDraft {
  return { version: lab.version, answers: {}, note: '', checked: false, takeawaySaved: false };
}

/** A version change cannot reuse an old completion, answer key, or saved-takeaway decision. */
export function currentLabDraft(lab: ConnectedLab, saved?: LabDraft): LabDraft {
  if (!saved || saved.version !== lab.version) return emptyLabDraft(lab);
  const answers = Object.fromEntries(lab.criteria.flatMap(criterion => criterion.choices.some(choice => choice.id === saved.answers[criterion.id]) ? [[criterion.id, saved.answers[criterion.id]]] : []));
  const complete = lab.criteria.every(criterion => answers[criterion.id] === criterion.correct);
  return { ...saved, answers, checked: saved.checked && Object.keys(answers).length === lab.criteria.length, takeawaySaved: saved.takeawaySaved && saved.checked && complete };
}

export function evaluateConnectedLab(lab: ConnectedLab, draft: LabDraft) {
  const criteria = lab.criteria.map(criterion => ({ criterion, choice: criterion.choices.find(choice => choice.id === draft.answers[criterion.id]), met: draft.answers[criterion.id] === criterion.correct }));
  return { criteria, ready: criteria.every(row => Boolean(row.choice)), complete: criteria.every(row => row.met) };
}
