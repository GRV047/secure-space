/**
 * Central API client.
 * All services use `apiRequest` so base URL and headers are managed in one place.
 */
export { API_BASE_URL } from './api.config';
import { API_BASE_URL } from './api.config';

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = (body as { detail?: string; message?: string }).detail
      ?? (body as { message?: string }).message
      ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
