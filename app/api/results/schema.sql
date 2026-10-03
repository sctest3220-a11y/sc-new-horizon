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
  feedback_id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  decision TEXT NOT NULL DEFAULT 'pending',
  rating INTEGER,
  clarity TEXT,
  artifact TEXT,
  format TEXT,
  comment TEXT,
  suggested_change TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS question_feedback_question_idx ON question_feedback(question_id, created_at);
