import type { AppExplorationData as AppExplorationDataType } from '../../types/scan.types';

interface Props {
  data: AppExplorationDataType;
}

interface RowProps {
  label: string;
  value: number;
}

function Row({ label, value }: RowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-secondary">{label}</span>
      <span className="text-sm font-medium text-primary">{value.toLocaleString()}</span>
    </div>
  );
}

export function AppExplorationData({ data }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card h-full flex flex-col">
      <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
        Explore data
      </p>
      <div className="flex flex-col">
        <Row label="Requests"        value={data.requests} />
        <Row label="Parameters"      value={data.parameters} />
        <Row label="Cookies"         value={data.cookies} />
        <Row label="Headers"         value={data.headers} />
        <Row label="Pages"           value={data.pages} />
        <Row label="Failed requests" value={data.failedRequests} />
      </div>
    </div>
  );
}
