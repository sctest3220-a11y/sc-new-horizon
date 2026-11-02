import type { Metadata } from 'next';
import LearningScreen from '../learning-screen';

export const metadata: Metadata = { title: 'AI Labs | New Horizon' };

export default function LabsPage() {
  return <LearningScreen />;
}
