import { scansStore } from '../mock/scans.mock';
import type { ScanEntry } from '../types/scanList.types';

export function getScans(): ScanEntry[] {
  return [...scansStore];
}

export function addScan(scan: ScanEntry): void {
  scansStore.unshift(scan);
}

export function deleteScan(id: string): void {
  const idx = scansStore.findIndex((s) => s.id === id);
  if (idx !== -1) scansStore.splice(idx, 1);
}
