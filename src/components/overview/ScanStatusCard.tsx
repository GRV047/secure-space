import { StatusIndicator } from '../ui/StatusIndicator';
import type { ScanOverview } from '../../types/scan.types';

interface Props {
  overview: ScanOverview | null;
  loading: boolean;
}

export function ScanStatusCard({ overview, loading }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">
        Scan status
      </p>
      {loading || !overview ? (
        <div className="h-4 w-20 bg-border rounded animate-pulse" />
      ) : (
        <StatusIndicator status={overview.status} />
      )}
    </div>
  );
}
