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

// ─── Exports (always mock — API not ready for issues) ────────────────────────

export const fetchIssues          = fetchIssuesMock;
export const updateIssueStatus    = updateIssueStatusMock;
export const updateIssueSeverity  = updateIssueSeverityMock;
export const addIssueComment      = addIssueCommentMock;
