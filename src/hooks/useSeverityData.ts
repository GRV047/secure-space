import { useState, useEffect } from 'react';
import type { SeverityDataPoint } from '../types/scan.types';
import { fetchSeverityData } from '../services/scanService';

interface UseSeverityDataResult {
  severityData: SeverityDataPoint[];
  loading: boolean;
  error: string | null;
}

export function useSeverityData(scanId: string): UseSeverityDataResult {
  const [severityData, setSeverityData] = useState<SeverityDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSeverityData(scanId)
      .then(setSeverityData)
      .catch((err: unknown) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [scanId]);

  return { severityData, loading, error };
}
