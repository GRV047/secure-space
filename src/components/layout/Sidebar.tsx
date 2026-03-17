import { Shield, ScanLine, Settings2, ChevronRight } from 'lucide-react';

type NavPage = 'setup' | 'scans';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  page: NavPage;
}

interface Props {
  currentPage: string;
  onNavigate: (page: NavPage) => void;
}

const navItems: NavItem[] = [
  { icon: <Settings2 size={16} />, label: 'Setup', page: 'setup' },
  { icon: <ScanLine size={16} />,  label: 'Scans', page: 'scans' },
];

export function Sidebar({ currentPage, onNavigate }: Props) {
  return (
    <aside className="w-sidebar bg-panel border-r border-border flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="h-topbar flex items-center gap-2.5 px-4 border-b border-border shrink-0">
        <Shield size={20} className="text-accent" />
        <span className="font-bold text-[15px] tracking-tight text-primary">
          SecureSphere
        </span>
      </div>

      {/* Nav */}
      <nav className="p-2 flex-1">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={
                isActive
                  ? 'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-card-hover text-primary text-[13px] font-medium mb-0.5 border-none cursor-pointer text-left transition-colors'
                  : 'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-secondary text-[13px] mb-0.5 border-none cursor-pointer text-left hover:bg-card-hover hover:text-primary transition-colors'
              }
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="text-muted" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border text-[11px] text-muted">
        v1.0.0
      </div>
    </aside>
  );
}
