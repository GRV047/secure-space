import { USE_MOCK } from '../config/env';
import type { AuthUser, LoginCredentials, SignupData } from '../types/auth.types';

// ─── Mock implementations ─────────────────────────────────────────────────────

const MOCK_USER: AuthUser = {
  id: 'user-001',
  name: 'Gourav Ranjan',
  email: 'gourav@dz.com',
};

async function loginMock(credentials: LoginCredentials): Promise<AuthUser> {
  await new Promise((r) => setTimeout(r, 800));
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required.');
  }
  if (credentials.password.length < 6) {
    throw new Error('Invalid email or password.');
  }
  return { ...MOCK_USER, email: credentials.email };
}

async function signupMock(data: SignupData): Promise<AuthUser> {
  await new Promise((r) => setTimeout(r, 800));
  if (!data.name || !data.email || !data.password) {
    throw new Error('All fields are required.');
  }
  if (data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match.');
  }
  if (data.password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }
  return { id: `user-${Date.now()}`, name: data.name, email: data.email };
}

async function logoutMock(): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}

// ─── API implementations (stubs — replace with real calls) ────────────────────

async function loginApi(_credentials: LoginCredentials): Promise<AuthUser> {
  throw new Error('Auth API not implemented yet.');
}

async function signupApi(_data: SignupData): Promise<AuthUser> {
  throw new Error('Auth API not implemented yet.');
}

async function logoutApi(): Promise<void> {
  throw new Error('Auth API not implemented yet.');
}

// ─── Exports (driven by USE_MOCK flag) ────────────────────────────────────────

export const login  = USE_MOCK ? loginMock  : loginApi;
export const signup = USE_MOCK ? signupMock : signupApi;
export const logout = USE_MOCK ? logoutMock : logoutApi;
