import type { Issue, IssueStatus, Severity } from '../types/issue.types';
import { mockIssues } from '../mock/issues.mock';

// Swap these implementations with real API calls when backend is ready.

export async function fetchIssues(_scanId: string): Promise<Issue[]> {
  return Promise.resolve(mockIssues);
}

export async function updateIssueStatus(issueId: string, status: IssueStatus): Promise<Issue> {
  const issue = mockIssues.find((i) => i.id === issueId);
  if (!issue) throw new Error(`Issue ${issueId} not found`);
  return Promise.resolve({ ...issue, status });
}

export async function updateIssueSeverity(issueId: string, severity: Severity): Promise<Issue> {
  const issue = mockIssues.find((i) => i.id === issueId);
  if (!issue) throw new Error(`Issue ${issueId} not found`);
  return Promise.resolve({ ...issue, severity });
}

export async function addIssueComment(
  issueId: string,
  text: string,
  author: string
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
