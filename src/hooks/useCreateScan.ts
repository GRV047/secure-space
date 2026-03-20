import { useState, useCallback } from 'react';
import { createScan, fetchCrawlSessions } from '../services/scanService';
import type { CreateScanPayload, CreatedScan } from '../types/scan.types';

export function useCreateScan() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState(false);

  const doCreateScan = useCallback(
    async (projectId: number, payload: CreateScanPayload): Promise<CreatedScan | null> => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      try {
        let crawl_session_id: number | null = null;
        try {
          const sessions = await fetchCrawlSessions(projectId);
          const completed = sessions.find((s) => s.status === 'completed');
          crawl_session_id = completed ? completed.id : null;
        } catch {
          crawl_session_id = null;
        }
        const result = await createScan(projectId, { ...payload, crawl_session_id });
        setSuccess(true);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { doCreateScan, isLoading, error, success };
}
