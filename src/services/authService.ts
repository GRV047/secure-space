import type { AuthUser, LoginCredentials, SignupData } from '../types/auth.types';

const MOCK_USER: AuthUser = {
  id: 'user-001',
  name: 'Gourav Ranjan',
  email: 'gourav@dz.com',
};

// Swap these with real API calls when backend is ready.

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  await new Promise((r) => setTimeout(r, 800)); // simulate network delay
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required.');
  }
  if (credentials.password.length < 6) {
    throw new Error('Invalid email or password.');
  }
  return { ...MOCK_USER, email: credentials.email };
}

export async function signup(data: SignupData): Promise<AuthUser> {
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

export async function logout(): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
}
