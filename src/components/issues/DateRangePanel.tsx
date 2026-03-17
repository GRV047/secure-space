import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';

interface Props {
  range: { from: Date | null; to: Date | null };
  onChange: (range: { from: Date | null; to: Date | null }) => void;
  onClose: () => void;
}

const pickerClassNames = {
  root:            'px-4 pt-3 pb-1 select-none',
  months:          'relative',
  month:           '',
  nav:             'absolute top-0 right-0 flex items-center',
  button_previous: 'flex items-center justify-center w-8 h-8 rounded-full text-[#6B7280] hover:bg-[#F5F6FA] transition-colors',
  button_next:     'flex items-center justify-center w-8 h-8 rounded-full text-[#6B7280] hover:bg-[#F5F6FA] transition-colors',
  chevron:         'w-[18px] h-[18px]',
  month_caption:   'flex items-center h-8 mb-3',
  caption_label:   'text-sm font-semibold text-[#131313]',
  month_grid:      'w-full border-collapse',
  weekdays:        '',
  weekday:         'text-center text-xs font-medium text-[#9CA3AF] pb-2',
  weeks:           '',
  week:            '',
  day:             'p-[2px] text-center',
  day_button:      'mx-auto flex items-center justify-center w-9 h-9 rounded-full text-sm text-[#131313] transition-colors hover:bg-[#F5F6FA] focus:outline-none',
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

export function DateRangePanel({ range, onChange, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState<DateRange | undefined>(
    range.from ? { from: range.from, to: range.to ?? undefined } : undefined,
  );

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [onClose]);

  function handleApply() {
    onChange({ from: pending?.from ?? null, to: pending?.to ?? null });
    onClose();
  }

  function handleClear() {
    setPending(undefined);
    onChange({ from: null, to: null });
  }

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full mt-1 z-50 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl overflow-hidden"
    >
      <DayPicker
        mode="range"
        selected={pending}
        onSelect={setPending}
        classNames={pickerClassNames}
        components={{
          Chevron: ({ orientation }) =>
            orientation === 'left'
              ? <ChevronLeft  size={18} strokeWidth={1.8} />
              : <ChevronRight size={18} strokeWidth={1.8} />,
        }}
      />

      <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E7EB]">
        <button
          onClick={handleClear}
          className="text-xs text-[#6B7280] hover:text-[#131313] transition-colors"
        >
          Clear
        </button>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="text-xs font-medium text-[#6B7280] px-3 py-1.5 hover:bg-[#F5F6FA] rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="text-xs font-medium text-[#002CCD] px-3 py-1.5 hover:bg-[#F0F4FF] rounded transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
