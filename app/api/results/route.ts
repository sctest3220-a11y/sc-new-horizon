import { env } from 'cloudflare:workers';

type ResultEvent = {
  releaseId?: string;
  contentVersion?: string;
  language?: string;
  completed?: boolean;
  overall?: number;
  domainScores?: Record<string, number>;
};
type FeedbackEntry = { id?: string; questionId?: string; decision?: string; rating?: string; clarity?: string; artifact?: string; format?: string; comment?: string; suggestedChange?: string };

function database(): D1Database | null {
  return (env as unknown as { RESULTS_DB?: D1Database }).RESULTS_DB ?? null;
}

export async function POST(request: Request) {
  const db = database();
  if (!db) return Response.json({ error: 'Results storage is not configured.' }, { status: 503 });
  const body = await request.json() as ResultEvent & FeedbackEntry & { kind?: string };
  if (body.kind === 'question_feedback') {
    if (!body.questionId) return Response.json({ error: 'questionId is required.' }, { status: 400 });
    const feedbackId = body.id ?? crypto.randomUUID();
    await db.prepare(`INSERT INTO question_feedback (feedback_id, question_id, decision, rating, clarity, artifact, format, comment, suggested_change, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`)
      .bind(feedbackId, body.questionId, body.decision ?? 'pending', body.rating ? Number(body.rating) : null, body.clarity ?? null, body.artifact ?? null, body.format ?? null, body.comment ?? null, body.suggestedChange ?? null).run();
    return Response.json({ ok: true, feedbackId });
  }
  const eventId = crypto.randomUUID();
  await db.prepare(`INSERT INTO result_events (event_id, release_id, content_version, language, completed, overall, domain_scores, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`)
    .bind(eventId, body.releaseId ?? null, body.contentVersion ?? null, body.language ?? null, body.completed ? 1 : 0, typeof body.overall === 'number' ? body.overall : null, JSON.stringify(body.domainScores ?? {})).run();
  return Response.json({ ok: true, eventId });
}

export async function GET(request: Request) {
  const db = database();
  if (!db) return Response.json({ configured: false, message: 'Results storage is not configured.' });
  const url = new URL(request.url);
  const questionId = url.searchParams.get('questionId');
  if (url.searchParams.get('feedback') === 'all') {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const sameOrigin = origin === url.origin || (referer ? new URL(referer).origin === url.origin : false);
    if (!sameOrigin) return Response.json({ error: 'Same-origin admin access required.' }, { status: 403 });
    const rows = await db.prepare(`SELECT feedback_id AS id, question_id AS questionId, decision, rating, clarity, artifact, format, comment, suggested_change AS suggestedChange, CASE WHEN (comment IS NOT NULL AND comment != '') OR (suggested_change IS NOT NULL AND suggested_change != '') THEN 1 ELSE 0 END AS hasNotes, created_at AS savedAt FROM question_feedback ORDER BY created_at DESC`).all();
    const latest = await db.prepare(`SELECT MAX(created_at) AS latestAt FROM question_feedback`).first<{ latestAt?: string | null }>();
    return Response.json({ configured: true, entries: rows.results, latestAt: latest?.latestAt ?? null });
  }
  if (questionId) {
    const rows = await db.prepare(`SELECT feedback_id AS id, decision, rating, clarity, artifact, format, comment, suggested_change AS suggestedChange, created_at AS savedAt FROM question_feedback WHERE question_id = ? ORDER BY created_at DESC`).bind(questionId).all();
    return Response.json({ configured: true, entries: rows.results });
  }
  const summary = await db.prepare(`SELECT COUNT(*) AS total, SUM(completed) AS completed, ROUND(AVG(CASE WHEN completed = 1 THEN overall END)) AS averageOverall, MAX(created_at) AS latestAt FROM result_events`).first<Record<string, number | string | null>>();
  const versions = await db.prepare(`SELECT COALESCE(content_version, 'unknown') AS version, COUNT(*) AS total, SUM(completed) AS completed, ROUND(AVG(CASE WHEN completed = 1 THEN overall END)) AS averageOverall FROM result_events GROUP BY content_version ORDER BY MAX(created_at) DESC`).all();
  return Response.json({ configured: true, summary, versions: versions.results });
}
