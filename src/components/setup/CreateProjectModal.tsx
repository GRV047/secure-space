import { useEffect, useRef, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useProjectFlow } from '../../hooks/useProjectFlow';
import type { Project } from '../../types/project.types';

interface Props {
  onClose: () => void;
  onSuccess: (project: Project, crawled: boolean) => void;
}

type Step = 'idle' | 'creating' | 'crawling' | 'fetching';

const STEP_LABEL: Record<Step, string> = {
  idle:     'Create Project',
  creating: 'Creating project…',
  crawling: 'Starting crawl session…',
  fetching: 'Fetching crawl details…',
};

const inputClass =
  'w-full bg-page border border-border rounded-lg px-3.5 py-2.5 text-[13px] text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-50';

const labelClass =
  'block text-[12px] font-semibold text-secondary uppercase tracking-wide mb-1.5';

function isValidUrl(val: string): boolean {
  try { new URL(val); return true; } catch { return false; }
}

export function CreateProjectModal({ onClose, onSuccess }: Props) {
  const { doCreateProject, doCreateCrawlSession, doFetchCrawlSession } = useProjectFlow();

  const [name, setName]               = useState('');
  const [targetUrl, setTargetUrl]     = useState('');
  const [addCrawling, setAddCrawling] = useState(false);
  const [step, setStep]               = useState<Step>('idle');
  const [apiError, setApiError]       = useState('');
  const [nameError, setNameError]     = useState('');
  const [urlError, setUrlError]       = useState('');

  const backdropRef = useRef<HTMLDivElement>(null);
  const busy = step !== 'idle';

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !busy) onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, busy]);

  function validate(): boolean {
    let ok = true;
    if (!name.trim()) { setNameError('Project Name is required.'); ok = false; }
    if (!targetUrl.trim()) { setUrlError('Target URL is required.'); ok = false; }
    else if (!isValidUrl(targetUrl.trim())) { setUrlError('Enter a valid URL (e.g. https://example.com).'); ok = false; }
    return ok;
  }

  async function handleCreate() {
    if (!validate()) return;
    setApiError('');

    let project: Project;
    try {
      setStep('creating');
      project = await doCreateProject(name.trim(), targetUrl.trim());
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to create project. Please try again.');
      setStep('idle');
      return;
    }

    if (!addCrawling) {
      setStep('idle');
      onSuccess(project, false);
      return;
    }

    let crawlSessionId: number;
    try {
      setStep('crawling');
      const session = await doCreateCrawlSession(project.id);
      crawlSessionId = session.id;
    } catch (err) {
      setApiError('Project created but crawl session failed. Please try again.');
      setStep('idle');
      onSuccess(project, false);
      return;
    }

    try {
      setStep('fetching');
      await doFetchCrawlSession(crawlSessionId);
    } catch {
      // non-critical — project + session already created
    }

    setStep('idle');
    onSuccess(project, true);
  }

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (!busy && e.target === backdropRef.current) onClose();
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-primary">Create New Project</h2>
          <button
            onClick={onClose}
            disabled={busy}
            className="text-muted hover:text-primary transition-colors cursor-pointer disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className={labelClass}>
              Project Name <span className="text-critical">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(''); }}
              placeholder="e.g. My Web App"
              disabled={busy}
              className={inputClass}
            />
            {nameError && <p className="mt-1 text-[11px] text-critical">{nameError}</p>}
          </div>

          <div>
            <label className={labelClass}>
              Target URL <span className="text-critical">*</span>
            </label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => { setTargetUrl(e.target.value); setUrlError(''); }}
              placeholder="https://example.com"
              disabled={busy}
              className={inputClass}
            />
            {urlError && <p className="mt-1 text-[11px] text-critical">{urlError}</p>}
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={addCrawling}
              onChange={(e) => setAddCrawling(e.target.checked)}
              disabled={busy}
              className="w-4 h-4 accent-accent cursor-pointer"
            />
            <span className="text-[13px] text-primary">Add Crawling</span>
          </label>
        </div>

        {/* API error */}
        {apiError && (
          <p className="mt-4 text-[12px] text-critical bg-critical/10 border border-critical/20 rounded-lg px-3 py-2">
            {apiError}
          </p>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" size="md" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleCreate}
            disabled={busy || !name.trim() || !targetUrl.trim()}
          >
            {busy && <Loader2 size={13} className="animate-spin" />}
            {STEP_LABEL[step]}
          </Button>
        </div>
      </div>
    </div>
  );
}
