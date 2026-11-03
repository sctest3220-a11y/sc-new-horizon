import { getRequestConfig } from 'next-intl/server';
import { defaultLanguage } from '../app/language-model';
import { messages, timeZone } from './messages';

// Server-rendered pages use the default language: the preference lives in
// the browser until users sign in. Once it is in a cookie or the user's
// record, read it here and the server renders the right language directly.
// Vinext picks this file up by path; no next.config plugin is needed.
export default getRequestConfig(async () => ({
  locale: defaultLanguage,
  messages: messages[defaultLanguage],
  timeZone,
}));
