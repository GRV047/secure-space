import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronUp, ChevronDown, Eye, Trash2 } from 'lucide-react';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import type { ScanEntry, ScanStatus } from '../../types/scanList.types';

interface Props {
  scans: ScanEntry[];
  onViewScan: (scanId: string) => void;
  onViewIssues: (scanId: string) => void;
  onDeleteScan: (scanId: string) => void;
}

const statusClasses: Record<ScanStatus, string> = {
  Queued:        'bg-secondary/10 text-secondary border border-secondary/20',
  Initialized:   'bg-info/10 text-info border border-info/20',
  'In-Progress': 'bg-medium/10 text-medium border border-medium/20',
  Completed:     'bg-success/10 text-success border border-success/20',
};

function ScanStatusBadge({ status }: { status: ScanStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}

export function ScanListTable({ scans, onViewScan, onViewIssues, onDeleteScan }: Props) {
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = [...scans].sort((a, b) => {
    const diff =
      new Date(a.executionDate).getTime() - new Date(b.executionDate).getTime();
    return sortDir === 'asc' ? diff : -diff;
  });

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row: ScanEntry) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewScan(row.id);
          }}
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
        <span className="text-[13px] text-secondary block max-w-[200px] truncate">
          {row.url}
        </span>
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
          onClick={(e) => {
            e.stopPropagation();
            onViewIssues(row.id);
          }}
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
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onViewScan(row.id);
            }}
          >
            <Eye size={13} />
            View
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteScan(row.id);
            }}
          >
            <Trash2 size={13} />
          </Button>
        </div>
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
