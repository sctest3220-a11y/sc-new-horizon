'use client';

import { createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppController } from './learner-app';

type AppController = ReturnType<typeof useAppController>;

const AppContext = createContext<AppController | null>(null);

/**
 * Holds the learner app's state for every route under app/(learner). The
 * layout mounts it once, so in-memory state (an assessment in progress, the
 * answers behind the results) survives moving between those routes.
 */
export function LearnerAppProvider({ children }: { children: React.ReactNode }) {
  const app = useAppController();
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
}

export function useApp(): AppController {
  const app = useContext(AppContext);
  if (!app) throw new Error('useApp() must be used inside <LearnerAppProvider>.');
  return app;
}

/**
 * Sends a visitor who opens a mid-flow URL directly (a reload, a shared link)
 * to `fallback` when the in-memory state that screen needs is missing. Waits
 * for saved browser state to be restored first.
 */
export function useRequireFlowState(hasState: boolean, fallback: string) {
  const { browserStateReady } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (browserStateReady && !hasState) router.replace(fallback);
  }, [browserStateReady, hasState, fallback, router]);
}
