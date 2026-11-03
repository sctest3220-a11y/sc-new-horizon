// The app's display language. The preference is saved in this browser for
// now; once users sign in it moves to their record behind the same
// LanguagePreferenceStore interface.

export const languages = ['en', 'th'] as const;
export type AppLanguage = (typeof languages)[number];

/** A piece of content in every supported language. Adding a language makes TypeScript list each one to fill. */
export type Localized<T = string> = Record<AppLanguage, T>;

export const defaultLanguage: AppLanguage = 'en';
export const languageStorageKey = 'new-horizon-language-v1';

export function isAppLanguage(value: unknown): value is AppLanguage {
  return typeof value === 'string' && (languages as readonly string[]).includes(value);
}

/** The saved preference, or null when it is missing or not a supported code. Never throws. */
export function parseLanguagePreference(raw: string | null): AppLanguage | null {
  return isAppLanguage(raw) ? raw : null;
}

/**
 * The language to show: the saved preference, else the first browser
 * language we support (matched on its primary subtag, so `th-TH` is Thai),
 * else the default.
 */
export function initialLanguage(saved: AppLanguage | null, browserLanguages: readonly string[]): AppLanguage {
  if (saved) return saved;
  for (const tag of browserLanguages) {
    const primary = tag.toLowerCase().split('-')[0];
    if (isAppLanguage(primary)) return primary;
  }
  return defaultLanguage;
}

export function pick<T>(text: Localized<T>, language: AppLanguage): T {
  return text[language];
}

export interface LanguagePreferenceStore {
  load(): AppLanguage | null;
  save(language: AppLanguage): void;
}

type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;

/**
 * Saves the preference in `storage` (localStorage in the app). When storage
 * is unavailable or throws, the choice is kept in memory for this visit.
 */
export function createLocalLanguageStore(storage: KeyValueStorage | null): LanguagePreferenceStore {
  let memory: AppLanguage | null = null;
  return {
    load() {
      try {
        const saved = parseLanguagePreference(storage?.getItem(languageStorageKey) ?? null);
        if (saved) return saved;
      } catch {
        // Fall through to the in-memory choice.
      }
      return memory;
    },
    save(language) {
      memory = language;
      try {
        storage?.setItem(languageStorageKey, language);
      } catch {
        // Kept in memory only.
      }
    },
  };
}
