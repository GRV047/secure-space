import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ChevronUp, ChevronDown, ChevronDown as DropChevron, RefreshCw, Pause, Pencil, Trash2 } from 'lucide-react';
import { Table } from '../ui/Table';
import type { ScanEntry, ScanStatus } from '../../types/scanList.types';

interface Props {
  scans: ScanEntry[];
  onViewScan: (scanId: string) => void;
  onViewIssues: (scanId: string) => void;
  onDeleteScan: (scanId: string) => void;
  onRerunScan: (scanId: string) => void;
  onEditScan: (scan: ScanEntry) => void;
}

const statusClasses: Record<ScanStatus, string> = {
  Queued:        'bg-secondary/10 text-secondary border border-secondary/20',
  Initialized:   'bg-info/10 text-info border border-info/20',
  'In-Progress': 'bg-medium/10 text-medium border border-medium/20',
  Completed:     'bg-success/10 text-success border border-success/20',
};

function ScanStatusBadge({ status }: { status: ScanStatus }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase ${statusClasses[status]}`}>
      {status}
    </span>
  );
}

const ACTIVE_STATUSES: ScanStatus[] = ['In-Progress', 'Initialized'];

interface ActionMenuProps {
  row: ScanEntry;
  onRerun: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ActionMenu({ row, onRerun, onEdit, onDelete }: ActionMenuProps) {
  const isActive = ACTIVE_STATUSES.includes(row.status);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  function pick(fn: () => void) {
    fn();
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex items-center gap-1.5 text-[12px] text-secondary border border-border rounded px-2.5 py-1.5 hover:bg-card-hover hover:text-primary transition-colors cursor-pointer bg-transparent whitespace-nowrap"
      >
        <DropChevron size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[130px]">
          {isActive ? (
            <button
              onClick={(e) => { e.stopPropagation(); pick(() => {}); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-primary hover:bg-card-hover transition-colors cursor-pointer border-none bg-transparent text-left"
            >
              <Pause size={13} className="text-medium" />
              Pause
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); pick(onRerun); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-primary hover:bg-card-hover transition-colors cursor-pointer border-none bg-transparent text-left"
            >
              <RefreshCw size={13} className="text-info" />
              Rerun
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); pick(onEdit); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-primary hover:bg-card-hover transition-colors cursor-pointer border-none bg-transparent text-left"
          >
            <Pencil size={13} className="text-medium" />
            Edit
          </button>
          <div className="my-1 border-t border-border" />
          <button
            onClick={(e) => { e.stopPropagation(); pick(onDelete); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-critical hover:bg-critical/5 transition-colors cursor-pointer border-none bg-transparent text-left"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export function ScanListTable({ scans, onViewScan, onViewIssues, onDeleteScan, onRerunScan, onEditScan }: Props) {
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = [...scans].sort((a, b) => {
    const diff = new Date(a.executionDate).getTime() - new Date(b.executionDate).getTime();
    return sortDir === 'asc' ? diff : -diff;
  });

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row: ScanEntry) => (
        <button
          onClick={(e) => { e.stopPropagation(); onViewScan(row.id); }}
          className="text-accent hover:underline text-[13px] font-medium text-left cursor-pointer border-none bg-transparent p-0"
        >
          {row.name}
        </button>
      ),
    },
    {
      key: 'url',
      header: 'URL',
      render: (row: ScanEntry) => (
        <span className="text-[13px] text-secondary block max-w-[200px] truncate">{row.url}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: ScanEntry) => <ScanStatusBadge status={row.status} />,
    },
    {
      key: 'executionDate',
      header: 'Execution Date',
      render: (row: ScanEntry) => (
        <span className="text-[13px] text-secondary whitespace-nowrap">
          {format(new Date(row.executionDate), 'dd MMM yyyy, HH:mm')}
        </span>
      ),
    },
    {
      key: 'issues',
      header: 'Issues',
      render: (row: ScanEntry) => (
        <button
          onClick={(e) => { e.stopPropagation(); onViewIssues(row.id); }}
          className="text-accent hover:underline text-[13px] font-medium cursor-pointer border-none bg-transparent p-0"
        >
          {row.issues}
        </button>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row: ScanEntry) => (
        <ActionMenu
          row={row}
          onRerun={() => onRerunScan(row.id)}
          onEdit={() => onEditScan(row)}
          onDelete={() => onDeleteScan(row.id)}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          className="flex items-center gap-1 text-[12px] text-secondary hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
        >
          Sort by Date
          {sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>
      <Table
        columns={columns}
        data={sorted}
        getRowId={(row) => row.id}
        emptyMessage="No scans found. Start a new scan from the Setup page."
        defaultRowsPerPage={10}
      />
    </div>
  );
}
