import { useState, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCreateScan } from '../../hooks/useCreateScan';
import type { ScanEntry } from '../../types/scanList.types';
import type { Project } from '../../types/project.types';

interface Props {
  onStartScan?: (scan: ScanEntry) => void;
  initialScan?: ScanEntry;
  onUpdateScan?: (id: string, patch: Partial<Omit<ScanEntry, 'id'>>) => void;
  projects?: Project[];
}

const inputClass =
  'w-full bg-card border border-border rounded-lg px-3.5 py-2.5 text-[13px] text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors';

const labelClass =
  'block text-[12px] font-semibold text-secondary uppercase tracking-wide mb-1.5';

export function ScanSetupForm(_props: Props) {
  const { doCreateScan, isLoading, error } = useCreateScan();

  const [projectId, setProjectId]   = useState('');
  const [name, setName]             = useState('');
  const [url, setUrl]               = useState('');
  const [domainTags, setDomainTags] = useState<string[]>([]);
  const [domainInput, setDomainInput] = useState('');
  const [errors, setErrors]         = useState<{ projectId?: string; name?: string }>({});
  const [successMsg, setSuccessMsg] = useState('');
  const domainInputRef = useRef<HTMLInputElement>(null);

  function addDomain() {
    const val = domainInput.trim();
    if (!val) return;
    setDomainTags((prev) => [...prev, val]);
    setDomainInput('');
    domainInputRef.current?.focus();
  }

  function removeTag(i: number) {
    setDomainTags((prev) => prev.filter((_, idx) => idx !== i));
  }

  function validate(): boolean {
    const errs: { projectId?: string; name?: string } = {};
    const pid = Number(projectId);
    if (!projectId.trim() || !Number.isInteger(pid) || pid <= 0)
      errs.projectId = 'Project ID must be a valid integer greater than 0.';
    if (!name.trim()) errs.name = 'Application name is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const result = await doCreateScan(Number(projectId), {
      include_subdomains: false,
      crawl_session_id: null,
      exclusions: domainTags.length > 0
        ? [{ pattern: domainTags.join(','), type: 'path' as const }]
        : [],
    });

    if (result) {
      setSuccessMsg('Scan started successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
      setTimeout(() => {
        const state = { page: 'scans', projectId: Number(projectId) };
        window.history.pushState(state, '');
        window.dispatchEvent(new PopStateEvent('popstate', { state }));
      }, 1500);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Project Name <span className="text-critical">*</span></label>
        <input
          type="number"
          value={projectId}
          onChange={(e) => { setProjectId(e.target.value); setErrors((p) => ({ ...p, projectId: undefined })); }}
          placeholder="Enter Project ID"
          className={inputClass}
          min={1}
        />
        {errors.projectId && <p className="mt-1 text-[11px] text-critical">{errors.projectId}</p>}
      </div>

      <div>
        <label className={labelClass}>App Name <span className="text-critical">*</span></label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
          placeholder="e.g. My Web App"
          className={inputClass}
        />
        {errors.name && <p className="mt-1 text-[11px] text-critical">{errors.name}</p>}
      </div>

      <div>
        <label className={labelClass}>Domains Name</label>
        <div className="flex items-start gap-2">
          <div
            onClick={() => domainInputRef.current?.focus()}
            className="flex-1 min-h-[42px] bg-card border border-border rounded-lg px-3 py-2 flex flex-wrap gap-1.5 cursor-text focus-within:border-accent transition-colors"
          >
            {domainTags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-accent/10 text-accent border border-accent/20 text-[12px] font-medium px-2 py-0.5 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="text-accent/60 hover:text-accent cursor-pointer border-none bg-transparent p-0 flex items-center"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
            <input
              ref={domainInputRef}
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDomain(); } }}
              placeholder={domainTags.length === 0 ? 'e.g. cdn.example.com' : ''}
              className="flex-1 min-w-[140px] bg-transparent border-none outline-none text-[13px] text-primary placeholder-muted py-0.5"
            />
          </div>
          <button
            type="button"
            onClick={addDomain}
            className="shrink-0 flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white text-[13px] font-medium px-3.5 py-2.5 rounded-full transition-colors cursor-pointer border-none whitespace-nowrap"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {error && (
        <p className="text-[12px] text-critical bg-critical/10 border border-critical/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {successMsg && (
        <p className="text-[12px] text-success bg-success/10 border border-success/20 rounded-lg px-3 py-2">
          {successMsg}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full justify-center mt-2"
        disabled={isLoading || !projectId.trim() || !name.trim()}
      >
        {isLoading ? 'Starting Scan...' : 'Start Scan'}
      </Button>
    </form>
  );
}
