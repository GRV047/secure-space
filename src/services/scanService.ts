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

// Swap these implementations with real API calls when backend is ready.

export async function fetchScanOverview(_scanId: string): Promise<ScanOverview> {
  return Promise.resolve(mockScanOverview);
}

export async function fetchScanDetails(_scanId: string): Promise<ScanDetails> {
  return Promise.resolve(mockScanDetails);
}

export async function fetchScanTimeline(_scanId: string): Promise<TimelineEvent[]> {
  return Promise.resolve(mockTimeline);
}

export async function fetchSeverityData(_scanId: string): Promise<SeverityDataPoint[]> {
  return Promise.resolve(mockSeverityData);
}

export async function fetchAppExplorationData(_scanId: string): Promise<AppExplorationData> {
  return Promise.resolve(mockAppExplorationData);
}

export async function fetchExecutionLog(_scanId: string): Promise<ExecutionLogEntry[]> {
  return Promise.resolve(mockExecutionLog);
}
