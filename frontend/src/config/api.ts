/** Base URL for the API gateway (proxies to auth, accounting, actuarial, ai, …). */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
