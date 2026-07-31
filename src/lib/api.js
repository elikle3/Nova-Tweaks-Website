const DEFAULT_API_BASE_URL = 'https://api.nova-tweaks.com';
const TOKEN_KEY = 'nova_website_token';
let accessToken = '';
let refreshPromise = null;
let currentAvatarObjectUrl = '';

export function getApiBaseUrl() {
  const configuredUrl = String(import.meta.env.VITE_NOVA_API_URL || '').trim();
  const source = configuredUrl || (import.meta.env.DEV ? '/api' : DEFAULT_API_BASE_URL);
  if (import.meta.env.DEV && source === '/api') {
    return source;
  }
  let parsed;
  try {
    parsed = new URL(source);
  } catch (_error) {
    throw new Error('Nova API URL is invalid.');
  }
  const trustedDevelopmentOrigin = import.meta.env.DEV
    && parsed.protocol === 'http:'
    && ['127.0.0.1', 'localhost'].includes(parsed.hostname)
    && parsed.port === '3000';
  if (
    (parsed.origin !== DEFAULT_API_BASE_URL && !trustedDevelopmentOrigin)
    || parsed.username
    || parsed.password
    || parsed.pathname !== '/'
    || parsed.search
    || parsed.hash
  ) {
    throw new Error('Nova API origin is not trusted.');
  }
  return parsed.origin;
}

export function getStoredToken() {
  return accessToken;
}

export function storeToken(token) {
  accessToken = looksLikeJwt(token) ? normalizeTokenValue(token) : '';
  localStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  accessToken = '';
  localStorage.removeItem(TOKEN_KEY);
  if (currentAvatarObjectUrl) {
    URL.revokeObjectURL(currentAvatarObjectUrl);
    currentAvatarObjectUrl = '';
  }
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
  return Boolean(
    token
    && token.length <= 8192
    && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)
  );
}

function extractToken(payload) {
  if (!payload || typeof payload !== 'object') {
    return '';
  }

  const candidates = [
    payload.accessToken,
    payload.token,
    payload.data?.accessToken,
    payload.data?.token
  ].map(normalizeTokenValue);
  return candidates.find((candidate) => looksLikeJwt(candidate)) || '';
}

function canonicalJson(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(',')}]`;
  }
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
    .join(',')}}`;
}

function decodeBase64(value) {
  const binary = globalThis.atob(String(value || ''));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function pemPublicKeyBytes(value) {
  const normalized = String(value || '').replace(/\\n/g, '\n').trim();
  const match = /^-----BEGIN PUBLIC KEY-----\s+([A-Za-z0-9+/=\s]+)\s+-----END PUBLIC KEY-----$/.exec(normalized);
  if (!match) return null;
  try {
    return decodeBase64(match[1].replace(/\s+/g, ''));
  } catch (_error) {
    return null;
  }
}

function configuredUpdatePublicKeys() {
  const direct = String(import.meta.env.VITE_NOVA_UPDATE_PUBLIC_KEY || '').trim();
  const collection = String(import.meta.env.VITE_NOVA_UPDATE_PUBLIC_KEYS || '').trim();
  let parsedCollection = [];
  if (collection) {
    try {
      const parsed = JSON.parse(collection);
      parsedCollection = Array.isArray(parsed) ? parsed : Object.values(parsed || {});
    } catch (_error) {
      parsedCollection = [];
    }
  }
  return [...new Set([direct, ...parsedCollection]
    .map((entry) => String(entry || '').replace(/\\n/g, '\n').trim())
    .filter(Boolean))];
}

async function publicKeyId(publicKeyBytes) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', publicKeyBytes);
  return `sha256:${Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')}`;
}

function isTrustedUpdateDownloadUrl(value) {
  try {
    const parsed = new URL(String(value || ''));
    if (
      parsed.protocol !== 'https:'
      || parsed.username
      || parsed.password
      || parsed.search
      || parsed.hash
      || (parsed.port && parsed.port !== '443')
    ) {
      return false;
    }
    if (['nova-tweaks.com', 'www.nova-tweaks.com'].includes(parsed.hostname)) {
      return parsed.pathname.startsWith('/downloads/');
    }
    return parsed.hostname === 'github.com'
      && parsed.pathname.startsWith('/elikle3/Nova-Tweaks/releases/download/');
  } catch (_error) {
    return false;
  }
}

async function verifyUpdateMetadata(payload) {
  const source = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
  const version = String(source?.version || source?.latestVersion || '').trim();
  const downloadUrl = String(source?.downloadUrl || source?.download_url || '').trim();
  const checksum = String(source?.sha256 || source?.checksumSha256 || source?.checksum_sha256 || '').trim().toLowerCase();
  const minimumSupportedVersion = String(
    source?.minimumSupportedVersion || source?.minimum_supported_version || ''
  ).trim();
  const keyId = String(source?.keyId || source?.key_id || source?.signedPayload?.keyId || '').trim();
  const signature = String(source?.signature || source?.updateSignature || source?.update_signature || '').trim();
  const signedPayload = source?.signedPayload;
  const expectedPayload = {
    kind: 'nova-desktop-update',
    schemaVersion: 2,
    keyId,
    version,
    downloadUrl,
    sha256: checksum,
    minimumSupportedVersion
  };

  if (
    !globalThis.crypto?.subtle
    || !/^\d+(?:\.\d+){1,3}(?:-[A-Za-z0-9.-]+)?$/.test(version)
    || !isTrustedUpdateDownloadUrl(downloadUrl)
    || !/^[a-f0-9]{64}$/.test(checksum)
    || !/^sha256:[a-f0-9]{64}$/.test(keyId)
    || !/^[A-Za-z0-9+/]{86}==$/.test(signature)
    || (
      minimumSupportedVersion
      && !/^\d+(?:\.\d+){1,3}(?:-[A-Za-z0-9.-]+)?$/.test(minimumSupportedVersion)
    )
    || !signedPayload
    || canonicalJson(signedPayload) !== canonicalJson(expectedPayload)
  ) {
    throw createApiError('Signed update metadata is invalid.', 'UPDATE_METADATA_INVALID', {});
  }

  const encodedPayload = new TextEncoder().encode(canonicalJson(signedPayload));
  const signatureBytes = decodeBase64(signature);
  for (const configuredKey of configuredUpdatePublicKeys()) {
    const keyBytes = pemPublicKeyBytes(configuredKey);
    if (!keyBytes || await publicKeyId(keyBytes) !== keyId) continue;
    try {
      const key = await globalThis.crypto.subtle.importKey(
        'spki',
        keyBytes,
        { name: 'Ed25519' },
        false,
        ['verify']
      );
      if (await globalThis.crypto.subtle.verify('Ed25519', key, signatureBytes, encodedPayload)) {
        return {
          source,
          version,
          downloadUrl,
          sha256: checksum,
          minimumSupportedVersion,
          keyId,
          signatureVerified: true
        };
      }
    } catch (_error) {
      // Try the next pinned update public key.
    }
  }
  throw createApiError('Update signature verification failed.', 'UPDATE_SIGNATURE_INVALID', {});
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
    createdAt: user?.created_at || user?.createdAt || '',
    hasAvatar: normalizeBoolean(user?.hasAvatar ?? user?.has_avatar),
    avatarUrl: user?.avatarUrl || user?.avatar_url || ''
  };
}

async function request(endpoint, options = {}) {
  if (options.auth && !accessToken && options.refresh !== false) {
    await refreshAccessToken().catch(() => {});
  }

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
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: options.credentials || 'omit'
    });
  } catch (error) {
    throw createApiError(
      `Unable to reach Nova API at ${getApiBaseUrl()}. Make sure the API server is running and CORS allows this website origin.`,
      'API_NETWORK_ERROR',
      {}
    );
  }

  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch (_error) {
    throw createApiError('Backend returned invalid JSON.', 'API_INVALID_JSON', {});
  }

  if (!response.ok) {
    const backendError = extractBackendError(payload);
    if (
      options.auth &&
      options.refresh !== false &&
      !options._retriedAfterRefresh &&
      (response.status === 401 || backendError?.code === 'token_expired' || backendError?.code === 'token_missing')
    ) {
      await refreshAccessToken();
      return request(endpoint, {
        ...options,
        _retriedAfterRefresh: true
      });
    }
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

export async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const payload = await request('/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      body: {},
      refresh: false
    });
    const nextToken = extractToken(payload);
    if (!nextToken) {
      clearToken();
      throw createApiError('Refresh response did not include an access token.', 'AUTH_TOKEN_MISSING_IN_RESPONSE', payload);
    }
    storeToken(nextToken);
    return payload;
  })();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function login({ identifier, password }) {
  const payload = await request('/auth/login', {
    method: 'POST',
    credentials: 'include',
    body: { identifier, password, clientType: 'website' }
  });
  const nextToken = extractToken(payload);
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

export async function register({ username, email, password, termsVersion, privacyVersion, termsAccepted }) {
  return request('/auth/register', {
    method: 'POST',
    body: {
      username,
      email,
      password,
      clientType: 'website',
      termsVersion,
      privacyVersion,
      termsAccepted: termsAccepted === true
    }
  });
}

export async function forgotPassword({ email }) {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: { email }
  });
}

export async function resetPassword({ token, password, confirmPassword }) {
  return request('/auth/reset-password', {
    method: 'POST',
    body: { token, password, confirmPassword }
  });
}

export async function logout() {
  try {
    await request('/auth/logout', {
      method: 'POST',
      auth: Boolean(accessToken),
      credentials: 'include',
      body: {},
      refresh: false
    });
  } finally {
    clearToken();
  }
}

export async function getCurrentUser() {
  const payload = await request('/user/me', { auth: true });
  const user = normalizeUserPayload(payload);
  if (!user.hasAvatar) {
    if (currentAvatarObjectUrl) {
      URL.revokeObjectURL(currentAvatarObjectUrl);
      currentAvatarObjectUrl = '';
    }
    return user;
  }

  const loadAvatar = async (retried = false) => {
    const response = await fetch(`${getApiBaseUrl()}/user/avatar`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      credentials: 'omit'
    });
    if (response.status === 401 && !retried) {
      await refreshAccessToken();
      return loadAvatar(true);
    }
    if (!response.ok) return '';
    const blob = await response.blob();
    if (!blob.type.startsWith('image/')) return '';
    if (currentAvatarObjectUrl) URL.revokeObjectURL(currentAvatarObjectUrl);
    currentAvatarObjectUrl = URL.createObjectURL(blob);
    return currentAvatarObjectUrl;
  };

  return {
    ...user,
    avatarUrl: await loadAvatar()
  };
}

export async function verifyEmail({ token }) {
  return request('/auth/verify', {
    method: 'POST',
    body: { token }
  });
}

function getAccountActionToken(payload) {
  const value = String(payload?.actionToken || payload?.data?.actionToken || '').trim();
  if (!/^[A-Za-z0-9_-]{43}$/.test(value)) {
    throw createApiError(
      'Backend did not return a valid account action token.',
      'ACCOUNT_ACTION_TOKEN_INVALID',
      payload
    );
  }
  return value;
}

export async function exportAccountData({ password }) {
  const authorization = await request('/account/export/authorize', {
    method: 'POST',
    auth: true,
    body: { password }
  });
  const actionToken = getAccountActionToken(authorization);
  return request('/account/export', {
    auth: true,
    headers: {
      'X-Account-Action-Token': actionToken
    }
  });
}

export async function deleteAccount({ password, confirmation }) {
  const authorization = await request('/account/delete/authorize', {
    method: 'POST',
    auth: true,
    body: { password }
  });
  const actionToken = getAccountActionToken(authorization);
  const result = await request('/account/delete', {
    method: 'DELETE',
    auth: true,
    credentials: 'include',
    headers: {
      'X-Account-Action-Token': actionToken
    },
    body: { confirmation }
  });
  clearToken();
  return result;
}

function isTrustedStripeCheckoutUrl(value) {
  try {
    const parsed = new URL(String(value || ''));
    return parsed.protocol === 'https:'
      && parsed.hostname === 'checkout.stripe.com'
      && !parsed.username
      && !parsed.password
      && (!parsed.port || parsed.port === '443')
      && parsed.pathname.startsWith('/c/pay/');
  } catch (_error) {
    return false;
  }
}

export async function createPremiumCheckout(legalAcceptance = {}) {
  if (!globalThis.crypto?.randomUUID) {
    throw new Error('secure_random_unavailable');
  }
  const checkoutSubmissionId = globalThis.crypto.randomUUID();
  const payload = await request('/premium/upgrade', {
    method: 'POST',
    auth: true,
    body: {
      plan: 'lifetime',
      checkoutSubmissionId,
      billingLocale: navigator.language || 'en',
      termsVersion: legalAcceptance.termsVersion,
      withdrawalVersion: legalAcceptance.withdrawalVersion,
      termsAccepted: legalAcceptance.termsAccepted === true,
      immediatePerformanceConsent: legalAcceptance.immediatePerformanceConsent === true,
      withdrawalAcknowledged: legalAcceptance.withdrawalAcknowledged === true
    }
  });
  const data = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
  const checkoutUrl = String(
    data?.checkoutUrl || data?.checkout_url || payload?.checkoutUrl || payload?.checkout_url || ''
  ).trim();
  if (checkoutUrl && !isTrustedStripeCheckoutUrl(checkoutUrl)) {
    throw createApiError(
      'Backend returned an untrusted checkout URL.',
      'CHECKOUT_URL_UNTRUSTED',
      payload
    );
  }
  return {
    ...payload,
    checkoutUrl,
    checkoutSessionId: data?.checkoutSessionId || data?.checkout_session_id || payload?.checkoutSessionId || payload?.checkout_session_id || '',
    status: data?.status || payload?.status || ''
  };
}

export async function submitWithdrawalRequest({
  submissionId,
  consumerName,
  contactEmail,
  contractReference,
  declarationConfirmed,
  declarationVersion,
  declarationChecksumSha256
}) {
  return request('/withdrawal/requests', {
    method: 'POST',
    body: {
      submissionId,
      consumerName,
      contactEmail,
      contractReference,
      declarationConfirmed: declarationConfirmed === true,
      declarationVersion,
      declarationChecksumSha256
    }
  });
}

export async function getLatestUpdate() {
  const payload = await request('/update');
  const verified = await verifyUpdateMetadata(payload);
  const data = verified.source;
  return {
    version: verified.version,
    downloadUrl: verified.downloadUrl,
    sha256: verified.sha256,
    releaseNotes: data?.releaseNotes || '',
    minimumSupportedVersion: verified.minimumSupportedVersion,
    updatedAt: data?.updatedAt || data?.updated_at || '',
    notes: Array.isArray(data?.notes) ? data.notes : [],
    keyId: verified.keyId,
    signatureVerified: true
  };
}
