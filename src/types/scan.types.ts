export type ScanStatus = 'running' | 'completed' | 'failed' | 'paused';

export interface ScanOverview {
  id: string;
  targetUrl: string;
  status: ScanStatus;
  startedAt: string;
  completedAt?: string;
  duration?: number; // seconds
  visitedPages: number;
  totalPages: number;
  testedElements: number;
  totalElements: number;
  issueCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

export interface ScanDetails {
  id: string;
  name: string;
  targetUrl: string;
  scanType: string;
  profile: string;
  authentication: boolean;
  createdBy: string;
  tags: string[];
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
  description?: string;
}

export interface SeverityDataPoint {
  name: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

export interface AppExplorationData {
  requests: number;
  parameters: number;
  cookies: number;
  headers: number;
  pages: number;
  failedRequests: number;
}

export interface ExecutionLogEntry {
  lineNo: number;
  timestamp: string;
  testId: string;
  message: string;
}
