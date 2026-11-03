import type { AppLanguage } from '../../app/language-model';
import th from './th.json';

// Content (lab text, competencies, survey options, catalogs, story summaries)
// is written in English in app/learner-app.tsx and translated here, one file
// per language, keyed by the English source text. When the English changes,
// its old translation stops matching and scripts/test-i18n-coverage.mjs lists
// it. Interface copy belongs in ../messages instead.
const contentCatalogs: Partial<Record<AppLanguage, Record<string, string>>> = { th };

/** English source strings that had no translation, collected in development so tests can list them. */
export const missingContent = new Set<string>();

const hasThai = /[฀-๿]/;

/** The content string in `language`, or the English when there is no translation yet. */
export function translateContent(text: string, language: AppLanguage): string {
  if (language === 'en' || !text) return text;
  const translated = contentCatalogs[language]?.[text];
  if (translated) return translated;
  if (process.env.NODE_ENV !== 'production' && /[A-Za-z]{2}/.test(text) && !hasThai.test(text)) missingContent.add(text);
  return text;
}
