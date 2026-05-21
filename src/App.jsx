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
  ExternalLink,
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
import ResetPasswordPage from './ResetPasswordPage';
import {
  clearToken,
  createPremiumCheckout,
  forgotPassword,
  getCurrentUser,
  getLatestUpdate,
  login,
  logout,
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
const WEBSITE_PICTURE_TIMER_RESOLUTION_SELECTION_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/timer_resolution_selection.png', import.meta.url).href;
const WEBSITE_PICTURE_DETAILS_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/tweak_details.png', import.meta.url).href;
const WEBSITE_PICTURE_PRIORITY_SUPPORT_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/priority_support.png', import.meta.url).href;
const WEBSITE_PICTURE_FUTURE_PREMIUM_UPDATES_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/future_premium_updates.png', import.meta.url).href;
const DISCORD_ICON_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/discord.png', import.meta.url).href;
const PROFILE_PICTURE_ONE_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/profile_pictures/1.jpg', import.meta.url).href;
const PROFILE_PICTURE_TWO_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/profile_pictures/2.jpg', import.meta.url).href;
const PROFILE_PICTURE_THREE_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/profile_pictures/3.jpg', import.meta.url).href;
const PROFILE_PICTURE_FOUR_SRC = new URL('./assets/Nova_Tweaks_Website_Pictures/profile_pictures/4.jpg', import.meta.url).href;

const DISCORD_URL = 'https://discord.gg/AkH2jJsF3M';
const SUPPORT_EMAIL = 'support@nova-tweaks.com';
const CONTACT_EMAIL = 'contact@nova-tweaks.com';
const PREMIUM_PRICE_LABEL = '19.99 EUR';

const navItems = [
  ['Features', '#features', LayoutGrid],
  ['Showcase', '#product-showcase', MonitorCheck],
  ['Premium', '#nova-premium', Gem],
  ['Performance', '#performance', Activity],
  ['Pricing', '#pricing', Tags],
  ['FAQ', '#faq', Info],
  ['Download', '#download', Download]
];

const features = [
  ['Checked Before It Changes', 'Nova checks the current Windows state first, so you do not apply tweaks blindly or guess what is already active.', BadgeCheck],
  ['Backups Within Reach', 'Create restore points and Nova config saves before bigger changes, then return to a known setup when needed.', DatabaseBackup],
  ['Apps and Startup, Clearly Sorted', 'See installed apps, startup entries, and supported cleanup actions without hunting through Windows menus.', Rocket],
  ['Readable Feedback', 'Scripts show understandable progress, errors, and results, so every step feels traceable instead of mysterious.', ShieldCheck],
  ['System Context Included', 'Live monitoring and hardware detection help you decide what to tune, and when to leave things alone.', MonitorCheck],
  ['150+ Focused Tweaks', 'Browse practical categories for latency, network, power, cleanup, hardware, and everyday Windows behavior.', SlidersHorizontal]
];

const productShowcaseCards = [
  {
    eyebrow: 'Overview',
    title: 'Dashboard',
    subtitle: 'Your starting point for safe Windows tuning.',
    description: 'The dashboard brings recent activity, quick actions, system uptime, and key performance signals into one calm overview. It helps users understand their PC before they change it.',
    frame: 'hero',
    label: 'Dashboard',
    image: WEBSITE_PICTURE_DASHBOARD_THREE_SRC,
    benefits: [
      { icon: ListChecks, title: 'Important actions nearby', text: 'Power plans, cleanup, startup, and latency workflows are easy to reach.' },
      { icon: Clock, title: 'Recent changes visible', text: 'Completed actions stay easy to review without digging through logs.' },
      { icon: Gauge, title: 'Load at a glance', text: 'Resource values show when the system is busy or ready for tuning.' },
      { icon: ShieldCheck, title: 'Safety close by', text: 'Backup and restore options stay part of the normal workflow.' }
    ],
  },
  {
    eyebrow: 'Apps',
    title: 'Apps',
    subtitle: 'Understand what is installed and what runs in the background.',
    description: 'The Apps view gathers installed software, startup visibility, useful metadata, and supported cleanup actions in one place. It helps users remove clutter with context, not pressure.',
    frame: 'hero',
    label: 'Apps',
    image: WEBSITE_PICTURE_APPS_SRC,
    benefits: [
      { icon: Eye, title: 'Installed apps listed', text: 'Review detected desktop apps and supported entries in one manager.' },
      { icon: Wrench, title: 'Supported cleanup', text: 'Run available cleanup actions, such as cache cleanup, where Nova supports them.' },
      { icon: RotateCcw, title: 'Careful uninstall flow', text: 'Confirm removal and see restart guidance when Windows needs it.' },
      { icon: FolderTree, title: 'Open install folders', text: 'Jump to app locations when an install path is available.' }
    ],
  },
  {
    eyebrow: 'Backup',
    title: 'Backup',
    subtitle: 'Make changes with a way back.',
    description: 'Backup separates Nova configuration saves from Windows restore points. Users can save tweak states, review history, and restore with clearer expectations before high-impact changes.',
    frame: 'hero',
    label: 'Backup',
    image: WEBSITE_PICTURE_BACKUP_SRC,
    benefits: [
      { icon: Save, title: 'Nova config saves', text: 'Save tweak states, choices, profiles, settings, and related Nova data.' },
      { icon: ShieldCheck, title: 'Windows restore points', text: 'Create OS-level restore points separately before deeper changes.' },
      { icon: RotateCcw, title: 'Review before restore', text: 'See what will be restored before the current setup is overwritten.' },
      { icon: Archive, title: 'Portable history', text: 'Export, import, search, and manage saved backup entries.' }
    ],
  },
  {
    eyebrow: 'Game Mode',
    title: 'Game Mode',
    subtitle: 'Prepare a game session without overcomplicating it.',
    description: 'Nova Game Mode detects a running game and gives users focused controls for priority, affinity, fullscreen optimization flags, and a one-click game preset.',
    frame: 'hero',
    label: 'Game Mode',
    image: WEBSITE_PICTURE_GAMEMODE_SRC,
    benefits: [
      { icon: Radar, title: 'Game detection', text: 'Wait for a game process or react when Nova detects one.' },
      { icon: Gauge, title: 'Runtime tuning', text: 'Apply priority and affinity controls where Windows allows them.' },
      { icon: PanelsTopLeft, title: 'Fullscreen setting', text: 'Manage the Windows compatibility setting for fullscreen optimizations.' },
      { icon: PlayCircle, title: 'One focused preset', text: 'Start the Game Mode steps from a single, clear workflow.' }
    ],
  },
  {
    eyebrow: 'Monitoring',
    title: 'Performance',
    subtitle: 'Read the system before tuning it.',
    description: 'The performance view tracks CPU, GPU, memory, and network activity with a clear live view. It gives users a better sense of what is actually happening on their PC.',
    frame: 'hero',
    label: 'Performance',
    image: WEBSITE_PICTURE_PERFORMANCE_SRC,
    benefits: [
      { icon: Cpu, title: 'CPU and GPU usage', text: 'Switch focus between processor and graphics usage.' },
      { icon: Activity, title: 'Live history', text: 'Recent samples make load changes easier to understand.' },
      { icon: HardDrive, title: 'Memory visibility', text: 'Memory usage stays visible next to other key resources.' },
      { icon: Gauge, title: 'Network activity', text: 'Download and upload signals reveal background traffic.' }
    ],
  },
  {
    eyebrow: 'Preferences',
    title: 'Preferences',
    subtitle: 'Make Nova fit your setup.',
    description: 'Preferences cover theme, language, accent color, and core interface behavior. The settings stay plain and predictable, so users know exactly what each option changes.',
    frame: 'hero',
    label: 'Preferences',
    image: WEBSITE_PICTURE_SETTINGS_ONE_SRC,
    benefits: [
      { icon: Settings2, title: 'Theme and language', text: 'Switch the interface language and visual theme where available.' },
      { icon: Sparkles, title: 'Accent color', text: 'Choose the accent used across the Nova interface.' },
      { icon: ToggleLeft, title: 'Window behavior', text: 'Manage launch and interface preferences from one settings area.' },
      { icon: Info, title: 'Plain descriptions', text: 'Each settings row explains what the option changes.' }
    ],
  },
  {
    eyebrow: 'Startup and Data',
    title: 'Startup and Data',
    subtitle: 'Control how Nova opens, stores, and resets data.',
    description: 'Startup and data settings handle real app behavior: start minimized, tray behavior, last-tab restore, automatic backups, backup location, import, export, reset, and cache cleanup.',
    frame: 'hero',
    label: 'Startup and Data',
    image: WEBSITE_PICTURE_SETTINGS_TWO_SRC,
    benefits: [
      { icon: ToggleLeft, title: 'Tray behavior', text: 'Minimize to tray and close-to-tray keep Nova available when needed.' },
      { icon: Clock, title: 'Remember last tab', text: 'Reopen the last selected tab on the next launch.' },
      { icon: Save, title: 'Backup location', text: 'Choose where local Nova backup files are stored.' },
      { icon: RefreshCw, title: 'Data tools', text: 'Export, import, reset settings, and clear cache from the same area.' }
    ],
  },
  {
    eyebrow: 'Tweak Library',
    title: 'Tweaks',
    subtitle: 'Find the right tweak without losing context.',
    description: 'The Tweaks view organizes options by category and subcategory, shows detected status, recommended counts, risk filters, and quick actions for supported bulk flows.',
    frame: 'hero',
    label: 'Tweaks',
    image: WEBSITE_PICTURE_TWEAKS_SRC,
    benefits: [
      { icon: LayoutGrid, title: 'Category browsing', text: 'Move through categories and subcategories without losing context.' },
      { icon: Radar, title: 'Status detection', text: 'Nova checks what is already active before presenting actions.' },
      { icon: Sparkles, title: 'Recommended view', text: 'Filter for recommended tweaks or run supported recommended actions.' },
      { icon: ShieldCheck, title: 'Risk labels', text: 'Labels and confirmations make higher-impact changes harder to miss.' }
    ],
  },
  {
    eyebrow: 'Choice-Based Tweaks',
    title: 'Selection Tweaks',
    subtitle: 'Choose an option instead of guessing between on and off.',
    description: 'Some optimizations have several valid settings. Selection Tweaks let users compare options, see the current selection, and apply the exact choice they want.',
    frame: 'hero',
    label: 'Selection Tweaks',
    image: WEBSITE_PICTURE_SELECTION_TWEAK_SRC,
    benefits: [
      { icon: CheckCircle2, title: 'Current selection visible', text: 'Shows the active option before anything changes.' },
      { icon: Sparkles, title: 'Recommended option', text: 'Marks the preferred choice where a recommendation exists.' },
      { icon: Layers, title: 'Compare options', text: 'Keeps every available choice in one focused dialog.' },
      { icon: MousePointerClick, title: 'Deliberate apply flow', text: 'Users choose an option first, then apply it deliberately.' }
    ],
  },
  {
    eyebrow: 'Details',
    title: 'Details',
    subtitle: 'Know what a tweak does before you run it.',
    description: 'The detail panel shows the description, category, risk level, recommendation, detected status, and the action that will run. It gives users a moment to understand the change.',
    frame: 'hero',
    label: 'Details',
    image: WEBSITE_PICTURE_DETAILS_SRC,
    benefits: [
      { icon: Info, title: 'Readable explanation', text: 'Explains what the tweak is for before it is applied.' },
      { icon: Tags, title: 'Useful labels', text: 'Shows category, recommendation, and related metadata.' },
      { icon: ShieldCheck, title: 'Risk context', text: 'Makes sensitive actions easier to spot.' },
      { icon: CheckCheck, title: 'Detected status', text: 'Shows whether Nova already sees the tweak as active.' }
    ],
  }
];

const premiumFeatureCards = [
  {
    title: 'Advanced Tweaks',
    copy: 'Unlock deeper latency, power, network, and system tuning options while keeping the same clear status checks and safety context.',
    frame: 'compact',
    label: 'Advanced Tweaks',
    image: WEBSITE_PICTURE_TIMER_RESOLUTION_SELECTION_SRC
  },
  {
    title: 'Nova Game Mode',
    copy: 'Use a focused premium workflow for game sessions, responsiveness, and background control.',
    frame: 'wide',
    label: 'Game Mode',
    image: WEBSITE_PICTURE_GAMEMODE_SRC
  },
  {
    title: 'Priority Support',
    copy: 'Get faster help with account, setup, and optimization questions when you need a clear answer.',
    frame: 'compact',
    label: 'Support',
    image: WEBSITE_PICTURE_PRIORITY_SUPPORT_SRC
  },
  {
    title: 'Future Premium Updates',
    copy: 'Keep access to upcoming Premium features as Nova Tweaks grows with new workflows and tuning options.',
    frame: 'compact',
    label: 'Updates',
    image: WEBSITE_PICTURE_FUTURE_PREMIUM_UPDATES_SRC
  }
];

const stats = [
  { label: 'Input delay reduced', value: 28, suffix: '%', prefix: '-', bar: 72 },
  { label: 'Boot time reduced', value: 34, suffix: '%', prefix: '-', bar: 78 },
  { label: 'Clutter cleaned', value: 1.3, suffix: ' GB', prefix: '', bar: 64, decimals: 1 },
  { label: 'Background load reduced', value: 22, suffix: '%', prefix: '-', bar: 58 },
  { label: 'Frame pacing improved', value: 18, suffix: '%', prefix: '+', bar: 68 }
];

const testimonials = [
  ['Trxy', 'Nova Tweaks gives me a clean routine before I play. I can see what changed and what is still safe to touch.', PROFILE_PICTURE_ONE_SRC],
  ['Cayfe', 'The restore flow and risk labels make it feel serious. It is built for people who actually care about their setup.', PROFILE_PICTURE_TWO_SRC],
  ['Reefz', 'My streaming setup feels more predictable because I can keep background clutter under control.', PROFILE_PICTURE_THREE_SRC],
  ['Veyron', 'It feels like a proper control panel, not another loud cleaner app with empty promises.', PROFILE_PICTURE_FOUR_SRC]
];

const faqs = [
  ['Is Nova Tweaks safe to use?', 'Nova Tweaks is designed around transparency, risk labels, confirmations, and restore options so you can understand changes before applying them.'],
  ['Can I undo changes?', 'Yes. Backup, restore, and config-save workflows are part of the product, especially before larger optimization passes.'],
  ['Does it work on Windows 10 and 11?', 'Nova Tweaks is built for modern Windows systems and supports Windows 10 and Windows 11 workflows.'],
  ['Do I need admin rights?', 'Most system-level optimizations require administrator privileges because Windows protects those settings.'],
  ['Will it increase my FPS?', 'Nova Tweaks focuses on cleaner system behavior, smoother frame pacing, lower input delay, and fewer background interruptions rather than unrealistic FPS promises.'],
  ['What is included in Premium?', 'Premium includes everything in Free plus advanced tweaks, Nova Game Mode, priority support, and future Premium updates.']
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
          {navItems.map(([label, href, Icon]) => (
            <a key={label} href={href} onClick={() => setOpen(false)}>
              <Icon size={15} />
              <span>{label}</span>
            </a>
          ))}
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
          <div className="badge"><ShieldCheck size={14} />Windows tuning with clear safety checks</div>
          <h1 className="hero-title">
            <span>Tune Windows.</span>
            <span>Stay in control.</span>
          </h1>
          <p>Nova Tweaks helps you reduce background load, improve responsiveness, and understand each system change before you apply it. No vague promises, just clear controls, restore options, and readable feedback.</p>
          <div className="hero-actions">
            <ButtonLink href="#download" icon={Download}>Download Now</ButtonLink>
            <ButtonLink href="#features" variant="secondary" icon={LayoutGrid}>View Features</ButtonLink>
          </div>
          <div className="trust-row">
            <span><ListChecks size={17} /><b>150+</b> focused tweaks</span>
            <span><Radar size={17} /><b>Checked state</b> before action</span>
            <span><MonitorCheck size={17} /><b>Windows 10/11</b> supported</span>
          </div>
        </div>
        <div className="hero-visual reveal delay-1"><DashboardMockup /></div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    [Timer, 'Lower latency', 'Reduce background friction before you play.'],
    [Clock3, 'Checked states', 'Nova checks before showing actions.'],
    [FileText, 'Readable details', 'Understand what each change does.'],
    [DatabaseBackup, 'Restore options', 'Keep restore points and config saves nearby.']
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
          <span className="eyebrow"><ShieldCheck size={14} />Built for confidence</span>
          <h2>Clear controls for people who care about their PC.</h2>
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
          <span className="eyebrow"><PanelsTopLeft size={14} />System workspace</span>
          <h2>One place for tuning, cleanup, and rollback.</h2>
          <p>Nova Tweaks brings checked tweak states, app management, startup control, backups, monitoring, and readable script feedback into one focused workspace.</p>
          <ul className="check-list">
            {['Tweak-state detection before action', 'Restore points and config saves', 'Apps and startup entries in one view', 'Clear script output and error feedback'].map((item) => <li key={item}><Check size={16} />{item}</li>)}
          </ul>
          <ButtonLink href="#features" variant="secondary" icon={ArrowRight}>Explore Features</ButtonLink>
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
  const [imageDirection, setImageDirection] = useState('next');
  const touchStartRef = useRef(null);
  const hasMultipleImages = images.length > 1;
  const imageSrc = images[activeImage] || images[0] || '';

  function showPrevious(event = null) {
    event?.stopPropagation();
    setImageDirection('previous');
    setActiveImage((value) => (value === 0 ? images.length - 1 : value - 1));
  }

  function showNext(event = null) {
    event?.stopPropagation();
    setImageDirection('next');
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
        <div className={`screenshot-media screenshot-media-${imageDirection}`} key={`${imageSrc}-${activeImage}`}>
          <img src={imageSrc} alt={`${card.title} preview ${activeImage + 1}`} loading="lazy" />
        </div>
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
  const [slideDirection, setSlideDirection] = useState('next');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartRef = useRef(null);
  const activeCard = productShowcaseCards[activeSlide];

  function showSlide(nextIndex, direction) {
    setSlideDirection(direction);
    setActiveSlide((nextIndex + productShowcaseCards.length) % productShowcaseCards.length);
  }

  function showPrevious() {
    showSlide(activeSlide - 1, 'previous');
  }

  function showNext() {
    showSlide(activeSlide + 1, 'next');
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
            <span className="eyebrow"><MonitorCheck size={14} />Product tour</span>
            <h2>Real screens, clear workflows.</h2>
            <p>Browse the actual Nova Tweaks views for dashboard, apps, backups, Game Mode, performance, settings, tweaks, and details.</p>
          </div>
          <a className="btn btn-secondary" href="#nova-premium"><Gem size={17} />View Premium</a>
        </div>
        <article className="product-tour-card reveal" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="product-tour-visual">
            <div className="screenshot-frame screenshot-frame-hero" aria-label={`${activeCard.label} interface preview`}>
              <div className="screenshot-top">
                <div className="window-dots"><span /><span /><span /></div>
                <span>{activeCard.label}</span>
              </div>
              <button className="product-tour-image-button" type="button" onClick={() => setLightboxOpen(true)} aria-label={`Open ${activeCard.title} screenshot larger`}>
                <span className={`product-tour-media product-tour-media-${slideDirection}`} key={activeCard.image}>
                  <img src={activeCard.image} alt={`${activeCard.title} preview`} loading="lazy" />
                </span>
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
                    onClick={() => showSlide(index, index > activeSlide ? 'next' : 'previous')}
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
  const [activePremiumFeature, setActivePremiumFeature] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const touchStartRef = useRef(null);
  const activeCard = premiumFeatureCards[activePremiumFeature];

  function showPremiumFeature(nextIndex, direction) {
    setSlideDirection(direction);
    setActivePremiumFeature((nextIndex + premiumFeatureCards.length) % premiumFeatureCards.length);
  }

  function showPreviousPremiumFeature() {
    showPremiumFeature(activePremiumFeature - 1, 'previous');
  }

  function showNextPremiumFeature() {
    showPremiumFeature(activePremiumFeature + 1, 'next');
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

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) {
      return;
    }

    if (deltaX < 0) {
      showNextPremiumFeature();
    } else {
      showPreviousPremiumFeature();
    }
  }

  return (
    <section className="section premium-features-section" id="nova-premium">
      <div className="section-inner">
        <div className="feature-showcase-head reveal">
          <div>
            <span className="eyebrow"><Gem size={14} />Premium</span>
            <h2>Go deeper without losing clarity.</h2>
            <p>Premium keeps the same careful product flow and adds advanced tuning paths, Nova Game Mode, priority help, and future Premium updates.</p>
          </div>
          <button className="btn btn-primary" type="button" onClick={onUpgrade}><Gem size={17} />Upgrade to Premium</button>
        </div>
        <div className="premium-slider reveal" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <button className="premium-slider-arrow premium-slider-prev" type="button" onClick={showPreviousPremiumFeature} aria-label="Show previous Premium feature">
            <ChevronLeft size={22} />
          </button>
          <article className={`premium-hero-card premium-slide-${slideDirection}`} key={activeCard.title}>
            <div className="premium-hero-copy">
              <span>{activeCard.label}</span>
              <h3>{activeCard.title}</h3>
              <p>{activeCard.copy}</p>
              <button className="btn btn-primary" type="button" onClick={onUpgrade}>Unlock Premium<ArrowRight size={17} /></button>
            </div>
            <ScreenshotFrame card={{ ...activeCard, frame: 'hero' }} />
          </article>
          <button className="premium-slider-arrow premium-slider-next" type="button" onClick={showNextPremiumFeature} aria-label="Show next Premium feature">
            <ChevronRight size={22} />
          </button>
          <div className="premium-slider-dots" aria-label="Premium feature selector">
            {premiumFeatureCards.map((card, index) => (
              <button
                className={index === activePremiumFeature ? 'premium-slider-dot-active' : ''}
                type="button"
                onClick={() => showPremiumFeature(index, index > activePremiumFeature ? 'next' : 'previous')}
                aria-label={`Show ${card.title}`}
                key={card.title}
              />
            ))}
          </div>
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
          <span className="eyebrow"><Activity size={14} />Performance</span>
          <h2>Focused on smoother sessions, not inflated claims.</h2>
          <p>Better sessions come from stability, fewer interruptions, and less background interference. Nova Tweaks keeps those goals visible.</p>
        </div>
        <div className="performance-layout">
          <div className={`graph-card reveal ${active ? 'revealed' : ''}`}>
            <div className="graph-header">
              <div className="graph-title-block">
                <span>Before vs after</span>
                <b>Frame pacing stability</b>
                <div className="performance-legend" aria-label="Chart legend">
                  <span><i className="legend-dot red" />Before optimization</span>
                  <span><i className="legend-dot blue" />After Nova Tweaks</span>
                </div>
              </div>
              <span className="live-pill"><i />Animated example</span>
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
        <div className="section-heading reveal"><span className="eyebrow"><Tags size={14} />Pricing</span><h2>Simple pricing, no forced subscription.</h2></div>
        <div className="pricing-grid">
          <article className="price-card reveal">
            <h3>Free</h3>
            <div className="price">0 EUR <span>/ forever</span></div>
            {['Core tweaks with checked status', 'Restore points and config saves', 'Apps and startup management', 'System monitoring and hardware detection', 'Interface preferences', '150+ readable tweak descriptions'].map((item) => <p key={item}><Check size={16} />{item}</p>)}
            <a className="btn btn-secondary full" href="#download">Download Free</a>
          </article>
          <article className="price-card price-pro reveal delay-1">
            <div className="popular"><Star size={13} />Most chosen</div>
            <h3>Premium</h3>
            <div className="price">{PREMIUM_PRICE_LABEL} <span>/ lifetime access</span></div>
            {['Advanced tuning options', 'Nova Game Mode', 'Priority support', 'Future Premium updates'].map((item) => <p key={item}><Check size={16} />{item}</p>)}
            <p>Final price, VAT handling, digital-content withdrawal information, and license terms are shown during checkout and must be reviewed before purchase.</p>
            <button className="btn btn-primary full" type="button" onClick={() => (account ? onUpgrade() : onRequireAuth())}><Gem size={17} /><span>Get Premium</span></button>
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
        <div className="section-heading reveal"><span className="eyebrow"><Star size={14} />User voices</span><h2>Built for gamers and careful PC users.</h2></div>
        <div className="testimonial-grid">
          {testimonials.map(([name, quote, avatar]) => (
            <article className="testimonial-card reveal" key={name}>
              <div className="testimonial-author">
                <img src={avatar} alt="" />
                <b>{name}</b>
              </div>
              <div className="stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, index) => <Star size={15} fill="currentColor" strokeWidth={1.8} key={index} />)}</div>
              <p>"{quote}"</p>
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
        <div className="section-heading reveal"><span className="eyebrow"><Info size={14} />Answers</span><h2>Questions people ask before they trust a tuning app.</h2></div>
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
        <div className="badge"><User size={14} />Nova Account</div>
        <h2>{view === 'login' ? 'Sign in to Nova' : view === 'register' ? 'Create your Nova account' : 'Reset your password'}</h2>
        <p>Use the account connected to your Nova Tweaks license, downloads, and product access.</p>
        {status ? <div className="form-status">{status}</div> : null}
        <form className="auth-form" onSubmit={handleSubmit}>
          {view === 'login' ? (
            <>
              <label className="auth-field">
                <Mail size={17} />
                <input required value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} placeholder="Email or username" />
              </label>
              <label className="auth-field">
                <Lock size={17} />
                <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
              </label>
            </>
          ) : null}
          {view === 'register' ? (
            <>
              <label className="auth-field">
                <User size={17} />
                <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
              </label>
              <label className="auth-field">
                <Mail size={17} />
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
              </label>
              <label className="auth-field">
                <Lock size={17} />
                <input required type="password" value={form.registerPassword} onChange={(e) => setForm({ ...form, registerPassword: e.target.value })} placeholder="Strong password" />
              </label>
            </>
          ) : null}
          {view === 'forgot' ? (
            <label className="auth-field">
              <Mail size={17} />
              <input required type="email" value={form.forgotEmail} onChange={(e) => setForm({ ...form, forgotEmail: e.target.value })} placeholder="Account email" />
            </label>
          ) : null}
          <button className="btn btn-primary full" type="submit" disabled={loading}>{loading ? 'Working...' : view === 'login' ? 'Sign In' : view === 'register' ? 'Create Account' : 'Send Reset Link'}</button>
          {view === 'register' ? (
            <p className="legal-disclaimer">By creating an account you acknowledge the privacy policy and terms linked below. Your email, username, password hash, license status, and device binding data are processed for account security and product access.</p>
          ) : null}
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
          <span className="eyebrow"><Lock size={14} />Account</span>
          <h2>Your license and downloads in one place.</h2>
          <p>Sign in to see your plan, product access, and account details from the Nova API.</p>
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
            <p>Your account data stays hidden until your session is authenticated.</p>
            <button className="btn btn-primary full" type="button" onClick={onSignIn}><User size={17} />Sign In</button>
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
            <span className="eyebrow"><ShieldCheck size={14} />Transparency</span>
            <h2>Legal, privacy, and safety.</h2>
            <p>Nova Tweaks uses account, license, device, diagnostic, and local backup data for access, safety checks, support, troubleshooting, and payment handling through trusted providers.</p>
          </div>
          <div className="legal-grid">
            <article id="privacy">
              <ShieldCheck size={20} />
              <h3>Privacy policy</h3>
              <p>Account data, device identifiers, support diagnostics, logs, and payment provider IDs are processed only for product access, security, billing, and support. Diagnostics should be shared only after a deliberate user action.</p>
            </article>
            <article id="terms">
              <FileText size={20} />
              <h3>Terms, EULA, and withdrawal</h3>
              <p>Digital Premium access, licensing terms, refund/withdrawal information, and EULA limits for system-level Windows changes must be reviewed before purchase and finalized by legal counsel.</p>
            </article>
            <article id="imprint">
              <Mail size={20} />
              <h3>Imprint and contact</h3>
              <p>Provider details must be completed before public sale. Support: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a><br />Contact: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
            </article>
          </div>
          <p className="legal-disclaimer">Payment processing is handled by Stripe. Email delivery, hosting/database, Discord, and any analytics or AI providers must be listed in the final privacy policy and data processing documentation.</p>
        </div>
      </section>
    );
  }

function FinalCTA({ onSignIn, onUpgrade }) {
  const [updateInfo, setUpdateInfo] = useState({
    version: '1.0.0',
    downloadUrl: '/downloads/NovaTweaks-Setup.exe',
    sha256: '',
    releaseNotes: 'Unsigned desktop beta for Windows 10 and Windows 11.',
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
        <h2>Download Nova Tweaks for Windows.</h2>
        <p>Install the Windows beta and tune with visible checks, restore options, risk confirmations, compatibility notes, and readable release information.</p>
        <div className="download-meta" aria-label="Desktop beta download details">
          <span><MonitorCheck size={15} />Windows 10 / 11 x64</span>
          <span><FileText size={15} />Version {updateInfo.version || '1.0.0'}</span>
          <span><ShieldCheck size={15} />Manual beta updates</span>
        </div>
        {updateInfo.releaseNotes ? <p className="download-release-note">{updateInfo.releaseNotes}</p> : null}
        {updateInfo.sha256 ? (
          <div className="checksum-box">
            <div className="checksum-label">
              <Hash size={16} />
              <span>SHA256 checksum</span>
            </div>
            <code title={updateInfo.sha256}>{updateInfo.sha256}</code>
          </div>
        ) : null}
        <div className="download-actions">
          <a className="btn btn-primary download-button" href={downloadHref}><Download size={17} />Download Beta</a>
          <button className="btn btn-secondary" type="button" onClick={onUpgrade}><Gem size={17} />Upgrade to Premium</button>
          <a className="btn btn-secondary" href={DISCORD_URL} target="_blank" rel="noreferrer"><img className="btn-image-icon" src={DISCORD_ICON_SRC} alt="" />Join Discord</a>
          <button className="btn btn-secondary" type="button" onClick={onSignIn}><ExternalLink size={17} />Open Account</button>
        </div>
        <p className="download-fineprint">Early beta builds may be unsigned and can trigger a Windows SmartScreen warning. Review the release notes and SHA256 checksum before installing; automatic public updates stay disabled until signed releases are ready.</p>
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
        ['Imprint', '#imprint'],
        ['Contact', `mailto:${CONTACT_EMAIL}`],
        ['Privacy', '#privacy'],
        ['Terms', '#terms']
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
        <div><Logo /><p>Clear Windows tuning for gamers, creators, and anyone who wants more control without guesswork.</p></div>
        {columns.map(([title, links]) => (
          <div key={title}>
            <h3>{title}</h3>
            {links.map(([label, href]) => (
              <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{label}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">(c) 2026 Nova Tweaks. All rights reserved.</div>
    </footer>
  );
}

function formatAuthError(code = '') {
  const source = typeof code === 'object' && code
    ? `${code.code || ''} ${code.message || ''}`
    : String(code || '');
  const normalized = source.toLowerCase();
  if (normalized.includes('invalid_credentials') || normalized.includes('invalid_login')) return 'Invalid username/email or password.';
    if (normalized.includes('email_not_verified')) return 'Invalid username/email or password.';
  if (normalized.includes('token_missing')) return 'Login succeeded, but the backend did not return a usable session token.';
  if (normalized.includes('api_network_error')) return 'Nova API is not reachable. Please make sure the local API server is running.';
  if (normalized.includes('weak_password')) return 'Password must include uppercase, lowercase, number, and special character.';
    if (normalized.includes('user_already_exists') || normalized.includes('already_registered')) return 'If the account can be created, we will send a verification email.';
  return source.trim() || 'Something went wrong. Please try again.';
}

function App() {
  if (window.location.pathname === '/reset-password') {
    return <ResetPasswordPage />;
  }

  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [account, setAccount] = useState(null);
  const [accountLoading, setAccountLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const loadAccount = async () => {
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

  async function handleLogout() {
    await logout().catch(() => clearToken());
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
