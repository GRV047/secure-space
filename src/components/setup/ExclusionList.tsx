import { X, Plus } from 'lucide-react';

export interface ExclusionRow {
  pattern: string;
  type: 'path' | 'domain' | 'regex';
}

interface Props {
  exclusions: ExclusionRow[];
  errors: string[];
  onChange: (exclusions: ExclusionRow[]) => void;
}

const inputClass =
  'bg-card border border-border rounded-lg px-3 py-2 text-[13px] text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors';

export function ExclusionList({ exclusions, errors, onChange }: Props) {
  function add() {
    onChange([...exclusions, { pattern: '', type: 'path' }]);
  }

  function remove(i: number) {
    onChange(exclusions.filter((_, idx) => idx !== i));
  }

  function update(i: number, patch: Partial<ExclusionRow>) {
    onChange(exclusions.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  return (
    <div className="space-y-2">
      {exclusions.map((row, i) => (
        <div key={i}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={row.pattern}
              onChange={(e) => update(i, { pattern: e.target.value })}
              placeholder="/admin/*"
              className={`flex-1 ${inputClass}`}
            />
            <select
              value={row.type}
              onChange={(e) => update(i, { type: e.target.value as ExclusionRow['type'] })}
              className={`w-28 ${inputClass} cursor-pointer`}
            >
              <option value="path">path</option>
              <option value="domain">domain</option>
              <option value="regex">regex</option>
            </select>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-muted hover:text-critical transition-colors cursor-pointer border-none bg-transparent p-1 flex items-center"
            >
              <X size={15} />
            </button>
          </div>
          {errors[i] && (
            <p className="mt-1 text-[11px] text-critical">{errors[i]}</p>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1 text-[13px] text-accent hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent p-0 mt-1"
      >
        <Plus size={14} />
        Add Exclusion
      </button>
    </div>
  );
}
