export type ScanStatus = 'Queued' | 'Initialized' | 'In-Progress' | 'Completed';

export interface ScanEntry {
  id: string;
  name: string;
  url: string;
  excludedDomains: string;
  status: ScanStatus;
  executionDate: string; // ISO string
  issues: number;
}
