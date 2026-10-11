CREATE TABLE IF NOT EXISTS result_events (
  event_id TEXT PRIMARY KEY,
  release_id TEXT,
  content_version TEXT,
  language TEXT,
  completed INTEGER NOT NULL DEFAULT 0,
  overall INTEGER,
  domain_scores TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS result_events_version_idx ON result_events(content_version, created_at);

CREATE TABLE IF NOT EXISTS question_feedback (
  id TEXT NOT NULL,
  content_version TEXT NOT NULL,
  question_id TEXT NOT NULL,
  entry_json TEXT NOT NULL,
  saved_at TEXT NOT NULL,
  PRIMARY KEY (content_version, question_id, id)
);
CREATE INDEX IF NOT EXISTS question_feedback_version_idx ON question_feedback(content_version, question_id, saved_at);
