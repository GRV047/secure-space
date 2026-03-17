import type { IssueFilters as IssueFiltersType } from '../../types/issue.types';
import type { Severity, IssueStatus } from '../../types/issue.types';

interface Props {
  filters: IssueFiltersType;
  onChange: (filters: IssueFiltersType) => void;
}

const SEVERITIES: Severity[] = ['Critical', 'High', 'Medium', 'Low', 'Info'];
const STATUSES: IssueStatus[] = ['Open', 'Confirmed', 'False Positive', 'Fixed', 'Wont Fix'];

const severityActiveClass: Record<Severity, string> = {
  Critical: 'bg-critical/10 text-critical border-critical/30 font-semibold',
  High:     'bg-high/10 text-high border-high/30 font-semibold',
  Medium:   'bg-medium/10 text-medium border-medium/30 font-semibold',
  Low:      'bg-low/10 text-low border-low/30 font-semibold',
  Info:     'bg-info/10 text-info border-info/30 font-semibold',
};

function FilterChip({
  label,
  active,
  onClick,
  isSeverity,
  severityKey,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  isSeverity?: boolean;
  severityKey?: Severity;
}) {
  let className: string;
  if (active && isSeverity && severityKey) {
    className = `px-3 py-1 rounded-full text-xs border cursor-pointer transition-all ${severityActiveClass[severityKey]}`;
  } else if (active) {
    className = 'px-3 py-1 rounded-full text-xs border border-accent/30 bg-accent/10 text-accent font-semibold cursor-pointer';
  } else {
    className = 'px-3 py-1 rounded-full text-xs border border-border text-secondary cursor-pointer hover:border-border-strong transition-all';
  }

  return (
    <button onClick={onClick} className={className}>
      {label}
    </button>
  );
}

export function IssueFilters({ filters, onChange }: Props) {
  function toggleSeverity(sev: Severity) {
    const next = filters.severity.includes(sev)
      ? filters.severity.filter((s) => s !== sev)
      : [...filters.severity, sev];
    onChange({ ...filters, severity: next });
  }

  function toggleStatus(st: IssueStatus) {
    const next = filters.status.includes(st)
      ? filters.status.filter((s) => s !== st)
      : [...filters.status, st];
    onChange({ ...filters, status: next });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-muted uppercase min-w-[52px]">SEVERITY</span>
        {SEVERITIES.map((sev) => (
          <FilterChip
            key={sev}
            label={sev}
            active={filters.severity.includes(sev)}
            onClick={() => toggleSeverity(sev)}
            isSeverity
            severityKey={sev}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-muted uppercase min-w-[52px]">STATUS</span>
        {STATUSES.map((st) => (
          <FilterChip
            key={st}
            label={st}
            active={filters.status.includes(st)}
            onClick={() => toggleStatus(st)}
          />
        ))}
      </div>
    </div>
  );
}
