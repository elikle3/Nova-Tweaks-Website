import { useMemo, useState } from 'react';
import { Lock } from 'lucide-react';
import { resetPassword } from './lib/api';

function isStrongPassword(password) {
  return (
    typeof password === 'string' &&
    password.length >= 8 &&
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
  const token = useMemo(() => new URLSearchParams(window.location.search || '').get('token') || '', []);

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
      setNotice({ tone: 'error', message: 'Use at least 8 characters, uppercase, lowercase, number and special character.' });
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
          <div className="auth-modal reset-card">
            <div className="badge">Nova Account</div>
            <h1>Reset your password</h1>
            <p>Set a new password for your Nova account.</p>
            {notice.message ? <div className={`form-status ${notice.tone === 'success' ? 'success' : ''}`}>{notice.message}</div> : null}
            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-field">
                <Lock size={17} />
                <input required type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" />
              </label>
              <label className="auth-field">
                <Lock size={17} />
                <input required type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm new password" />
              </label>
              <button className="btn btn-primary full" type="submit" disabled={loading || !token}>{loading ? 'Saving...' : 'Save New Password'}</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
