import type { ScanOverview } from '../../types/scan.types';

interface Props {
  overview: ScanOverview | null;
  loading: boolean;
}

export function VisitedPagesCard({ overview, loading }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">
        Visited pages
      </p>
      {loading || !overview ? (
        <div className="h-7 w-24 bg-border rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-primary">
          {overview.visitedPages.toLocaleString()}
          <span className="text-base font-normal text-secondary ml-1">
            / {overview.totalPages.toLocaleString()}
          </span>
        </p>
      )}
    </div>
  );
}
