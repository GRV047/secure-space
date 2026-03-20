import { USE_MOCK } from '../config/env';
import { apiRequest } from '../config/api';
import type {
  ScanOverview,
  ScanDetails,
  TimelineEvent,
  SeverityDataPoint,
  AppExplorationData,
  ExecutionLogEntry,
  CreateScanPayload,
  CreatedScan,
  CrawlSession,
} from '../types/scan.types';
import {
  mockScanOverview,
  mockScanDetails,
  mockTimeline,
  mockSeverityData,
  mockAppExplorationData,
  mockExecutionLog,
} from '../mock/scanOverview.mock';

// ─── Mock implementations ─────────────────────────────────────────────────────

async function fetchScanOverviewMock(_scanId: string): Promise<ScanOverview> {
  return Promise.resolve(mockScanOverview);
}

async function fetchScanDetailsMock(_scanId: string): Promise<ScanDetails> {
  return Promise.resolve(mockScanDetails);
}

async function fetchScanTimelineMock(_scanId: string): Promise<TimelineEvent[]> {
  return Promise.resolve(mockTimeline);
}

async function fetchSeverityDataMock(_scanId: string): Promise<SeverityDataPoint[]> {
  return Promise.resolve(mockSeverityData);
}

async function fetchAppExplorationDataMock(_scanId: string): Promise<AppExplorationData> {
  return Promise.resolve(mockAppExplorationData);
}

async function fetchExecutionLogMock(_scanId: string): Promise<ExecutionLogEntry[]> {
  return Promise.resolve(mockExecutionLog);
}

// ─── fetchCrawlSessions ───────────────────────────────────────────────────────

async function fetchCrawlSessionsMock(_projectId: number): Promise<CrawlSession[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [{ id: 37, status: 'completed' }];
}

async function fetchCrawlSessionsApi(projectId: number): Promise<CrawlSession[]> {
  return apiRequest<CrawlSession[]>(`/projects/${projectId}/crawl-sessions/`);
}

export const fetchCrawlSessions = USE_MOCK ? fetchCrawlSessionsMock : fetchCrawlSessionsApi;

// ─── createScan ───────────────────────────────────────────────────────────────

async function createScanMock(_projectId: number, _payload: CreateScanPayload): Promise<CreatedScan> {
  await new Promise((r) => setTimeout(r, 600));
  return {
    id: Date.now(),
    project_id: _projectId,
    status: 'queued',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

async function createScanApi(projectId: number, payload: CreateScanPayload): Promise<CreatedScan> {
  return apiRequest<CreatedScan>(`/projects/${projectId}/scans/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export const createScan = USE_MOCK ? createScanMock : createScanApi;

// ─── Exports (always mock — API not ready for dashboard) ─────────────────────

export const fetchScanOverview        = fetchScanOverviewMock;
export const fetchScanDetails         = fetchScanDetailsMock;
export const fetchScanTimeline        = fetchScanTimelineMock;
export const fetchSeverityData        = fetchSeverityDataMock;
export const fetchAppExplorationData  = fetchAppExplorationDataMock;
export const fetchExecutionLog        = fetchExecutionLogMock;
