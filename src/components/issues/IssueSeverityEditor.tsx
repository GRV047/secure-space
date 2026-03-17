import type { Severity } from '../../types/issue.types';

const SEVERITIES: Severity[] = ['Critical', 'High', 'Medium', 'Low', 'Info'];

interface Props {
  value: Severity;
  onChange: (severity: Severity) => void;
}

export function IssueSeverityEditor({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Severity)}
      className="bg-card border border-border rounded text-primary text-xs px-2 py-1 cursor-pointer outline-none"
    >
      {SEVERITIES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
