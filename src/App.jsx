import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Clock3,
  DatabaseBackup,
  Download,
  FileText,
  Lock,
  LogOut,
  Menu,
  MonitorCheck,
  Rocket,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Timer,
  User,
  X
} from 'lucide-react';
import { useInView } from './hooks/useInView';
import {
  clearToken,
  createPremiumCheckout,
  forgotPassword,
  getCurrentUser,
  getStoredToken,
  login,
  register
} from './lib/api';

const APP_LOGO_SRC = new URL('./assets/logo.ico', import.meta.url).href;
const HERO_MOCKUP_SRC = new URL('./assets/website-mockup-transparent.png', import.meta.url).href;
const TWEAKS_MOCKUP_SRC = new URL('./assets/tweaks-mockup-transparent.png', import.meta.url).href;

const navItems = [
  ['Features', '#features'],
  ['Free', '#nova-free'],
  ['Premium', '#nova-premium'],
  ['Performance', '#performance'],
  ['Pricing', '#pricing'],
  ['FAQ', '#faq'],
  ['Download', '#download']
];

const features = [
  ['Verified Tweak States', 'Nova loads tweak definitions first, checks what is already active, and avoids misleading default disabled states.', BadgeCheck],
  ['Backup & Config Saves', 'Manage restore points, backups, and Nova config saves before larger Windows changes.', DatabaseBackup],
  ['Apps & Startup Control', 'Review installed apps and startup entries so background load stays visible and manageable.', Rocket],
  ['Clean Script Handling', 'Readable script output, clear error states, and safer execution feedback keep every change understandable.', ShieldCheck],
  ['Monitoring & Detection', 'Live monitoring and hardware detection show the system context behind your optimization decisions.', MonitorCheck],
  ['150+ Tweak Catalog', 'Browse focused tweak categories with clear descriptions for latency, network, hardware, cleanup, power, and more.', SlidersHorizontal]
];

const freeFeatureCards = [
  {
    title: 'Real Tweak Status Detection',
    copy: 'Tweaks are loaded and checked before they are shown, so active changes are not presented as disabled by default.',
    frame: 'wide',
    label: 'Tweak cards',
    image: TWEAKS_MOCKUP_SRC
  },
  {
    title: 'Backup & Config Save Management',
    copy: 'Keep restore paths and Nova configuration saves organized before changing sensitive Windows settings.',
    frame: 'tall',
    label: 'Backups',
    image: HERO_MOCKUP_SRC
  },
  {
    title: 'Apps & Startup App Management',
    copy: 'Find installed apps, inspect startup entries, and reduce boot-time clutter from one focused workspace.',
    frame: 'wide',
    label: 'Apps',
    image: TWEAKS_MOCKUP_SRC
  },
  {
    title: 'System Monitoring & Detection',
    copy: 'See live system signals and detected hardware context before deciding which optimizations fit your PC.',
    frame: 'wide',
    label: 'Monitoring',
    image: HERO_MOCKUP_SRC
  },
  {
    title: 'Design Settings',
    copy: 'Customize the app experience with design settings that make Nova feel right for your setup.',
    frame: 'compact',
    label: 'Settings',
    image: HERO_MOCKUP_SRC
  },
  {
    title: 'Clear Descriptions Across 150+ Tweaks',
    copy: 'Understand what each tweak is for with readable descriptions, categories, and practical status labels.',
    frame: 'tall',
    label: 'Details',
    image: TWEAKS_MOCKUP_SRC
  }
];

const premiumFeatureCards = [
  {
    title: 'Free + Stronger Workflows',
    copy: 'Everything in Nova Free, expanded with deeper optimization paths for users who want more control.',
    frame: 'wide',
    label: 'Premium',
    image: TWEAKS_MOCKUP_SRC
  },
  {
    title: 'More Powerful Tweaks',
    copy: 'Unlock more impactful latency, power, network, and system tuning options while keeping transparency.',
    frame: 'tall',
    label: 'Power tweaks',
    image: HERO_MOCKUP_SRC
  },
  {
    title: 'Nova Game Mode',
    copy: 'Prepare gaming sessions with focused background control and responsiveness-first presets.',
    frame: 'wide',
    label: 'Game Mode',
    image: HERO_MOCKUP_SRC
  },
  {
    title: 'Priority Support',
    copy: 'Get faster help for account, setup, and optimization questions when you need a direct answer.',
    frame: 'compact',
    label: 'Support',
    image: TWEAKS_MOCKUP_SRC
  },
  {
    title: 'Future Premium Updates',
    copy: 'Keep access to upcoming Premium features as Nova Tweaks evolves.',
    frame: 'wide',
    label: 'Updates',
    image: HERO_MOCKUP_SRC
  }
];

const stats = [
  { label: 'Lower Input Lag', value: 28, suffix: '%', prefix: '-', bar: 72 },
  { label: 'Faster Boot Time', value: 34, suffix: '%', prefix: '-', bar: 78 },
  { label: 'Cleaner System', value: 1.3, suffix: ' GB', prefix: '', bar: 64, decimals: 1 },
  { label: 'Background Processes', value: 22, suffix: '%', prefix: '-', bar: 58 },
  { label: 'FPS Stability', value: 18, suffix: '%', prefix: '+', bar: 68 }
];

const testimonials = [
  ['Competitive Gamer', 'NovaTweaks gives me a clean pre-match routine without making me guess what changed.'],
  ['PC Enthusiast', 'The restore flow and risk labels make it feel serious. It is built for people who care about their PC.'],
  ['Streamer', 'My streaming setup is more predictable because I can keep background clutter under control.'],
  ['Power User', 'It feels like a control panel for power users, not a noisy cleaner app.']
];

const faqs = [
  ['Is NovaTweaks safe to use?', 'NovaTweaks is designed around transparency, risk labels, confirmations, and restore options so you can understand changes before applying them.'],
  ['Can I undo changes?', 'Yes. Backup, restore, and config-save workflows are core to the product, especially before larger optimization passes.'],
  ['Does it work on Windows 10 and 11?', 'NovaTweaks is built for modern Windows systems and supports Windows 10 and Windows 11 workflows.'],
  ['Do I need admin rights?', 'Most system-level optimizations require administrator privileges because Windows protects those settings.'],
  ['Will it increase my FPS?', 'NovaTweaks focuses on cleaner system behavior, smoother frame pacing, lower input delay, and fewer background interruptions rather than unrealistic FPS promises.'],
  ['What is included in Premium?', 'Premium includes everything in Free plus more powerful tweaks, Nova Game Mode, priority support, and future Premium updates.']
];

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="NovaTweaks home">
      <span className="logo-mark"><img src={APP_LOGO_SRC} alt="" /></span>
      <span>Nova Tweaks</span>
    </a>
  );
}

function ButtonLink({ children, href = '#download', variant = 'primary', icon: Icon = ArrowRight, onClick }) {
  return (
    <a className={`btn btn-${variant}`} href={href} onClick={onClick}>
      <span>{children}</span>
      {Icon ? <Icon size={17} /> : null}
    </a>
  );
}

function Nav({ onSignIn, account }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav-shell">
      <nav className="nav">
        <Logo />
        <button className="mobile-menu" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className={`nav-links ${open ? 'nav-links-open' : ''}`}>
          {navItems.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        </div>
        <div className="nav-actions">
          <button className="text-action" type="button" onClick={onSignIn}>{account ? 'Account' : 'Sign In'}</button>
          <a className="btn btn-small btn-primary" href="#download"><Download size={16} />Download Now</a>
        </div>
      </nav>
    </header>
  );
}

function MiniChart() {
  return (
    <svg className="mini-chart" viewBox="0 0 320 120" aria-hidden="true">
      <path className="chart-grid-line" d="M10 30H310M10 60H310M10 90H310" />
      <path className="hero-chart-glow" d="M10 90 C42 72 58 78 82 58 C112 31 133 46 158 42 C191 36 207 68 235 47 C265 25 286 33 310 20" />
      <path className="hero-chart-line" d="M10 90 C42 72 58 78 82 58 C112 31 133 46 158 42 C191 36 207 68 235 47 C265 25 286 33 310 20" />
    </svg>
  );
}

function DashboardMockup() {
  return (
    <img className="hero-mockup-image" src={HERO_MOCKUP_SRC} alt="Nova Tweaks dashboard interface preview" />
  );
}

function Hero() {
  return (
    <section className="hero section" id="top">
      <div className="energy-lines" />
      <div className="section-inner hero-inner">
        <div className="hero-copy reveal">
          <div className="badge">Windows Optimization App for Gamers & Power Users</div>
          <h1>Optimize Windows.<br />Keep Control.</h1>
          <p>Tune latency, clean up background load, improve responsiveness, and keep every system change under your control with clear safety checks and restore workflows.</p>
          <div className="hero-actions">
            <ButtonLink href="#download" icon={Download}>Download Now</ButtonLink>
            <ButtonLink href="#features" variant="secondary">View Features</ButtonLink>
          </div>
          <div className="trust-row">
            <span><b>150+</b> tweak catalog</span>
            <span><b>Real state</b> detection before display</span>
            <span><b>Win 10/11</b> supported</span>
          </div>
        </div>
        <div className="hero-visual reveal delay-1"><DashboardMockup /></div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    [Timer, 'Lower Latency', 'Reduce background friction before play.'],
    [Clock3, 'Verified States', 'Tweaks are checked before they are shown.'],
    [FileText, 'Readable Details', 'Clear descriptions make each change understandable.'],
    [DatabaseBackup, 'Backup Control', 'Manage restore points and config saves.']
  ];
  return (
    <section className="benefit-section">
      <div className="section-inner benefit-strip">
        {items.map(([Icon, title, copy]) => (
          <article className="benefit-item" key={title}><Icon size={21} /><div><h3>{title}</h3><p>{copy}</p></div></article>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="section" id="features">
      <div className="section-inner">
        <div className="section-heading reveal">
          <span className="eyebrow">Control with clarity</span>
          <h2>Real Controls. Clear Status. Safer Tweaks.</h2>
        </div>
        <div className="feature-grid">
          {features.map(([title, copy, Icon], index) => (
            <article className="feature-card reveal" style={{ transitionDelay: `${index * 55}ms` }} key={title}>
              <Icon size={24} />
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ControlCenter() {
  return (
    <section className="section control-section">
      <div className="section-inner split">
        <div className="split-copy reveal">
          <span className="eyebrow">System command layer</span>
          <h2>A Control Center for Your System</h2>
          <p>Nova Tweaks brings status-checked tweaks, app management, startup control, backups, monitoring, and readable script feedback into one focused workspace.</p>
          <ul className="check-list">
            {['Real tweak-state detection', 'Backup and config-save management', 'Apps and startup app management', 'Clean error handling and script feedback'].map((item) => <li key={item}><Check size={16} />{item}</li>)}
          </ul>
          <ButtonLink href="#features" variant="secondary">Explore All Features</ButtonLink>
        </div>
        <div className="mockup-stack reveal delay-1">
          <div className="product-window stack-main">
            <div className="window-top"><div className="window-dots"><span /><span /><span /></div><span>Dashboard</span></div>
            <div className="stack-grid"><div className="metric-ring"><span>92</span><small>System score</small></div><MiniChart /></div>
          </div>
          <div className="product-window stack-card">
            <div className="window-top"><span>Backups & Config Saves</span><span className="window-status">3 saved</span></div>
            {['Before Gaming Profile', 'Startup Cleanup', 'Network Tune'].map((item) => <div className="backup-row" key={item}><DatabaseBackup size={15} /><span>{item}</span><b>Ready</b></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScreenshotFrame({ card }) {
  return (
    <div className={`screenshot-frame screenshot-frame-${card.frame || 'wide'}`} aria-label={`${card.label || card.title} interface preview`}>
      <div className="screenshot-top">
        <div className="window-dots"><span /><span /><span /></div>
        <span>{card.label || card.title}</span>
      </div>
      <img src={card.image || HERO_MOCKUP_SRC} alt={`${card.title} preview`} loading="lazy" />
    </div>
  );
}

function FeatureShowcaseSection({ id, eyebrow, title, copy, cta, cards, premium = false, onCta }) {
  return (
    <section className={`section image-feature-section ${premium ? 'premium-showcase' : 'free-showcase'}`} id={id}>
      <div className="section-inner">
        <div className="feature-showcase-head reveal">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </div>
          {onCta ? (
            <button className={`btn ${premium ? 'btn-primary' : 'btn-secondary'}`} type="button" onClick={onCta}>{cta}<ArrowRight size={17} /></button>
          ) : (
            <a className={`btn ${premium ? 'btn-primary' : 'btn-secondary'}`} href="#download">{cta}<ArrowRight size={17} /></a>
          )}
        </div>
        <div className="image-feature-grid">
          {cards.map((card, index) => (
            <article className="image-feature-card reveal" style={{ transitionDelay: `${index * 45}ms` }} key={card.title}>
              <ScreenshotFrame card={card} />
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NovaFreeSection() {
  return (
    <FeatureShowcaseSection
      id="nova-free"
      eyebrow="Nova Free"
      title="A serious optimization workspace for free."
      copy="Start with core tweak workflows, real status detection, backups and config saves, app and startup management, monitoring, design settings, and clear descriptions across 150+ tweaks."
      cta="Download Free"
      cards={freeFeatureCards}
    />
  );
}

function NovaPremiumSection({ onUpgrade }) {
  return (
    <FeatureShowcaseSection
      id="nova-premium"
      eyebrow="Premium features"
      title="Unlock deeper control with Premium."
      copy="Nova Premium includes everything in Free plus more powerful tweaks, Nova Game Mode, priority support, and future Premium updates."
      cta="Upgrade to Premium"
      cards={premiumFeatureCards}
      premium
      onCta={onUpgrade}
    />
  );
}

const beforeChartPoints = [
  { x: 72, y: 166 },
  { x: 116, y: 142 },
  { x: 150, y: 184 },
  { x: 178, y: 238, marker: true, label: 'Input spike', labelX: 196, labelY: 198, labelWidth: 94 },
  { x: 216, y: 174 },
  { x: 256, y: 146 },
  { x: 294, y: 196 },
  { x: 328, y: 272, marker: true, label: 'Background spike', labelX: 346, labelY: 232, labelWidth: 130 },
  { x: 370, y: 182 },
  { x: 414, y: 150 },
  { x: 452, y: 184 },
  { x: 496, y: 246, marker: true, label: 'Heavy fight scene', labelX: 514, labelY: 266, labelWidth: 132 },
  { x: 540, y: 168 },
  { x: 588, y: 206 },
  { x: 632, y: 156 },
  { x: 690, y: 214 },
  { x: 774, y: 188 }
];

const afterChartPoints = [
  { x: 72, y: 178 },
  { x: 132, y: 171 },
  { x: 196, y: 160 },
  { x: 258, y: 154 },
  { x: 318, y: 156 },
  { x: 384, y: 146 },
  { x: 446, y: 142 },
  { x: 506, y: 138 },
  { x: 566, y: 132 },
  { x: 626, y: 127 },
  { x: 690, y: 121, marker: true, label: 'Stable optimized path', labelX: 610, labelY: 82, labelWidth: 152 },
  { x: 774, y: 114 }
];

function createPointPath(points) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`).join(' ');
}

function createAreaPath(points, baseline = 330) {
  return `${createPointPath(points)} L${points[points.length - 1].x} ${baseline} L${points[0].x} ${baseline} Z`;
}

function PerformanceGraph({ active }) {
  const beforePath = createPointPath(beforeChartPoints);
  const afterPath = createPointPath(afterChartPoints);
  const afterAreaPath = createAreaPath(afterChartPoints);
  const markers = [
    ...beforeChartPoints.filter((point) => point.marker).map((point) => ({ ...point, tone: 'red' })),
    ...afterChartPoints.filter((point) => point.marker).map((point) => ({ ...point, tone: 'blue' }))
  ];

  return (
    <svg className={`performance-chart ${active ? 'chart-active' : ''}`} viewBox="0 0 820 390" role="img" aria-label="Before and after frame pacing chart">
      <defs>
        <linearGradient id="blueAreaFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#35c9ff" stopOpacity="0.24" />
          <stop offset="78%" stopColor="#008cff" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="blueTravelGlow" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#35c9ff" stopOpacity="0" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#008cff" stopOpacity="0" />
        </linearGradient>
        <filter id="blueLineGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="redSpikeGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      <g className="axis-shell">
        <path className="chart-axis" d="M72 54V330H774" />
        <path className="chart-grid" d="M72 88H774M72 134H774M72 180H774M72 226H774M72 272H774M72 318H774M188 54V330M304 54V330M420 54V330M536 54V330M652 54V330M768 54V330" />
      </g>

      <path className="after-area" d={afterAreaPath} />

      <path className="before-line before-glow" d={beforePath} />
      <path className="before-line" d={beforePath} />

      <path className="after-line after-glow" d={afterPath} />
      <path className="after-line" d={afterPath} />
      <path className="after-highlight" d={afterPath} />

      <g className="chart-chip">
        <rect x="532" y="28" width="158" height="28" rx="14" />
        <text x="548" y="47">Smoother frame pacing</text>
      </g>

      <g className="markers">
        {markers.map((marker, index) => (
          <g className={`marker marker-${marker.tone}`} style={{ '--marker-index': index }} key={marker.label}>
            <circle cx={marker.x} cy={marker.y} r="6" />
            <g className="marker-label" transform={`translate(${marker.labelX} ${marker.labelY})`}>
              <rect width={marker.labelWidth} height="26" rx="13" />
              <text x="12" y="17">{marker.label}</text>
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}

function AnimatedStat({ stat, active }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / 1250);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(stat.value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, stat.value]);
  const display = stat.decimals ? value.toFixed(stat.decimals) : Math.round(value);
  return (
    <article className="stat-card">
      <div className="stat-top"><span>{stat.label}</span><b>{stat.prefix}{display}{stat.suffix}</b></div>
      <div className="bar-track"><span style={{ width: active ? `${stat.bar}%` : '0%' }} /></div>
    </article>
  );
}

function Performance() {
  const [ref, active] = useInView();
  return (
    <section className="section performance-section" id="performance" ref={ref}>
      <div className="section-inner">
        <div className="section-heading reveal">
          <span className="eyebrow">Frame pacing, not fantasy claims</span>
          <h2>Built for Gamers. Proven Results.</h2>
          <p>Smoother sessions come from stability, fewer drops, and less background interference.</p>
        </div>
        <div className="performance-layout">
          <div className={`graph-card reveal ${active ? 'revealed' : ''}`}>
            <div className="graph-header">
              <div className="graph-title-block">
                <span>Before vs After</span>
                <b>Frame pacing stability</b>
                <div className="performance-legend" aria-label="Chart legend">
                  <span><i className="legend-dot red" />Before optimization</span>
                  <span><i className="legend-dot blue" />After NovaTweaks</span>
                </div>
              </div>
              <span className="live-pill"><i />Live motion</span>
            </div>
            <PerformanceGraph active={active} />
          </div>
          <div className="stats-grid">{stats.map((stat) => <AnimatedStat key={stat.label} stat={stat} active={active} />)}</div>
        </div>
      </div>
    </section>
  );
}

function Pricing({ account, onRequireAuth, onUpgrade }) {
  return (
    <section className="section" id="pricing">
      <div className="section-inner">
        <div className="section-heading reveal"><span className="eyebrow">Clean value</span><h2>Simple Pricing. Maximum Value.</h2></div>
        <div className="pricing-grid">
          <article className="price-card reveal">
            <h3>Free</h3>
            <div className="price">$0 <span>/ Forever</span></div>
            {['Core tweaks with real status detection', 'Backup and config saves', 'Apps and startup app management', 'System monitoring and detection', 'Design settings', '150+ readable tweak descriptions'].map((item) => <p key={item}><Check size={16} />{item}</p>)}
            <a className="btn btn-secondary full" href="#download">Download Free</a>
          </article>
          <article className="price-card price-pro reveal delay-1">
            <div className="popular">Most Popular</div>
            <h3>Premium</h3>
            <div className="price">Lifetime <span>/ Premium access</span></div>
            {['Free +', 'More powerful tweaks', 'Nova Game Mode', 'Priority support', 'Future Premium updates'].map((item) => <p key={item}><Check size={16} />{item}</p>)}
            <button className="btn btn-primary full" type="button" onClick={() => (account ? onUpgrade() : onRequireAuth())}><span>Get Premium Now</span><ArrowRight size={17} /></button>
          </article>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section">
      <div className="section-inner">
        <div className="section-heading reveal"><span className="eyebrow">Real product trust</span><h2>Trusted by Gamers & Power Users</h2></div>
        <div className="testimonial-grid">
          {testimonials.map(([role, quote]) => (
            <article className="testimonial-card reveal" key={role}>
              <div className="stars">{Array.from({ length: 5 }).map((_, index) => <Star size={15} key={index} />)}</div>
              <p>"{quote}"</p><b>{role}</b>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section" id="faq">
      <div className="section-inner faq-wrap">
        <div className="section-heading reveal"><span className="eyebrow">Support-ready answers</span><h2>Got Questions? We've Got Answers.</h2></div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <article className={`faq-item ${open === index ? 'faq-open' : ''}`} key={question}>
              <button type="button" onClick={() => setOpen(open === index ? -1 : index)}><span>{question}</span><ChevronDown size={18} /></button>
              <div className="faq-answer"><p>{answer}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AuthModal({ open, onClose, onAuth }) {
  const [view, setView] = useState('login');
  const [form, setForm] = useState({ identifier: '', password: '', username: '', email: '', registerPassword: '', forgotEmail: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setView('login');
      setStatus('');
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      if (view === 'login') {
        await login({ identifier: form.identifier, password: form.password });
        await onAuth();
        onClose();
      } else if (view === 'register') {
        await register({ username: form.username, email: form.email, password: form.registerPassword });
        setStatus('Registration started. Please verify your email before signing in.');
        setView('login');
      } else {
        await forgotPassword({ email: form.forgotEmail });
        setStatus('If the address exists, a password reset link has been sent.');
        setView('login');
      }
    } catch (error) {
      setStatus(formatAuthError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="auth-modal" role="dialog" aria-modal="true" aria-label="Nova account sign in">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="badge">Nova Account</div>
        <h2>{view === 'login' ? 'Sign in to Nova' : view === 'register' ? 'Create your Nova account' : 'Reset your password'}</h2>
        <p>Use the same account connected to NovaTweaks licensing and product access.</p>
        {status ? <div className="form-status">{status}</div> : null}
        <form className="auth-form" onSubmit={handleSubmit}>
          {view === 'login' ? (
            <>
              <input required value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} placeholder="Email or username" />
              <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
            </>
          ) : null}
          {view === 'register' ? (
            <>
              <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
              <input required type="password" value={form.registerPassword} onChange={(e) => setForm({ ...form, registerPassword: e.target.value })} placeholder="Strong password" />
            </>
          ) : null}
          {view === 'forgot' ? <input required type="email" value={form.forgotEmail} onChange={(e) => setForm({ ...form, forgotEmail: e.target.value })} placeholder="Account email" /> : null}
          <button className="btn btn-primary full" type="submit" disabled={loading}>{loading ? 'Working...' : view === 'login' ? 'Sign In' : view === 'register' ? 'Create Account' : 'Send Reset Link'}</button>
        </form>
        <div className="auth-switch">
          <button type="button" onClick={() => setView(view === 'register' ? 'login' : 'register')}>{view === 'register' ? 'Already have an account?' : 'Create account'}</button>
          <button type="button" onClick={() => setView('forgot')}>Forgot password?</button>
        </div>
      </div>
    </div>
  );
}

function AccountSection({ account, accountLoading, onSignIn, onLogout, onUpgrade }) {
  return (
    <section className="section account-section" id="account">
      <div className="section-inner account-panel reveal">
        <div>
          <span className="eyebrow">Account portal</span>
          <h2>Access Your Nova Account</h2>
          <p>Sign in to retrieve real account data from the Nova API, including plan status, email, username, and product access.</p>
        </div>
        {account ? (
          <div className="account-card">
            <div className="account-head"><div className="account-avatar"><User size={22} /></div><div><b>{account.username || 'Nova user'}</b><span>{account.email || 'Email unavailable'}</span></div></div>
            <div className="account-data">
              <span>Plan status <b>{account.premium ? 'Premium' : 'Free'}</b></span>
              <span>Product access <b>{account.premium ? 'Premium downloads enabled' : 'Free download enabled'}</b></span>
              <span>Account ID <b>{account.id || 'Unavailable'}</b></span>
            </div>
            <div className="account-actions">
              {!account.premium ? <button className="btn btn-primary" type="button" onClick={onUpgrade}>Get Premium</button> : null}
              <button className="btn btn-secondary" type="button" onClick={onLogout}><LogOut size={16} />Sign Out</button>
            </div>
          </div>
        ) : (
          <div className="account-card empty">
            <Lock size={28} />
            <h3>{accountLoading ? 'Checking session...' : 'Sign in to load your account'}</h3>
            <p>No account data is shown until the Nova API authenticates your session.</p>
            <button className="btn btn-primary full" type="button" onClick={onSignIn}>Continue to Sign In</button>
          </div>
        )}
      </div>
    </section>
  );
}

function FinalCTA({ onSignIn }) {
  return (
    <section className="section final-cta" id="download">
      <div className="section-inner cta-panel reveal">
        <BadgeCheck size={34} />
        <h2>Ready to unlock your PC's full potential?</h2>
        <p>Download NovaTweaks, keep changes transparent, and make your Windows setup feel sharper for every session.</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="/downloads/NovaTweaks-Setup.exe"><Download size={17} />Download Now</a>
          <a className="btn btn-secondary" href="https://discord.gg/novatweaks" target="_blank" rel="noreferrer">Join Discord</a>
          <button className="btn btn-secondary" type="button" onClick={onSignIn}>Open Account</button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const columns = [
    ['Product', ['Features', 'Performance', 'Pricing', 'Download']],
    ['Resources', ['Documentation', 'Support', 'Changelog', 'Status']],
    ['Company', ['About', 'Contact', 'Privacy', 'Terms']],
    ['Community', ['Discord', 'YouTube', 'GitHub', 'Feedback']]
  ];
  return (
    <footer className="footer">
      <div className="section-inner footer-grid">
        <div><Logo /><p>Premium Windows optimization and control for gamers and power users.</p></div>
        {columns.map(([title, links]) => (
          <div key={title}><h3>{title}</h3>{links.map((link) => <a key={link} href={link === 'Download' ? '#download' : '#top'}>{link}</a>)}</div>
        ))}
      </div>
      <div className="footer-bottom">(c) 2026 NovaTweaks. All rights reserved.</div>
    </footer>
  );
}

function formatAuthError(code = '') {
  const source = typeof code === 'object' && code
    ? `${code.code || ''} ${code.message || ''}`
    : String(code || '');
  const normalized = source.toLowerCase();
  if (normalized.includes('invalid_credentials') || normalized.includes('invalid_login')) return 'Invalid username/email or password.';
  if (normalized.includes('email_not_verified')) return 'Please verify your email before signing in.';
  if (normalized.includes('token_missing')) return 'Login succeeded, but the backend did not return a usable session token.';
  if (normalized.includes('api_network_error')) return 'Nova API is not reachable. Please make sure the local API server is running.';
  if (normalized.includes('weak_password')) return 'Password must include uppercase, lowercase, number, and special character.';
  if (normalized.includes('user_already_exists') || normalized.includes('already_registered')) return 'An account with that email or username already exists.';
  return source.trim() || 'Something went wrong. Please try again.';
}

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [account, setAccount] = useState(null);
  const [accountLoading, setAccountLoading] = useState(Boolean(getStoredToken()));
  const [notice, setNotice] = useState('');

  const loadAccount = async () => {
    const token = getStoredToken();
    if (!token) {
      setAccount(null);
      setAccountLoading(false);
      return;
    }
    setAccountLoading(true);
    try {
      setAccount(await getCurrentUser());
    } catch (_error) {
      clearToken();
      setAccount(null);
    } finally {
      setAccountLoading(false);
    }
  };

  useEffect(() => {
    loadAccount();
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
    }, { threshold: 0.16 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const accountLabel = useMemo(() => account?.premium ? 'Premium' : account ? 'Free' : '', [account]);

  async function handleUpgrade() {
    if (!account) {
      setAuthOpen(true);
      return;
    }
    try {
      const checkout = await createPremiumCheckout();
      if (checkout.checkoutUrl) {
        window.location.href = checkout.checkoutUrl;
      } else if (checkout.status === 'already_premium') {
        setNotice('Your account already has Premium access.');
        await loadAccount();
      }
    } catch (error) {
      setNotice(formatAuthError(error));
    }
  }

  return (
    <>
      <Nav onSignIn={() => setAuthOpen(true)} account={account} />
      {notice ? <button className="site-notice" type="button" onClick={() => setNotice('')}>{notice}<X size={15} /></button> : null}
      {accountLabel ? <a className="account-pill" href="#account">{accountLabel} account</a> : null}
      <main>
        <Hero />
        <Benefits />
        <Features />
        <ControlCenter />
        <NovaFreeSection />
        <NovaPremiumSection onUpgrade={handleUpgrade} />
        <Performance />
        <Pricing account={account} onRequireAuth={() => setAuthOpen(true)} onUpgrade={handleUpgrade} />
        <Testimonials />
        <FAQ />
        <AccountSection account={account} accountLoading={accountLoading} onSignIn={() => setAuthOpen(true)} onLogout={() => { clearToken(); setAccount(null); }} onUpgrade={handleUpgrade} />
        <FinalCTA onSignIn={() => setAuthOpen(true)} />
      </main>
      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuth={loadAccount} />
    </>
  );
}

export default App;
