import { USE_MOCK } from '../config/env';
import { mockIssues } from '../mock/issues.mock';
import type { Issue, IssueStatus, Severity } from '../types/issue.types';

// ─── Mock implementations ─────────────────────────────────────────────────────

async function fetchIssuesMock(_scanId: string): Promise<Issue[]> {
  return Promise.resolve(mockIssues);
}

async function updateIssueStatusMock(issueId: string, status: IssueStatus): Promise<Issue> {
  const issue = mockIssues.find((i) => i.id === issueId);
  if (!issue) throw new Error(`Issue ${issueId} not found`);
  return Promise.resolve({ ...issue, status });
}

async function updateIssueSeverityMock(issueId: string, severity: Severity): Promise<Issue> {
  const issue = mockIssues.find((i) => i.id === issueId);
  if (!issue) throw new Error(`Issue ${issueId} not found`);
  return Promise.resolve({ ...issue, severity });
}

async function addIssueCommentMock(
  issueId: string,
  text: string,
  author: string,
): Promise<Issue> {
  const issue = mockIssues.find((i) => i.id === issueId);
  if (!issue) throw new Error(`Issue ${issueId} not found`);
  const comment = {
    id: `c-${Date.now()}`,
    author,
    text,
    createdAt: new Date().toISOString(),
  };
  return Promise.resolve({ ...issue, comments: [...issue.comments, comment] });
}

// ─── API implementations (stubs — replace with real calls) ────────────────────

async function fetchIssuesApi(_scanId: string): Promise<Issue[]> {
  throw new Error('Issues API not implemented yet.');
}

async function updateIssueStatusApi(_issueId: string, _status: IssueStatus): Promise<Issue> {
  throw new Error('Issues API not implemented yet.');
}

async function updateIssueSeverityApi(_issueId: string, _severity: Severity): Promise<Issue> {
  throw new Error('Issues API not implemented yet.');
}

async function addIssueCommentApi(_issueId: string, _text: string, _author: string): Promise<Issue> {
  throw new Error('Issues API not implemented yet.');
}

// ─── Exports (driven by USE_MOCK flag) ────────────────────────────────────────

export const fetchIssues          = USE_MOCK ? fetchIssuesMock          : fetchIssuesApi;
export const updateIssueStatus    = USE_MOCK ? updateIssueStatusMock    : updateIssueStatusApi;
export const updateIssueSeverity  = USE_MOCK ? updateIssueSeverityMock  : updateIssueSeverityApi;
export const addIssueComment      = USE_MOCK ? addIssueCommentMock      : addIssueCommentApi;
