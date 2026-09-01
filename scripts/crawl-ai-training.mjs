import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const outputDir = path.join(process.cwd(), '.agent-drafts');
const runDate = new Date();
const runId = `training-crawl-${runDate.toISOString().slice(0, 19).replace(/[-:T]/g, '')}`;
const maxSources = 5;
const maxCandidatesPerSource = 12;
const repeatedTitleLimit = 2;

const sources = [
  {
    name: 'Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/training/browse/?terms=AI',
    provider: 'Microsoft',
  },
  {
    name: 'DeepLearning.AI Courses',
    url: 'https://www.deeplearning.ai/courses/',
    provider: 'DeepLearning.AI',
  },
  {
    name: 'Google Cloud AI Learning',
    url: 'https://cloud.google.com/learn/training/machinelearning-ai',
    provider: 'Google Cloud',
  },
  {
    name: 'AWS Machine Learning Training',
    url: 'https://aws.amazon.com/training/learn-about/machine-learning/',
    provider: 'AWS',
  },
  {
    name: 'Coursera AI Search',
    url: 'https://www.coursera.org/search?query=artificial%20intelligence',
    provider: 'Coursera',
  },
];

function normalizeSpace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function cleanTitle(value, provider) {
  let title = normalizeSpace(value)
    .replace(/^Skip to main content$/i, '')
    .replace(new RegExp(`^${provider.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'), '')
    .replace(/^DeepLearning\.AI/i, '')
    .replace(/^Short Course/i, '')
    .replace(/^Course/i, '')
    .replace(/^Training/i, '')
    .trim();
  title = title
    .replace(/(Best for:|Learn how to|In this course|Turn your|Build reliable|Build agents|Start Now|Learn More).*$/i, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\bAI\s+AI\b/gi, 'AI')
    .replace(/\s+/g, ' ')
    .trim();
  if (title.length > 96) title = `${title.slice(0, 93).trim()}...`;
  return title;
}

function isUsefulTitle(title) {
  if (title.length < 10) return false;
  if (/^(all training|browse all training|azure training|dynamics 365 training|training|learn more|start now)$/i.test(title)) return false;
  return /ai|artificial intelligence|generative|machine learning|llm|agent|copilot|prompt|responsible|course|certificate|workflow/i.test(title);
}

function classifyDomain(text) {
  const lower = text.toLowerCase();
  if (/(ethic|risk|privacy|security|responsible|governance|compliance|policy)/.test(lower)) return 'D4';
  if (/(prompt|tool|agent|workflow|copilot|automation|application|build)/.test(lower)) return 'D2';
  if (/(data|evaluate|evaluation|benchmark|analytics|rag|retrieval|metric)/.test(lower)) return 'D3';
  if (/(strategy|business|leader|executive|product|value|transformation)/.test(lower)) return 'D5';
  if (/(team|collaboration|workforce|change|communication|human)/.test(lower)) return 'D6';
  return 'D1';
}

function classifyLevel(text) {
  const lower = text.toLowerCase();
  if (/(advanced|professional|architect|engineer|developer|specialization|certificate)/.test(lower)) return 'Advanced';
  if (/(intermediate|build|project|apply|hands-on|lab)/.test(lower)) return 'Applied';
  if (/(leader|executive|business|strategy)/.test(lower)) return 'Executive';
  return 'Starter';
}

function candidateScore(candidate) {
  const text = `${candidate.title} ${candidate.description}`.toLowerCase();
  let score = 40;
  if (/ai|artificial intelligence|generative|machine learning|llm|agent|copilot/.test(text)) score += 25;
  if (/course|training|learn|certificate|specialization|tutorial|module|path/.test(text)) score += 20;
  if (/responsible|ethic|governance|security|privacy|evaluate|workflow|prompt|agent/.test(text)) score += 10;
  if (candidate.href.startsWith('http')) score += 5;
  return Math.min(score, 100);
}

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true, channel: 'chrome' });
  } catch {
    return chromium.launch({ headless: true });
  }
}

async function crawlSource(browser, source) {
  const page = await browser.newPage({
    viewport: { width: 1365, height: 900 },
    userAgent: 'New Horizon MVP course scout review crawler',
  });
  const startedAt = Date.now();
  try {
    await page.goto(source.url, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(2500);
    const title = await page.title().catch(() => source.name);
    const candidates = await page.evaluate((maxCandidates) => {
      const terms = /ai|artificial intelligence|generative|machine learning|llm|agent|copilot|prompt|responsible|course|training|certificate|learn/i;
      const rows = [];
      const anchors = Array.from(document.querySelectorAll('a[href]'));
      for (const anchor of anchors) {
        const container = anchor.closest('article, li, section, div');
        const heading = container?.querySelector('h1, h2, h3, h4, [class*="title"], [class*="Title"]')?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        const label = (heading || anchor.textContent)?.replace(/\s+/g, ' ').trim() ?? '';
        if (label.length < 10 || label.length > 180 || !terms.test(label)) continue;
        const href = new URL(anchor.getAttribute('href'), window.location.href).toString();
        const description = container?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 320) ?? '';
        rows.push({ title: label, href, description });
        if (rows.length >= maxCandidates * 3) break;
      }
      return rows;
    }, maxCandidatesPerSource);

    const deduped = [];
    const seen = new Set();
    for (const candidate of candidates) {
      const title = cleanTitle(candidate.title, source.provider);
      if (!isUsefulTitle(title)) continue;
      const key = `${title.toLowerCase()}|${candidate.href.split('?')[0]}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const description = normalizeSpace(candidate.description || title);
      deduped.push({
        provider: source.provider,
        source: source.name,
        title,
        url: candidate.href,
        description,
        domain: classifyDomain(`${title} ${description}`),
        level: classifyLevel(`${title} ${description}`),
        score: candidateScore({ title, href: candidate.href, description }),
        status: 'admin-review',
      });
      if (deduped.length >= maxCandidatesPerSource) break;
    }

    return {
      source: source.name,
      provider: source.provider,
      url: source.url,
      pageTitle: title,
      status: 'complete',
      durationMs: Date.now() - startedAt,
      candidates: deduped,
      error: null,
    };
  } catch (error) {
    return {
      source: source.name,
      provider: source.provider,
      url: source.url,
      pageTitle: source.name,
      status: 'failed',
      durationMs: Date.now() - startedAt,
      candidates: [],
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    await page.close().catch(() => undefined);
  }
}

function detectSafetyEvents(results) {
  const titleCounts = new Map();
  for (const result of results) {
    for (const candidate of result.candidates) {
      const key = candidate.title.toLowerCase();
      titleCounts.set(key, (titleCounts.get(key) ?? 0) + 1);
    }
  }
  const repeated = [...titleCounts.entries()].filter(([, count]) => count > repeatedTitleLimit);
  const events = [
    `Source limit enforced: ${Math.min(sources.length, maxSources)} sources maximum.`,
    `Candidate limit enforced: ${maxCandidatesPerSource} candidates per source maximum.`,
  ];
  if (repeated.length) {
    events.push(`Safety cut: ${repeated.length} repeated titles exceeded duplicate threshold and require manual review.`);
  } else {
    events.push('No repeated-title loop detected.');
  }
  const failures = results.filter((result) => result.status === 'failed');
  if (failures.length) {
    events.push(`${failures.length} source crawl failure${failures.length === 1 ? '' : 's'} captured without retry loop.`);
  }
  return events;
}

function buildMarkdown(report) {
  const lines = [
    `# ${report.headline}`,
    '',
    `Run ID: \`${report.runId}\``,
    `Generated: ${report.generatedAt}`,
    '',
    report.summary,
    '',
    '## Activity',
    ...report.activityLog.map((entry) => `- ${entry}`),
    '',
    '## Safety',
    ...report.safetyEvents.map((entry) => `- ${entry}`),
    '',
    '## Top Candidates',
  ];
  for (const candidate of report.topCandidates) {
    lines.push(`- [${candidate.title}](${candidate.url})`);
    lines.push(`  - ${candidate.provider} · ${candidate.domain} · ${candidate.level} · score ${candidate.score}/100`);
  }
  lines.push('', '## Source Results');
  for (const result of report.sources) {
    lines.push(`- ${result.source}: ${result.status}, ${result.candidates.length} candidates, ${result.durationMs}ms`);
    if (result.error) lines.push(`  - Error: ${result.error}`);
  }
  return `${lines.join('\n')}\n`;
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const browser = await launchBrowser();
  const selectedSources = sources.slice(0, maxSources);
  const results = [];
  for (const source of selectedSources) {
    results.push(await crawlSource(browser, source));
  }
  await browser.close();

  const allCandidates = results.flatMap((result) => result.candidates);
  const topCandidates = allCandidates
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
    .slice(0, 15);
  const report = {
    runId,
    generatedAt: runDate.toISOString(),
    headline: 'Training and Course Scout crawl report',
    summary: `Crawled ${selectedSources.length} allow-listed AI learning sources and found ${allCandidates.length} course or training candidates. ${topCandidates.length} are shown as top review candidates. Nothing was published; every item is marked for admin review.`,
    activityLog: [
      'Orchestrator started course crawl with allow-list, source cap, candidate cap, and duplicate threshold.',
      `Training and Course Scout visited ${selectedSources.length} public sources with Playwright.`,
      `Reviewer/QA prepared ${topCandidates.length} top candidates for learning-catalog review.`,
    ],
    safetyEvents: detectSafetyEvents(results),
    topCandidates,
    sources: results,
    productionNote: 'This local crawler is for admin review testing. Production should use persisted source records, robots/terms review, retries, queue state, cost telemetry, and human approval before learning recommendations appear in the app.',
  };
  const jsonPath = path.join(outputDir, `${runId}.json`);
  const mdPath = path.join(outputDir, `${runId}.md`);
  await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(mdPath, buildMarkdown(report));
  console.log(JSON.stringify({ jsonPath, mdPath, summary: report.summary, topCandidates: report.topCandidates.slice(0, 8), safetyEvents: report.safetyEvents }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
