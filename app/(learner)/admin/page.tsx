import type { Metadata } from 'next';
import AdminScreen from './screen';

export const metadata: Metadata = { title: 'Admin console | New Horizon' };

export default function AdminPage() {
  return <AdminScreen />;
}
