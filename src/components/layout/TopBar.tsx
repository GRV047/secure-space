import { Bell, User } from 'lucide-react';

interface TopBarProps {
  title?: string;
}

export function TopBar({ title = 'Scan Dashboard' }: TopBarProps) {
  return (
    <header className="h-topbar bg-panel border-b border-border flex items-center justify-between px-8 shrink-0">
      <h1 className="text-[15px] font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="bg-transparent border-none text-secondary cursor-pointer flex items-center p-1 hover:text-primary transition-colors">
          <Bell size={18} />
        </button>
        <button className="bg-card-hover border border-border rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-secondary hover:text-primary transition-colors">
          <User size={16} />
        </button>
      </div>
    </header>
  );
}
