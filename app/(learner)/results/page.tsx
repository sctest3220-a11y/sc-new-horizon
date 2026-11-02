import type { Metadata } from 'next';
import ResultsScreen from './screen';

export const metadata: Metadata = { title: 'Your results | New Horizon' };

export default function ResultsPage() {
  return <ResultsScreen />;
}
