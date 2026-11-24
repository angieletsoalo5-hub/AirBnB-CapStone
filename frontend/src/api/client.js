/**
 * api/client.js
 *
 * Central HTTP client for the Airbnb Clone frontend.
 * All requests go through the `request()` wrapper which:
 *   - Attaches Content-Type: application/json
 *   - Attaches Authorization: Bearer <token> when a token is passed
 *   - Parses JSON responses
 *   - Throws a descriptive Error on non-2xx responses
 *
 * Set VITE_API_URL in .env to point at a deployed backend.
 * Falls back to http://localhost:5000/api for local development.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// The backend serves uploaded photos as relative paths (e.g. "/uploads/167...jpg")
// from its own origin, not from the /api prefix.
const API_ORIGIN = BASE_URL.replace(/\/api\/?$/, '');

/**
 * Resolves an accommodation image path to a fully-qualified URL.
 * Absolute URLs pass through unchanged; relative paths returned by the
 * backend (from a real file upload) are prefixed with the API's origin.
 */
export function resolveImageUrl(src) {
  if (!src) return src;
  if (/^(https?:|blob:|data:)/i.test(src)) return src;
  return `${API_ORIGIN}${src.startsWith('/') ? '' : '/'}${src}`;
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  // ── Users ──────────────────────────────────────────────
  login: (email, password) =>
    request('/users/login', { method: 'POST', body: { email, password } }),

  register: (username, email, password, role) =>
    request('/users/register', { method: 'POST', body: { username, email, password, role } }),

  getCurrentUser: (token) =>
    request('/users/me', { token }),

  // ── Accommodations ─────────────────────────────────────
  getAccommodations: (location) =>
    request(`/accommodations${location ? `?location=${encodeURIComponent(location)}` : ''}`),

  getHostAccommodations: (hostId, token) =>
    request(`/accommodations?host=${encodeURIComponent(hostId)}`, { token }),

  getAccommodation: (id) =>
    request(`/accommodations/${id}`),

  createAccommodation: (payload, token) =>
    request('/accommodations', { method: 'POST', body: payload, token }),

  updateAccommodation: (id, payload, token) =>
    request(`/accommodations/${id}`, { method: 'PUT', body: payload, token }),

  deleteAccommodation: (id, token) =>
    request(`/accommodations/${id}`, { method: 'DELETE', token }),

  // ── Reservations ───────────────────────────────────────
  createReservation: (payload, token) =>
    request('/reservations', { method: 'POST', body: payload, token }),

  getHostReservations: (token) =>
    request('/reservations/host', { token }),

  getMyReservations: (token) =>
    request('/reservations/user', { token }),

  cancelReservation: (id, token) =>
    request(`/reservations/${id}`, { method: 'DELETE', token }),
};
