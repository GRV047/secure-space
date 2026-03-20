import { useState, useCallback, useEffect } from 'react';
import { getScans, deleteScan, rerunScan, updateScan } from '../services/scanListService';
import type { ScanEntry } from '../types/scanList.types';

export function useScans(projectId?: number) {
  const [scans, setScans] = useState<ScanEntry[]>([]);

  const refresh = useCallback(async () => {
    const data = await getScans(projectId);
    setScans(data);
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = useCallback((id: string) => {
    deleteScan(id);
    refresh();
  }, [refresh]);

  const rerun = useCallback((id: string) => {
    rerunScan(id);
    refresh();
  }, [refresh]);

  const update = useCallback((id: string, patch: Partial<Omit<ScanEntry, 'id'>>) => {
    updateScan(id, patch);
    refresh();
  }, [refresh]);

  return { scans, remove, rerun, update, refresh };
}
