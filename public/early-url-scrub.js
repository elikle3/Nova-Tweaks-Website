(function scrubSensitiveResetToken() {
  try {
    var url = new URL(window.location.href);
    var isReset = url.pathname === '/reset-password';
    var isVerification = url.pathname === '/verify-email';
    if (!isReset && !isVerification) return;
    var fragment = new URLSearchParams(url.hash.replace(/^#/, ''));
    var token = String(fragment.get('token') || url.searchParams.get('token') || '').trim();
    if (/^[a-f0-9]{64}$/i.test(token)) {
      Object.defineProperty(window, isVerification ? '__NOVA_VERIFY_TOKEN__' : '__NOVA_RESET_TOKEN__', {
        value: token,
        writable: true,
        configurable: true
      });
    }
    url.searchParams.delete('token');
    url.hash = '';
    window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
  } catch (_error) {
    // The reset page fails closed when no valid token can be captured.
  }
}());
