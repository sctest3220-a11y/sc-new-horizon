import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useSyncExternalStore, type ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { LearnerAppProvider } from './learner-app-context';
import LearnerShell from './(learner)/learner-shell';
import HomePage from './(learner)/page';
import DashboardPage from './(learner)/dashboard/page';
import AdminPage from './(learner)/admin/page';
import DeveloperReportPage from './(learner)/admin/developer-report/page';
import WatchPage from './(learner)/watch/page';
import LabsPage from './(learner)/labs/page';
import LabPage from './(learner)/labs/[kind]/page';
import AssessmentPage from './(learner)/assessment/page';
import PremiumPage from './(learner)/assessment/premium/page';
import AssessmentRunPage from './(learner)/assessment/run/page';
import ResultsPage from './(learner)/results/page';

// Pins one landmark per screen of the learner app and the route each one
// lives at. Answer feedback and a full results screen need a completed
// assessment and are checked by hand in the browser (docs/TESTING.md).

// A minimal stand-in for the App Router: one current URL, pushed and replaced
// through window.history, that the pages below are chosen from.
const router = vi.hoisted(() => {
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());
  const go = (href: string, mode: 'push' | 'replace') => {
    window.history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', href);
    notify();
  };
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    pathname: () => window.location.pathname,
    push: (href: string) => go(href, 'push'),
    replace: (href: string) => go(href, 'replace'),
    back() {
      window.history.back();
    },
    notify,
  };
});

vi.mock('next/navigation', () => ({
  usePathname: () => useSyncExternalStore(router.subscribe, router.pathname, () => '/'),
  useRouter: () => router,
  useParams: () => ({ kind: router.pathname().split('/')[2] }),
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: ComponentProps<'a'> & { href: string }) => (
    <a
      href={href}
      {...props}
      onClick={(event) => {
        event.preventDefault();
        router.push(href);
      }}
    >
      {children}
    </a>
  ),
}));

const routes: Record<string, () => React.ReactNode> = {
  '/': HomePage,
  '/dashboard': DashboardPage,
  '/admin': AdminPage,
  '/admin/developer-report': DeveloperReportPage,
  '/watch': WatchPage,
  '/labs': LabsPage,
  '/assessment': AssessmentPage,
  '/assessment/premium': PremiumPage,
  '/assessment/run': AssessmentRunPage,
  '/results': ResultsPage,
};

function CurrentRoute() {
  const pathname = useSyncExternalStore(router.subscribe, router.pathname);
  const Page = pathname.startsWith('/labs/') ? LabPage : routes[pathname];
  return Page ? <Page /> : <p>404</p>;
}

async function renderApp(url = '/') {
  window.history.replaceState(null, '', url);
  const view = render(
    <LearnerAppProvider>
      <LearnerShell>
        <CurrentRoute />
      </LearnerShell>
    </LearnerAppProvider>,
  );
  // Saved state is restored after the first animation frame.
  await screen.findByRole('navigation', { name: 'Primary navigation' });
  await act(() => new Promise((resolve) => window.requestAnimationFrame(() => resolve(null))));
  return view;
}

function navigate(label: string) {
  fireEvent.click(within(screen.getByRole('navigation', { name: 'Primary navigation' })).getByRole('link', { name: label }));
}

const heading = (name: string) => screen.findByRole('heading', { level: 1, name });

describe('app screens', () => {
  it('opens on the home screen', async () => {
    await renderApp();
    expect(await heading('Measure practical AI readiness.')).toBeTruthy();
  });

  it.each([
    ['Assessment', '/assessment', 'Start with a broad profile.'],
    ['Premium', '/assessment/premium', 'Add context for a deeper profile.'],
    ['Dashboard', '/dashboard', 'Your AI readiness dashboard.'],
    ['Admin', '/admin', 'Assessment intelligence console.'],
    ['AI Watch', '/watch', 'What’s worth knowing. What you can try.'],
    ['AI Labs', '/labs', 'Build a skill you can use.'],
  ])('the %s navigation opens %s', async (label, path, title) => {
    await renderApp();
    navigate(label);
    expect(await heading(title)).toBeTruthy();
    expect(window.location.pathname).toBe(path);
    expect(within(screen.getByRole('navigation', { name: 'Primary navigation' })).getByRole('link', { name: label }).getAttribute('aria-current')).toBe('page');
  });

  it.each([
    ['/assessment', 'Start with a broad profile.'],
    ['/assessment/premium', 'Add context for a deeper profile.'],
    ['/dashboard', 'Your AI readiness dashboard.'],
    ['/admin', 'Assessment intelligence console.'],
    ['/watch', 'What’s worth knowing. What you can try.'],
    ['/labs', 'Build a skill you can use.'],
  ])('%s opens its screen directly', async (path, title) => {
    await renderApp(path);
    expect(await heading(title)).toBeTruthy();
  });

  it('Home returns from another screen, and Back returns to it', async () => {
    await renderApp();
    navigate('Dashboard');
    await heading('Your AI readiness dashboard.');
    navigate('Home');
    expect(await heading('Measure practical AI readiness.')).toBeTruthy();
    await act(async () => {
      window.history.back();
      await new Promise((resolve) => window.addEventListener('popstate', resolve, { once: true }));
      router.notify();
    });
    expect(await heading('Your AI readiness dashboard.')).toBeTruthy();
  });

  it.each([
    ['/?view=watch', '/watch', 'What’s worth knowing. What you can try.'],
    ['/?view=labs', '/labs', 'Build a skill you can use.'],
    ['/?view=assessment', '/assessment', 'Start with a broad profile.'],
    ['/?view=admin', '/admin', 'Assessment intelligence console.'],
  ])('the legacy link %s redirects to %s', async (url, path, title) => {
    await renderApp(url);
    expect(await heading(title)).toBeTruthy();
    expect(window.location.pathname).toBe(path);
  });

  it('starting an assessment opens the question workbench at /assessment/run', async () => {
    await renderApp('/assessment');
    await heading('Start with a broad profile.');
    fireEvent.click(screen.getByRole('button', { name: 'Build Profile and Begin 12-Question Assessment' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Skip for now' }));
    await waitFor(() => expect(document.querySelector('.assessment-workbench [data-question-id]')).toBeTruthy());
    expect(window.location.pathname).toBe('/assessment/run');
  });

  it('the legacy question preview link opens that question in the run', async () => {
    await renderApp('/?question=D1-A-001');
    await waitFor(() => expect(document.querySelector('.assessment-workbench [data-question-id="D1-A-001"]')).toBeTruthy());
    expect(`${window.location.pathname}${window.location.search}`).toBe('/assessment/run?question=D1-A-001');
  });

  it('answering shows feedback in place of the question, then the next question', async () => {
    await renderApp('/?question=D1-A-001');
    await waitFor(() => expect(document.querySelector('[data-question-id="D1-A-001"]')).toBeTruthy());
    const options = [...document.querySelectorAll<HTMLButtonElement>('.question-card button')].filter((button) => /^[A-F][A-Za-z]/.test(button.textContent?.trim() ?? ''));
    for (const option of options) {
      if (document.querySelector('.feedback-workbench')) break;
      fireEvent.click(option);
    }
    await waitFor(() => expect(document.querySelector('.feedback-workbench')).toBeTruthy());
    expect(document.querySelector('.assessment-workbench')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Next Question' }));
    await waitFor(() => expect(document.querySelector('.assessment-workbench [data-question-id]')).toBeTruthy());
    expect(document.querySelector('.feedback-workbench')).toBeNull();
    expect(document.querySelector('[data-question-id="D1-A-001"]')).toBeNull();
    expect(window.location.pathname).toBe('/assessment/run');
  });

  it.each([['/assessment/run'], ['/results']])('opening %s with no assessment in progress returns to /assessment', async (path) => {
    await renderApp(path);
    expect(await heading('Start with a broad profile.')).toBeTruthy();
    expect(window.location.pathname).toBe('/assessment');
  });

  it('a Practice Lab card opens that lab at its own URL', async () => {
    await renderApp();
    const card = document.querySelector<HTMLButtonElement>('button.activity-card, button.room-card');
    expect(card).toBeTruthy();
    fireEvent.click(card!);
    expect(await screen.findByRole('button', { name: 'Back to Labs' })).toBeTruthy();
    expect(window.location.pathname).toMatch(/^\/labs\/[a-z]+$/);
  });

  it('a lab URL opens that lab directly', async () => {
    await renderApp('/labs/workflow');
    expect(await screen.findByRole('button', { name: 'Back to Labs' })).toBeTruthy();
    expect(await screen.findByRole('heading', { level: 2, name: 'Move the steps into the safest launch sequence.' })).toBeTruthy();
  });

  it('an unknown lab URL is not found', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(renderApp('/labs/unknown')).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('renders the home screen in Thai', async () => {
    window.localStorage.setItem('new-horizon-language-v1', 'th');
    await renderApp();
    expect(await heading('วัดความพร้อมด้าน AI ที่ใช้ได้จริง')).toBeTruthy();
  });
});
