import { useState } from 'react';
import { Shield, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { signup } from '../services/authService';
import type { AuthUser } from '../types/auth.types';

interface Props {
  onSignup: (user: AuthUser) => void;
  onGoToLogin: () => void;
}

interface PasswordRule {
  label: string;
  test: (v: string) => boolean;
}

const passwordRules: PasswordRule[] = [
  { label: 'At least 8 characters',         test: (v) => v.length >= 8 },
  { label: 'One uppercase letter',           test: (v) => /[A-Z]/.test(v) },
  { label: 'One number',                     test: (v) => /\d/.test(v) },
];

export function SignupPage({ onSignup, onGoToLogin }: Props) {
  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirm]     = useState('');
  const [showPassword, setShowPwd]        = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [touched, setTouched]             = useState(false);

  const passwordMismatch = touched && confirmPassword.length > 0 && password !== confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const user = await signup({ name, email, password, confirmPassword });
      onSignup(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed.');
    } finally {
      setLoading(false);
    }
  }

  const allRulesMet = passwordRules.every((r) => r.test(password));

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
          <h1 className="text-xl font-semibold text-primary mb-1">Create your account</h1>
          <p className="text-sm text-secondary mb-6">Start securing your applications today.</p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-critical/10 border border-critical/20 rounded-lg text-xs text-critical">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-xs font-medium text-primary mb-1.5">
                Full name
              </label>
              <input
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Gourav Ranjan"
                className="w-full h-10 px-3 text-sm text-primary bg-white border border-border rounded-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition placeholder:text-muted"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-primary mb-1.5">
                Work email
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full h-10 px-3 text-sm text-primary bg-white border border-border rounded-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition placeholder:text-muted"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-primary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-3 pr-10 text-sm text-primary bg-white border border-border rounded-lg outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition placeholder:text-muted"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength rules */}
              {password.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {passwordRules.map((rule) => {
                    const ok = rule.test(password);
                    return (
                      <li key={rule.label} className={`flex items-center gap-1.5 text-[11px] ${ok ? 'text-success' : 'text-muted'}`}>
                        {ok
                          ? <Check size={11} strokeWidth={2.5} />
                          : <X size={11} strokeWidth={2.5} />}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-medium text-primary mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full h-10 pl-3 pr-10 text-sm text-primary bg-white border rounded-lg outline-none focus:ring-2 transition placeholder:text-muted ${
                    passwordMismatch
                      ? 'border-critical focus:border-critical focus:ring-critical/15'
                      : 'border-border focus:border-accent focus:ring-accent/15'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordMismatch && (
                <p className="mt-1 text-[11px] text-critical">Passwords do not match.</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !allRulesMet}
              className="w-full h-10 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-[11px] text-muted leading-relaxed">
            By creating an account you agree to our{' '}
            <span className="text-accent hover:underline cursor-pointer">Terms of Service</span>
            {' '}and{' '}
            <span className="text-accent hover:underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>

        {/* Footer link */}
        <p className="text-center text-xs text-secondary mt-5">
          Already have an account?{' '}
          <button
            onClick={onGoToLogin}
            className="text-accent font-medium hover:underline focus:outline-none"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
