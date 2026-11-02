import type { Metadata } from 'next';
import PremiumOnboardingScreen from './screen';

export const metadata: Metadata = { title: 'Premium diagnostic | New Horizon' };

export default function PremiumPage() {
  return <PremiumOnboardingScreen />;
}
