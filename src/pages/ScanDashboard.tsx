import { useEffect, useRef, useState } from 'react';
import { BarChart2, Bug, ChevronDown, Copy, Filter, Pause, Pencil, RefreshCw, X, XCircle } from 'lucide-react';
import type { ScanStatus } from '../types/scanList.types';
import { Tabs } from '../components/ui/Tabs';
import { DatePickerButton } from '../components/ui/DatePickerButton';
import { VulnerabilityCountCard } from '../components/overview/VulnerabilityCountCard';
import { IssueCountCard } from '../components/overview/IssueCountCard';
import { VisitedPagesCard } from '../components/overview/VisitedPagesCard';
import { TestedElementsCard } from '../components/overview/TestedElementsCard';
import { ScanDetailsPanel } from '../components/overview/ScanDetailsPanel';
import { ScanTimeline } from '../components/overview/ScanTimeline';
import { IssueSeverityChart } from '../components/overview/IssueSeverityChart';
import { AppExplorationData } from '../components/overview/AppExplorationData';
import { ExecutionLog } from '../components/overview/ExecutionLog';
import { IssueTable } from '../components/issues/IssueTable';
import { IssueFilterPanel } from '../components/issues/IssueFilterPanel';
import { IssueSearchBar } from '../components/issues/IssueSearchBar';
import { useScanOverview } from '../hooks/useScanOverview';
import { useScanTimeline } from '../hooks/useScanTimeline';
import { useIssues } from '../hooks/useIssues';
import { useExecutionLog } from '../hooks/useExecutionLog';
import type { IssueFilters as IssueFiltersType } from '../types/issue.types';

const SCAN_ID = 'scan-2024-001';

const tabs = [
  { id: 'overview', label: 'Overview', icon: <BarChart2 size={14} /> },
  { id: 'issues',   label: 'Issues',   icon: <Bug size={14} /> },
];

const defaultFilters: IssueFiltersType = { severity: [], status: [], category: [] };

const ACTIVE_STATUSES: ScanStatus[] = ['In-Progress', 'Initialized'];

interface Props {
  defaultTab?: 'overview' | 'issues';
  scanName?: string;
  scanUrl?: string;
  scanStatus?: ScanStatus;
  onEdit?: () => void;
  onRestart?: () => void;
}

export function ScanDashboard({
  defaultTab = 'overview',
  scanName = 'DAST 2026-02-11 File Name',
  scanUrl = 'https://demo.testfire.net',
  scanStatus = 'Completed',
  onEdit,
  onRestart,
}: Props) {
  const SCAN_URL = scanUrl;
  const SCAN_NAME = scanName;
  const isActive = ACTIVE_STATUSES.includes(scanStatus);
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<IssueFiltersType>(defaultFilters);
  const [pickerDate, setPickerDate] = useState<Date>(new Date(2026, 1, 11));
  const [manageScanOpen, setManageScanOpen] = useState(false);
  const [filtersOpen, setFiltersOpen]       = useState(false);
  const [dateRange, setDateRange]           = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [copied, setCopied]                 = useState(false);
  const manageScanRef  = useRef<HTMLDivElement>(null);
  const filtersRef     = useRef<HTMLDivElement>(null);

  const { overview, details, explorationData, loading: ovLoading } = useScanOverview(SCAN_ID);
  const { loading: tlLoading } = useScanTimeline(SCAN_ID);
  const { issues, changeStatus, changeSeverity, addComment } = useIssues(SCAN_ID);
  const { entries: logEntries, loading: logLoading } = useExecutionLog(SCAN_ID);

  // Close Manage scan dropdown on outside click
  useEffect(() => {
    if (!manageScanOpen) return;
    function onDown(e: MouseEvent) {
      if (manageScanRef.current && !manageScanRef.current.contains(e.target as Node))
        setManageScanOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [manageScanOpen]);

  function copyUrl() {
    navigator.clipboard.writeText(SCAN_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // All active filter conditions combined with AND logic across the full dataset
  const filteredIssues = issues.filter((issue) => {
    if (search) {
      const q = search.toLowerCase();
      const matchesSearch =
        issue.title.toLowerCase().includes(q) ||
        issue.url.toLowerCase().includes(q) ||
        issue.category.toLowerCase().includes(q) ||
        (issue.cwe?.toLowerCase().includes(q) ?? false);
      if (!matchesSearch) return false;
    }
    if (filters.severity.length && !filters.severity.includes(issue.severity)) return false;
    if (filters.status.length   && !filters.status.includes(issue.status))     return false;
    if (dateRange.from || dateRange.to) {
      const d = new Date(issue.detectedAt);
      if (dateRange.from && d < dateRange.from) return false;
      if (dateRange.to   && d > dateRange.to)   return false;
    }
    return true;
  });

  const hasActiveFilters =
    search.length > 0 ||
    filters.severity.length > 0 ||
    filters.status.length > 0 ||
    dateRange.from !== null ||
    dateRange.to   !== null;

  const filterCount = filters.severity.length + filters.status.length;

  const bodyLoading = tlLoading || logLoading;

  return (
    <div>
      {/* ── Page header: title + Manage scan ── */}
      <div className="flex items-start justify-between mb-3">
        {/* Left: scan name + URL */}
        <div>
          <h1 className="text-base font-semibold text-primary leading-snug">{SCAN_NAME}</h1>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[#D1D5DB] text-xs select-none">|</span>
            <span className="text-xs text-secondary">URL: {SCAN_URL}</span>
            <button
              onClick={copyUrl}
              title={copied ? 'Copied!' : 'Copy URL'}
              className="text-muted hover:text-primary transition-colors ml-0.5"
            >
              <Copy size={12} />
            </button>
          </div>
        </div>

        {/* Right: Manage scan dropdown */}
        <div ref={manageScanRef} className="relative">
          <div className="flex items-stretch border border-border rounded-md overflow-hidden">
            <button className="text-sm font-medium text-primary px-3 py-1.5 hover:bg-card-hover transition-colors">
              Manage scan
            </button>
            <button
              onClick={() => setManageScanOpen((v) => !v)}
              className="flex items-center px-2 py-1.5 border-l border-border hover:bg-card-hover transition-colors"
            >
              <ChevronDown size={14} className="text-primary" />
            </button>
          </div>

          {manageScanOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg py-1 w-36">
              {isActive ? (
                <>
                  <button
                    onClick={() => setManageScanOpen(false)}
                    className="w-full text-left px-4 py-2 text-sm text-critical hover:bg-critical/5 transition-colors flex items-center gap-2"
                  >
                    <XCircle size={14} /> Cancel
                  </button>
                  <button
                    onClick={() => setManageScanOpen(false)}
                    className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-card-hover transition-colors flex items-center gap-2"
                  >
                    <Pause size={14} className="text-muted" /> Pause
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setManageScanOpen(false); onRestart?.(); }}
                  className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-card-hover transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={14} className="text-info" /> Restart
                </button>
              )}
              <button
                onClick={() => { setManageScanOpen(false); onEdit?.(); }}
                className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-card-hover transition-colors flex items-center gap-2"
              >
                <Pencil size={14} className="text-muted" /> Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs row + Execution created date ── */}
      <div className="flex items-center justify-between border-b border-border mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} noBorder />
        <div className="flex items-center gap-1.5 pb-px">
          <span className="text-xs text-muted">Execution created</span>
          <DatePickerButton date={pickerDate} onChange={setPickerDate} />
        </div>
      </div>

      {/* ── Overview tab ── */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-4">

            {/* ── Row 1: stat cards (always visible, each owns its skeleton) ── */}
            <VulnerabilityCountCard overview={overview} loading={ovLoading} />
            <IssueCountCard         overview={overview} loading={ovLoading} />
            <VisitedPagesCard       overview={overview} loading={ovLoading} />
            <TestedElementsCard     overview={overview} loading={ovLoading} />

            {/* ── Row 2: body content (gated until data ready) ── */}
            {bodyLoading || !overview || !details || !explorationData ? (
              <>
                {/* skeleton placeholders preserving the same column structure */}
                <div className="h-52 bg-card border border-border rounded-xl animate-pulse" />
                <div className="col-span-2 h-52 bg-card border border-border rounded-xl animate-pulse" />
                <div className="h-52 bg-card border border-border rounded-xl animate-pulse" />
              </>
            ) : (
              <>
                {/* Left col: details + timeline stacked — self-start so they don't stretch */}
                <div className="flex flex-col gap-4 self-start">
                  <ScanDetailsPanel details={details} />
                  <ScanTimeline overview={overview} />
                </div>

                {/* Middle: chart spans cols 2+3, h-full matches Explore Data height */}
                <div className="col-span-2 h-full">
                  <IssueSeverityChart overview={overview} />
                </div>

                {/* Right col: explore data */}
                <AppExplorationData data={explorationData} />
              </>
            )}
          </div>

          {/* ── Row 3: Execution log (full width) ── */}
          {!bodyLoading && <ExecutionLog entries={logEntries} />}
        </div>
      )}

      {/* ── Issues tab ── */}
      {activeTab === 'issues' && (
        <div className="flex flex-col gap-3">
          {/* Search + filter bar */}
          <div className="flex items-center gap-2">
            <IssueSearchBar value={search} onChange={setSearch} />

            {/* Filters button + panel (includes date range) */}
            <div ref={filtersRef} className="relative">
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className={`flex items-center gap-1.5 text-xs border rounded px-3 py-1.5 transition-colors ${
                  filtersOpen || filterCount > 0
                    ? 'border-accent text-accent bg-[#F0F4FF]'
                    : 'border-border text-secondary hover:bg-page'
                }`}
              >
                <Filter size={13} /> Filters
                {filterCount > 0 && (
                  <span className="ml-0.5 bg-accent text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-semibold">
                    {filterCount}
                  </span>
                )}
              </button>
              {filtersOpen && (
                <IssueFilterPanel
                  filters={filters}
                  onChange={setFilters}
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  onClose={() => setFiltersOpen(false)}
                  onClear={() => { setFilters(defaultFilters); setDateRange({ from: null, to: null }); }}
                />
              )}
            </div>

            {/* Clear all */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearch('');
                  setFilters(defaultFilters);
                  setDateRange({ from: null, to: null });
                }}
                className="flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors"
              >
                <X size={12} /> Clear all
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <IssueTable
              issues={filteredIssues}
              onStatusChange={changeStatus}
              onSeverityChange={changeSeverity}
              onAddComment={addComment}
            />
          </div>
        </div>
      )}
    </div>
  );
}
