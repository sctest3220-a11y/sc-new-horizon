// The learner app's URLs. Each screen has its own route; the in-memory `step`
// the screens still use is derived from the path, never the other way round.

export const labKinds = ['ownership', 'proof', 'next', 'prompt', 'media', 'workflow', 'trust'] as const;
export type LabKind = (typeof labKinds)[number];

export type AppStep =
  | 'home'
  | 'dashboard'
  | 'admin'
  | 'news'
  | 'learningLabs'
  | 'lab'
  | 'developerReport'
  | 'onboarding'
  | 'premiumOnboarding'
  | 'assessment'
  | 'feedback'
  | 'results';

/** Steps that own a URL. `feedback` is a phase of the assessment run, and `lab` needs a kind. */
type RoutedStep = Exclude<AppStep, 'feedback' | 'lab'>;

const stepPaths: Record<RoutedStep, string> = {
  home: '/',
  dashboard: '/dashboard',
  admin: '/admin',
  developerReport: '/admin/developer-report',
  news: '/watch',
  learningLabs: '/labs',
  onboarding: '/assessment',
  premiumOnboarding: '/assessment/premium',
  assessment: '/assessment/run',
  results: '/results',
};

const legacyViews: Record<string, string> = {
  assessment: stepPaths.onboarding,
  admin: stepPaths.admin,
  watch: stepPaths.news,
  labs: stepPaths.learningLabs,
};

export function isLabKind(value: unknown): value is LabKind {
  return typeof value === 'string' && (labKinds as readonly string[]).includes(value);
}

export function labPath(kind: LabKind): string {
  return `/labs/${kind}`;
}

/** The URL for a step. `feedback` shares the assessment run's URL; a lab's URL comes from `labPath`. */
export function pathForStep(step: Exclude<AppStep, 'lab'>): string {
  return stepPaths[step === 'feedback' ? 'assessment' : step];
}

/** The screen a path shows. Unknown paths fall back to home; the router 404s them before this runs. */
export function stepForPath(pathname: string): Exclude<AppStep, 'feedback'> {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (/^\/labs\/[^/]+$/.test(path)) return 'lab';
  const match = (Object.keys(stepPaths) as RoutedStep[]).find((step) => stepPaths[step] === path);
  return match ?? 'home';
}

/**
 * Where an old `/?view=…` or `/?question=…` link now lives, or null when the
 * URL is not a legacy link. Only the home path carried these parameters.
 */
export function legacyRedirect(pathname: string, search: string): string | null {
  if (pathname !== '/') return null;
  const params = new URLSearchParams(search);
  const question = params.get('question');
  if (question) return `${stepPaths.assessment}?${new URLSearchParams({ question }).toString()}`;
  const view = params.get('view') ?? '';
  return Object.hasOwn(legacyViews, view) ? legacyViews[view] : null;
}
