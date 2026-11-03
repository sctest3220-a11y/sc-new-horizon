import { LanguageProvider } from '../language';
import { LearnerAppProvider } from '../learner-app-context';
import LearnerShell from './learner-shell';

// Every learner and admin-console route shares one app state and one header.
// The question-inventory and pilot-operations pages sit outside this group.
export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <LearnerAppProvider>
        <LearnerShell>{children}</LearnerShell>
      </LearnerAppProvider>
    </LanguageProvider>
  );
}
