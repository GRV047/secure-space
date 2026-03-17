import { useState, useEffect } from 'react';
import type { ExecutionLogEntry } from '../types/scan.types';
import { fetchExecutionLog } from '../services/scanService';

interface UseExecutionLogResult {
  entries: ExecutionLogEntry[];
  loading: boolean;
}

export function useExecutionLog(scanId: string): UseExecutionLogResult {
  const [entries, setEntries] = useState<ExecutionLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchExecutionLog(scanId)
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [scanId]);

  return { entries, loading };
}
