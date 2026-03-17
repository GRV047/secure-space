import { ScanSetupForm } from '../components/setup/ScanSetupForm';
import { Card } from '../components/ui/Card';
import type { ScanEntry } from '../types/scanList.types';

interface Props {
  onStartScan: (scan: ScanEntry) => void;
}

export function SetupPage({ onStartScan }: Props) {
  return (
    <div className="flex items-start justify-start">
      <div className="w-full max-w-[644px]">
        <h1 className="text-xl font-bold text-primary mb-1">New Scan Setup</h1>
        <p className="text-[13px] text-secondary mb-6">
          Configure a target application and start a security scan.
        </p>
        <Card>
          <ScanSetupForm onStartScan={onStartScan} />
        </Card>
      </div>
    </div>
  );
}
