import { useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  selectable?: boolean;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  getRowId?: (row: T, index: number) => string;
}

export function Table<T>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data',
  selectable = false,
  rowsPerPageOptions = [5, 10, 20],
  defaultRowsPerPage = 10,
  getRowId,
}: TableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const totalRows = data.length;
  const pageData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const getKey = (row: T, idx: number) =>
    getRowId ? getRowId(row, idx) : String(page * rowsPerPage + idx);

  const toggleSelectAll = () => {
    if (selectedIds.size === pageData.length && pageData.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pageData.map((row, idx) => getKey(row, idx))));
    }
  };

  const toggleRow = (key: string) => {
    const next = new Set(selectedIds);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedIds(next);
  };

  const allSelected = pageData.length > 0 && selectedIds.size === pageData.length;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              {selectable && (
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border cursor-pointer accent-accent"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-xs font-semibold text-secondary whitespace-nowrap"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center py-12 text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageData.map((row, idx) => {
                const key = getKey(row, idx);
                const isSelected = selectedIds.has(key);
                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-border transition-colors ${
                      isSelected
                        ? 'bg-accent/5'
                        : onRowClick
                          ? 'cursor-pointer hover:bg-card-hover'
                          : 'hover:bg-card-hover'
                    }`}
                  >
                    {selectable && (
                      <td className="px-4 py-3 w-10">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(key)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded border-border cursor-pointer accent-accent"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 align-middle text-primary">
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalRows > 0 && (
        <div className="flex items-center justify-end gap-6 px-4 py-3 border-t border-border text-sm text-secondary">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              className="bg-transparent border-none text-primary font-medium cursor-pointer outline-none text-sm"
            >
              {rowsPerPageOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <span>
            {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, totalRows)} of {totalRows}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1 rounded hover:bg-card-hover disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors text-secondary"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1 rounded hover:bg-card-hover disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors text-secondary"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
