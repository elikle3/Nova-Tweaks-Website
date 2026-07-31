import { getApiBaseUrl } from './lib/api';

function enabled(value) {
  return String(value || '').trim().toLowerCase() === 'true';
}

function value(name) {
  return String(import.meta.env[name] || '').trim();
}

function isSha256(valueToCheck) {
  return /^[a-f0-9]{64}$/i.test(String(valueToCheck || '').trim());
}

export const legalConfig = Object.freeze({
  apiUrl: getApiBaseUrl(),
  released: enabled(import.meta.env.VITE_LEGAL_DOCUMENTS_RELEASED),
  registrationEnabled: enabled(import.meta.env.VITE_REGISTRATION_ENABLED),
  checkoutEnabled: enabled(import.meta.env.VITE_PREMIUM_CHECKOUT_ENABLED),
  versions: Object.freeze({
    privacy: value('VITE_LEGAL_PRIVACY_VERSION'),
    terms: value('VITE_LEGAL_TERMS_VERSION'),
    withdrawal: value('VITE_LEGAL_WITHDRAWAL_VERSION'),
    imprint: value('VITE_LEGAL_IMPRINT_VERSION')
  }),
  checksums: Object.freeze({
    privacy: value('VITE_LEGAL_PRIVACY_SHA256').toLowerCase(),
    terms: value('VITE_LEGAL_TERMS_SHA256').toLowerCase(),
    withdrawal: value('VITE_LEGAL_WITHDRAWAL_SHA256').toLowerCase(),
    imprint: value('VITE_LEGAL_IMPRINT_SHA256').toLowerCase()
  })
});

export function canRegister() {
  return Boolean(
    legalConfig.released
    && legalConfig.registrationEnabled
    && legalConfig.versions.privacy
    && legalConfig.versions.terms
    && isSha256(legalConfig.checksums.privacy)
    && isSha256(legalConfig.checksums.terms)
  );
}

export function canCheckout() {
  return Boolean(
    legalConfig.released
    && legalConfig.checkoutEnabled
    && legalConfig.versions.terms
    && legalConfig.versions.withdrawal
    && isSha256(legalConfig.checksums.terms)
    && isSha256(legalConfig.checksums.withdrawal)
  );
}
