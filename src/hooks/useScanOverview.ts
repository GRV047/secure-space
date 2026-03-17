import { useState, useEffect } from 'react';
import type { ScanOverview, ScanDetails, AppExplorationData } from '../types/scan.types';
import { fetchScanOverview, fetchScanDetails, fetchAppExplorationData } from '../services/scanService';

interface UseScanOverviewResult {
  overview: ScanOverview | null;
  details: ScanDetails | null;
  explorationData: AppExplorationData | null;
  loading: boolean;
  error: string | null;
}

export function useScanOverview(scanId: string): UseScanOverviewResult {
  const [overview, setOverview] = useState<ScanOverview | null>(null);
  const [details, setDetails] = useState<ScanDetails | null>(null);
  const [explorationData, setExplorationData] = useState<AppExplorationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchScanOverview(scanId),
      fetchScanDetails(scanId),
      fetchAppExplorationData(scanId),
    ])
      .then(([ov, det, exp]) => {
        setOverview(ov);
        setDetails(det);
        setExplorationData(exp);
      })
      .catch((err: unknown) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [scanId]);

  return { overview, details, explorationData, loading, error };
}
