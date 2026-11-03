import type { AppLanguage } from './app/language-model';
import type { Messages } from './i18n/messages';

// Type-checks every message key and locale passed to next-intl.
declare module 'next-intl' {
  interface AppConfig {
    Locale: AppLanguage;
    Messages: Messages;
  }
}
