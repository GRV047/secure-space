import { Shield, LayoutDashboard, Bug, Settings, ChevronRight } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={16} />, label: 'Dashboard', active: true },
  { icon: <Bug size={16} />, label: 'Issues' },
  { icon: <Settings size={16} />, label: 'Settings' },
];

export function Sidebar() {
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
        {navItems.map((item) => (
          <button
            key={item.label}
            className={
              item.active
                ? 'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-card-hover text-primary text-[13px] font-medium mb-0.5 border-none cursor-pointer text-left transition-colors'
                : 'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-secondary text-[13px] mb-0.5 border-none cursor-pointer text-left hover:bg-card-hover hover:text-primary transition-colors'
            }
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {item.active && <ChevronRight size={14} className="text-muted" />}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border text-[11px] text-muted">
        v1.0.0
      </div>
    </aside>
  );
}
