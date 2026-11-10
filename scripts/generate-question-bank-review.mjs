import { mkdir, writeFile } from 'node:fs/promises';
import { generateQuestionDrafts, validateQuestionBank } from '../agent/question-bank-agent.mjs';

const bank = generateQuestionDrafts();
const validation = validateQuestionBank(bank);
if (!validation.valid) throw new Error(validation.errors.join('\n'));
await mkdir('exports/agent-question-bank', { recursive: true });
await writeFile('exports/agent-question-bank/questions.json', `${JSON.stringify(bank, null, 2)}\n`);
console.log(`Wrote ${validation.count} isolated agent-generated drafts to exports/agent-question-bank/questions.json`);
