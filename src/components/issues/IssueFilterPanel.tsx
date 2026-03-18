import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';
import type { IssueFilters, IssueStatus, Severity } from '../../types/issue.types';

const SEVERITIES: { value: Severity; dotClass: string }[] = [
  { value: 'Critical', dotClass: 'text-[#DC2626]' },
  { value: 'High',     dotClass: 'text-[#EA580C]' },
  { value: 'Medium',   dotClass: 'text-[#D97706]' },
  { value: 'Low',      dotClass: 'text-[#0891B2]' },
  { value: 'Info',     dotClass: 'text-[#2563EB]' },
];

const STATUSES: IssueStatus[] = ['Open', 'Confirmed', 'False Positive', 'Fixed', 'Wont Fix'];

const pickerClassNames = {
  root:            'select-none',
  months:          'relative',
  month:           '',
  nav:             'absolute top-0 right-0 flex items-center',
  button_previous: 'flex items-center justify-center w-7 h-7 rounded-full text-[#6B7280] hover:bg-[#F5F6FA] transition-colors',
  button_next:     'flex items-center justify-center w-7 h-7 rounded-full text-[#6B7280] hover:bg-[#F5F6FA] transition-colors',
  chevron:         'w-4 h-4',
  month_caption:   'flex items-center h-7 mb-2',
  caption_label:   'text-xs font-semibold text-[#131313]',
  month_grid:      'w-full border-collapse',
  weekdays:        '',
  weekday:         'text-center text-[10px] font-medium text-[#9CA3AF] pb-1.5',
  weeks:           '',
  week:            '',
  day:             'p-[1px] text-center',
  day_button:      'mx-auto flex items-center justify-center w-7 h-7 rounded-full text-xs text-[#131313] transition-colors hover:bg-[#F5F6FA] focus:outline-none',
  today:           '[&>button]:border [&>button]:border-[#002CCD] [&>button]:text-[#002CCD] [&>button]:font-medium',
  selected:        '[&>button]:!bg-[#002CCD] [&>button]:!text-white [&>button]:!border-transparent [&>button]:font-medium',
  range_start:     '[&>button]:!bg-[#002CCD] [&>button]:!text-white [&>button]:!border-transparent [&>button]:font-medium',
  range_end:       '[&>button]:!bg-[#002CCD] [&>button]:!text-white [&>button]:!border-transparent [&>button]:font-medium',
  range_middle:    '[&>button]:!bg-[#EEF2FF] [&>button]:!text-[#002CCD] [&>button]:!rounded-none [&>button]:hover:!bg-[#E0E7FF]',
  outside:         '[&>button]:text-[#C9CBD0] [&>button]:hover:bg-transparent',
  disabled:        '[&>button]:opacity-30 [&>button]:cursor-not-allowed',
  hidden:          'invisible',
  focused:              '',
  dropdowns:            '',
  dropdown:             '',
  dropdown_root:        '',
  footer:               '',
  months_dropdown:      '',
  week_number:          '',
  week_number_header:   '',
  years_dropdown:       '',
  weeks_before_enter:   '',
  weeks_before_exit:    '',
  weeks_after_enter:    '',
  weeks_after_exit:     '',
  caption_after_enter:  '',
  caption_after_exit:   '',
  caption_before_enter: '',
  caption_before_exit:  '',
};

interface Props {
  filters: IssueFilters;
  onChange: (filters: IssueFilters) => void;
  dateRange: { from: Date | null; to: Date | null };
  onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void;
  onClose: () => void;
  onClear: () => void;
}

export function IssueFilterPanel({ filters, onChange, dateRange, onDateRangeChange, onClose, onClear }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pendingRange, setPendingRange] = useState<DateRange | undefined>(
    dateRange.from ? { from: dateRange.from, to: dateRange.to ?? undefined } : undefined,
  );

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onDateRangeChange({ from: pendingRange?.from ?? null, to: pendingRange?.to ?? null });
        onClose();
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [onClose, onDateRangeChange, pendingRange]);

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

  function handleClearAll() {
    setPendingRange(undefined);
    onClear();
  }

  function handleDone() {
    onDateRangeChange({ from: pendingRange?.from ?? null, to: pendingRange?.to ?? null });
    onClose();
  }

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full mt-1 z-50 bg-white border border-[#E5E7EB] rounded-xl shadow-lg w-72 p-4"
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

      {/* Date Range */}
      <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2 border-t border-[#E5E7EB] pt-3">
        Date Range
      </p>
      <DayPicker
        mode="range"
        selected={pendingRange}
        onSelect={setPendingRange}
        classNames={pickerClassNames}
        components={{
          Chevron: ({ orientation }) =>
            orientation === 'left'
              ? <ChevronLeft  size={16} strokeWidth={1.8} />
              : <ChevronRight size={16} strokeWidth={1.8} />,
        }}
      />

      {/* Footer */}
      <div className="flex justify-between border-t border-[#E5E7EB] pt-3 mt-1">
        <button
          onClick={handleClearAll}
          className="text-xs text-[#6B7280] hover:text-[#131313] transition-colors"
        >
          Clear all
        </button>
        <button
          onClick={handleDone}
          className="text-xs font-medium text-[#002CCD] hover:text-[#0022AA] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
