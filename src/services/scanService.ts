import { USE_MOCK } from '../config/env';
import type {
  ScanOverview,
  ScanDetails,
  TimelineEvent,
  SeverityDataPoint,
  AppExplorationData,
  ExecutionLogEntry,
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

// ─── API implementations (stubs — replace with real calls) ────────────────────

async function fetchScanOverviewApi(_scanId: string): Promise<ScanOverview> {
  throw new Error('Scan API not implemented yet.');
}

async function fetchScanDetailsApi(_scanId: string): Promise<ScanDetails> {
  throw new Error('Scan API not implemented yet.');
}

async function fetchScanTimelineApi(_scanId: string): Promise<TimelineEvent[]> {
  throw new Error('Scan API not implemented yet.');
}

async function fetchSeverityDataApi(_scanId: string): Promise<SeverityDataPoint[]> {
  throw new Error('Scan API not implemented yet.');
}

async function fetchAppExplorationDataApi(_scanId: string): Promise<AppExplorationData> {
  throw new Error('Scan API not implemented yet.');
}

async function fetchExecutionLogApi(_scanId: string): Promise<ExecutionLogEntry[]> {
  throw new Error('Scan API not implemented yet.');
}

// ─── Exports (driven by USE_MOCK flag) ────────────────────────────────────────

export const fetchScanOverview        = USE_MOCK ? fetchScanOverviewMock        : fetchScanOverviewApi;
export const fetchScanDetails         = USE_MOCK ? fetchScanDetailsMock         : fetchScanDetailsApi;
export const fetchScanTimeline        = USE_MOCK ? fetchScanTimelineMock        : fetchScanTimelineApi;
export const fetchSeverityData        = USE_MOCK ? fetchSeverityDataMock        : fetchSeverityDataApi;
export const fetchAppExplorationData  = USE_MOCK ? fetchAppExplorationDataMock  : fetchAppExplorationDataApi;
export const fetchExecutionLog        = USE_MOCK ? fetchExecutionLogMock        : fetchExecutionLogApi;
