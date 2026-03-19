import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { PageLayout } from './components/layout/PageLayout';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { addScan, getScans, rerunScan, updateScan } from './services/scanListService';
import type { AuthUser } from './types/auth.types';
import type { ScanEntry, ScanStatus } from './types/scanList.types';

// Heavy authenticated pages — loaded only after login so the login screen renders immediately.
const SetupPage     = lazy(() => import('./pages/SetupPage').then((m) => ({ default: m.SetupPage })));
const ScansPage     = lazy(() => import('./pages/ScansPage').then((m) => ({ default: m.ScansPage })));
const ScanDashboard = lazy(() => import('./pages/ScanDashboard').then((m) => ({ default: m.ScanDashboard })));

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
  const [activeScanName,   setActiveScanName]   = useState<string>('');
  const [activeScanUrl,    setActiveScanUrl]    = useState<string>('');
  const [activeScanStatus, setActiveScanStatus] = useState<ScanStatus>('Completed');
  const [editScan,         setEditScan]         = useState<ScanEntry | undefined>(undefined);

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
    setEditScan(undefined);
    pushPage('scans');
  }

  function handleUpdateScan(id: string, patch: Partial<Omit<ScanEntry, 'id'>>) {
    updateScan(id, patch);
    setEditScan(undefined);
    pushPage('scans');
  }

  function handleEditScan(scan: ScanEntry) {
    setEditScan(scan);
    pushPage('setup');
  }

  function setActiveScan(scanId: string) {
    const entry = getScans().find((s) => s.id === scanId);
    setActiveScanId(scanId);
    setActiveScanName(entry?.name ?? '');
    setActiveScanUrl(entry?.url ?? '');
    setActiveScanStatus(entry?.status ?? 'Completed');
  }

  function handleDashboardEdit() {
    const entry = getScans().find((s) => s.id === activeScanId);
    if (entry) handleEditScan(entry);
  }

  function handleDashboardRestart() {
    rerunScan(activeScanId);
    pushPage('scans');
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
      <Suspense fallback={<div className="flex-1" />}>
        {page === 'setup' && (
          <SetupPage onStartScan={handleStartScan} editScan={editScan} onUpdateScan={handleUpdateScan} />
        )}
        {page === 'scans' && (
          <ScansPage onViewScan={handleViewScan} onViewIssues={handleViewIssues} onEditScan={handleEditScan} />
        )}
        {page === 'dashboard' && (
          <ScanDashboard
            key={activeScanId}
            defaultTab={defaultTab}
            scanName={activeScanName}
            scanUrl={activeScanUrl}
            scanStatus={activeScanStatus}
            onEdit={handleDashboardEdit}
            onRestart={handleDashboardRestart}
          />
        )}
      </Suspense>
    </PageLayout>
  );
}
