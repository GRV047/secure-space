import { Download, ExternalLink } from 'lucide-react';
import type { ExecutionLogEntry } from '../../types/scan.types';

interface Props {
  entries: ExecutionLogEntry[];
}

export function ExecutionLog({ entries }: Props) {
  function handleDownload() {
    const lines = entries.map(
      (e) => `${e.lineNo}\t${e.timestamp}\t${e.testId}\t${e.message}`,
    );
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'execution-log.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <p className="text-xs font-semibold text-secondary uppercase tracking-widest">
          Execution log
        </p>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 text-xs text-secondary border border-border rounded px-2.5 py-1 hover:bg-card-hover transition-colors cursor-pointer"
          >
            <ExternalLink size={12} />
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs text-secondary border border-border rounded px-2.5 py-1 hover:bg-card-hover transition-colors cursor-pointer"
          >
            <Download size={12} />
            Download log
          </button>
        </div>
      </div>

      {/* Log content */}
      <div className="p-5 max-h-[200px] overflow-y-auto">
        {entries.length === 0 ? (
          <p className="text-xs text-muted">No log entries.</p>
        ) : (
          <div className="font-mono text-xs text-secondary leading-relaxed space-y-0.5">
            {entries.map((entry) => (
              <div key={entry.lineNo} className="flex gap-3 hover:bg-page rounded px-1">
                <span className="text-muted shrink-0 w-5 text-right">{entry.lineNo}</span>
                <span className="text-muted shrink-0">{entry.timestamp}</span>
                <span className="text-accent shrink-0">{entry.testId}</span>
                <span className="text-secondary break-all">{entry.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
