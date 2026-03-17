import type { Severity, IssueStatus } from '../../types/issue.types';

interface SeverityBadgeProps {
  severity: Severity;
}

const severityClasses: Record<Severity, string> = {
  Critical: 'bg-critical/10 text-critical border border-critical/20',
  High:     'bg-high/10 text-high border border-high/20',
  Medium:   'bg-medium/10 text-medium border border-medium/20',
  Low:      'bg-low/10 text-low border border-low/20',
  Info:     'bg-info/10 text-info border border-info/20',
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase ${severityClasses[severity]}`}>
      {severity}
    </span>
  );
}

interface StatusBadgeProps {
  status: IssueStatus;
}

const statusClasses: Record<IssueStatus, string> = {
  Open:             'bg-high/10 text-high border border-high/20',
  Confirmed:        'bg-critical/10 text-critical border border-critical/20',
  'False Positive': 'bg-secondary/10 text-secondary border border-secondary/20',
  Fixed:            'bg-success/10 text-success border border-success/20',
  'Wont Fix':       'bg-muted/10 text-muted border border-muted/20',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
