const DEFAULT_API_BASE_URL = 'https://api.nova-tweaks.com';
const TOKEN_KEY = 'nova_website_token';

export function getApiBaseUrl() {
  return (import.meta.env.VITE_NOVA_API_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function storeToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(endpoint, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json; charset=utf-8' } : {}),
    ...(options.headers || {})
  };

  const token = options.token ?? getStoredToken();
  if (options.auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = new Error(payload?.message || payload?.error || `Request failed with ${response.status}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  if (payload?.error) {
    const error = new Error(payload.error);
    error.payload = payload;
    throw error;
  }

  return payload;
}

export async function login({ identifier, password }) {
  const payload = await request('/auth/login', {
    method: 'POST',
    body: { identifier, password }
  });
  if (payload?.token) {
    storeToken(payload.token);
  }
  return payload;
}

export async function register({ username, email, password }) {
  return request('/auth/register', {
    method: 'POST',
    body: { username, email, password }
  });
}

export async function forgotPassword({ email }) {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: { email }
  });
}

export async function getCurrentUser() {
  return request('/user/me', { auth: true });
}

export async function createPremiumCheckout() {
  return request('/premium/upgrade', {
    method: 'POST',
    auth: true,
    body: { plan: 'lifetime', billingLocale: navigator.language || 'en' }
  });
}
