/**
 * Central API client.
 * All services use `apiRequest` so base URL and headers are managed in one place.
 */
export { API_BASE_URL } from './api.config';
import { API_BASE_URL } from './api.config';

// ─── Token management ─────────────────────────────────────────────────────────

const TOKEN_KEY = 'ss_access_token';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Auto-fetch a Bearer token using hardcoded admin credentials.
 * Called transparently before the first request that has no token.
 */
async function fetchAdminToken(): Promise<string> {
  const body = new URLSearchParams({ username: 'admin', password: 'admin' });
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error('Auto-login failed. Check admin credentials.');
  const data = await res.json() as { access_token: string };
  saveToken(data.access_token);
  return data.access_token;
}

// ─── Request interceptor ──────────────────────────────────────────────────────

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  let token = getToken();
  if (!token) token = await fetchAdminToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options?.headers as Record<string, string>),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { headers, ...options });

  // Token expired — clear and retry once with a fresh token
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    const fresh = await fetchAdminToken();
    headers['Authorization'] = `Bearer ${fresh}`;
    const retry = await fetch(`${API_BASE_URL}${path}`, { headers, ...options });
    if (!retry.ok) {
      const body = await retry.json().catch(() => ({}));
      throw new Error(
        (body as { detail?: string }).detail ?? `Request failed with status ${retry.status}`,
      );
    }
    const retryText = await retry.text();
    return (retryText.trim() ? JSON.parse(retryText) : {}) as T;
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = (body as { detail?: string; message?: string }).detail
      ?? (body as { message?: string }).message
      ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  const text = await res.text();
  return (text.trim() ? JSON.parse(text) : {}) as T;
}
