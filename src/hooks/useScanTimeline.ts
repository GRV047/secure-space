import { useState, useEffect } from 'react';
import type { TimelineEvent } from '../types/scan.types';
import { fetchScanTimeline } from '../services/scanService';

interface UseScanTimelineResult {
  timeline: TimelineEvent[];
  loading: boolean;
  error: string | null;
}

export function useScanTimeline(scanId: string): UseScanTimelineResult {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScanTimeline(scanId)
      .then(setTimeline)
      .catch((err: unknown) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [scanId]);

  return { timeline, loading, error };
}
