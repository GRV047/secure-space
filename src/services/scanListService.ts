import { USE_MOCK } from '../config/env';
import { apiRequest } from '../config/api';
import { scansStore } from '../mock/scans.mock';
import type {
  ScanEntry,
  ScanStatus,
  CreateScanInput,
  CreateScanPayload,
  CreateScanResponse,
} from '../types/scanList.types';

// ─── Shared helpers ───────────────────────────────────────────────────────────

const API_STATUS_MAP: Record<string, ScanStatus> = {
  queued:      'Queued',
  initialized: 'Initialized',
  scanning:    'In-Progress',
  'in-progress': 'In-Progress',
  completed:   'Completed',
};

function mapResponseToEntry(res: CreateScanResponse, input: CreateScanInput): ScanEntry {
  return {
    id: String(res.id),
    name: input.name,
    url: res.start_url || input.url,
    excludedDomains: res.exclusion_rules.map((r) => r.pattern).join(', '),
    status: API_STATUS_MAP[res.status.toLowerCase()] ?? 'Queued',
    executionDate: res.queued_at || new Date().toISOString(),
    issues: 0,
  };
}

function buildPayload(input: CreateScanInput): CreateScanPayload {
  return {
    include_subdomains: input.includeSubdomains,
    crawl_session_id: 0,
    exclusions: input.excludedDomains.map((pattern) => ({ pattern, type: 'path' })),
  };
}

// ─── Mock implementations ─────────────────────────────────────────────────────

function getScansMock(): ScanEntry[] {
  return [...scansStore];
}

function addScanMock(scan: ScanEntry): void {
  scansStore.unshift(scan);
}

function deleteScanMock(id: string): void {
  const idx = scansStore.findIndex((s) => s.id === id);
  if (idx !== -1) scansStore.splice(idx, 1);
}

function rerunScanMock(id: string): void {
  const original = scansStore.find((s) => s.id === id);
  if (!original) return;
  const clone: ScanEntry = {
    ...original,
    id: `scan-${Date.now()}`,
    status: 'Queued',
    executionDate: new Date().toISOString(),
    issues: 0,
  };
  scansStore.unshift(clone);
}

function updateScanMock(id: string, patch: Partial<Omit<ScanEntry, 'id'>>): void {
  const idx = scansStore.findIndex((s) => s.id === id);
  if (idx !== -1) scansStore[idx] = { ...scansStore[idx], ...patch };
}

// ─── API implementations (stubs — replace with real calls) ────────────────────

function getScansApi(): ScanEntry[] {
  throw new Error('Scan list API not implemented yet.');
}

function addScanApi(_scan: ScanEntry): void {
  throw new Error('Scan list API not implemented yet.');
}

function deleteScanApi(_id: string): void {
  throw new Error('Scan list API not implemented yet.');
}

function rerunScanApi(_id: string): void {
  throw new Error('Scan list API not implemented yet.');
}

function updateScanApi(_id: string, _patch: Partial<Omit<ScanEntry, 'id'>>): void {
  throw new Error('Scan list API not implemented yet.');
}

async function createScanMock(input: CreateScanInput): Promise<ScanEntry> {
  await new Promise((r) => setTimeout(r, 800)); // simulate network delay

  // Build a response that mirrors the real API shape
  const mockResponse: CreateScanResponse = {
    id: Date.now(),
    project_id: input.projectId,
    start_url: input.url,
    effective_start_url: input.url,
    include_subdomains: input.includeSubdomains,
    crawl_session_id: 0,
    progress_percentage: 0,
    exclusion_rules: input.excludedDomains.map((pattern, i) => ({
      id: i + 1,
      pattern,
      type: 'path',
    })),
    status: 'queued',
    zap_scan_id: '',
    metadata: {},
    spider: { url_count: 0, urls: [] },
    queued_at: new Date().toISOString(),
    initialized_at: '',
    crawling_started_at: '',
    scanning_started_at: '',
    processing_started_at: '',
    completed_at: '',
    failed_at: '',
  };

  const entry = mapResponseToEntry(mockResponse, input);
  scansStore.unshift(entry);
  return entry;
}

async function createScanApi(input: CreateScanInput): Promise<ScanEntry> {
  const payload = buildPayload(input);
  const response = await apiRequest<CreateScanResponse>(
    `/projects/${input.projectId}/scans/`,
    { method: 'POST', body: JSON.stringify(payload) },
  );
  const entry = mapResponseToEntry(response, input);
  return entry;
}

// ─── Exports (driven by USE_MOCK flag) ────────────────────────────────────────

export const getScans    = USE_MOCK ? getScansMock    : getScansApi;
export const addScan     = USE_MOCK ? addScanMock     : addScanApi;
export const deleteScan  = USE_MOCK ? deleteScanMock  : deleteScanApi;
export const rerunScan   = USE_MOCK ? rerunScanMock   : rerunScanApi;
export const updateScan  = USE_MOCK ? updateScanMock  : updateScanApi;
export const createScan  = USE_MOCK ? createScanMock  : createScanApi;
