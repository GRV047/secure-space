import { useState, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { createScan } from '../../services/scanListService';
import type { ScanEntry } from '../../types/scanList.types';

interface Props {
  onStartScan: (scan: ScanEntry) => void;
  initialScan?: ScanEntry;
  onUpdateScan?: (id: string, patch: Partial<Omit<ScanEntry, 'id'>>) => void;
}

const inputClass =
  'w-full bg-card border border-border rounded-lg px-3.5 py-2.5 text-[13px] text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors';

const labelClass =
  'block text-[12px] font-semibold text-secondary uppercase tracking-wide mb-1.5';

function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export function ScanSetupForm({ onStartScan, initialScan, onUpdateScan }: Props) {
  const isEdit = Boolean(initialScan);

  const [projectId, setProjectId] = useState('');
  const [name, setName]           = useState(initialScan?.name ?? '');
  const [url, setUrl]             = useState(initialScan?.url ?? '');
  const [includeSubdomains, setIncludeSubdomains] = useState(false);
  const [domainTags, setDomainTags] = useState<string[]>(
    () => parseTags(initialScan?.excludedDomains ?? ''),
  );
  const [domainInput, setDomainInput] = useState('');
  const [loading, setLoading]         = useState(false);
  const [apiError, setApiError]       = useState<string | null>(null);
  const [errors, setErrors]           = useState<{ name?: string; url?: string; projectId?: string }>({});
  const domainInputRef = useRef<HTMLInputElement>(null);

  function addDomain() {
    const val = domainInput.trim();
    if (!val) return;
    setDomainTags((prev) => [...prev, val]);
    setDomainInput('');
    domainInputRef.current?.focus();
  }

  function removeTag(index: number) {
    setDomainTags((prev) => prev.filter((_, i) => i !== index));
  }

  function validate() {
    const errs: { name?: string; url?: string; projectId?: string } = {};
    if (!isEdit && !projectId.trim()) errs.projectId = 'Project ID is required.';
    if (!name.trim()) errs.name = 'Application name is required.';
    if (!url.trim()) errs.url = 'URL is required.';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    if (isEdit && initialScan && onUpdateScan) {
      // Edit path — sync, no API call yet
      onUpdateScan(initialScan.id, {
        name: name.trim(),
        url: url.trim(),
        excludedDomains: domainTags.join(', '),
      });
      return;
    }

    // Create path — call service (mock or real API)
    setLoading(true);
    try {
      const entry = await createScan({
        projectId: Number(projectId),
        name: name.trim(),
        url: url.trim(),
        includeSubdomains,
        excludedDomains: domainTags,
      });
      onStartScan(entry);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Project ID — only shown when creating */}
      {!isEdit && (
        <div>
          <label className={labelClass}>Project ID</label>
          <input
            type="text"
            value={projectId}
            onChange={(e) => { setProjectId(e.target.value); setErrors((p) => ({ ...p, projectId: undefined })); }}
            placeholder="e.g. 42"
            className={inputClass}
          />
          {errors.projectId && <p className="mt-1 text-[11px] text-critical">{errors.projectId}</p>}
        </div>
      )}

      <div>
        <label className={labelClass}>Application Name</label>
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
        <label className={labelClass}>URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setErrors((p) => ({ ...p, url: undefined })); }}
          placeholder="https://example.com"
          className={inputClass}
        />
        {errors.url && <p className="mt-1 text-[11px] text-critical">{errors.url}</p>}
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={includeSubdomains}
            onChange={(e) => setIncludeSubdomains(e.target.checked)}
            className="w-4 h-4 accent-accent cursor-pointer"
          />
          <span className="text-[13px] text-primary">Include subdomains</span>
        </label>
      </div>

      <div>
        <label className={labelClass}>Domains to be Excluded</label>
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

      {apiError && (
        <p className="text-[12px] text-critical bg-critical/10 border border-critical/20 rounded-lg px-3 py-2">
          {apiError}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full justify-center mt-2"
        disabled={loading || !name.trim() || !url.trim() || (!isEdit && !projectId.trim())}
      >
        {loading ? 'Starting…' : isEdit ? 'Save Changes' : 'Start Scan'}
      </Button>
    </form>
  );
}
