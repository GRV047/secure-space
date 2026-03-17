import { useState, useEffect, useCallback } from 'react';
import type { Issue, IssueStatus, Severity } from '../types/issue.types';
import {
  fetchIssues,
  updateIssueStatus,
  updateIssueSeverity,
  addIssueComment,
} from '../services/issueService';

interface UseIssuesResult {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  changeStatus: (issueId: string, status: IssueStatus) => Promise<void>;
  changeSeverity: (issueId: string, severity: Severity) => Promise<void>;
  addComment: (issueId: string, text: string, author: string) => Promise<void>;
}

export function useIssues(scanId: string): UseIssuesResult {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIssues(scanId)
      .then(setIssues)
      .catch((err: unknown) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [scanId]);

  const changeStatus = useCallback(async (issueId: string, status: IssueStatus) => {
    const updated = await updateIssueStatus(issueId, status);
    setIssues((prev) => prev.map((i) => (i.id === issueId ? updated : i)));
  }, []);

  const changeSeverity = useCallback(async (issueId: string, severity: Severity) => {
    const updated = await updateIssueSeverity(issueId, severity);
    setIssues((prev) => prev.map((i) => (i.id === issueId ? updated : i)));
  }, []);

  const addComment = useCallback(async (issueId: string, text: string, author: string) => {
    const updated = await addIssueComment(issueId, text, author);
    setIssues((prev) => prev.map((i) => (i.id === issueId ? updated : i)));
  }, []);

  return { issues, loading, error, changeStatus, changeSeverity, addComment };
}
