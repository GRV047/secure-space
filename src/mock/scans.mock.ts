import type { ScanEntry } from '../types/scanList.types';

const initialScans: ScanEntry[] = [
  {
    id: 'scan-2024-001',
    name: 'DAST 2026-02-11 File Name',
    url: 'https://demo.testfire.net',
    excludedDomains: '',
    status: 'Completed',
    executionDate: '2026-02-11T09:00:00.000Z',
    issues: 8,
  },
  {
    id: 'scan-2024-002',
    name: 'Production API Scan',
    url: 'https://api.example.com',
    excludedDomains: 'cdn.example.com',
    status: 'In-Progress',
    executionDate: '2026-03-10T14:30:00.000Z',
    issues: 3,
  },
  {
    id: 'scan-2024-003',
    name: 'Staging Environment',
    url: 'https://staging.example.com',
    excludedDomains: 'assets.staging.example.com',
    status: 'Initialized',
    executionDate: '2026-03-15T08:00:00.000Z',
    issues: 0,
  },
  {
    id: 'scan-2024-004',
    name: 'New Feature Branch',
    url: 'https://feature.example.com',
    excludedDomains: '',
    status: 'Queued',
    executionDate: '2026-03-17T10:00:00.000Z',
    issues: 0,
  },
];

// Mutable in-memory store — serves as the data source for the service layer
export const scansStore: ScanEntry[] = [...initialScans];
