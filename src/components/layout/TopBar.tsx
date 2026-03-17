import { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import type { AuthUser } from '../../types/auth.types';

interface TopBarProps {
  title?: string;
  user?: AuthUser | null;
  onLogout?: () => void;
}

export function TopBar({ title = 'Scan Dashboard', user, onLogout }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  return (
    <header className="h-topbar bg-panel border-b border-border flex items-center justify-between px-8 shrink-0">
      <h1 className="text-[15px] font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="bg-transparent border-none text-secondary cursor-pointer flex items-center p-1 hover:text-primary transition-colors">
          <Bell size={18} />
        </button>

        {/* User avatar / menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="bg-card-hover border border-border rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-secondary hover:text-primary transition-colors"
          >
            <User size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-panel border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              {user && (
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-xs font-semibold text-primary truncate">{user.name}</p>
                  <p className="text-[11px] text-muted truncate mt-0.5">{user.email}</p>
                </div>
              )}
              <button
                onClick={() => { setMenuOpen(false); onLogout?.(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-secondary hover:bg-card-hover hover:text-primary transition-colors"
              >
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
