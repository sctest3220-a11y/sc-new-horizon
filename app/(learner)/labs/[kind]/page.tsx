import type { Metadata } from 'next';
import LabScreen from './screen';

export const metadata: Metadata = { title: 'Practice lab | New Horizon' };

export default function LabPage() {
  return <LabScreen />;
}
