import type { Metadata } from 'next';
import DeveloperReportScreen from './screen';

export const metadata: Metadata = { title: 'Developer report | New Horizon' };

export default function DeveloperReportPage() {
  return <DeveloperReportScreen />;
}
