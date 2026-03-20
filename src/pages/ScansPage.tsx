import { useEffect } from 'react';
import { ScanListTable } from '../components/scans/ScanListTable';
import { Card } from '../components/ui/Card';
import { useScans } from '../hooks/useScans';
import type { ScanEntry } from '../types/scanList.types';

interface Props {
  projectId?: number;
  onViewScan: (scan: ScanEntry) => void;
  onViewIssues: (scan: ScanEntry) => void;
  onEditScan: (scan: ScanEntry) => void;
}

export function ScansPage({ projectId, onViewScan, onViewIssues, onEditScan }: Props) {
  const { scans, remove, rerun, refresh } = useScans(projectId);

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
          onRerunScan={rerun}
          onEditScan={onEditScan}
        />
      </Card>
    </div>
  );
}
