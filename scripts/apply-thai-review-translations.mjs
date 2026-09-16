import fs from 'node:fs/promises';

const pagePath = new URL('../app/admin/question-inventory/page.tsx', import.meta.url);
const inventoryPath = new URL('../exports/review-inventory/questions.json', import.meta.url);
const qaPath = new URL('../exports/review-inventory/thai-translation-qa.json', import.meta.url);

const source = await fs.readFile(pagePath, 'utf8');

function extractExactMap() {
  const block = source.match(/const thaiExactPhrases: Record<string, string> = \{([\s\S]*?)\n\};/)?.[1];
  if (!block) throw new Error('Could not find thaiExactPhrases in question inventory page.');
  return [...block.matchAll(/\n\s*'((?:\\'|[^'])*)':\s*'((?:\\'|[^'])*)',?/g)]
    .map((match) => [match[1].replace(/\\'/g, "'"), match[2].replace(/\\'/g, "'")]);
}

function extractRegexPairs(name) {
  const block = source.match(new RegExp(`const ${name}:[\\s\\S]*?= \\[([\\s\\S]*?)\\n\\];`))?.[1];
  if (!block) throw new Error(`Could not find ${name} in question inventory page.`);
  return block
    .split('\n')
    .filter((line) => line.trim().startsWith('[/'))
    .flatMap((line) => {
      const match = line.match(/^\s*\[\/(.*)\/([a-z]*),\s*'((?:\\'|[^'])*)'/);
      if (!match) return [];
      return [[new RegExp(match[1], match[2]), match[3].replace(/\\'/g, "'")]];
    });
}

const exact = extractExactMap();
const sentencePatterns = extractRegexPairs('thaiSentencePatterns');
const phrasePatterns = extractRegexPairs('thaiPhrases');

function translate(value) {
  if (!value) return '';
  let text = value;
  for (const [pattern, replacement] of sentencePatterns) text = text.replace(pattern, replacement);
  for (const [from, to] of exact) text = text.split(from).join(to);
  for (const [pattern, replacement] of phrasePatterns) text = text.replace(pattern, replacement);
  return text
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
    .replace(/\s+\./g, '.')
    .trim();
}

function translateOptions(options = []) {
  return options.map((option) => ({ ...option, thLabel: translate(option.label) }));
}

function translateDraft(draft) {
  if (!draft) return draft;
  return {
    ...draft,
    th: {
      context: translate(draft.context),
      prompt: translate(draft.prompt),
      explanation: translate(draft.explanation),
      rewriteNotes: translate(draft.rewriteNotes),
    },
    options: translateOptions(draft.options),
    parts: draft.parts?.map((part) => ({
      ...part,
      thPrompt: translate(part.prompt),
      options: translateOptions(part.options),
    })),
  };
}

function translateArtifact(artifactNeed) {
  if (!artifactNeed) return artifactNeed;
  return {
    ...artifactNeed,
    th: {
      need: translate(artifactNeed.need),
      artifactLabel: translate(artifactNeed.artifactLabel),
      artifactBrief: translate(artifactNeed.artifactBrief),
      prompt: translate(artifactNeed.prompt || artifactNeed.generationPrompt || ''),
    },
  };
}

const allowedEnglish = /\b(AI|Model|Prompt|Workflow|Dashboard|Agent|RAG|CRM|HR|CEO|API|ROI|KPI|IT|pilot|workspace|benchmark|token|retrieval|semantic|embedding|index|checklist|release|support|workshop|asset|repository|delivery|refund|Operations|People|Policy|production|platform|account|owner|review|rollout|scale|workforce|exception|Assistant|input|claim|journal entry|operating model|transformation|ownership|adoption|findings|ledger|invoice|portfolio|payment|recovery path|work order|operations|escalation route|business case|recovery owner|oversight|assurance|executive|funding gate|clinician|if-then|baseline|metric|ticket)\b/g;

function remainingEnglish(text) {
  return (text || '')
    .replace(allowedEnglish, '')
    .match(/[A-Za-z][A-Za-z0-9/-]*(?:\s+[A-Za-z][A-Za-z0-9/-]*){0,5}/g)?.map((item) => item.trim())
    .filter((item) => item.length > 1 && !/^[ABCD]$/.test(item)) ?? [];
}

const payload = JSON.parse(await fs.readFile(inventoryPath, 'utf8'));
const qa = [];
const fragmentCounts = new Map();
for (const question of payload.questions) {
  question.locale = 'en-th';
  question.userFacingDraft = translateDraft(question.userFacingDraft);
  question.artifactNeed = translateArtifact(question.artifactNeed);
  question.th = {
    context: translate(question.context),
    prompt: translate(question.prompt),
    rationale: translate(question.rationale),
  };
  question.options = translateOptions(question.options);

  const draft = question.userFacingDraft;
  const fields = [
    ['context', draft?.th?.context],
    ['prompt', draft?.th?.prompt],
    ['explanation', draft?.th?.explanation],
    ['rewriteNotes', draft?.th?.rewriteNotes],
    ...(draft?.options ?? []).map((option) => [`option:${option.id}`, option.thLabel]),
    ...(draft?.parts ?? []).flatMap((part) => [
      [`part:${part.id}:prompt`, part.thPrompt],
      ...part.options.map((option) => [`part:${part.id}:option:${option.id}`, option.thLabel]),
    ]),
  ];
  for (const [field, value] of fields) {
    const fragments = remainingEnglish(value);
    if (fragments.length) {
      for (const fragment of fragments) fragmentCounts.set(fragment, (fragmentCounts.get(fragment) || 0) + 1);
      qa.push({ id: question.id, field, fragments: fragments.slice(0, 6), text: value });
    }
  }
}

payload.locale = 'en-th';
payload.translation = {
  thStatus: qa.length ? 'machine-assisted-needs-review' : 'machine-assisted-no-obvious-english-fragments',
  generatedAt: new Date().toISOString(),
  qaIssueCount: qa.length,
  note: 'Thai fields are generated for reviewer workflow and still require human language review before production assessment use.',
};

await fs.writeFile(inventoryPath, `${JSON.stringify(payload, null, 2)}\n`);
await fs.writeFile(qaPath, `${JSON.stringify({
  issueCount: qa.length,
  topFragments: [...fragmentCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 100),
  issues: qa.slice(0, 500),
}, null, 2)}\n`);
console.log(JSON.stringify({ translatedQuestions: payload.questions.length, qaIssueCount: qa.length, qaPath: 'exports/review-inventory/thai-translation-qa.json' }, null, 2));
