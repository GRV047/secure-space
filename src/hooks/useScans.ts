import { useState, useCallback } from 'react';
import { getScans, deleteScan, rerunScan, updateScan } from '../services/scanListService';
import type { ScanEntry } from '../types/scanList.types';

export function useScans() {
  const [scans, setScans] = useState<ScanEntry[]>(() => getScans());

  const remove = useCallback((id: string) => {
    deleteScan(id);
    setScans(getScans());
  }, []);

  const rerun = useCallback((id: string) => {
    rerunScan(id);
    setScans(getScans());
  }, []);

  const update = useCallback((id: string, patch: Partial<Omit<ScanEntry, 'id'>>) => {
    updateScan(id, patch);
    setScans(getScans());
  }, []);

  const refresh = useCallback(() => {
    setScans(getScans());
  }, []);

  return { scans, remove, rerun, update, refresh };
}
