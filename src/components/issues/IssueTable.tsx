import { useState } from 'react';
import { MessageSquare, Pencil, Upload } from 'lucide-react';
import { IssueCommentModal } from './IssueCommentModal';
import { format } from 'date-fns';
import type { Issue, IssueStatus, Severity } from '../../types/issue.types';

const severityDotClass: Record<string, string> = {
  Critical: 'text-[#DC2626]',
  High:     'text-[#EA580C]',
  Medium:   'text-[#D97706]',
  Low:      'text-[#0891B2]',
  Info:     'text-[#2563EB]',
};

interface Props {
  issues: Issue[];
  onStatusChange?: (id: string, status: IssueStatus) => void;
  onSeverityChange?: (id: string, severity: Severity) => void;
  onAddComment: (id: string, text: string, author: string) => void;
}

export function IssueTable({ issues, onAddComment }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [commentIssue, setCommentIssue] = useState<Issue | null>(null);

  const allSelected  = issues.length > 0 && selectedIds.size === issues.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  function toggleAll() {
    setSelectedIds(allSelected ? new Set() : new Set(issues.map((i) => i.id)));
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div>
      {/* Selection toolbar — only visible when rows are checked */}
      {selectedIds.size > 0 && (
        <div className="flex items-center px-4 py-2.5 border-b border-[#E5E7EB] bg-white gap-4">
          <span className="text-xs font-medium text-[#131313]">
            Selected: {selectedIds.size}
          </span>
          <div className="w-px h-3.5 bg-[#D1D5DB]" />
          <button className="flex items-center gap-1 text-xs text-[#131313] hover:text-[#002CCD] transition-colors">
            <Pencil size={12} /> Edit status
          </button>
          <button className="flex items-center gap-1 text-xs text-[#131313] hover:text-[#002CCD] transition-colors">
            <Pencil size={12} /> Edit severity
          </button>
          <button className="flex items-center gap-1 text-xs text-[#131313] hover:text-[#002CCD] transition-colors">
            <MessageSquare size={12} /> Add comment
          </button>
          <div className="ml-auto">
            <button className="flex items-center gap-1 text-xs text-[#131313] hover:text-[#002CCD] transition-colors">
              <Upload size={12} /> Export
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="w-10 px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => { if (el) el.indeterminate = someSelected; }}
                onChange={toggleAll}
                className="w-4 h-4 accent-[#002CCD] cursor-pointer rounded"
              />
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-[#6B7280] whitespace-nowrap">
              Severity ↓
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-[#6B7280]">Status</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-[#6B7280]">Issue type</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-[#6B7280]" />
            <th className="px-3 py-3 text-left text-xs font-medium text-[#6B7280] whitespace-nowrap">
              Last found
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-[#6B7280] whitespace-nowrap">
              Last updated
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-[#6B7280] whitespace-nowrap">
              Library and version
            </th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => {
            const selected = selectedIds.has(issue.id);
            const dotClass = severityDotClass[issue.severity] ?? 'text-[#9CA3AF]';
            const dateStr  = format(new Date(issue.detectedAt), 'MMM d, yyyy h:mm aa');
            return (
              <tr
                key={issue.id}
                className={`border-b border-[#E5E7EB] transition-colors ${
                  selected ? 'bg-[#EEF2FF]' : 'hover:bg-[#F5F6FA]'
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleOne(issue.id)}
                    className="w-4 h-4 accent-[#002CCD] cursor-pointer rounded"
                  />
                </td>
                <td className="px-3 py-3">
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${dotClass}`}>
                    ● {issue.severity}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs text-[#131313]">{issue.status}</td>
                <td className="px-3 py-3 text-xs text-[#131313] max-w-[220px] truncate">
                  {issue.title}
                </td>
                <td className="px-3 py-3 text-xs text-[#9CA3AF] max-w-[160px] truncate">
                  *Unavailable for free plan
                </td>
                <td className="px-3 py-3 text-xs text-[#131313] whitespace-nowrap">{dateStr}</td>
                <td className="px-3 py-3 text-xs text-[#131313] whitespace-nowrap">{dateStr}</td>
                <td className="px-3 py-3 text-xs text-[#9CA3AF]">
                  Unavailable for free plan Unavailable
                </td>
              </tr>
            );
          })}

          {issues.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-10 text-center text-sm text-[#9CA3AF]">
                No issues match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {commentIssue && (
        <IssueCommentModal
          issue={commentIssue}
          onClose={() => setCommentIssue(null)}
          onAddComment={(text) => {
            onAddComment(commentIssue.id, text, 'user@example.com');
            setCommentIssue(null);
          }}
        />
      )}
    </div>
  );
}
