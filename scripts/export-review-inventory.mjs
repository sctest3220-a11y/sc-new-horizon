import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { SpreadsheetFile, Workbook } from '../work/review-inventory/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

// Uses the bundled artifact runtime through a local ignored junction; no package changes.
const root = new URL('../', import.meta.url);
const outputDir = new URL('outputs/new-horizon-review-inventory/', root);
const exportsDir = new URL('exports/review-inventory/', root);
const payload = JSON.parse(await fs.readFile(new URL('questions.json', exportsDir), 'utf8'));
const audit = JSON.parse(await fs.readFile(new URL('coverage.json', exportsDir), 'utf8'));
const questions = payload.questions;
const workbook = Workbook.create();
const summary = workbook.worksheets.add('Summary');
const items = workbook.worksheets.add('Questions');
const coverage = workbook.worksheets.add('Coverage');
const end = questions.length + 1;
const palette = { ink: '#142638', header: '#223F62', line: '#CBD5E1', input: '#FFF5D6' };

function base(sheet, range) {
  sheet.showGridLines = false;
  sheet.getRange(range).format.font = { name: 'Arial', size: 11, color: palette.ink };
  sheet.getRange(range).format.verticalAlignment = 'top';
}
function heading(sheet, range) {
  sheet.getRange(range).format = {
    fill: palette.header,
    font: { name: 'Arial', size: 11, bold: true, color: '#FFFFFF' },
    wrapText: true,
    rowHeight: 32,
    borders: { insideVertical: { style: 'thin', color: '#FFFFFF' } },
  };
}

const headers = ['Question ID', 'Layer', 'Scope', 'Competency', 'Difficulty', 'Context and evidence', 'Question', 'Answer choices', 'Answer key', 'Explanation', 'Decision', 'Reviewer', 'Review notes', 'Answer-key check', 'Difficulty check', 'Specialization check', 'Language check', 'Similarity check', 'Review flags', 'Family ID', 'Case pattern', 'Content hash', 'Language'];
const rows = questions.map(q => [
  q.id, q.layer, q.scopeLabel, q.competencyLabel, q.difficulty, q.context, q.prompt,
  q.options.map(option => `${option.id.toUpperCase()}. ${option.label}`).join('\n\n'),
  q.correctOptionIds[0].toUpperCase(), q.rationale,
  'Pending', '', '', 'Pending', 'Pending', q.layer === 'core' ? 'Not applicable' : 'Pending',
  'Pending', 'Pending', q.qualityFlags.join('\n'), q.familyId, q.casePatternId, q.contentHash, q.locale,
]);
items.getRange(`A1:W${end}`).values = [headers, ...rows];
base(items, `A1:W${end}`);
items.getRange(`A1:W${end}`).format.wrapText = true;
items.getRange(`A1:A${end}`).format.columnWidth = 45;
items.getRange(`B1:B${end}`).format.columnWidth = 14;
items.getRange(`C1:D${end}`).format.columnWidth = 28;
items.getRange(`E1:E${end}`).format.columnWidth = 14;
items.getRange(`F1:F${end}`).format.columnWidth = 78;
items.getRange(`G1:G${end}`).format.columnWidth = 58;
items.getRange(`H1:H${end}`).format.columnWidth = 95;
items.getRange(`I1:I${end}`).format.columnWidth = 12;
items.getRange(`J1:J${end}`).format.columnWidth = 70;
items.getRange(`K1:L${end}`).format.columnWidth = 22;
items.getRange(`M1:M${end}`).format.columnWidth = 60;
items.getRange(`N1:R${end}`).format.columnWidth = 24;
items.getRange(`S1:V${end}`).format.columnWidth = 48;
items.getRange(`W1:W${end}`).format.columnWidth = 12;
items.getRange(`A2:W${end}`).format.rowHeight = 185;
items.getRange(`K2:R${end}`).format.fill = palette.input;
items.getRange(`K2:K${end}`).dataValidation = { rule: { type: 'list', values: ['Pending', 'Approve for pilot', 'Revise', 'Reject'] } };
items.getRange(`N2:R${end}`).dataValidation = { rule: { type: 'list', values: ['Pending', 'Accept', 'Revise', 'Not applicable'] } };
const itemTable = items.tables.add(`A1:W${end}`, true, 'ReviewQuestions');
itemTable.showFilterButton = true;
heading(items, 'A1:W1');
items.freezePanes.freezeRows(1);
items.freezePanes.freezeColumns(1);

base(summary, 'A1:I42');
summary.getRange('A1').values = [['New Horizon question inventory']];
summary.getRange('A1').format.font = { name: 'Arial', size: 18, bold: true, color: palette.ink };
summary.getRange('A1:I1').format.rowHeight = 29;
summary.getRange('A2').values = [['Draft milestone · 10 September 2026 · English']];
summary.getRange('A2:I2').format.borders = { bottom: { style: 'thin', color: palette.line } };
summary.getRange('A4:F8').values = [
  ['Layer', 'Mappings', 'Levels', 'Per cell', 'Target', 'Generated'],
  ['core', 24, 4, 8, null, null],
  ['function', 81, 4, 4, null, null],
  ['industry', 20, 4, 4, null, null],
  ['executive', 59, 4, 4, null, null],
];
heading(summary, 'A4:F4');
summary.getRange('E5:F5').formulas = [['=B5*C5*D5', `=COUNTIF('Questions'!$B$2:$B$${end},A5)`]];
summary.getRange('E5:F8').fillDown();
summary.getRange('A9').values = [['Total']];
summary.getRange('E9:F9').formulas = [['=SUM(E5:E8)', '=SUM(F5:F8)']];
summary.getRange('A9:F9').format.font.bold = true;
summary.getRange('A9:F9').format.borders = { top: { style: 'thin', color: palette.line } };
summary.getRange('B5:F9').setNumberFormat('#,##0');
summary.getRange('A12:B16').values = [
  ['Difficulty', 'Generated'], ['awareness', null], ['applied', null], ['proficient', null], ['advanced', null],
];
heading(summary, 'A12:B12');
summary.getRange('B13').formulas = [[`=COUNTIF('Questions'!$E$2:$E$${end},A13)`]];
summary.getRange('B13:B16').fillDown();
summary.getRange('D12:E16').values = [
  ['Review decision', 'Items'], ['Pending', null], ['Approve for pilot', null], ['Revise', null], ['Reject', null],
];
heading(summary, 'D12:E12');
summary.getRange('E13').formulas = [[`=COUNTIF('Questions'!$K$2:$K$${end},D13)`]];
summary.getRange('E13:E16').fillDown();
summary.getRange('H4:I9').values = [
  ['Inventory structure', 'Count'],
  ['Competencies', 24], ['Coverage cells', audit.coverageCells],
  ['Decision families', audit.competencyDifficultyFamilies], ['Base evidence patterns', audit.baseEvidencePatterns],
  ['Existing live questions', audit.liveInventoryCount],
];
heading(summary, 'H4:I4');
summary.getRange('H12:I14').values = [
  ['Additional review', 'Items'], ['Answer-length candidates', audit.longestAnswerReviewCount], ['Pilot-calibrated items', 0],
];
heading(summary, 'H12:I12');
summary.getRange('A19').values = [['How to review']];
summary.getRange('A19').format.font.bold = true;
const notes = [
  ['Scope', 'This is a separate review inventory. The existing 634 live questions remain unchanged.'],
  ['Method', '3,328 item variants share 96 competency/difficulty families and 384 base evidence patterns. Core forms reuse each pattern in two work settings.'],
  ['Specialization', 'Each overlay adds a profile-specific constraint. One distractor diagnoses the competency correctly but violates that constraint.'],
  ['Difficulty', 'Labels reflect intended cognitive demand and remain provisional. Advanced labels do not establish advanced psychometric difficulty.'],
  ['Format', 'All new drafts are single-best-answer scenarios. Correct = 100; incorrect = 0. Scores are proposed keys, not calibrated readiness estimates.'],
  ['Review inputs', 'Filter Questions, then edit the amber decision, reviewer, notes, and check columns. Summary decision counts update from those inputs.'],
  ['Approval', 'Approve for pilot records a review decision only. Editing this workbook does not change the JSON or publish any assessment item.'],
  ['Family exposure', 'Review related variants together. Avoid using shared evidence patterns as independent observations in one assessment.'],
  ['Checks', `Inspect key correctness, ambiguity, answer clues, role relevance, language, and similarity. ${audit.longestAnswerReviewCount} items have a mechanical answer-length flag.`],
  ['Language', 'These new drafts are English only. Thai adaptation and bilingual equivalence checks remain pending.'],
  ['Evidence', 'The scenarios and exercise policies are synthetic. They do not state jurisdiction-specific legal requirements or clinical guidance.'],
  ['Pilot', 'Use fresh learners and track response rates, timing, distractor selection, item discrimination, subgroup effects, and family exposure.'],
];
notes.forEach(([label, note], index) => {
  const row = 20 + index;
  summary.getRange(`A${row}`).values = [[label]];
  summary.getRange(`B${row}`).values = [[note]];
  summary.getRange(`A${row}:I${row}`).format.rowHeight = 32;
});
// Notes use ordinary unmerged cells with reserved blank space to the right.
summary.getRange('A1:A42').format.columnWidth = 22;
summary.getRange('B1:F42').format.columnWidth = 18;
summary.getRange('G1:G42').format.columnWidth = 3;
summary.getRange('H1:H42').format.columnWidth = 31;
summary.getRange('I1:I42').format.columnWidth = 15;
summary.getRange('A34').values = [['Background reading']];
summary.getRange('A34').format.font.bold = true;
const sources = [
  ['NIST AI RMF', 'https://www.nist.gov/itl/ai-risk-management-framework'],
  ['RAG overview', 'https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview'],
  ['Prompt injection', 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/'],
  ['Government AI playbook', 'https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html'],
];
sources.forEach((values, index) => { summary.getRange(`A${35 + index}:B${35 + index}`).values = [values]; });
summary.getRange('A40').values = [['Source note']];
summary.getRange('B40').values = [['Background references support general concepts; they do not validate the authored answer keys, scenario policies, or difficulty ratings.']];

const coverageRows = audit.coverage.map(cell => [cell.layer, cell.scope, cell.competency, cell.difficulty, cell.target, cell.actual]);
coverage.getRange(`A1:F${coverageRows.length + 1}`).values = [['Layer', 'Profile', 'Competency ID', 'Difficulty', 'Target', 'Generated'], ...coverageRows];
base(coverage, `A1:F${coverageRows.length + 1}`);
coverage.getRange(`A1:B${coverageRows.length + 1}`).format.columnWidth = 21;
coverage.getRange(`C1:C${coverageRows.length + 1}`).format.columnWidth = 37;
coverage.getRange(`D1:D${coverageRows.length + 1}`).format.columnWidth = 18;
coverage.getRange(`E1:F${coverageRows.length + 1}`).format.columnWidth = 14;
coverage.getRange(`A2:F${coverageRows.length + 1}`).format.rowHeight = 22;
coverage.tables.add(`A1:F${coverageRows.length + 1}`, true, 'CoverageCells').showFilterButton = true;
heading(coverage, 'A1:F1');
coverage.freezePanes.freezeRows(1);

await fs.mkdir(outputDir, { recursive: true });
items.getRange('K2').values = [['Approve for pilot']];
assert.equal(summary.getRange('E13').values[0][0], 3327);
assert.equal(summary.getRange('E14').values[0][0], 1);
items.getRange('K2').values = [['Pending']];
assert.equal(summary.getRange('E13').values[0][0], 3328);
assert.equal(summary.getRange('E14').values[0][0], 0);
console.log((await workbook.inspect({ kind: 'table', range: 'Summary!A4:F16', include: 'values,formulas', tableMaxRows: 13, tableMaxCols: 6, maxChars: 3500 })).ndjson);
console.log((await workbook.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 20 }, summary: 'Formula errors' })).ndjson);
for (const [sheetName, range, filename] of [
  ['Summary', 'A1:I17', 'summary.png'],
  ['Summary', 'A19:I40', 'guide.png'],
  ['Questions', 'F1:J3', 'questions.png'],
  ['Questions', 'F770:J771', 'specialized-questions.png'],
  ['Questions', 'K1:R3', 'review-inputs.png'],
  ['Coverage', 'A1:F9', 'coverage.png'],
]) {
  const image = await workbook.render({ sheetName, range, scale: 1, format: 'png' });
  await fs.writeFile(new URL(filename, outputDir), new Uint8Array(await image.arrayBuffer()));
}
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(fileURLToPath(new URL('new-horizon-3328-review.xlsx', outputDir)));
await fs.copyFile(new URL('new-horizon-3328-review.xlsx', outputDir), new URL('new-horizon-3328-review.xlsx', exportsDir));
console.log('Exported 3,328 draft questions with coverage and editable review columns.');
