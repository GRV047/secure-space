import { PageLayout } from './components/layout/PageLayout';
import { ScanDashboard } from './pages/ScanDashboard';

export default function App() {
  return (
    <PageLayout title="Scan Dashboard">
      <ScanDashboard />
    </PageLayout>
  );
}
