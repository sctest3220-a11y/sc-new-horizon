import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const appPath = path.resolve('app/page.tsx');
const outDir = path.resolve('exports');
const outPath = path.join(outDir, 'new-horizon-question-bank-review.xlsx');
const artifactToolPath = '/Users/SC/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const source = await fs.readFile(appPath, 'utf8');
const withoutImports = source
  .replace(/^'use client';\s*/u, '')
  .replace(/^import .*?;\s*/gmu, '');
const constantsOnly = withoutImports.slice(0, withoutImports.indexOf('export default function Home()'));

const appended = `
globalThis.__questionBankExport = {
  domains,
  difficultyLabels,
  difficultyDescriptions,
  competencyDefinitions,
  broadCompetencyMap,
  functionLabels,
  industryLabels,
  executiveLabels,
  functionPriorityCompetencies,
  industryPriorityCompetencies,
  executivePriorityCompetencies,
  questionBank,
  executiveQuestionBank,
  executiveAssessmentQuestionBank,
  allAssessmentItems,
  generalRelianceQuestions,
  executiveRelianceQuestions,
  functionalQuestionBank,
  competencyDepthQuestionBank,
  marketTrendQuestionBank,
  advancedCompetencyQuestionBank,
};
`;

const js = ts.transpileModule(constantsOnly + appended, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.React,
  },
}).outputText;

const sandbox = {
  console,
  Math,
  Date,
  Set,
  Map,
  RegExp,
  Array,
  Object,
  String,
  Number,
  Boolean,
  process: { env: {} },
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(js, sandbox, { filename: 'question-bank-export.vm.js' });

const data = sandbox.__questionBankExport;

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function expandCompetencyIds(ids = []) {
  return unique(ids.flatMap((id) => data.broadCompetencyMap[id] ?? [id]));
}

function join(values) {
  return unique(values).join('; ');
}

function optionSummary(question) {
  if (question.parts?.length) {
    return question.parts.map((part) => {
      const options = (part.options ?? []).map((option) => `${option.id}: ${option.label} (${option.score})`).join(' | ');
      return `${part.id}: ${part.prompt} [${options}]`;
    }).join('\n');
  }
  if (question.matchPairs?.length) {
    return question.matchPairs.map((pair) => `${pair.id}: ${pair.left} -> ${pair.correct}; choices: ${pair.choices.join(' | ')}`).join('\n');
  }
  if (question.rankItems?.length) {
    return question.rankItems.map((item) => `${item.id}: ${item.label}`).join('\n');
  }
  return (question.options ?? []).map((option) => `${option.id}: ${option.label} (${option.score})`).join('\n');
}

function correctSummary(question) {
  if (question.correctOptionIds?.length) return question.correctOptionIds.join('; ');
  if (question.idealOrder?.length) return question.idealOrder.join(' > ');
  if (question.matchPairs?.length) return question.matchPairs.map((pair) => `${pair.left} -> ${pair.correct}`).join('; ');
  if (question.parts?.length) return question.parts.map((part) => `${part.id}: ${part.correctOptionId}`).join('; ');
  const highScoreOptions = (question.options ?? []).filter((option) => option.score >= 82).map((option) => option.id);
  return highScoreOptions.join('; ');
}

function sourceBanks(question) {
  const banks = [
    ['General reliance', data.generalRelianceQuestions],
    ['Executive reliance', data.executiveRelianceQuestions],
    ['Functional', data.functionalQuestionBank],
    ['Competency depth', data.competencyDepthQuestionBank],
    ['Market trends', data.marketTrendQuestionBank],
    ['Advanced competency', data.advancedCompetencyQuestionBank],
    ['Executive bank', data.executiveQuestionBank],
    ['Main bank', data.questionBank],
    ['Executive assessment bank', data.executiveAssessmentQuestionBank],
  ];
  return banks.filter(([, bank]) => bank.some((item) => item.id === question.id)).map(([label]) => label);
}

function assessmentModes(question) {
  const modes = [];
  if (data.questionBank.some((item) => item.id === question.id)) modes.push('free/premium');
  if (data.executiveAssessmentQuestionBank.some((item) => item.id === question.id)) modes.push('executive');
  return modes;
}

function inferredRoleMapping(expandedCompetencyIds) {
  const functions = Object.entries(data.functionPriorityCompetencies)
    .filter(([, ids]) => expandedCompetencyIds.some((id) => ids.includes(id)))
    .map(([id]) => data.functionLabels[id] ?? id);
  const industries = Object.entries(data.industryPriorityCompetencies)
    .filter(([, ids]) => expandedCompetencyIds.some((id) => ids.includes(id)))
    .map(([id]) => data.industryLabels[id] ?? id);
  const executives = Object.entries(data.executivePriorityCompetencies)
    .filter(([, ids]) => expandedCompetencyIds.some((id) => ids.includes(id)))
    .map(([id]) => data.executiveLabels[id] ?? id);
  return { functions, industries, executives };
}

const uniqueQuestions = [...new Map(
  [...data.questionBank, ...data.executiveAssessmentQuestionBank, ...data.executiveQuestionBank, ...data.allAssessmentItems]
    .map((question) => [question.id, question]),
).values()];

const questionHeaders = [
  'Review status',
  'Reviewer notes',
  'Suggested change',
  'Question ID',
  'Source bank',
  'Assessment mode',
  'Domain',
  'Domain label',
  'Secondary domains',
  'Difficulty',
  'Question type',
  'Interaction',
  'Evidence mode',
  'Raw competency IDs',
  'Expanded competency IDs',
  'Competency labels',
  'Skill IDs',
  'Explicit function tracks',
  'Explicit industry tracks',
  'Inferred function roles',
  'Inferred industry mapping',
  'Inferred executive mapping',
  'Artifact source',
  'Artifact label',
  'Artifact caption',
  'Visual stimulus title',
  'Context',
  'Prompt',
  'Options / parts',
  'Correct answer / expected evidence',
  'Rubric criteria',
  'Exemplar answer',
];

const questionRows = uniqueQuestions.map((question) => {
  const expanded = expandCompetencyIds(question.competencyIds);
  const inferred = inferredRoleMapping(expanded);
  return [
    '',
    '',
    '',
    question.id,
    join(sourceBanks(question)),
    join(assessmentModes(question)),
    question.domain,
    data.domains[question.domain]?.name ?? '',
    join(question.secondaryDomains ?? []),
    data.difficultyLabels[question.difficulty] ?? question.difficulty,
    question.type,
    question.interaction ?? 'single',
    question.evidenceMode ?? '',
    join(question.competencyIds ?? []),
    join(expanded),
    join(expanded.map((id) => data.competencyDefinitions[id]?.label ?? id)),
    join(question.skillIds ?? []),
    join((question.functionTracks ?? []).map((id) => data.functionLabels[id] ?? id)),
    join((question.industryTracks ?? []).map((id) => data.industryLabels[id] ?? id)),
    join(inferred.functions),
    join(inferred.industries),
    join(inferred.executives),
    question.stimulus?.src ?? '',
    question.stimulus?.label ?? '',
    question.stimulus?.caption ?? '',
    question.visualStimulus?.title ?? '',
    question.context,
    question.prompt,
    optionSummary(question),
    correctSummary(question),
    (question.rubricCriteria ?? []).map((criterion) => `${criterion.id}: ${criterion.label} (${criterion.points})`).join('\n'),
    question.exemplarAnswer ?? '',
  ];
});

const summaryHeaders = ['Metric', 'Value'];
const byDomain = Object.keys(data.domains).map((domain) => [
  `${domain} ${data.domains[domain].short}`,
  uniqueQuestions.filter((question) => question.domain === domain).length,
]);
const byDifficulty = ['awareness', 'applied', 'proficient', 'advanced'].map((difficulty) => [
  data.difficultyLabels[difficulty],
  uniqueQuestions.filter((question) => question.difficulty === difficulty).length,
]);
const byInteraction = Object.entries(uniqueQuestions.reduce((acc, question) => {
  const key = question.interaction ?? 'single';
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, {})).sort(([left], [right]) => left.localeCompare(right));

const summaryRows = [
  ['Export date', new Date().toISOString()],
  ['Total unique questions', uniqueQuestions.length],
  ['Artifact-backed questions', uniqueQuestions.filter((question) => question.stimulus || question.visualStimulus).length],
  ['Main free/premium bank questions', data.questionBank.length],
  ['Executive assessment bank questions', data.executiveAssessmentQuestionBank.length],
  ['', ''],
  ['By domain', ''],
  ...byDomain,
  ['', ''],
  ['By difficulty', ''],
  ...byDifficulty,
  ['', ''],
  ['By interaction', ''],
  ...byInteraction,
];

const competencyHeaders = ['Competency ID', 'Domain', 'Competency label', 'Skills', 'Questions mapped', 'Inferred function roles', 'Inferred industry mapping', 'Inferred executive mapping'];
const competencyRows = Object.values(data.competencyDefinitions).map((competency) => {
  const questions = uniqueQuestions.filter((question) => expandCompetencyIds(question.competencyIds).includes(competency.id));
  const inferred = inferredRoleMapping([competency.id]);
  return [
    competency.id,
    competency.domain,
    competency.label,
    join(competency.skills),
    questions.length,
    join(inferred.functions),
    join(inferred.industries),
    join(inferred.executives),
  ];
});

const { Workbook } = await import(artifactToolPath);

function cellAddress(row, col) {
  let letters = '';
  let n = col + 1;
  while (n > 0) {
    const mod = (n - 1) % 26;
    letters = String.fromCharCode(65 + mod) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return `${letters}${row + 1}`;
}

function rangeAddress(row, col, rowCount, colCount) {
  return `${cellAddress(row, col)}:${cellAddress(row + rowCount - 1, col + colCount - 1)}`;
}

function writeSheet(workbook, name, rows, tableName) {
  const sheet = workbook.worksheets.add(name);
  const address = rangeAddress(0, 0, rows.length, rows[0].length);
  sheet.getRange(address).values = rows;
  sheet.tables.add(address, true, tableName);
  return sheet;
}

const workbook = Workbook.create();
writeSheet(workbook, 'Summary', [summaryHeaders, ...summaryRows], 'SummaryTable');
writeSheet(workbook, 'Question Bank', [questionHeaders, ...questionRows], 'QuestionBankTable');
writeSheet(workbook, 'Competencies', [competencyHeaders, ...competencyRows], 'CompetenciesTable');
workbook.worksheets.setActiveWorksheet('Summary');

await fs.mkdir(outDir, { recursive: true });
const blob = await workbook.export({ format: 'xlsx' });
await fs.writeFile(outPath, new Uint8Array(await blob.arrayBuffer()));

console.log(JSON.stringify({
  outPath,
  questions: uniqueQuestions.length,
  artifacts: uniqueQuestions.filter((question) => question.stimulus || question.visualStimulus).length,
  byDomain: Object.fromEntries(byDomain),
  byDifficulty: Object.fromEntries(byDifficulty),
}, null, 2));
