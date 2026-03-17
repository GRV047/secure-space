import type { ScanOverview } from '../../types/scan.types';

interface Props {
  overview: ScanOverview;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h > 0 ? `${h}h` : '', m > 0 ? `${m}m` : '', `${s}s`].filter(Boolean).join(' ');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

interface TimelineRowProps {
  label: string;
  value?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

function TimelineRow({ label, value, isFirst, isLast }: TimelineRowProps) {
  return (
    <div className="flex items-start gap-3">
      {/* Dot + line */}
      <div className="flex flex-col items-center shrink-0 w-4">
        <div className={`w-[10px] h-[10px] rounded-full border-2 shrink-0 mt-0.5 ${value ? 'bg-accent border-accent' : 'bg-white border-border-strong'}`} />
        {!isLast && <div className="w-px flex-1 bg-border mt-1 min-h-[20px]" />}
      </div>
      {/* Content */}
      <div className={`flex items-baseline justify-between w-full gap-2 ${isFirst ? '' : 'pb-4'} ${isLast ? '' : 'pb-4'}`}>
        <span className="text-xs text-secondary">{label}</span>
        <span className="text-xs text-primary font-medium">{value ?? '—'}</span>
      </div>
    </div>
  );
}

export function ScanTimeline({ overview }: Props) {
  const startValue = overview.startedAt ? formatDate(overview.startedAt) : undefined;
  const durationValue = overview.duration ? formatDuration(overview.duration) : undefined;
  const endValue = overview.completedAt ? formatDate(overview.completedAt) : undefined;

  const rows = [
    { label: 'In queue', value: undefined },
    { label: 'Start',    value: startValue },
    { label: 'Duration', value: durationValue },
    { label: 'End',      value: endValue },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4">
        Scan timeline
      </p>
      <div>
        {rows.map((row, idx) => (
          <TimelineRow
            key={row.label}
            label={row.label}
            value={row.value}
            isFirst={idx === 0}
            isLast={idx === rows.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
