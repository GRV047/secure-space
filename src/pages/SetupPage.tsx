import { ScanSetupForm } from '../components/setup/ScanSetupForm';
import { Card } from '../components/ui/Card';
import type { ScanEntry } from '../types/scanList.types';

interface Props {
  onStartScan: (scan: ScanEntry) => void;
  editScan?: ScanEntry;
  onUpdateScan?: (id: string, patch: Partial<Omit<ScanEntry, 'id'>>) => void;
}

export function SetupPage({ onStartScan, editScan, onUpdateScan }: Props) {
  const isEdit = Boolean(editScan);

  return (
    <div className="flex items-start justify-start">
      <div className="w-full max-w-[644px]">
        <h1 className="text-xl font-bold text-primary mb-1">
          {isEdit ? 'Edit Scan' : 'New Scan Setup'}
        </h1>
        <p className="text-[13px] text-secondary mb-6">
          {isEdit
            ? 'Update the scan configuration below.'
            : 'Configure a target application and start a security scan.'}
        </p>
        <Card>
          <ScanSetupForm
            onStartScan={onStartScan}
            initialScan={editScan}
            onUpdateScan={onUpdateScan}
          />
        </Card>
      </div>
    </div>
  );
}
