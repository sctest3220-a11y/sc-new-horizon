import type { Metadata } from 'next';
import AssessmentRunScreen from './screen';

export const metadata: Metadata = { title: 'Assessment in progress | New Horizon' };

export default function AssessmentRunPage() {
  return <AssessmentRunScreen />;
}
