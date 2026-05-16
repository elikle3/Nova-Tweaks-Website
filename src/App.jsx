import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Activity,
  Archive,
  BadgeCheck,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Clock3,
  Cpu,
  DatabaseBackup,
  Download,
  Eye,
  FileText,
  FolderTree,
  Gauge,
  Hash,
  HardDrive,
  Info,
  Layers,
  LayoutGrid,
  ListChecks,
  Gem,
  Lock,
  LogOut,
  Mail,
  Menu,
  MonitorCheck,
  MousePointerClick,
  PanelsTopLeft,
  PlayCircle,
  Radar,
  RefreshCw,
  RotateCcw,
  Rocket,
  Save,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tags,
  Timer,
  ToggleLeft,
  User,
  Wrench,
  X
} from 'lucide-react';
import { useInView } from './hooks/useInView';
import {
  clearToken,
  createPremiumCheckout,
  forgotPassword,
  getCurrentUser,
  getLatestUpdate,
  getStoredToken,
  login,
  register
} from './lib/api';

const APP_LOGO_SRC = new URL('./assets/logo.ico', import.meta.url).href;
const HERO_MOCKUP_SRC = new URL('./assets/website-mockup-transparent.png', import.meta.url).href;
const WEBSITE_PICTURE_DASHBOARD_THREE_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/dashboard_3.png', import.meta.url).href;
const WEBSITE_PICTURE_APPS_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/apps.png', import.meta.url).href;
const WEBSITE_PICTURE_BACKUP_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/backup.png', import.meta.url).href;
const WEBSITE_PICTURE_GAMEMODE_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/gamemode.png', import.meta.url).href;
const WEBSITE_PICTURE_PERFORMANCE_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/performance overview.png', import.meta.url).href;
const WEBSITE_PICTURE_SETTINGS_ONE_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/settings_1.png', import.meta.url).href;
const WEBSITE_PICTURE_SETTINGS_TWO_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/settings_2.png', import.meta.url).href;
const WEBSITE_PICTURE_TWEAKS_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/tweaks.png', import.meta.url).href;
const WEBSITE_PICTURE_SELECTION_TWEAK_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/selection_tweak.png', import.meta.url).href;
const WEBSITE_PICTURE_DETAILS_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/tweak_details.png', import.meta.url).href;
const WEBSITE_PICTURE_PRIORITY_SUPPORT_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/priority_support.png', import.meta.url).href;

const DISCORD_URL = 'https://discord.gg/AkH2jJsF3M';
const SUPPORT_EMAIL = 'support@nova-tweaks.com';
const CONTACT_EMAIL = 'contact@nova-tweaks.com';
const PREMIUM_PRICE_LABEL = '19,99€';

const navItems = [
  ['Features', '#features'],
  ['Showcase', '#product-showcase'],
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

const productShowcaseCards = [
  {
    eyebrow: 'Dashboard Theme',
    title: 'Dashboard in Pink',
    subtitle: 'The same control surface with a softer accent.',
    description: 'The pink dashboard shows Nova as a personal optimization hub with recent changes, quick entries into common workflows, system uptime, and readable performance status.',
    frame: 'hero',
    label: 'Dashboard in Pink',
    image: WEBSITE_PICTURE_DASHBOARD_THREE_SRC,
    benefits: [
      { icon: ListChecks, title: 'Common flows in reach', text: 'Power plan, cleanup, startup, and latency actions are easy to start.' },
      { icon: Clock, title: 'Recent activity visible', text: 'Completed actions stay readable without digging through logs.' },
      { icon: Gauge, title: 'Performance at a glance', text: 'Resource values help users see when the system is under load.' },
      { icon: ShieldCheck, title: 'Safety stays nearby', text: 'Backup and restore access stays part of the dashboard workflow.' }
    ],
  },
  {
    eyebrow: 'App Management',
    title: 'Apps',
    subtitle: 'Find installed software and act on it faster.',
    description: 'The Apps view lists detected applications with search, filters, app metadata, startup visibility, and supported actions for cleanup or removal.',
    frame: 'hero',
    label: 'Apps',
    image: WEBSITE_PICTURE_APPS_SRC,
    benefits: [
      { icon: Eye, title: 'Installed apps visible', text: 'Review detected desktop and supported app entries in one manager.' },
      { icon: Wrench, title: 'Optimize supported apps', text: 'Run available cleanup actions such as cache cleanup where Nova supports it.' },
      { icon: RotateCcw, title: 'Uninstall with context', text: 'Supported uninstall flows include confirmation and restart guidance.' },
      { icon: FolderTree, title: 'Open install paths', text: 'Jump to local app locations when an install path is available.' }
    ],
  },
  {
    eyebrow: 'Safety Layer',
    title: 'Backup',
    subtitle: 'Keep rollback options close to risky changes.',
    description: 'Backup separates Nova configuration backups from Windows Restore Points, so users can save tweak states, manage history, and recover with clearer expectations.',
    frame: 'hero',
    label: 'Backup',
    image: WEBSITE_PICTURE_BACKUP_SRC,
    benefits: [
      { icon: Save, title: 'Nova config backups', text: 'Capture tweak states, choices, profiles, settings, and related Nova data.' },
      { icon: ShieldCheck, title: 'Windows Restore Points', text: 'Create OS-level restore points separately before deeper changes.' },
      { icon: RotateCcw, title: 'Restore with review', text: 'Inspect what will be restored before overwriting the current setup.' },
      { icon: Archive, title: 'Portable backup flow', text: 'Export, import, search, and manage saved backup entries.' }
    ],
  },
  {
    eyebrow: 'Premium Workflow',
    title: 'Game Mode',
    subtitle: 'Prepare a detected game for focused tuning.',
    description: 'Nova Game Mode detects a game and exposes runtime controls for fullscreen optimization flags, high start priority, CPU affinity, and the one-click game preset.',
    frame: 'hero',
    label: 'Game Mode',
    image: WEBSITE_PICTURE_GAMEMODE_SRC,
    benefits: [
      { icon: Radar, title: 'Game detection', text: 'Waits for or reacts to a detected game executable.' },
      { icon: Gauge, title: 'Runtime tuning', text: 'Applies high-priority and affinity controls where Windows allows it.' },
      { icon: PanelsTopLeft, title: 'Fullscreen flag', text: 'Writes the Windows compatibility flag for fullscreen optimizations.' },
      { icon: PlayCircle, title: 'One-click preset', text: 'Runs the Game Mode optimization steps from one focused workflow.' }
    ],
  },
  {
    eyebrow: 'Monitoring',
    title: 'Performance Overview',
    subtitle: 'See current load before changing the system.',
    description: 'The performance view tracks CPU, GPU, memory, and network activity, with a selectable CPU/GPU focus for clearer live monitoring.',
    frame: 'hero',
    label: 'Performance',
    image: WEBSITE_PICTURE_PERFORMANCE_SRC,
    benefits: [
      { icon: Cpu, title: 'CPU and GPU usage', text: 'Switch focus between processor and graphics usage in percent.' },
      { icon: Activity, title: 'Live history', text: 'Recent samples make load changes easier to read.' },
      { icon: HardDrive, title: 'Memory visibility', text: 'Memory usage stays visible next to other key resources.' },
      { icon: Gauge, title: 'Network activity', text: 'Download and upload signals show background traffic.' }
    ],
  },
  {
    eyebrow: 'Preferences',
    title: 'Settings: Preferences',
    subtitle: 'Make Nova feel right without hiding controls.',
    description: 'Preferences cover theme, language, accent color, and core interface behavior so the app can match the user setup while staying predictable.',
    frame: 'hero',
    label: 'Settings preferences',
    image: WEBSITE_PICTURE_SETTINGS_ONE_SRC,
    benefits: [
      { icon: Settings2, title: 'Theme and language', text: 'Switch interface language and theme where translations are available.' },
      { icon: Sparkles, title: 'Accent color', text: 'Pick the visual accent used across the Nova interface.' },
      { icon: ToggleLeft, title: 'Window behavior', text: 'Control launch and interface preferences from one settings area.' },
      { icon: Info, title: 'Clear descriptions', text: 'Settings rows explain what each preference changes.' }
    ],
  },
  {
    eyebrow: 'App Behavior',
    title: 'Settings: Startup & Data',
    subtitle: 'Control launch, tray, and backup behavior.',
    description: 'Startup and data settings manage real app behavior: start minimized, tray handling, close-to-tray, last-tab restore, automatic backups, location, import/export, reset, and cache cleanup.',
    frame: 'hero',
    label: 'Settings startup and data',
    image: WEBSITE_PICTURE_SETTINGS_TWO_SRC,
    benefits: [
      { icon: ToggleLeft, title: 'Tray controls', text: 'Minimize to tray and close-to-tray keep Nova running when needed.' },
      { icon: Clock, title: 'Remember last tab', text: 'Reopen the last selected tab on the next launch.' },
      { icon: Save, title: 'Backup location', text: 'Choose where local Nova backup files are stored.' },
      { icon: RefreshCw, title: 'Data maintenance', text: 'Export, import, reset settings, and clear cache from the same area.' }
    ],
  },
  {
    eyebrow: 'Tweak Catalog',
    title: 'Tweaks',
    subtitle: 'Search, filter, and apply structured Windows tweaks.',
    description: 'The Tweaks view organizes definitions by category and subcategory, shows detected status, recommended counts, risk filters, and quick actions for supported bulk flows.',
    frame: 'hero',
    label: 'Tweaks',
    image: WEBSITE_PICTURE_TWEAKS_SRC,
    benefits: [
      { icon: LayoutGrid, title: 'Category browsing', text: 'Move through categories and subcategories without losing context.' },
      { icon: Radar, title: 'Status detection', text: 'Nova checks what is already active before presenting actions.' },
      { icon: Sparkles, title: 'Recommended filters', text: 'Filter to recommended tweaks or run supported recommended actions.' },
      { icon: ShieldCheck, title: 'Risk-aware controls', text: 'Risk labels and confirmations protect higher-impact changes.' }
    ],
  },
  {
    eyebrow: 'Workflow Feature',
    title: 'Selection Tweak',
    subtitle: 'Pick the best option, not just on or off.',
    description: 'Some optimizations are choices. Selection Tweaks let users compare available options, see the current selection, and apply the exact option Nova should use next.',
    frame: 'hero',
    label: 'Selection Tweak',
    image: WEBSITE_PICTURE_SELECTION_TWEAK_SRC,
    benefits: [
      { icon: CheckCircle2, title: 'Current selection visible', text: 'Shows the active option before anything changes.' },
      { icon: Sparkles, title: 'Recommended option', text: 'Marks the safest or preferred choice where a recommendation exists.' },
      { icon: Layers, title: 'Option comparison', text: 'Keeps every available choice in one focused modal.' },
      { icon: MousePointerClick, title: 'Clear apply flow', text: 'Users choose an option first, then apply it deliberately.' }
    ],
  },
  {
    eyebrow: 'Tweak Details',
    title: 'Details',
    subtitle: 'Review impact before applying a tweak.',
    description: 'The detail panel gives users a focused read on description, category, risk level, recommendation, detected status, and the action they are about to run.',
    frame: 'hero',
    label: 'Details',
    image: WEBSITE_PICTURE_DETAILS_SRC,
    benefits: [
      { icon: Info, title: 'Readable explanation', text: 'Explains what the tweak is for before applying it.' },
      { icon: Tags, title: 'Category and labels', text: 'Shows category, recommendation, and related metadata.' },
      { icon: ShieldCheck, title: 'Risk context', text: 'Risk labels make sensitive actions easier to spot.' },
      { icon: CheckCheck, title: 'Detected status', text: 'Shows whether Nova already sees the tweak as active.' }
    ],
  }
];

const premiumFeatureCards = [
  {
    title: 'More Powerful Tweaks',
    copy: 'Unlock deeper latency, power, network, and system tuning options while keeping the same clear status and safety context.',
    frame: 'compact',
    label: 'Power tweaks'
  },
  {
    title: 'Nova Game Mode',
    copy: 'Use a dedicated premium workflow for gaming sessions, responsiveness, and focused background control.',
    frame: 'wide',
    label: 'Game Mode',
    image: WEBSITE_PICTURE_GAMEMODE_SRC
  },
  {
    title: 'Priority Support',
    copy: 'Get faster help for account, setup, and optimization questions when you need a direct answer.',
    frame: 'compact',
    label: 'Support',
    image: WEBSITE_PICTURE_PRIORITY_SUPPORT_SRC
  },
  {
    title: 'Future Premium Updates',
    copy: 'Keep access to upcoming Premium features as Nova Tweaks evolves with new workflows and optimization options.',
    frame: 'compact',
    label: 'Updates'
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

function getAccountName(account) {
  return account?.username || 'Nova user';
}

function getAccountInitial(account) {
  return getAccountName(account).trim().slice(0, 1).toUpperCase() || 'N';
}

function getAccountAvatarUrl(account) {
  return typeof account?.avatarUrl === 'string' ? account.avatarUrl.trim() : '';
}

function AccountAvatar({ account, size = '' }) {
  const avatarUrl = getAccountAvatarUrl(account);
  const initial = getAccountInitial(account);
  return (
    <span className={`profile-avatar ${size ? `profile-avatar-${size}` : ''}`} aria-hidden="true">
      {avatarUrl ? <img src={avatarUrl} alt="" /> : initial}
    </span>
  );
}

function PlanBadge({ premium, withIcon = false }) {
  return (
    <span className={`profile-plan-badge ${premium ? 'profile-plan-premium' : ''}`}>
      {withIcon && premium ? <Gem size={12} /> : null}
      {premium ? 'Premium' : 'Free'}
    </span>
  );
}

function ProfileMenu({ account, accountLoading, onSignIn, onOpenProfile, onUpgrade, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const accountName = getAccountName(account);
  const accountEmail = account?.email || 'Email unavailable';

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (!account) {
    return (
      <button className="profile-trigger profile-trigger-guest" type="button" onClick={onSignIn} aria-label="Sign in to Nova account">
        <User size={18} />
      </button>
    );
  }

  function runMenuAction(action) {
    setOpen(false);
    action?.();
  }

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        className={`profile-trigger ${open ? 'profile-trigger-open' : ''}`}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
      >
        <AccountAvatar account={account} />
        <span className="profile-trigger-copy">
          <span>{accountName}</span>
        </span>
        <ChevronDown className="profile-chevron" size={16} />
      </button>

      {open ? (
        <div className="profile-dropdown" role="menu">
          <div className="profile-dropdown-head">
            <AccountAvatar account={account} size="large" />
            <div className="profile-dropdown-identity">
              <b>{accountName}</b>
              <span>{accountEmail}</span>
              <PlanBadge premium={account.premium} withIcon />
            </div>
          </div>

          <div className="profile-dropdown-actions">
            <button type="button" role="menuitem" onClick={() => runMenuAction(onOpenProfile)}>
              <User size={16} />
              <span>Profile</span>
            </button>
            {!account.premium ? (
              <button type="button" role="menuitem" onClick={() => runMenuAction(onUpgrade)}>
                <Gem size={16} />
                <span>Upgrade to Premium</span>
              </button>
            ) : null}
            <button type="button" role="menuitem" onClick={() => runMenuAction(onLogout)} disabled={accountLoading}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Nav({ onSignIn, onOpenProfile, onUpgrade, onLogout, account, accountLoading }) {
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
          <ProfileMenu account={account} accountLoading={accountLoading} onSignIn={onSignIn} onOpenProfile={onOpenProfile} onUpgrade={onUpgrade} onLogout={onLogout} />
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
    <div className="hero-mockup-frame">
      <img className="hero-mockup-image" src={HERO_MOCKUP_SRC} alt="Nova Tweaks dashboard interface preview" />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero section" id="top">
      <div className="energy-lines" />
      <div className="section-inner hero-inner">
        <div className="hero-copy reveal">
          <div className="badge">Windows Optimization App for Gamers & Power Users</div>
          <h1 className="hero-title">
            <span>Optimize Windows.</span>
            <span>Keep Control.</span>
          </h1>
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
  const images = card.images?.length ? card.images : (card.image ? [card.image] : []);
  const [activeImage, setActiveImage] = useState(0);
  const touchStartRef = useRef(null);
  const hasMultipleImages = images.length > 1;
  const imageSrc = images[activeImage] || images[0] || '';

  function showPrevious(event = null) {
    event?.stopPropagation();
    setActiveImage((value) => (value === 0 ? images.length - 1 : value - 1));
  }

  function showNext(event = null) {
    event?.stopPropagation();
    setActiveImage((value) => (value + 1) % images.length);
  }

  function handleTouchStart(event) {
    if (!hasMultipleImages) return;
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event) {
    if (!hasMultipleImages || !touchStartRef.current) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.3) {
      return;
    }

    if (deltaX < 0) {
      showNext();
    } else {
      showPrevious();
    }
  }

  return (
    <div
      className={`screenshot-frame screenshot-frame-${card.frame || 'wide'}`}
      aria-label={`${card.label || card.title} interface preview`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="screenshot-top">
        <div className="window-dots"><span /><span /><span /></div>
        <span>{card.label || card.title}</span>
      </div>
      {imageSrc ? (
        <img src={imageSrc} alt={`${card.title} preview ${activeImage + 1}`} loading="lazy" />
      ) : (
        <div className="screenshot-placeholder" aria-hidden="true">
          <div className="placeholder-screen">
            <div className="placeholder-top"><span /><span /><span /></div>
            <div className="placeholder-lines"><i /><i /><i /></div>
          </div>
        </div>
      )}
      {hasMultipleImages ? (
        <>
          <button className="screenshot-nav screenshot-nav-prev" type="button" onClick={showPrevious} aria-label={`Show previous ${card.title} screenshot`}>
            <ChevronLeft size={17} />
          </button>
          <button className="screenshot-nav screenshot-nav-next" type="button" onClick={showNext} aria-label={`Show next ${card.title} screenshot`}>
            <ChevronRight size={17} />
          </button>
          <div className="screenshot-dots" aria-hidden="true">
            {images.map((image, index) => <span className={index === activeImage ? 'screenshot-dot-active' : ''} key={image} />)}
          </div>
        </>
      ) : null}
    </div>
  );
}

function FeatureBenefits({ benefits = [] }) {
  return (
    <div className="feature-benefit-list">
      {benefits.map(({ icon: Icon = CheckCircle2, title, text }) => (
        <div className="feature-benefit-row" key={title}>
          <span className="feature-benefit-icon" aria-hidden="true">
            <Icon size={17} />
          </span>
          <span className="feature-benefit-copy">
            <b>{title}</b>
            <span>{text}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function FeatureShowcaseText({ card }) {
  return (
    <div className="product-showcase-copy product-tour-copy">
      <span className="feature-eyebrow">
        <Sparkles size={13} />
        {card.eyebrow || card.label}
      </span>
      <div className="feature-copy-head">
        <h3>{card.title}</h3>
        <p className="feature-subtitle">{card.subtitle}</p>
      </div>
      <p className="feature-description">{card.description}</p>
      <FeatureBenefits benefits={card.benefits} />
    </div>
  );
}

function ProductShowcase() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartRef = useRef(null);
  const activeCard = productShowcaseCards[activeSlide];

  function showPrevious() {
    setActiveSlide((value) => (value === 0 ? productShowcaseCards.length - 1 : value - 1));
  }

  function showNext() {
    setActiveSlide((value) => (value + 1) % productShowcaseCards.length);
  }

  function handleTouchStart(event) {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event) {
    if (!touchStartRef.current) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.3) {
      return;
    }

    if (deltaX < 0) {
      showNext();
    } else {
      showPrevious();
    }
  }

  useEffect(() => {
    if (!lightboxOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setLightboxOpen(false);
      } else if (event.key === 'ArrowLeft') {
        showPrevious();
      } else if (event.key === 'ArrowRight') {
        showNext();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  return (
    <section className="section product-showcase-section" id="product-showcase">
      <div className="section-inner">
        <div className="feature-showcase-head reveal">
          <div>
            <span className="eyebrow">Nova product tour</span>
            <h2>Real screens from the Nova Tweaks app.</h2>
            <p>Browse the actual product views for dashboards, apps, backups, game mode, performance, settings, tweaks, and details.</p>
          </div>
          <a className="btn btn-secondary" href="#nova-premium">View Premium<ArrowRight size={17} /></a>
        </div>
        <article className="product-tour-card reveal" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="product-tour-visual">
            <div className="screenshot-frame screenshot-frame-hero" aria-label={`${activeCard.label} interface preview`}>
              <div className="screenshot-top">
                <div className="window-dots"><span /><span /><span /></div>
                <span>{activeCard.label}</span>
              </div>
              <button className="product-tour-image-button" type="button" onClick={() => setLightboxOpen(true)} aria-label={`Open ${activeCard.title} screenshot larger`}>
                <img src={activeCard.image} alt={`${activeCard.title} preview`} loading="lazy" />
              </button>
              <button className="screenshot-nav screenshot-nav-prev" type="button" onClick={showPrevious} aria-label="Show previous Nova screenshot">
                <ChevronLeft size={17} />
              </button>
              <button className="screenshot-nav screenshot-nav-next" type="button" onClick={showNext} aria-label="Show next Nova screenshot">
                <ChevronRight size={17} />
              </button>
              <div className="screenshot-dots" aria-label="Nova screenshot slides">
                {productShowcaseCards.map((card, index) => (
                  <button
                    className={index === activeSlide ? 'screenshot-dot-active' : ''}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Show ${card.title}`}
                    key={card.title}
                  />
                ))}
              </div>
            </div>
          </div>
          <FeatureShowcaseText card={activeCard} />
        </article>
        {lightboxOpen ? (
          <div className="screenshot-lightbox" role="dialog" aria-modal="true" aria-label={`${activeCard.title} screenshot preview`} onClick={() => setLightboxOpen(false)}>
            <button className="lightbox-close" type="button" onClick={() => setLightboxOpen(false)} aria-label="Close screenshot preview">
              <X size={20} />
            </button>
            <button className="lightbox-nav lightbox-nav-prev" type="button" onClick={(event) => { event.stopPropagation(); showPrevious(); }} aria-label="Show previous Nova screenshot">
              <ChevronLeft size={22} />
            </button>
            <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
              <img src={activeCard.image} alt={`${activeCard.title} large preview`} />
              <figcaption>
                <span>{activeCard.label}</span>
                <b>{activeCard.title}</b>
              </figcaption>
            </figure>
            <button className="lightbox-nav lightbox-nav-next" type="button" onClick={(event) => { event.stopPropagation(); showNext(); }} aria-label="Show next Nova screenshot">
              <ChevronRight size={22} />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function PremiumFeaturesSection({ onUpgrade }) {
  return (
    <section className="section premium-features-section" id="nova-premium">
      <div className="section-inner">
        <div className="feature-showcase-head reveal">
          <div>
            <span className="eyebrow">Premium features</span>
            <h2>Go deeper with Nova Premium.</h2>
            <p>Premium keeps the same clean product flow and adds stronger optimization paths, Game Mode, priority help, and future Premium updates.</p>
          </div>
          <button className="btn btn-primary" type="button" onClick={onUpgrade}>Upgrade to Premium<ArrowRight size={17} /></button>
        </div>
        <div className="premium-features-grid">
          {premiumFeatureCards.map((card, index) => (
            <article className="premium-feature-card reveal" style={{ transitionDelay: `${index * 55}ms` }} key={card.title}>
              <ScreenshotFrame card={card} />
              <div>
                <span>{card.label}</span>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
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
            <div className="price">0€ <span>/ Forever</span></div>
            {['Core tweaks with real status detection', 'Backup and config saves', 'Apps and startup app management', 'System monitoring and detection', 'Design settings', '150+ readable tweak descriptions'].map((item) => <p key={item}><Check size={16} />{item}</p>)}
            <a className="btn btn-secondary full" href="#download">Download Free</a>
          </article>
          <article className="price-card price-pro reveal delay-1">
            <div className="popular">Most Popular</div>
            <h3>Premium</h3>
            <div className="price">{PREMIUM_PRICE_LABEL} <span>/ Lifetime access</span></div>
            {['More powerful tweaks', 'Nova Game Mode', 'Priority support', 'Future Premium updates'].map((item) => <p key={item}><Check size={16} />{item}</p>)}
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

function ProfileModal({ open, account, onClose, onUpgrade, onLogout }) {
  if (!open || !account) return null;

  const accountName = getAccountName(account);

  return (
    <div className="modal-backdrop">
      <div className="profile-modal" role="dialog" aria-modal="true" aria-label="Nova account profile">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="profile-modal-hero">
          <AccountAvatar account={account} size="modal" />
          <div className="profile-modal-title">
            <h2>{accountName}</h2>
            <p>{account.email || 'Email unavailable'}</p>
            <PlanBadge premium={account.premium} />
          </div>
        </div>

        <div className="profile-modal-grid">
          <div className="profile-fact">
            <Mail size={17} />
            <span>Email</span>
            <b>{account.email || 'Unavailable'}</b>
          </div>
          <div className="profile-fact">
            <ShieldCheck size={17} />
            <span>Plan status</span>
            <b>{account.premium ? 'Premium' : 'Free'}</b>
          </div>
          <div className="profile-fact">
            <User size={17} />
            <span>Account ID</span>
            <b>{account.id || 'Unavailable'}</b>
          </div>
          <div className="profile-fact">
            <BadgeCheck size={17} />
            <span>Product access</span>
            <b>{account.premium ? 'Premium enabled' : 'Free enabled'}</b>
          </div>
        </div>

        <div className="profile-modal-actions">
          {!account.premium ? <button className="btn btn-primary" type="button" onClick={onUpgrade}><Gem size={16} />Upgrade to Premium</button> : null}
          <button className="btn btn-secondary" type="button" onClick={onLogout}><LogOut size={16} />Logout</button>
          <button className="btn btn-secondary" type="button" onClick={onClose}>Close</button>
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
            <div className="account-head"><AccountAvatar account={account} size="account" /><div><b>{account.username || 'Nova user'}</b><span>{account.email || 'Email unavailable'}</span></div></div>
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

function LegalNotice() {
  return (
    <section className="section legal-section" id="legal">
      <div className="section-inner legal-panel reveal">
        <div>
          <span className="eyebrow">Beta transparency</span>
          <h2>Privacy, Terms, and Support Before Public Release</h2>
          <p>Nova Tweaks stores account, license, device-binding, diagnostic, and local backup data only for product access, safety, support, and troubleshooting workflows.</p>
        </div>
        <div className="legal-grid">
          <article>
            <ShieldCheck size={20} />
            <h3>Privacy baseline</h3>
            <p>Diagnostics are redacted, local token storage uses the desktop secure store, and account export/delete workflows are part of the release checklist.</p>
          </article>
          <article>
            <FileText size={20} />
            <h3>Terms and safety</h3>
            <p>System-level tweaks require administrator rights and can affect Windows behavior. Beta users should keep restore points and backups available.</p>
          </article>
          <article>
            <Mail size={20} />
            <h3>Support contact</h3>
            <p>Support: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a><br />Contact: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          </article>
        </div>
        <p className="legal-disclaimer">Public privacy policy, terms, imprint, and processor disclosures must be reviewed by counsel before a non-beta launch.</p>
      </div>
    </section>
  );
}

function FinalCTA({ onSignIn, onUpgrade }) {
  const [updateInfo, setUpdateInfo] = useState({
    version: '1.0.0',
    downloadUrl: '/downloads/NovaTweaks-Setup.exe',
    sha256: '',
    releaseNotes: 'Desktop beta for Windows 10 and Windows 11.',
    minimumSupportedVersion: '1.0.0'
  });

  useEffect(() => {
    let cancelled = false;
    getLatestUpdate()
      .then((nextInfo) => {
        if (!cancelled) {
          setUpdateInfo((current) => ({ ...current, ...nextInfo }));
        }
      })
      .catch(() => {
        // Keep static download metadata if the API is unreachable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const downloadHref = updateInfo.downloadUrl || '/downloads/NovaTweaks-Setup.exe';

  return (
    <section className="section final-cta" id="download">
      <div className="section-inner cta-panel reveal">
        <BadgeCheck size={34} />
        <h2>Nova Tweaks Desktop Beta</h2>
        <p>Download the Windows beta, verify the checksum, and keep changes transparent with backups, risk confirmations, compatibility warnings, and diagnostics.</p>
        <div className="download-meta" aria-label="Desktop beta download details">
          <span><MonitorCheck size={15} />Windows 10 / 11 x64</span>
          <span><FileText size={15} />Version {updateInfo.version || '1.0.0'}</span>
          <span><ShieldCheck size={15} />Manual beta update</span>
        </div>
        {updateInfo.releaseNotes ? <p className="download-release-note">{updateInfo.releaseNotes}</p> : null}
        {updateInfo.sha256 ? (
          <div className="checksum-box">
            <Hash size={16} />
            <span>SHA256</span>
            <code>{updateInfo.sha256}</code>
          </div>
        ) : null}
        <div className="hero-actions">
          <a className="btn btn-primary" href={downloadHref}><Download size={17} />Download Beta</a>
          <button className="btn btn-secondary" type="button" onClick={onUpgrade}><Gem size={17} />Upgrade to Premium</button>
          <a className="btn btn-secondary" href={DISCORD_URL} target="_blank" rel="noreferrer">Join Discord</a>
          <button className="btn btn-secondary" type="button" onClick={onSignIn}>Open Account</button>
        </div>
        <p className="download-fineprint">Beta builds are distributed from this website. Review release notes and checksum before installing.</p>
      </div>
    </section>
  );
}

function Footer() {
  const columns = [
    ['Product', [
      ['Features', '#features'],
      ['Performance', '#performance'],
      ['Pricing', '#pricing'],
      ['Download', '#download']
    ]],
    ['Resources', [
      ['Documentation', '#faq'],
      ['Support', `mailto:${SUPPORT_EMAIL}`],
      ['Changelog', '#top'],
      ['Status', '#top']
    ]],
    ['Company', [
      ['About', '#top'],
      ['Contact', `mailto:${CONTACT_EMAIL}`],
      ['Privacy', '#legal'],
      ['Terms', '#legal']
    ]],
    ['Community', [
      ['Discord', DISCORD_URL],
      ['YouTube', '#top'],
      ['GitHub', '#top'],
      ['Feedback', `mailto:${CONTACT_EMAIL}`]
    ]]
  ];
  return (
    <footer className="footer">
      <div className="section-inner footer-grid">
        <div><Logo /><p>Premium Windows optimization and control for gamers and power users.</p></div>
        {columns.map(([title, links]) => (
          <div key={title}>
            <h3>{title}</h3>
            {links.map(([label, href]) => (
              <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{label}</a>
            ))}
          </div>
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
  const [profileOpen, setProfileOpen] = useState(false);
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

  function handleLogout() {
    clearToken();
    setAccount(null);
    setProfileOpen(false);
  }

  return (
    <>
      <Nav
        onSignIn={() => setAuthOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        onUpgrade={handleUpgrade}
        onLogout={handleLogout}
        account={account}
        accountLoading={accountLoading}
      />
      {notice ? <button className="site-notice" type="button" onClick={() => setNotice('')}>{notice}<X size={15} /></button> : null}
      <main>
        <Hero />
        <Benefits />
        <Features />
        <ControlCenter />
        <ProductShowcase />
        <PremiumFeaturesSection onUpgrade={handleUpgrade} />
        <Performance />
        <Pricing account={account} onRequireAuth={() => setAuthOpen(true)} onUpgrade={handleUpgrade} />
        <Testimonials />
        <FAQ />
        <AccountSection account={account} accountLoading={accountLoading} onSignIn={() => setAuthOpen(true)} onLogout={handleLogout} onUpgrade={handleUpgrade} />
        <LegalNotice />
        <FinalCTA onSignIn={() => (account ? setProfileOpen(true) : setAuthOpen(true))} onUpgrade={handleUpgrade} />
      </main>
      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuth={loadAccount} />
      <ProfileModal open={profileOpen} account={account} onClose={() => setProfileOpen(false)} onUpgrade={handleUpgrade} onLogout={handleLogout} />
    </>
  );
}

export default App;
