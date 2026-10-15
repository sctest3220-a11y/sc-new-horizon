import { env } from 'cloudflare:workers';

type ResultEvent = {
  kind?: string;
  questionId?: string;
  id?: string;
  releaseId?: string;
  contentVersion?: string;
  language?: string;
  completed?: boolean;
  overall?: number;
  domainScores?: Record<string, number>;
};

function database(): D1Database | null {
  return (env as unknown as { RESULTS_DB?: D1Database }).RESULTS_DB ?? null;
}

export async function POST(request: Request) {
  const db = database();
  if (!db) return Response.json({ error: 'Results storage is not configured.' }, { status: 503 });
  const body = await request.json() as ResultEvent & Record<string, unknown>;
  if (body.kind === 'question_feedback') {
    const version = body.contentVersion ?? 'legacy-unversioned';
    if (!body.questionId || !/^[A-Za-z0-9._-]{1,200}$/.test(body.questionId) ||
        (version !== 'legacy-unversioned' && !/^[a-f0-9]{64}$/.test(version))) {
      return Response.json({ error: 'Invalid question or content version.' }, { status: 400 });
    }
    const id = body.id ?? crypto.randomUUID();
    if (typeof id !== 'string' || !id || id.length > 200) return Response.json({ error: 'Invalid feedback ID.' }, { status: 400 });
    const entry: Record<string, string> = { id, questionId: body.questionId, savedAt: new Date().toISOString() };
    for (const field of ['decision', 'rating', 'clarity', 'artifact', 'format', 'comment', 'suggestedChange']) {
      if (body[field] !== undefined && (typeof body[field] !== 'string' || body[field].length > 10000)) {
        return Response.json({ error: `Invalid ${field}.` }, { status: 400 });
      }
      entry[field] = typeof body[field] === 'string' ? body[field] : '';
    }
    await db.prepare('INSERT OR IGNORE INTO question_feedback (id, content_version, question_id, entry_json, saved_at) VALUES (?, ?, ?, ?, ?)')
      .bind(id, version, body.questionId, JSON.stringify(entry), entry.savedAt).run();
    return Response.json({ ok: true, entry });
  }
  const eventId = crypto.randomUUID();
  await db.prepare(`INSERT INTO result_events (event_id, release_id, content_version, language, completed, overall, domain_scores, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`)
    .bind(eventId, body.releaseId ?? null, body.contentVersion ?? null, body.language ?? null, body.completed ? 1 : 0, typeof body.overall === 'number' ? body.overall : null, JSON.stringify(body.domainScores ?? {})).run();
  return Response.json({ ok: true, eventId });
}

export async function GET(request: Request) {
  const db = database();
  if (!db) return Response.json({ configured: false, message: 'Results storage is not configured.' });
  const params = new URL(request.url).searchParams;
  if (params.has('questionId') || params.get('feedback') === 'all') {
    const version = params.get('contentVersion') ?? 'legacy-unversioned';
    const questionId = params.get('questionId');
    const query = questionId
      ? db.prepare('SELECT entry_json FROM question_feedback WHERE content_version = ? AND question_id = ? ORDER BY saved_at DESC').bind(version, questionId)
      : db.prepare('SELECT entry_json FROM question_feedback WHERE content_version = ? ORDER BY saved_at DESC').bind(version);
    const rows = await query.all<{ entry_json: string }>();
    return Response.json({ entries: rows.results.map(row => JSON.parse(row.entry_json)) }, { headers: { 'Cache-Control': 'no-store' } });
  }
  const summary = await db.prepare(`SELECT COUNT(*) AS total, SUM(completed) AS completed, ROUND(AVG(CASE WHEN completed = 1 THEN overall END)) AS averageOverall, MAX(created_at) AS latestAt FROM result_events`).first<Record<string, number | string | null>>();
  const versions = await db.prepare(`SELECT COALESCE(content_version, 'unknown') AS version, COUNT(*) AS total, SUM(completed) AS completed, ROUND(AVG(CASE WHEN completed = 1 THEN overall END)) AS averageOverall FROM result_events GROUP BY content_version ORDER BY MAX(created_at) DESC`).all();
  return Response.json({ configured: true, summary, versions: versions.results });
}
