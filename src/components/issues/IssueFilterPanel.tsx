import { useEffect, useRef } from 'react';
import type { IssueFilters, IssueStatus, Severity } from '../../types/issue.types';

const SEVERITIES: { value: Severity; dotClass: string }[] = [
  { value: 'Critical', dotClass: 'text-[#DC2626]' },
  { value: 'High',     dotClass: 'text-[#EA580C]' },
  { value: 'Medium',   dotClass: 'text-[#D97706]' },
  { value: 'Low',      dotClass: 'text-[#0891B2]' },
  { value: 'Info',     dotClass: 'text-[#2563EB]' },
];

const STATUSES: IssueStatus[] = ['Open', 'Confirmed', 'False Positive', 'Fixed', 'Wont Fix'];

interface Props {
  filters: IssueFilters;
  onChange: (filters: IssueFilters) => void;
  onClose: () => void;
  onClear: () => void;
}

export function IssueFilterPanel({ filters, onChange, onClose, onClear }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [onClose]);

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
    <div
      ref={ref}
      className="absolute left-0 top-full mt-1 z-50 bg-white border border-[#E5E7EB] rounded-xl shadow-lg w-60 p-4"
    >
      {/* Severity */}
      <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">
        Severity
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {SEVERITIES.map(({ value, dotClass }) => (
          <label key={value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.severity.includes(value)}
              onChange={() => toggleSeverity(value)}
              className="w-4 h-4 accent-[#002CCD] cursor-pointer"
            />
            <span className={`text-xs font-medium flex items-center gap-1 ${dotClass}`}>
              ● {value}
            </span>
          </label>
        ))}
      </div>

      {/* Status */}
      <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2 border-t border-[#E5E7EB] pt-3">
        Status
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {STATUSES.map((st) => (
          <label key={st} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.status.includes(st)}
              onChange={() => toggleStatus(st)}
              className="w-4 h-4 accent-[#002CCD] cursor-pointer"
            />
            <span className="text-xs text-[#131313]">{st}</span>
          </label>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between border-t border-[#E5E7EB] pt-3">
        <button
          onClick={onClear}
          className="text-xs text-[#6B7280] hover:text-[#131313] transition-colors"
        >
          Clear all
        </button>
        <button
          onClick={onClose}
          className="text-xs font-medium text-[#002CCD] hover:text-[#0022AA] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
