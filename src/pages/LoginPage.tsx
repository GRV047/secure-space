import { useState } from 'react';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { login } from '../services/authService';
import type { AuthUser } from '../types/auth.types';

interface Props {
  onLogin: (user: AuthUser) => void;
  onGoToSignup: () => void;
}

export function LoginPage({ onLogin, onGoToSignup }: Props) {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShow]     = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ email, password });
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="w-full max-w-[440px]">

        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Shield size={28} className="text-accent" />
          <span className="font-bold text-[22px] tracking-tight text-primary">SecureSphere</span>
        </div>

        {/* Card */}
        <div className="bg-panel border border-border rounded-2xl shadow-card p-8">
          <h1 className="text-xl font-semibold text-primary mb-1">Welcome back</h1>
          <p className="text-sm text-secondary mb-6">Sign in to your account to continue.</p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-critical/10 border border-critical/20 rounded-lg text-xs text-critical">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-primary mb-1.5">
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-10 px-3 text-sm text-primary bg-white border border-border rounded-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition placeholder:text-muted"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-primary">Password</label>
                <button
                  type="button"
                  className="text-xs text-accent hover:underline focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-3 pr-10 text-sm text-primary bg-white border border-border rounded-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition placeholder:text-muted"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            {/* <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-accent cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-secondary cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div> */}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-xs text-secondary mt-5">
          Don't have an account?{' '}
          <button
            onClick={onGoToSignup}
            className="text-accent font-medium hover:underline focus:outline-none"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
