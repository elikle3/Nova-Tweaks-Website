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

function normalizeTokenValue(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  const bearerMatch = /^Bearer\s+(.+)$/i.exec(trimmed);
  return bearerMatch ? bearerMatch[1].trim() : trimmed;
}

function looksLikeJwt(value) {
  const token = normalizeTokenValue(value);
  return Boolean(token && /^[A-Za-z0-9\-_]+=*\.[A-Za-z0-9\-_]+=*\.[A-Za-z0-9\-_+/=]*$/.test(token));
}

function appendTokenCandidate(candidates, value) {
  const normalized = normalizeTokenValue(value);
  if (normalized) {
    candidates.push(normalized);
  }
}

function extractTokenFromHeaders(headers) {
  if (!headers || typeof headers.get !== 'function') {
    return '';
  }

  const candidates = [];
  ['authorization', 'x-auth-token', 'x-access-token', 'x-jwt-token'].forEach((headerName) => {
    appendTokenCandidate(candidates, headers.get(headerName));
  });

  const setCookie = headers.get('set-cookie');
  if (typeof setCookie === 'string' && setCookie) {
    const cookieMatch = /(?:^|;\s*)(?:token|jwt|access_token)=([^;]+)/i.exec(setCookie);
    if (cookieMatch?.[1]) {
      appendTokenCandidate(candidates, decodeURIComponent(cookieMatch[1]));
    }
  }

  return candidates.find((candidate) => looksLikeJwt(candidate)) || candidates.find((candidate) => candidate.length >= 16) || '';
}

function extractToken(payload) {
  if (!payload || typeof payload !== 'object') {
    return '';
  }

  const tokenKeys = [
    'token',
    'jwt',
    'accessToken',
    'access_token',
    'idToken',
    'id_token',
    'authToken',
    'auth_token',
    'jwtToken',
    'jwt_token',
    'bearer',
    'bearerToken'
  ];

  const candidates = [];
  const queue = [payload];
  const visited = new Set();
  let iterations = 0;

  while (queue.length && iterations < 250) {
    const node = queue.shift();
    iterations += 1;
    if (!node || typeof node !== 'object' || visited.has(node)) {
      continue;
    }
    visited.add(node);

    tokenKeys.forEach((key) => appendTokenCandidate(candidates, node[key]));

    Object.entries(node).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const lowered = key.toLowerCase();
        if (lowered.includes('token') || lowered.includes('jwt') || lowered.includes('access')) {
          appendTokenCandidate(candidates, value);
        }
        return;
      }

      if (value && typeof value === 'object') {
        queue.push(value);
      }
    });
  }

  return candidates.find((candidate) => looksLikeJwt(candidate)) || candidates.find((candidate) => candidate.length >= 16) || '';
}

function extractBackendError(payload) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const rawCode =
    payload.error ||
    payload.code ||
    payload.errorCode ||
    payload.statusCode ||
    payload?.data?.error ||
    payload?.data?.code ||
    payload?.data?.errorCode;
  const rawMessage =
    payload.message ||
    payload.errorMessage ||
    payload?.data?.message ||
    payload?.data?.errorMessage;

  if (!rawCode && !rawMessage) {
    return null;
  }

  return {
    code: String(rawCode || rawMessage || 'API_ERROR').trim(),
    message: String(rawMessage || rawCode || 'Backend rejected the request.').trim()
  };
}

function createApiError(message, code, payload) {
  const error = new Error(message || code || 'Request failed.');
  error.code = code || 'API_ERROR';
  error.payload = payload;
  return error;
}

function normalizeBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) && value !== 0;
  if (typeof value === 'string') return ['true', '1', 'yes', 'premium'].includes(value.trim().toLowerCase());
  return false;
}

function normalizeUserPayload(payload) {
  const user = payload?.user || payload?.data?.user || payload?.data || payload || {};
  return {
    id: user?.id ?? null,
    username: user?.username || '',
    email: user?.email || '',
    premium: normalizeBoolean(user?.premium),
    createdAt: user?.created_at || user?.createdAt || ''
  };
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

  let response;
  try {
    response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });
  } catch (error) {
    throw createApiError(
      `Unable to reach Nova API at ${getApiBaseUrl()}. Make sure the API server is running and CORS allows this website origin.`,
      'API_NETWORK_ERROR',
      { cause: error?.message || String(error || '') }
    );
  }

  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch (_error) {
    throw createApiError('Backend returned invalid JSON.', 'API_INVALID_JSON', { bodyPreview: text.slice(0, 500) });
  }

  if (!response.ok) {
    const backendError = extractBackendError(payload);
    const error = createApiError(
      backendError?.message || `Request failed with ${response.status}`,
      backendError?.code || `HTTP_${response.status}`,
      payload
    );
    error.status = response.status;
    throw error;
  }

  if (payload?.error) {
    const backendError = extractBackendError(payload);
    throw createApiError(backendError?.message || String(payload.error), backendError?.code || String(payload.error), payload);
  }

  if (options.returnMeta) {
    return { payload, headers: response.headers, status: response.status };
  }

  return payload;
}

export async function login({ identifier, password }) {
  const result = await request('/auth/login', {
    method: 'POST',
    returnMeta: true,
    body: { identifier, password }
  });
  const payload = result?.payload && typeof result.payload === 'object' ? result.payload : {};
  const nextToken = extractToken(payload) || extractTokenFromHeaders(result?.headers);
  const backendError = extractBackendError(payload);

  if (!nextToken && backendError) {
    const normalizedCode = backendError.code.toLowerCase();
    if (normalizedCode === 'email_not_verified') {
      throw createApiError('Please verify your email before signing in.', 'AUTH_EMAIL_NOT_VERIFIED', payload);
    }
    if (normalizedCode === 'invalid_login' || normalizedCode === 'invalid_credentials') {
      throw createApiError('Invalid username/email or password.', 'AUTH_INVALID_CREDENTIALS', payload);
    }
    throw createApiError(backendError.message, backendError.code, payload);
  }

  if (!nextToken) {
    throw createApiError('Login response did not include a JWT token.', 'AUTH_TOKEN_MISSING_IN_RESPONSE', payload);
  }

  storeToken(nextToken);
  return { ...payload, token: nextToken };
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
  const payload = await request('/user/me', { auth: true });
  return normalizeUserPayload(payload);
}

export async function createPremiumCheckout() {
  const payload = await request('/premium/upgrade', {
    method: 'POST',
    auth: true,
    body: { plan: 'lifetime', billingLocale: navigator.language || 'en' }
  });
  const data = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
  return {
    ...payload,
    checkoutUrl: data?.checkoutUrl || data?.checkout_url || payload?.checkoutUrl || payload?.checkout_url || '',
    checkoutSessionId: data?.checkoutSessionId || data?.checkout_session_id || payload?.checkoutSessionId || payload?.checkout_session_id || '',
    status: data?.status || payload?.status || ''
  };
}
