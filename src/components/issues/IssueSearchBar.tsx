import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function IssueSearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search
        size={14}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
      />
      <input
        type="text"
        placeholder="Search issues..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[280px] pl-8 pr-3 py-1.5 bg-card border border-border rounded text-primary text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
      />
    </div>
  );
}
