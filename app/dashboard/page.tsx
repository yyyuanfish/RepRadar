import type { Metadata } from 'next';
import RepRadar from '@/components/RepRadar';
export const metadata: Metadata = { title: 'Workspace | RepRadar' };
export default function DashboardPage() { return <RepRadar/>; }
