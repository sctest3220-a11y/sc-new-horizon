import type { Metadata } from 'next';
import DashboardScreen from './screen';

export const metadata: Metadata = { title: 'Dashboard | New Horizon' };

export default function DashboardPage() {
  return <DashboardScreen />;
}
