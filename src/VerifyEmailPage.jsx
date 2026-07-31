import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import HeroTypewriterTitle from './components/HeroTypewriterTitle';
import { verifyEmail } from './lib/api';

export default function VerifyEmailPage() {
  const token = useMemo(() => {
    const captured = typeof window.__NOVA_VERIFY_TOKEN__ === 'string'
      ? window.__NOVA_VERIFY_TOKEN__
      : new URLSearchParams(window.location.hash.replace(/^#/, '')).get('token') || '';
    try {
      delete window.__NOVA_VERIFY_TOKEN__;
    } catch (_error) {
      window.__NOVA_VERIFY_TOKEN__ = '';
    }
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    url.hash = '';
    window.history.replaceState({}, document.title, `${url.pathname}${url.search}`);
    return /^[a-f0-9]{64}$/i.test(captured) ? captured : '';
  }, []);
  const [state, setState] = useState({
    tone: token ? 'info' : 'error',
    message: token ? 'Verifying your email address…' : 'This verification link is invalid or incomplete.'
  });

  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    verifyEmail({ token })
      .then(() => {
        if (active) setState({ tone: 'success', message: 'Your email address is verified. You can now sign in.' });
      })
      .catch((error) => {
        if (!active) return;
        const code = String(error?.code || error?.payload?.error || '').toLowerCase();
        const message = code.includes('token_expired')
          ? 'This verification link has expired. Please register again to receive a new link.'
          : 'This verification link is invalid or was already used.';
        setState({ tone: 'error', message });
      });
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <main className="site-shell reset-shell">
      <section className="section">
        <div className="section-inner">
          <div className="auth-modal reset-card" data-typewriter-scope>
            <div className="badge hero-intro-secondary"><BadgeCheck size={16} /> Nova Account</div>
            <HeroTypewriterTitle text="Email verification" />
            <div className={`form-status hero-intro-secondary hero-intro-delay-2 ${state.tone === 'success' ? 'success' : ''}`}>
              {state.message}
            </div>
            <a className="btn btn-primary full hero-intro-secondary hero-intro-delay-2" href="/">Return to Nova Tweaks</a>
          </div>
        </div>
      </section>
    </main>
  );
}
