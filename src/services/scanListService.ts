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

export function rerunScan(id: string): void {
  const original = scansStore.find((s) => s.id === id);
  if (!original) return;
  const clone: ScanEntry = {
    ...original,
    id: `scan-${Date.now()}`,
    status: 'Queued',
    executionDate: new Date().toISOString(),
    issues: 0,
  };
  scansStore.unshift(clone);
}

export function updateScan(id: string, patch: Partial<Omit<ScanEntry, 'id'>>): void {
  const idx = scansStore.findIndex((s) => s.id === id);
  if (idx !== -1) scansStore[idx] = { ...scansStore[idx], ...patch };
}
