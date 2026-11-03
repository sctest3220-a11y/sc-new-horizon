import type { AppLanguage } from '../../app/language-model';
import en from './en.json';
import th from './th.json';

// One catalog per language; en.json is the source of truth for the keys.
// Adding a language: add <code>.json here and the code to `languages` in
// app/language-model.ts (see docs/LOCALISATION.md, "Adding a language").
export type Messages = typeof en;

export const messages: Record<AppLanguage, Messages> = { en, th };

/** Fixed so server and client format dates the same way. */
export const timeZone = 'Asia/Bangkok';
