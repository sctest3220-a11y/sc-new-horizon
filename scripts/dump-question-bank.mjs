// Dumps the question bank + metadata from app/page.tsx to JSON (no UI dependencies).
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const source = await fs.readFile(path.resolve('app/page.tsx'), 'utf8');
const withoutImports = source.replace(/^'use client';\s*/u, '').replace(/^import .*?;\s*/gmu, '');
const constantsOnly = withoutImports.slice(0, withoutImports.indexOf('export default function Home()'));
// The Thai translation table lives in a sibling module; inline it so localizeQuestion() and the dump can see it.
const translationsSource = (await fs.readFile(path.resolve('app/questionTranslations.th.ts'), 'utf8'))
  .replace(/^export type .*?;\n\n/gmsu, '')
  .replace(/^export type QuestionTranslation = \{[\s\S]*?\n\};\n/mu, '')
  .replace(/^export const questionTranslationsTh: Record<string, QuestionTranslation> =/mu, 'const questionTranslationsTh =');
const appended = `
globalThis.__dump = { domains, difficultyLabels, difficultyDescriptions, competencyDefinitions, broadCompetencyMap,
  functionLabels, industryLabels, executiveLabels, functionPriorityCompetencies, industryPriorityCompetencies,
  executivePriorityCompetencies, questionBank, executiveQuestionBank, executiveAssessmentQuestionBank, allAssessmentItems,
  generalRelianceQuestions, horizonRelianceQuestions, executiveRelianceQuestions, functionalQuestionBank,
  competencyDepthQuestionBank, marketTrendQuestionBank, advancedCompetencyQuestionBank, thaiUiCopy,
  hiddenArtifactQuestionIds: [...hiddenArtifactQuestionIds], modeConfig, questionTranslationsTh, localizeQuestion, scoreTextAnswer };`;
const js = ts.transpileModule(translationsSource + constantsOnly + appended, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } }).outputText;
const sandbox = { console, Math, Date, Set, Map, RegExp, Array, Object, String, Number, Boolean, JSON, process: { env: {} } };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(js, sandbox, { filename: 'dump.vm.js' });
const d = sandbox.__dump;
const bankNames = ['generalRelianceQuestions','horizonRelianceQuestions','executiveRelianceQuestions','functionalQuestionBank','competencyDepthQuestionBank','marketTrendQuestionBank','advancedCompetencyQuestionBank','executiveQuestionBank','questionBank','executiveAssessmentQuestionBank'];
const out = { ...d, banks: Object.fromEntries(bankNames.map((n) => [n, d[n].map((q) => q.id)])) };
for (const n of bankNames) delete out[n];
out.questions = [...new Map([...d.questionBank, ...d.executiveAssessmentQuestionBank, ...d.executiveQuestionBank, ...d.allAssessmentItems].map((q) => [q.id, q])).values()];
const outPath = process.argv[2] ?? 'exports/question-bank-dump.json';
await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, JSON.stringify(out));
console.log(JSON.stringify({ outPath, questions: out.questions.length, thaiUiEntries: Object.keys(d.thaiUiCopy).length }));
