// Parsers for the app's persisted browser state. Storage is user-editable and
// survives deploys, so these never throw: missing, corrupt or wrongly shaped
// data returns the empty default (app/CLAUDE.md, non-negotiable 2).

function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function hasFields(value: unknown, requiredFields: readonly string[]): boolean {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return requiredFields.every((field) => Boolean(record[field]));
}

/** A stored JSON array, keeping only the entries that carry every required field. */
export function parseStoredList<T>(raw: string | null, requiredFields: readonly string[]): T[] {
  const parsed = parseJson(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((entry) => hasFields(entry, requiredFields)) as T[];
}

/** A stored JSON object, or null when it is missing, corrupt or lacks a required field. */
export function parseStoredRecord<T>(raw: string | null, requiredFields: readonly string[] = []): T | null {
  const parsed = parseJson(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  return hasFields(parsed, requiredFields) ? (parsed as T) : null;
}
