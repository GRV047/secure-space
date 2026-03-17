import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { ScanDetails } from '../../types/scan.types';

interface Props {
  details: ScanDetails;
}

export function ScanDetailsPanel({ details }: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(details.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const shortId = details.id.length > 20
    ? `${details.id.substring(0, 20)}…`
    : details.id;

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4">
        Scan details
      </p>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs text-secondary shrink-0">Execution ID</span>
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-xs font-mono text-primary truncate" title={details.id}>
              {shortId}
            </span>
            <button
              onClick={handleCopy}
              className="shrink-0 bg-transparent border-none cursor-pointer text-muted hover:text-secondary transition-colors p-0.5"
              title="Copy ID"
            >
              {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs text-secondary shrink-0">Scanned by</span>
          <span className="text-xs text-primary text-right">{details.createdBy}</span>
        </div>
      </div>
    </div>
  );
}
