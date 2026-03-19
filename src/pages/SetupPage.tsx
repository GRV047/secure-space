import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { ScanSetupForm } from '../components/setup/ScanSetupForm';
import { CreateProjectModal } from '../components/setup/CreateProjectModal';
import { Card } from '../components/ui/Card';
import { useProjects } from '../hooks/useProjects';
import type { ScanEntry } from '../types/scanList.types';
import type { Project } from '../types/project.types';

interface Props {
  onStartScan: (scan: ScanEntry) => void;
  editScan?: ScanEntry;
  onUpdateScan?: (id: string, patch: Partial<Omit<ScanEntry, 'id'>>) => void;
}

export function SetupPage({ onStartScan, editScan, onUpdateScan }: Props) {
  const isEdit = Boolean(editScan);
  const { projects, addProject }    = useProjects();
  const [modalOpen, setModalOpen]   = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  function handleSuccess(project: Project, crawled: boolean) {
    addProject(project);
    setSuccessMsg(
      crawled
        ? 'Project created and crawl session started'
        : 'Project created successfully',
    );
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  return (
    <div className="flex items-start justify-start">
      <div className="w-full max-w-[644px]">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-primary mb-1">
              {isEdit ? 'Edit Scan' : 'New Scan Setup'}
            </h1>
            <p className="text-[13px] text-secondary">
              {isEdit
                ? 'Update the scan configuration below.'
                : 'Configure a target application and start a security scan.'}
            </p>
          </div>

          {!isEdit && (
            <div className="flex flex-col items-end gap-1 pt-0.5">
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-secondary hover:text-primary hover:bg-card border border-border transition-colors cursor-pointer"
              >
                <FolderPlus size={15} />
                Create Project
              </button>
              {successMsg && (
                <span className="text-[11px] text-success font-medium whitespace-nowrap">
                  {successMsg}
                </span>
              )}
            </div>
          )}
        </div>

        <Card>
          <ScanSetupForm
            onStartScan={onStartScan}
            initialScan={editScan}
            onUpdateScan={onUpdateScan}
            projects={projects}
          />
        </Card>
      </div>

      {modalOpen && (
        <CreateProjectModal
          onClose={() => setModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
