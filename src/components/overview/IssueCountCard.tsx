import { Info } from 'lucide-react';
import type { ScanOverview } from '../../types/scan.types';

interface Props {
  overview: ScanOverview | null;
  loading: boolean;
}

export function IssueCountCard({ overview, loading }: Props) {
  const total = overview
    ? overview.issueCount.critical +
      overview.issueCount.high +
      overview.issueCount.medium +
      overview.issueCount.low +
      overview.issueCount.info
    : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-card">
      <div className="flex items-center gap-1 mb-3">
        <p className="text-xs font-semibold text-secondary uppercase tracking-widest">Issues</p>
        <Info size={12} className="text-muted" />
      </div>
      {loading || !overview ? (
        <div className="h-7 w-10 bg-border rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-accent">{total}</p>
      )}
    </div>
  );
}
