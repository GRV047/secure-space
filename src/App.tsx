import { useState } from 'react';
import { PageLayout } from './components/layout/PageLayout';
import { ScanDashboard } from './pages/ScanDashboard';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import type { AuthUser } from './types/auth.types';

type Page = 'login' | 'signup' | 'dashboard';

export default function App() {
  const [page, setPage]   = useState<Page>('login');
  const [user, setUser]   = useState<AuthUser | null>(null);

  function handleLogin(u: AuthUser) {
    setUser(u);
    setPage('dashboard');
  }

  function handleSignup(u: AuthUser) {
    setUser(u);
    setPage('dashboard');
  }

  function handleLogout() {
    setUser(null);
    setPage('login');
  }

  if (page === 'login') {
    return <LoginPage onLogin={handleLogin} onGoToSignup={() => setPage('signup')} />;
  }

  if (page === 'signup') {
    return <SignupPage onSignup={handleSignup} onGoToLogin={() => setPage('login')} />;
  }

  return (
    <PageLayout title="Scan Dashboard" user={user} onLogout={handleLogout}>
      <ScanDashboard />
    </PageLayout>
  );
}
