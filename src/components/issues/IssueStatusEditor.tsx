import type { IssueStatus } from '../../types/issue.types';

const STATUSES: IssueStatus[] = ['Open', 'Confirmed', 'False Positive', 'Fixed', 'Wont Fix'];

interface Props {
  value: IssueStatus;
  onChange: (status: IssueStatus) => void;
}

export function IssueStatusEditor({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as IssueStatus)}
      className="bg-card border border-border rounded text-primary text-xs px-2 py-1 cursor-pointer outline-none"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
