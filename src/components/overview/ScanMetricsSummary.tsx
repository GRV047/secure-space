import type { ScanOverview } from '../../types/scan.types';

interface Props {
  overview: ScanOverview;
}

interface MetricTileProps {
  value: number;
  label: string;
  colorClass: string;
}

function MetricTile({ value, label, colorClass }: MetricTileProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center flex-1 min-w-[120px] shadow-card">
      <div className={`text-4xl font-bold leading-none ${colorClass}`}>{value}</div>
      <div className="text-xs text-secondary mt-1.5 uppercase tracking-wide">{label}</div>
    </div>
  );
}

export function ScanMetricsSummary({ overview }: Props) {
  const { issueCount } = overview;
  return (
    <div className="flex gap-4 flex-wrap">
      <MetricTile value={issueCount.critical} label="Critical" colorClass="text-critical" />
      <MetricTile value={issueCount.high}     label="High"     colorClass="text-high" />
      <MetricTile value={issueCount.medium}   label="Medium"   colorClass="text-medium" />
      <MetricTile value={issueCount.low}      label="Low"      colorClass="text-low" />
      <MetricTile value={issueCount.info}     label="Info"     colorClass="text-info" />
    </div>
  );
}
