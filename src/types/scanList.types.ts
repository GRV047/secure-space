export type ScanStatus = 'Queued' | 'Initialized' | 'In-Progress' | 'Completed';

export interface ScanEntry {
  id: string;
  name: string;
  url: string;
  excludedDomains: string;
  status: ScanStatus;
  executionDate: string; // ISO string
  issues: number;
}

// ─── API contract types ───────────────────────────────────────────────────────

/** Input collected from the Setup form before sending to the API. */
export interface CreateScanInput {
  projectId: number;
  name: string;            // display label (stored in our app, not sent to API)
  url: string;             // display URL (from project, not sent to API)
  includeSubdomains: boolean;
  excludedDomains: string[]; // each item → exclusions[].pattern
}

/** POST /projects/{project_id}/scans/ — request body */
export interface CreateScanPayload {
  include_subdomains: boolean;
  crawl_session_id: number;
  exclusions: { pattern: string; type: 'path' }[];
}

/** POST /projects/{project_id}/scans/ — response body */
export interface CreateScanResponse {
  id: number;
  project_id: number;
  start_url: string;
  effective_start_url: string;
  include_subdomains: boolean;
  crawl_session_id: number;
  progress_percentage: number;
  exclusion_rules: { id: number; pattern: string; type: string }[];
  status: string;
  zap_scan_id: string;
  metadata: Record<string, unknown>;
  spider: { url_count: number; urls: string[] };
  queued_at: string;
  initialized_at: string;
  crawling_started_at: string;
  scanning_started_at: string;
  processing_started_at: string;
  completed_at: string;
  failed_at: string;
}
