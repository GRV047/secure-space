import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import type { AuthUser } from '../../types/auth.types';

type NavPage = 'setup' | 'scans';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  user?: AuthUser | null;
  onLogout?: () => void;
  currentPage: string;
  onNavigate: (page: NavPage) => void;
}

export function PageLayout({ children, title, user, onLogout, currentPage, onNavigate }: PageLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={title} user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-8 bg-page">
          {children}
        </main>
      </div>
    </div>
  );
}
