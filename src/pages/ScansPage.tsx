import { useEffect } from 'react';
import { ScanListTable } from '../components/scans/ScanListTable';
import { Card } from '../components/ui/Card';
import { useScans } from '../hooks/useScans';

interface Props {
  onViewScan: (scanId: string) => void;
  onViewIssues: (scanId: string) => void;
}

export function ScansPage({ onViewScan, onViewIssues }: Props) {
  const { scans, remove, refresh } = useScans();

  // Refresh from store each time this page is shown
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      <h1 className="text-xl font-bold text-primary mb-6">Scan List</h1>
      <Card>
        <ScanListTable
          scans={scans}
          onViewScan={onViewScan}
          onViewIssues={onViewIssues}
          onDeleteScan={remove}
        />
      </Card>
    </div>
  );
}
