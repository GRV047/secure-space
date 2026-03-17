import type { ScanStatus } from '../../types/scan.types';

interface StatusIndicatorProps {
  status: ScanStatus;
  showLabel?: boolean;
}

const dotClass: Record<ScanStatus, string> = {
  running:   'bg-low',
  completed: 'bg-success',
  failed:    'bg-critical',
  paused:    'bg-medium',
};

const labelClass: Record<ScanStatus, string> = {
  running:   'text-low',
  completed: 'text-success',
  failed:    'text-critical',
  paused:    'text-medium',
};

const labels: Record<ScanStatus, string> = {
  running:   'Running',
  completed: 'Completed',
  failed:    'Failed',
  paused:    'Paused',
};

export function StatusIndicator({ status, showLabel = true }: StatusIndicatorProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass[status]}`} />
      {showLabel && (
        <span className={`text-xs font-medium ${labelClass[status]}`}>{labels[status]}</span>
      )}
    </span>
  );
}
