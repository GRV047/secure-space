/**
 * Global feature flags derived from Vite environment variables.
 *
 * To run on mocks:   VITE_USE_MOCK=true  (default in .env)
 * To hit real APIs:  VITE_USE_MOCK=false (set in .env.production or .env.local)
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
