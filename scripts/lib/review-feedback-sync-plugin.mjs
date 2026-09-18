// Dev-server-only sync of reviewer feedback into the repository.
//
// The question inventory page keeps ratings, decisions and comments in the
// browser's localStorage under `new-horizon-review:<questionId>`. The app itself
// renders inside workerd, which has no host filesystem, so writing that feedback
// to a file has to happen in the Vite dev server's Node process instead. This
// plugin adds two dev-only endpoints for the page to talk to:
//
//   GET  /__review-feedback   current contents of exports/review-feedback/<reviewer>.json
//   POST /__review-feedback   merge the browser's feedback into that file
//
// The file is plain JSON keyed by question id, so it diffs cleanly and is
// committed and pushed like any other export. `pnpm start` (production) has no
// Vite server, so the page shows sync as unavailable there.

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const endpoint = '/__review-feedback';

function reviewerName() {
  if (process.env.REVIEW_FEEDBACK_REVIEWER) return process.env.REVIEW_FEEDBACK_REVIEWER;
  try {
    return execSync('git config user.name', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || 'local';
  } catch {
    return 'local';
  }
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'local';
}

function emptyStore(reviewer) {
  return { reviewer, updatedAt: null, questions: {} };
}

function readStore(filePath, reviewer) {
  if (!fs.existsSync(filePath)) return emptyStore(reviewer);
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return { ...emptyStore(reviewer), ...parsed, questions: parsed.questions ?? {} };
  } catch {
    return emptyStore(reviewer);
  }
}

function newestFirst(left, right) {
  return String(right.savedAt ?? right.id ?? '').localeCompare(String(left.savedAt ?? left.id ?? ''));
}

// Union of saved entries by id; the browser's current draft wins. Nothing that
// was already committed is ever dropped, even if the browser storage was cleared.
function mergeQuestion(existing, incoming) {
  const byId = new Map();
  for (const entry of [...(incoming?.entries ?? []), ...(existing?.entries ?? [])]) {
    if (entry?.id && !byId.has(entry.id)) byId.set(entry.id, entry);
  }
  const updatedAt = [incoming?.updatedAt, existing?.updatedAt].filter(Boolean).sort().pop() ?? null;
  return {
    draft: incoming?.draft ?? existing?.draft ?? null,
    entries: [...byId.values()].sort(newestFirst),
    updatedAt,
  };
}

function mergeStores(existing, incomingQuestions) {
  const questions = { ...existing.questions };
  for (const [id, incoming] of Object.entries(incomingQuestions ?? {})) {
    questions[id] = mergeQuestion(questions[id], incoming);
  }
  const sorted = Object.fromEntries(Object.keys(questions).sort().map((id) => [id, questions[id]]));
  return { ...existing, updatedAt: new Date().toISOString(), questions: sorted };
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let data = '';
    request.on('data', (chunk) => {
      data += chunk;
      if (data.length > 50_000_000) reject(new Error('Request body too large'));
    });
    request.on('end', () => resolve(data));
    request.on('error', reject);
  });
}

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(payload));
}

export function reviewFeedbackSync({ root = process.cwd() } = {}) {
  const reviewer = reviewerName();
  const relativePath = `exports/review-feedback/${slugify(reviewer)}.json`;
  const filePath = path.join(root, relativePath);

  return {
    name: 'new-horizon:review-feedback-sync',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(endpoint, async (request, response) => {
        try {
          if (request.method === 'GET') {
            return sendJson(response, 200, { reviewer, file: relativePath, store: readStore(filePath, reviewer) });
          }
          if (request.method === 'POST') {
            const body = JSON.parse((await readBody(request)) || '{}');
            const existing = { ...readStore(filePath, reviewer), reviewer };
            const merged = mergeStores(existing, body.questions);
            // Only touch the file when the feedback itself changed, so a plain
            // page visit never leaves the export showing as modified in git.
            if (JSON.stringify(merged.questions) === JSON.stringify(existing.questions) && fs.existsSync(filePath)) {
              return sendJson(response, 200, { reviewer, file: relativePath, store: existing });
            }
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, `${JSON.stringify(merged, null, 2)}\n`);
            return sendJson(response, 200, { reviewer, file: relativePath, store: merged });
          }
          response.setHeader('Allow', 'GET, POST');
          return sendJson(response, 405, { error: 'Method not allowed' });
        } catch (error) {
          return sendJson(response, 500, { error: error instanceof Error ? error.message : String(error) });
        }
      });
    },
  };
}
