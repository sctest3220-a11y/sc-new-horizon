// Visible strings that are the same in every language: the brand, language
// codes, and product or technical names. scripts/test-i18n-coverage.mjs
// accepts them hard-coded in markup and identical across catalogs. Keep this
// list short; anything a Thai reader would expect translated does not belong.
export const untranslatedAllowlist = new Set([
  'NH',
  'AI Watch | New Horizon',
  'AI Labs | New Horizon',
  'New Horizon',
  'EN',
  'TH',
  'AI Watch',
  'AI Labs',
  'Premium',
  'Admin',
  'Dashboard',
  'SEM',
  'Info',
  'Item a',
  'Item b',
  'Guess c',
]);
