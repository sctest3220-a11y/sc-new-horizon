import type { Metadata } from 'next';
import OnboardingScreen from './screen';

export const metadata: Metadata = { title: 'Assessment | New Horizon' };

export default function AssessmentPage() {
  return <OnboardingScreen />;
}
