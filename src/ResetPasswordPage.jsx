import { useMemo, useState } from 'react';
import { Lock } from 'lucide-react';
import { resetPassword } from './lib/api';
import HeroTypewriterTitle from './components/HeroTypewriterTitle';

function isStrongPassword(password) {
  const byteLength = typeof password === 'string'
    ? new TextEncoder().encode(password).byteLength
    : 0;
  return (
    typeof password === 'string' &&
    password.length >= 12 &&
    byteLength <= 72 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function mapResetError(error) {
  const code = String(error?.code || error?.payload?.error || '').toLowerCase();
  if (code.includes('weak_password')) return 'Password does not meet the security requirements.';
  if (code.includes('token_expired')) return 'This reset link has expired. Please request a new one.';
  if (code.includes('invalid_token')) return 'This reset link is invalid or was already used.';
  if (code.includes('password_confirmation_mismatch')) return 'Password confirmation does not match.';
  return 'Password reset failed. Please try again.';
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({ tone: '', message: '' });
  const token = useMemo(() => {
    const captured = typeof window.__NOVA_RESET_TOKEN__ === 'string'
      ? window.__NOVA_RESET_TOKEN__
      : new URLSearchParams(window.location.hash.replace(/^#/, '')).get('token')
        || new URLSearchParams(window.location.search || '').get('token')
        || '';
    try {
      delete window.__NOVA_RESET_TOKEN__;
    } catch (_error) {
      window.__NOVA_RESET_TOKEN__ = '';
    }
    const url = new URL(window.location.href);
    if (url.searchParams.has('token')) {
      url.searchParams.delete('token');
    }
    url.hash = '';
    window.history.replaceState({}, document.title, `${url.pathname}${url.search}`);
    return /^[a-f0-9]{64}$/i.test(captured) ? captured : '';
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!token) {
      setNotice({ tone: 'error', message: 'This reset link is invalid or incomplete.' });
      return;
    }
    if (!password || !confirmPassword) {
      setNotice({ tone: 'error', message: 'Please fill all required fields.' });
      return;
    }
    if (password !== confirmPassword) {
      setNotice({ tone: 'error', message: 'Password confirmation does not match.' });
      return;
    }
    if (!isStrongPassword(password)) {
      setNotice({ tone: 'error', message: 'Use 12 to 72 UTF-8 bytes, uppercase, lowercase, number and special character.' });
      return;
    }

    setLoading(true);
    setNotice({ tone: '', message: '' });
    try {
      await resetPassword({ token, password, confirmPassword });
      setPassword('');
      setConfirmPassword('');
      setNotice({ tone: 'success', message: 'Password updated successfully. You can now sign in.' });
    } catch (error) {
      setNotice({ tone: 'error', message: mapResetError(error) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="site-shell reset-shell">
      <section className="section">
        <div className="section-inner">
          <div className="auth-modal reset-card" data-typewriter-scope>
            <div className="badge hero-intro-secondary">Nova Account</div>
            <HeroTypewriterTitle text="Reset your password" />
            <p className="hero-intro-secondary hero-intro-delay-1">Set a new password for your Nova account.</p>
            {notice.message ? <div className={`form-status hero-intro-secondary hero-intro-delay-2 ${notice.tone === 'success' ? 'success' : ''}`}>{notice.message}</div> : null}
            <form className="auth-form hero-intro-secondary hero-intro-delay-2" onSubmit={handleSubmit}>
              <label className="auth-field">
                <Lock size={17} />
                <input required minLength={12} maxLength={72} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" />
              </label>
              <label className="auth-field">
                <Lock size={17} />
                <input required minLength={12} maxLength={72} type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm new password" />
              </label>
              <button className="btn btn-primary full" type="submit" disabled={loading || !token}>{loading ? 'Saving...' : 'Save New Password'}</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
