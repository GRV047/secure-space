/**
 * API base URL — resolved from Vite env, falls back to localhost for local dev.
 * Set VITE_API_BASE_URL in .env.local or .env.production as needed.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
