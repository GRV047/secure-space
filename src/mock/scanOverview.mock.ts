import type {
  ScanOverview,
  ScanDetails,
  TimelineEvent,
  SeverityDataPoint,
  AppExplorationData,
  ExecutionLogEntry,
} from '../types/scan.types';

export const mockScanOverview: ScanOverview = {
  id: 'scan-2024-001',
  targetUrl: 'https://app.example.com',
  status: 'running',
  startedAt: '2026-02-11T15:14:00Z',
  completedAt: undefined,
  duration: 981,
  visitedPages: 18,
  totalPages: 18,
  testedElements: 59,
  totalElements: 121,
  // Matches the 8 issues in issues.mock.ts (Critical×3, High×3, Medium×1, Low×1)
  issueCount: {
    critical: 3,
    high: 3,
    medium: 1,
    low: 1,
    info: 0,
  },
};

export const mockScanDetails: ScanDetails = {
  id: '6d91c53e-a475-48e0-91b0-3e78014c08Ac',
  name: 'Full Application Scan – Feb 2026',
  targetUrl: 'https://app.example.com',
  scanType: 'Full Scan',
  profile: 'OWASP Top 10',
  authentication: true,
  createdBy: 'abhishek.jain@successive.tech',
  tags: ['production', 'quarterly'],
};

export const mockTimeline: TimelineEvent[] = [
  { timestamp: '2026-02-11T15:14:00Z', event: 'Start',    description: 'Feb 11, 2026 3:14 PM' },
  { timestamp: '2026-02-11T15:30:21Z', event: 'Duration', description: '16m 21s' },
];

export const mockSeverityData: SeverityDataPoint[] = [
  { name: 'Injection', critical: 1, high: 3, medium: 5, low: 2,  info: 0  },
  { name: 'Auth',      critical: 1, high: 2, medium: 4, low: 6,  info: 1  },
  { name: 'XSS',       critical: 0, high: 4, medium: 8, low: 5,  info: 2  },
  { name: 'CSRF',      critical: 0, high: 1, medium: 3, low: 7,  info: 3  },
  { name: 'SSRF',      critical: 1, high: 2, medium: 2, low: 1,  info: 0  },
  { name: 'Config',    critical: 0, high: 0, medium: 6, low: 20, info: 11 },
];

export const mockAppExplorationData: AppExplorationData = {
  requests: 342,
  parameters: 87,
  cookies: 14,
  headers: 26,
  pages: 18,
  failedRequests: 5,
};

export const mockExecutionLog: ExecutionLogEntry[] = [
  { lineNo: 1,  timestamp: '02/11/2026 10:08:44', testId: 'CRVA8DESK0', message: '[Text] Sending test (Archive File Download) on https://demo.testfire.net/index.sp' },
  { lineNo: 2,  timestamp: '02/11/2026 10:08:44', testId: 'CRVA8DESK0', message: '[Text] Sending test (Temporary File Download) on https://demo.testfire.net/login.sp' },
  { lineNo: 3,  timestamp: '02/11/2026 10:08:44', testId: 'CRVA8DESK0', message: '[Text] Sending test (Application Error) on https://demo.testfire.net/subscribe?parameter=1+%Email' },
  { lineNo: 4,  timestamp: '02/11/2026 10:08:44', testId: 'CRVA8DESK0', message: '[Text] test (Temporary File Download) is negative on: https://demo.testfire.net/subscribe' },
  { lineNo: 5,  timestamp: '02/11/2026 10:08:44', testId: 'CRVA8DESK0', message: '[Text] test (Temporary File Download) is negative on: https://demo.testfire.net/branches/sp' },
  { lineNo: 6,  timestamp: '02/11/2026 10:08:44', testId: 'CRVA8DESK0', message: '[Text] Test (LDAP Injection) is negative on: https://demo.testfire.net/doUnsubscribe?parameter=1+%Email' },
  { lineNo: 7,  timestamp: '02/11/2026 10:08:44', testId: 'CRVA8DESK0', message: '[Text] Sending test (SQL Injection) on https://demo.testfire.net/api/search?q=test' },
  { lineNo: 8,  timestamp: '02/11/2026 10:08:44', testId: 'CRVA8DESK0', message: '[Text] test (SQL Injection) is negative on: https://demo.testfire.net/api/search?q=test' },
  { lineNo: 9,  timestamp: '02/11/2026 10:08:45', testId: 'CRVA8DESK0', message: '[Text] Sending test (XSS) on https://demo.testfire.net/comment?text=hello' },
  { lineNo: 10, timestamp: '02/11/2026 10:08:45', testId: 'CRVA8DESK0', message: '[Text] Sending test (Path Traversal) on https://demo.testfire.net/files?name=report' },
];
