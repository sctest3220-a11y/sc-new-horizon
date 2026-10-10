import { env } from 'cloudflare:workers';

type ResultEvent = {
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
  const body = await request.json() as ResultEvent;
  const eventId = crypto.randomUUID();
  await db.prepare(`INSERT INTO result_events (event_id, release_id, content_version, language, completed, overall, domain_scores, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`)
    .bind(eventId, body.releaseId ?? null, body.contentVersion ?? null, body.language ?? null, body.completed ? 1 : 0, typeof body.overall === 'number' ? body.overall : null, JSON.stringify(body.domainScores ?? {})).run();
  return Response.json({ ok: true, eventId });
}

export async function GET() {
  const db = database();
  if (!db) return Response.json({ configured: false, message: 'Results storage is not configured.' });
  const summary = await db.prepare(`SELECT COUNT(*) AS total, SUM(completed) AS completed, ROUND(AVG(CASE WHEN completed = 1 THEN overall END)) AS averageOverall, MAX(created_at) AS latestAt FROM result_events`).first<Record<string, number | string | null>>();
  const versions = await db.prepare(`SELECT COALESCE(content_version, 'unknown') AS version, COUNT(*) AS total, SUM(completed) AS completed, ROUND(AVG(CASE WHEN completed = 1 THEN overall END)) AS averageOverall FROM result_events GROUP BY content_version ORDER BY MAX(created_at) DESC`).all();
  return Response.json({ configured: true, summary, versions: versions.results });
}
