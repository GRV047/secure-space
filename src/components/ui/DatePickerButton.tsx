import { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';

interface Props {
  date: Date;
  onChange: (date: Date) => void;
}

const pickerClassNames = {
  root:            'px-4 pt-3 pb-1 select-none',
  months:          'relative',
  month:           '',

  // Nav on the top-right (abs so it overlays the caption row)
  nav:             'absolute top-0 right-0 flex items-center',
  button_previous: 'flex items-center justify-center w-8 h-8 rounded-full text-[#6B7280] hover:bg-[#F5F6FA] transition-colors',
  button_next:     'flex items-center justify-center w-8 h-8 rounded-full text-[#6B7280] hover:bg-[#F5F6FA] transition-colors',
  chevron:         'w-[18px] h-[18px]',

  // Caption row — label left-aligned, same height as nav buttons
  month_caption:   'flex items-center h-8 mb-3',
  caption_label:   'text-sm font-semibold text-[#131313] flex items-center gap-0.5 cursor-default',

  month_grid:         'w-full border-collapse',
  weekdays:           '',
  weekday:            'text-center text-xs font-medium text-[#9CA3AF] pb-2',
  weeks:              '',
  week:               '',
  day:                'p-[2px] text-center',
  day_button:         [
    'mx-auto flex items-center justify-center',
    'w-9 h-9 rounded-full text-sm text-[#131313] transition-colors',
    'hover:bg-[#F5F6FA]',
    'focus:outline-none',
  ].join(' '),

  // Modifiers applied to the `day` wrapper cell
  today:    '[&>button]:border [&>button]:border-[#002CCD] [&>button]:text-[#002CCD] [&>button]:font-medium',
  selected: '[&>button]:!bg-[#002CCD] [&>button]:!text-white [&>button]:!border-transparent [&>button]:font-medium',
  outside:  '[&>button]:text-[#C9CBD0] [&>button]:hover:bg-transparent',
  disabled: '[&>button]:opacity-30 [&>button]:cursor-not-allowed',
  hidden:   'invisible',

  // Unused — kept for TS completeness
  range_start:          '',
  range_end:            '',
  range_middle:         '',
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

export function DatePickerButton({ date, onChange }: Props) {
  const [open, setOpen]           = useState(false);
  const [pending, setPending]     = useState<Date>(date);
  const ref                       = useRef<HTMLDivElement>(null);

  // Sync pending when prop changes externally
  useEffect(() => { setPending(date); }, [date]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  function handleOk() {
    onChange(pending);
    setOpen(false);
  }

  function handleCancel() {
    setPending(date); // revert
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-secondary border border-border rounded px-3 py-1.5 hover:bg-card-hover transition-colors cursor-pointer"
      >
        <Calendar size={13} />
        {format(date, 'MMMM d, yyyy')}
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl w-[320px] overflow-hidden">
          <DayPicker
            mode="single"
            selected={pending}
            defaultMonth={pending}
            onSelect={(d) => { if (d) setPending(d); }}
            classNames={pickerClassNames}
            components={{
              Chevron: ({ orientation }) =>
                orientation === 'left'
                  ? <ChevronLeft  size={18} strokeWidth={1.8} />
                  : <ChevronRight size={18} strokeWidth={1.8} />,
              CaptionLabel: ({ children }) => (
                <span className="text-sm font-semibold text-[#131313] flex items-center gap-0.5 cursor-default">
                  {children}
                  <ChevronDown size={15} className="text-[#6B7280] mt-px" />
                </span>
              ),
            }}
          />

          {/* Footer */}
          <div className="flex justify-end gap-1 px-4 py-3 border-t border-[#E5E7EB]">
            <button
              onClick={handleCancel}
              className="text-sm font-medium text-[#6B7280] px-4 py-1.5 rounded hover:bg-[#F5F6FA] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleOk}
              className="text-sm font-medium text-[#002CCD] px-4 py-1.5 rounded hover:bg-[#F0F4FF] transition-colors"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
