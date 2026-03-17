import { useState, useEffect, useRef } from 'react';
import { PageLayout } from './components/layout/PageLayout';
import { ScanDashboard } from './pages/ScanDashboard';
import { SetupPage } from './pages/SetupPage';
import { ScansPage } from './pages/ScansPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { addScan, getScans } from './services/scanListService';
import type { AuthUser } from './types/auth.types';
import type { ScanEntry } from './types/scanList.types';

type Page = 'login' | 'signup' | 'setup' | 'scans' | 'dashboard';
type NavPage = 'setup' | 'scans';

interface HistoryState {
  page: Page;
  scanId?: string;
  tab?: 'overview' | 'issues';
}

const pageTitles: Record<Page, string> = {
  login:     'Login',
  signup:    'Sign Up',
  setup:     'Setup',
  scans:     'Scans',
  dashboard: 'Scan Dashboard',
};

const AUTH_PAGES = new Set<Page>(['setup', 'scans', 'dashboard']);

export default function App() {
  const [page, setPage]                 = useState<Page>('login');
  const [user, setUser]                 = useState<AuthUser | null>(null);
  const [activeScanId, setActiveScanId] = useState<string>('scan-2024-001');
  const [defaultTab, setDefaultTab]     = useState<'overview' | 'issues'>('overview');
  const [activeScanName, setActiveScanName] = useState<string>('');
  const [activeScanUrl, setActiveScanUrl]   = useState<string>('');

  // Ref so the popstate handler always reads the latest user without re-registering
  const userRef = useRef<AuthUser | null>(null);
  userRef.current = user;

  // Stamp the initial history entry on mount
  useEffect(() => {
    window.history.replaceState({ page: 'login' } as HistoryState, '');
  }, []);

  // Browser back / forward
  useEffect(() => {
    function onPopState(e: PopStateEvent) {
      const state = e.state as HistoryState | null;
      const target: Page = state?.page ?? 'login';

      // Navigating to a pre-auth page → kill session so forward can't bypass login
      if (!AUTH_PAGES.has(target)) {
        setUser(null);
        setPage('login');
        // Replace this history entry with login so forward history is collapsed
        window.history.replaceState({ page: 'login' } as HistoryState, '');
        return;
      }

      // Navigating forward to a protected page while unauthenticated → block it
      if (!userRef.current) {
        setPage('login');
        window.history.replaceState({ page: 'login' } as HistoryState, '');
        return;
      }

      // Normal authenticated navigation
      setPage(target);
      if (target === 'dashboard' && state?.scanId) {
        setActiveScanId(state.scanId);
        setDefaultTab(state.tab ?? 'overview');
      }
    }

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function pushPage(p: Page, extra?: Omit<HistoryState, 'page'>) {
    window.history.pushState({ page: p, ...extra } as HistoryState, '');
    setPage(p);
  }

  function handleLogin(u: AuthUser) {
    setUser(u);
    pushPage('setup');
  }

  function handleSignup(u: AuthUser) {
    setUser(u);
    pushPage('setup');
  }

  function handleLogout() {
    setUser(null);
    setActiveScanId('scan-2024-001');
    setDefaultTab('overview');
    // replaceState collapses the forward stack so forward can't reach protected pages
    window.history.replaceState({ page: 'login' } as HistoryState, '');
    setPage('login');
  }

  function handleNavigate(p: NavPage) {
    pushPage(p);
  }

  function handleStartScan(scan: ScanEntry) {
    addScan(scan);
    pushPage('scans');
  }

  function setActiveScan(scanId: string) {
    const entry = getScans().find((s) => s.id === scanId);
    setActiveScanId(scanId);
    setActiveScanName(entry?.name ?? '');
    setActiveScanUrl(entry?.url ?? '');
  }

  function handleViewScan(scanId: string) {
    setActiveScan(scanId);
    setDefaultTab('overview');
    pushPage('dashboard', { scanId, tab: 'overview' });
  }

  function handleViewIssues(scanId: string) {
    setActiveScan(scanId);
    setDefaultTab('issues');
    pushPage('dashboard', { scanId, tab: 'issues' });
  }

  if (page === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onGoToSignup={() => pushPage('signup')}
      />
    );
  }

  if (page === 'signup') {
    return (
      <SignupPage
        onSignup={handleSignup}
        onGoToLogin={() => pushPage('login')}
      />
    );
  }

  return (
    <PageLayout
      title={pageTitles[page]}
      user={user}
      onLogout={handleLogout}
      currentPage={page}
      onNavigate={handleNavigate}
    >
      {page === 'setup' && (
        <SetupPage onStartScan={handleStartScan} />
      )}
      {page === 'scans' && (
        <ScansPage onViewScan={handleViewScan} onViewIssues={handleViewIssues} />
      )}
      {page === 'dashboard' && (
        <ScanDashboard key={activeScanId} defaultTab={defaultTab} scanName={activeScanName} scanUrl={activeScanUrl} />
      )}
    </PageLayout>
  );
}
