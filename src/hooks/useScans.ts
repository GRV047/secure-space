import { useState, useCallback } from 'react';
import { getScans, deleteScan } from '../services/scanListService';
import type { ScanEntry } from '../types/scanList.types';

export function useScans() {
  const [scans, setScans] = useState<ScanEntry[]>(() => getScans());

  const remove = useCallback((id: string) => {
    deleteScan(id);
    setScans(getScans());
  }, []);

  const refresh = useCallback(() => {
    setScans(getScans());
  }, []);

  return { scans, remove, refresh };
}
