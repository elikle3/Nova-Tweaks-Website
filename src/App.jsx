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
  CircleCheck,
  CircuitBoard,
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
  Gpu,
  Hash,
  HardDrive,
  History,
  Info,
  Layers,
  LayoutGrid,
  ListChecks,
  Gem,
  Lock,
  LogOut,
  Mail,
  MemoryStick,
  Menu,
  MonitorCog,
  MonitorCheck,
  MousePointer2,
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
  Thermometer,
  Timer,
  ToggleLeft,
  Trash2,
  User,
  Wifi,
  Wrench,
  X
} from 'lucide-react';
import { useInView } from './hooks/useInView';
import HomePage from './landing/HomePage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
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
const WEBSITE_PICTURE_DASHBOARD_THREE_SRC = '';
const WEBSITE_PICTURE_APPS_SRC = '';
const WEBSITE_PICTURE_BACKUP_SRC = '';
const WEBSITE_PICTURE_GAMEMODE_SRC = '';
const WEBSITE_PICTURE_PERFORMANCE_SRC = '';
const WEBSITE_PICTURE_SETTINGS_ONE_SRC = '';
const WEBSITE_PICTURE_SETTINGS_TWO_SRC = '';
const WEBSITE_PICTURE_TWEAKS_SRC = '';
const WEBSITE_PICTURE_SELECTION_TWEAK_SRC = '';
const WEBSITE_PICTURE_TIMER_RESOLUTION_SELECTION_SRC = '';
const WEBSITE_PICTURE_DETAILS_SRC = '';
const WEBSITE_PICTURE_FUTURE_PREMIUM_UPDATES_SRC = '';
const WEBSITE_PICTURE_PRIORITY_SUPPORT_SRC = '';
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
  ['Dashboard', '#dashboard-showcase', MonitorCheck],
  ['Performance', '#performance', Activity],
  ['Free', '#nova-free', Sparkles],
  ['Premium', '#nova-premium', Gem],
  ['Pricing', '#pricing', Tags],
  ['FAQ', '#faq', Info],
  ['Download', '#download', Download]
];

const novaAppNavItems = [
  ['Dashboard', LayoutGrid, true],
  ['Tweaks', SlidersHorizontal],
  ['Game Mode', PlayCircle],
  ['Performance', Activity],
  ['Backup', DatabaseBackup],
  ['Apps', Rocket],
  ['Settings', Settings2]
];

const novaDashboardHardwareCards = [
  { key: 'gpu', label: 'GPU', primary: 'NVIDIA GeForce RTX 4070', secondary: 'Detected', icon: Gpu },
  { key: 'cpu', label: 'CPU', primary: 'AMD Ryzen 7 7800X3D', secondary: '8 cores / 16 threads', icon: Cpu },
  { key: 'ram', label: 'RAM', primary: '32 GB DDR5', secondary: '6000 MT/s', icon: MemoryStick },
  { key: 'mb', label: 'MB', primary: 'MSI MAG B650 Tomahawk', secondary: 'AM5 platform', icon: CircuitBoard }
];

const novaDashboardMetrics = [
  { icon: Cpu, label: 'CPU Usage', value: '18%', detail: '47 C', detailIcon: Thermometer, accent: 'var(--accent)' },
  { icon: Gpu, label: 'GPU Usage', value: '12%', detail: '44 C', detailIcon: Thermometer, accent: 'var(--accent-secondary)' },
  { icon: MemoryStick, label: 'Memory Usage', value: '9.8 GB', detail: 'Used', accent: '#8B5CF6' },
  { icon: Wifi, label: 'Network Usage', value: '18.4 Mbit/s', detail: 'Inbound', accent: '#06B6D4' }
];

const novaDashboardActivities = [
  ['Apply Powerplan opened', 'just now', 'var(--accent)'],
  ['Clean Temporary Files opened', '2m ago', 'var(--accent-secondary)'],
  ['Manage Startup Apps opened', '8m ago', '#8B5CF6'],
  ['Reduce Input Delay opened', '13m ago', '#06B6D4']
];

const features = [
  ['Checked Before It Changes', 'Nova checks the current Windows state first, so you do not apply tweaks blindly or guess what is already active.', BadgeCheck, 'Checked'],
  ['Backups Within Reach', 'Create restore points and Nova config saves before bigger changes, then return to a known setup when needed.', DatabaseBackup, 'Protected'],
  ['Apps and Startup, Clearly Sorted', 'See installed apps, startup entries, and supported cleanup actions without hunting through Windows menus.', Rocket, 'Mapped'],
  ['Readable Feedback', 'Scripts show understandable progress, errors, and results, so every step feels traceable instead of mysterious.', ShieldCheck, 'Traceable'],
  ['System Context Included', 'Live monitoring and hardware detection help you decide what to tune, and when to leave things alone.', MonitorCheck, 'Live'],
  ['150+ Focused Tweaks', 'Browse practical categories for latency, network, power, cleanup, hardware, and everyday Windows behavior.', SlidersHorizontal, 'Ready']
];

const freeLandingFeatures = [
  {
    title: 'System Tweaks',
    copy: 'Tune Windows power, latency, cleanup, network, and interface settings from one focused library.',
    image: WEBSITE_PICTURE_TWEAKS_SRC,
    icon: SlidersHorizontal
  },
  {
    title: 'Smart Status Detection',
    copy: 'Nova checks current state before presenting actions, so users know what is already active.',
    image: WEBSITE_PICTURE_SELECTION_TWEAK_SRC,
    icon: Radar
  },
  {
    title: 'Performance Overview',
    copy: 'Read CPU, GPU, memory, and network signals before making changes to the system.',
    image: WEBSITE_PICTURE_PERFORMANCE_SRC,
    icon: Activity
  },
  {
    title: 'Backup and Restore',
    copy: 'Create Nova config saves and Windows restore points before bigger optimization passes.',
    image: WEBSITE_PICTURE_BACKUP_SRC,
    icon: DatabaseBackup
  },
  {
    title: 'Apps and Startup',
    copy: 'Review installed software, startup impact, and supported cleanup actions in a clear workflow.',
    image: WEBSITE_PICTURE_APPS_SRC,
    icon: Rocket
  },
  {
    title: 'Settings That Stay Clear',
    copy: 'Theme, language, startup behavior, data tools, and backup locations stay easy to control.',
    image: WEBSITE_PICTURE_SETTINGS_ONE_SRC,
    icon: Settings2
  }
];

const premiumLandingFeatures = [
  {
    title: 'Nova Game Mode',
    copy: 'Prepare active game sessions with priority, affinity, fullscreen behavior, and session-focused tuning.',
    image: WEBSITE_PICTURE_GAMEMODE_SRC,
    icon: PlayCircle
  },
  {
    title: 'Timer Resolution Control',
    copy: 'Use advanced timer workflows for latency-focused setups with clearer selection states.',
    image: WEBSITE_PICTURE_TIMER_RESOLUTION_SELECTION_SRC,
    icon: Timer
  },
  {
    title: 'Future Premium Updates',
    copy: 'Keep access to new premium workflows as Nova adds deeper performance tooling.',
    image: WEBSITE_PICTURE_FUTURE_PREMIUM_UPDATES_SRC,
    icon: Sparkles
  },
  {
    title: 'Priority Support',
    copy: 'Get help faster for setup, licensing, and PC tuning questions through the Nova support flow.',
    image: WEBSITE_PICTURE_PRIORITY_SUPPORT_SRC,
    icon: BadgeCheck
  }
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
  ['What is included in Premium?', 'Premium includes everything in Free plus advanced tweaks, Nova Game Mode, and future Premium updates.']
];

function Logo() {
  return (
    <a className="logo" href="/" aria-label="NovaTweaks home">
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

function Nav({ onSignIn, onOpenProfile, onUpgrade, onLogout, account, accountLoading, showAccount = true }) {
  const [open, setOpen] = useState(false);
  const isHomePage = window.location.pathname === '/';
  return (
    <header className="nav-shell">
      <nav className="nav">
        <Logo />
        <button className="mobile-menu" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className={`nav-links ${open ? 'nav-links-open' : ''}`}>
          {navItems.map(([label, href, Icon]) => (
            <a key={label} href={!isHomePage && href.startsWith('#') ? `/${href}` : href} onClick={() => setOpen(false)}>
              <Icon size={15} />
              <span>{label}</span>
            </a>
          ))}
        </div>
        <div className="nav-actions">
          {showAccount ? (
            <ProfileMenu account={account} accountLoading={accountLoading} onSignIn={onSignIn} onOpenProfile={onOpenProfile} onUpgrade={onUpgrade} onLogout={onLogout} />
          ) : null}
          <a className="btn btn-small btn-primary" href="/#download"><Download size={16} />Download Now</a>
        </div>
      </nav>
    </header>
  );
}

const NOVA_ICON_PROPS = {
  size: 18,
  strokeWidth: 1.8
};

function NovaIconContainer({ className = '', children, style }) {
  return (
    <span className={`ui-icon-container ${className}`.trim()} style={style}>
      {children}
    </span>
  );
}

function NovaDashboardTopIcon({ icon: Icon, tone = 'accent' }) {
  return (
    <NovaIconContainer className={`dashboard-top-row-icon dashboard-top-row-icon--${tone}`}>
      <Icon {...NOVA_ICON_PROPS} aria-hidden="true" />
    </NovaIconContainer>
  );
}

function NovaBackupHeroIllustration() {
  return (
    <svg className="dashboard-top-row-backup-hero" viewBox="0 0 210 160" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="backupHeroAccentWebsite" x1="34" y1="18" x2="165" y2="138" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.95" />
          <stop offset="1" stopColor="var(--accent-secondary)" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="backupHeroSurfaceWebsite" x1="64" y1="105" x2="148" y2="145" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--surface-hover)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--surface)" stopOpacity="0.26" />
        </linearGradient>
      </defs>
      <ellipse className="dashboard-top-row-backup-orbit" cx="111" cy="79" rx="77" ry="28" transform="rotate(-24 111 79)" />
      <path className="dashboard-top-row-backup-platform" d="M54 116 103 91c5-3 13-3 18 0l44 22c5 3 5 8 0 10l-49 25c-5 3-13 3-18 0l-44-22c-5-3-5-8 0-10Z" />
      <path className="dashboard-top-row-backup-platform dashboard-top-row-backup-platform--lower" d="M63 129 105 108c4-2 10-2 14 0l37 18c4 2 4 6 0 8l-42 21c-4 2-10 2-14 0l-37-18c-4-2-4-6 0-8Z" />
      <g className="dashboard-top-row-backup-core">
        <ellipse cx="111" cy="54" rx="28" ry="13" fill="url(#backupHeroAccentWebsite)" />
        <path d="M83 54v51c0 7 13 13 28 13s28-6 28-13V54c0 7-13 13-28 13S83 61 83 54Z" fill="url(#backupHeroAccentWebsite)" opacity="0.68" />
        <path d="M83 73c0 7 13 13 28 13s28-6 28-13M83 92c0 7 13 13 28 13s28-6 28-13" fill="none" stroke="var(--text-primary)" strokeOpacity="0.24" strokeWidth="2" />
        <path d="M92 51c6-5 29-7 39 0" fill="none" stroke="var(--text-primary)" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      </g>
      <path className="dashboard-top-row-backup-shield" d="M111 22 141 34v28c0 24-15 39-30 46-15-7-30-22-30-46V34l30-12Z" />
      <circle className="dashboard-top-row-backup-node dashboard-top-row-backup-node--left" cx="39" cy="101" r="4" />
      <circle className="dashboard-top-row-backup-node dashboard-top-row-backup-node--right" cx="176" cy="40" r="5" />
    </svg>
  );
}

function NovaUptimeSparkline() {
  return (
    <svg className="dashboard-top-row-sparkline" viewBox="0 0 240 86" role="img" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id="uptimeSparklineStrokeWebsite" x1="0" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--dashboard-top-row-accent)" stopOpacity="0.7" />
          <stop offset="1" stopColor="var(--dashboard-top-row-accent)" />
        </linearGradient>
        <linearGradient id="uptimeSparklineFillWebsite" x1="0" y1="24" x2="0" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--dashboard-top-row-accent)" stopOpacity="0.2" />
          <stop offset="1" stopColor="var(--dashboard-top-row-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="dashboard-top-row-sparkline-grid" d="M2 72H238M2 58H238M2 44H238M2 30H238" />
      <path d="M4 68 C28 51 48 55 68 59 C92 64 106 33 132 33 C158 33 162 65 190 62 C211 60 220 41 236 29 L236 86 L4 86 Z" fill="url(#uptimeSparklineFillWebsite)" />
      <path className="dashboard-top-row-sparkline-line" d="M4 68 C28 51 48 55 68 59 C92 64 106 33 132 33 C158 33 162 65 190 62 C211 60 220 41 236 29" />
      <circle className="dashboard-top-row-sparkline-dot" cx="236" cy="29" r="4" />
    </svg>
  );
}

function NovaDashboardSectionTitle({ icon: Icon, title }) {
  return (
    <div className="dashboard-section-title">
      <NovaIconContainer className="dashboard-section-title__icon">
        <Icon {...NOVA_ICON_PROPS} aria-hidden="true" />
      </NovaIconContainer>
      <h2>{title}</h2>
    </div>
  );
}

function NovaHardwareStatusTile({ card }) {
  const Icon = card.icon;
  return (
    <div className="dashboard-top-row-hardware-tile is-detected">
      <NovaIconContainer className="dashboard-top-row-hardware-icon is-detected">
        <Icon {...NOVA_ICON_PROPS} aria-hidden="true" />
      </NovaIconContainer>
      <div className="dashboard-top-row-hardware-copy">
        <p className="dashboard-top-row-hardware-label">{card.label}</p>
        <p className="dashboard-top-row-hardware-primary" title={card.primary}>{card.primary}</p>
        <p className="dashboard-top-row-hardware-secondary" title={card.secondary}>{card.secondary}</p>
      </div>
      <CircleCheck {...NOVA_ICON_PROPS} className="dashboard-top-row-hardware-check is-detected" aria-hidden="true" />
    </div>
  );
}

function NovaOverviewMetricCard({ icon: Icon, label, value, detail, detailIcon: DetailIcon, accent }) {
  return (
    <article className="dashboard-metric-card ui-card-subtle">
      <div className="dashboard-metric-card-top">
        <NovaIconContainer
          className="dashboard-metric-card-icon"
          style={{
            color: accent,
            background: `color-mix(in srgb, ${accent} 9%, var(--surface-elevated))`,
            borderColor: `color-mix(in srgb, ${accent} 18%, var(--border))`
          }}
        >
          <Icon {...NOVA_ICON_PROPS} aria-hidden="true" />
        </NovaIconContainer>
        <p className="dashboard-metric-card-detail">
          {DetailIcon ? <DetailIcon {...NOVA_ICON_PROPS} aria-hidden="true" /> : null}
          <span>{detail}</span>
        </p>
      </div>
      <div className="dashboard-metric-card-copy">
        <p>{label}</p>
        <p title={String(value)}>{value}</p>
      </div>
    </article>
  );
}

function NovaPerformanceChart() {
  return (
    <div className="dashboard-performance-chart">
      <svg className="nova-real-chart" viewBox="0 0 720 280" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="novaChartFillWebsite" x1="0" y1="40" x2="0" y2="260" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.2" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="nova-real-chart-grid">
          <path d="M42 30H700M42 82H700M42 134H700M42 186H700M42 238H700" />
          <path d="M86 20V250M180 20V250M274 20V250M368 20V250M462 20V250M556 20V250M650 20V250" />
        </g>
        <path className="nova-real-chart-area" d="M44 212 C86 184 122 198 156 170 C196 136 234 176 272 148 C318 112 356 124 396 96 C442 64 480 122 520 104 C570 82 604 118 650 76 C674 54 690 62 704 48 L704 260 L44 260 Z" />
        <path className="nova-real-chart-line nova-real-chart-line-shadow" d="M44 212 C86 184 122 198 156 170 C196 136 234 176 272 148 C318 112 356 124 396 96 C442 64 480 122 520 104 C570 82 604 118 650 76 C674 54 690 62 704 48" />
        <path className="nova-real-chart-line" d="M44 212 C86 184 122 198 156 170 C196 136 234 176 272 148 C318 112 356 124 396 96 C442 64 480 122 520 104 C570 82 604 118 650 76 C674 54 690 62 704 48" />
        <circle className="nova-real-chart-dot" cx="704" cy="48" r="5" />
      </svg>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="hero-real-app-stage" aria-label="Nova Tweaks dashboard app preview">
      <div className="hero-real-app-glow" aria-hidden="true" />
      <div className="nova-real-window app-grid-bg">
        <header className="nova-real-titlebar">
          <div className="nova-real-titlebar-brand">
            <img src={APP_LOGO_SRC} alt="" />
            <span>Nova Tweaks</span>
          </div>
          <div className="nova-real-titlebar-controls" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </header>
        <div className="nova-real-app-shell">
          <aside className="nova-real-sidebar">
            <div className="nova-real-sidebar-brand">
              <span><img src={APP_LOGO_SRC} alt="" /></span>
              <b>Nova Tweaks</b>
            </div>
            <nav aria-label="Nova Tweaks app navigation">
              {novaAppNavItems.map(([label, Icon, active]) => (
                <span className={active ? 'is-active' : ''} key={label}>
                  <Icon {...NOVA_ICON_PROPS} aria-hidden="true" />
                  {label}
                </span>
              ))}
            </nav>
          </aside>
          <main className="ui-page-shell dashboard-shell nova-dashboard-mock">
            <header className="dashboard-header">
              <div className="dashboard-header-copy">
                <h1 className="dashboard-title">
                  Hello, <span>NT_Admin</span>
                </h1>
                <p className="dashboard-subtitle">Welcome back! Everything looks good.</p>
              </div>
              <button type="button" className="dashboard-update-notes-button ui-btn ui-btn-secondary ui-btn-sm">
                <FileText {...NOVA_ICON_PROPS} aria-hidden="true" />
                <span>Update Notes</span>
              </button>
            </header>

            <section className="dashboard-top-row">
              <article className="dashboard-top-row-card dashboard-top-row-card--backup">
                <NovaBackupHeroIllustration />
                <div className="dashboard-top-row-card-content dashboard-top-row-card-content--backup">
                  <div className="dashboard-top-row-card-header">
                    <div className="dashboard-top-row-title-group">
                      <NovaDashboardTopIcon icon={DatabaseBackup} tone="accent" />
                      <h2 className="dashboard-top-row-label">Create Backup</h2>
                    </div>
                  </div>
                  <div className="dashboard-top-row-copy">
                    <p className="dashboard-top-row-headline">Backup your system</p>
                    <p className="dashboard-top-row-description">Save your current tweak state.</p>
                  </div>
                  <div className="dashboard-top-row-footer dashboard-top-row-footer--backup">
                    <button type="button" className="ui-btn ui-btn-primary dashboard-top-row-primary-button">
                      <DatabaseBackup {...NOVA_ICON_PROPS} aria-hidden="true" />
                      <span>Create Backup</span>
                    </button>
                  </div>
                </div>
              </article>

              <article className="dashboard-top-row-card dashboard-top-row-card--uptime">
                <div className="dashboard-top-row-card-content">
                  <div className="dashboard-top-row-card-header">
                    <div className="dashboard-top-row-title-group">
                      <NovaDashboardTopIcon icon={Clock} tone="accent" />
                      <h2 className="dashboard-top-row-label">System Uptime</h2>
                    </div>
                  </div>
                  <div className="dashboard-top-row-uptime-body">
                    <p className="dashboard-top-row-uptime-value">5h 24m</p>
                    <p className="dashboard-top-row-description">Running smoothly</p>
                  </div>
                  <NovaUptimeSparkline />
                </div>
              </article>

              <article className="dashboard-top-row-card dashboard-top-row-card--detection">
                <div className="dashboard-top-row-card-content">
                  <div className="dashboard-top-row-card-header">
                    <div className="dashboard-top-row-title-group">
                      <NovaDashboardTopIcon icon={MonitorCog} tone="accent" />
                      <div>
                        <h2 className="dashboard-top-row-label">System Detection</h2>
                        <p className="dashboard-top-row-subtitle">Hardware snapshot</p>
                      </div>
                    </div>
                    <button type="button" className="ui-btn ui-btn-secondary ui-btn-sm dashboard-top-row-rescan-button">
                      <RefreshCw {...NOVA_ICON_PROPS} aria-hidden="true" />
                      <span>Rescan</span>
                    </button>
                  </div>
                  <div className="dashboard-top-row-hardware-grid">
                    {novaDashboardHardwareCards.map((card) => (
                      <NovaHardwareStatusTile key={card.key} card={card} />
                    ))}
                  </div>
                </div>
              </article>
            </section>

            <div className="dashboard-main-row">
              <div className="dashboard-performance-column">
                <section className="dashboard-performance-card ui-card">
                  <div className="dashboard-performance-head">
                    <div>
                      <NovaDashboardSectionTitle icon={Activity} title="Performance Overview" />
                      <p className="dashboard-performance-subtitle">@ AMD Ryzen 7 7800X3D</p>
                    </div>
                    <div className="ui-select-shell dashboard-performance-select">
                      <select defaultValue="cpu" aria-label="Metric" className="ui-select">
                        <option value="cpu">CPU</option>
                        <option value="gpu">GPU</option>
                      </select>
                      <ChevronDown {...NOVA_ICON_PROPS} aria-hidden="true" />
                    </div>
                  </div>
                  <NovaPerformanceChart />
                  <div className="dashboard-metric-grid">
                    {novaDashboardMetrics.map((metric) => (
                      <NovaOverviewMetricCard key={metric.label} {...metric} />
                    ))}
                  </div>
                </section>
              </div>

              <aside className="dashboard-side-panel">
                <section className="dashboard-quick-actions-card ui-card">
                  <NovaDashboardSectionTitle icon={Sparkles} title="Quick Actions" />
                  <div className="dashboard-quick-action-list">
                    <button type="button" className="ui-btn ui-btn-primary">
                      <Rocket {...NOVA_ICON_PROPS} aria-hidden="true" />
                      <span>Apply Powerplan</span>
                    </button>
                    <button type="button" className="ui-btn ui-btn-secondary">
                      <Trash2 {...NOVA_ICON_PROPS} aria-hidden="true" />
                      <span>Clean Temporary Files</span>
                    </button>
                    <button type="button" className="ui-btn ui-btn-secondary">
                      <LayoutGrid {...NOVA_ICON_PROPS} aria-hidden="true" />
                      <span>Manage Startup Apps</span>
                    </button>
                    <button type="button" className="ui-btn ui-btn-secondary">
                      <MousePointer2 {...NOVA_ICON_PROPS} aria-hidden="true" />
                      <span>Reduce Input Delay</span>
                    </button>
                  </div>
                </section>

                <section className="dashboard-recent-activity-card ui-card">
                  <NovaDashboardSectionTitle icon={History} title="Recent Activity" />
                  <div className="dashboard-recent-activity-list">
                    {novaDashboardActivities.map(([label, time, color]) => (
                      <div className="dashboard-recent-activity-item" key={label}>
                        <span style={{ background: color }} aria-hidden="true" />
                        <p>{label}</p>
                        <time>{time}</time>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero section" id="top">
      <div className="energy-lines" />
      <div className="section-inner hero-inner">
        <div className="hero-copy reveal">
          <div className="badge"><ShieldCheck size={14} />Nova Tweaks for Windows 10 / 11</div>
          <h1 className="hero-title">
            <span>Boost your PC's Gaming </span>
            <span>Performance</span>
          </h1>
          <p>Increase stability, reduce input delay, clean background friction, and tune Windows for smoother gaming sessions with one clear app.</p>
          <div className="hero-actions">
            <ButtonLink href="#download" icon={Download}>Download for free</ButtonLink>
            <ButtonLink href="#nova-premium" variant="secondary" icon={Gem}>View Premium</ButtonLink>
          </div>
          <div className="hero-download-row" aria-label="Nova Tweaks launch signals">
            <span><Download size={15} />Free Windows beta</span>
            <span><ShieldCheck size={15} />Reversible workflows</span>
            <span><Activity size={15} />Animated performance examples</span>
          </div>
        </div>
        <div className="hero-visual reveal delay-1"><DashboardMockup /></div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    [Timer, 'Lower latency', 'Reduce background friction before you play.', 'Signal stable'],
    [Clock3, 'Checked states', 'Nova checks before showing actions.', 'Scan complete'],
    [FileText, 'Readable details', 'Understand what each change does.', 'Trace visible'],
    [DatabaseBackup, 'Restore options', 'Keep restore points and config saves nearby.', 'Fallback armed']
  ];
  return (
    <section className="benefit-section">
      <div className="section-inner benefit-strip">
        {items.map(([Icon, title, copy, status], index) => (
          <article className="benefit-item" style={{ '--signal-delay': `${index * 220}ms` }} key={title}>
            <span className="benefit-signal" aria-hidden="true"><Icon size={21} /></span>
            <div>
              <span className="benefit-status">{status}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </article>
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
          {features.map(([title, copy, Icon, status], index) => (
            <article className="feature-card reveal" style={{ transitionDelay: `${index * 55}ms` }} key={title}>
              <span className="feature-card-glow" aria-hidden="true" />
              <span className="feature-card-top">
                <Icon size={24} />
                <b>{status}</b>
              </span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
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
    <section className="section premium-features-section" id="premium-showcase">
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

function CinematicOptimizationVisual({ active }) {
  const graphCanvasRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const graphCanvas = graphCanvasRef.current;
    const particleCanvas = particleCanvasRef.current;
    const wrap = wrapRef.current;
    if (!graphCanvas || !particleCanvas || !wrap) return undefined;

    const graphCtx = graphCanvas.getContext('2d');
    const particleCtx = particleCanvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let graphW = 0;
    let graphH = 0;
    let particleW = 0;
    let particleH = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0;

    const particles = Array.from({ length: 78 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      r: 0.25 + Math.random() * 1.15,
      speed: 0.000025 + Math.random() * 0.000075,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.05 + Math.random() * 0.22
    }));

    function resizeCanvas(canvas, ctx, rect) {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return [rect.width, rect.height];
    }

    function resize() {
      [graphW, graphH] = resizeCanvas(graphCanvas, graphCtx, graphCanvas.getBoundingClientRect());
      [particleW, particleH] = resizeCanvas(particleCanvas, particleCtx, particleCanvas.getBoundingClientRect());
    }

    function drawGrid(ctx, x, y, w, h, time) {
      ctx.save();
      const glow = ctx.createRadialGradient(x + w * 0.65, y + h * 0.45, 0, x + w * 0.65, y + h * 0.45, w * 0.7);
      glow.addColorStop(0, 'rgba(68, 148, 220, 0.08)');
      glow.addColorStop(0.45, 'rgba(28, 72, 130, 0.025)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(x, y, w, h);

      const verticals = 16;
      const horizontals = 7;
      ctx.lineWidth = 0.8;
      for (let i = 0; i <= verticals; i += 1) {
        const px = x + (i / verticals) * w;
        ctx.strokeStyle = `rgba(120, 175, 220, ${i % 3 === 0 ? 0.095 : 0.042})`;
        ctx.beginPath();
        ctx.moveTo(px, y);
        ctx.lineTo(px, y + h);
        ctx.stroke();
      }

      for (let i = 0; i <= horizontals; i += 1) {
        const py = y + (i / horizontals) * h;
        ctx.strokeStyle = `rgba(120, 175, 220, ${i % 2 === 0 ? 0.085 : 0.038})`;
        ctx.beginPath();
        ctx.moveTo(x, py);
        ctx.lineTo(x + w, py);
        ctx.stroke();
      }

      const shimmerX = x + ((time * 0.015) % 1) * w;
      const shimmer = ctx.createLinearGradient(shimmerX - w * 0.22, y, shimmerX + w * 0.22, y);
      shimmer.addColorStop(0, 'rgba(255,255,255,0)');
      shimmer.addColorStop(0.5, 'rgba(255,255,255,0.032)');
      shimmer.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = shimmer;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    }

    function beforeValue(progress, time) {
      const base =
        0.58 +
        Math.sin(progress * 12.5 + time * 0.00185) * 0.048 +
        Math.sin(progress * 42.0 + time * 0.0055) * 0.028 +
        Math.sin(progress * 85.0 + time * 0.01) * 0.018;
      let spikes = 0;
      const centers = [0.08, 0.16, 0.24, 0.32, 0.4, 0.5, 0.58, 0.66, 0.76, 0.86, 0.94];
      for (let i = 0; i < centers.length; i += 1) {
        const center = (centers[i] + Math.sin(time * 0.00016 + i) * 0.01 + 1) % 1;
        const distance = Math.abs(progress - center);
        const spike = Math.exp(-(distance * distance) / (0.000085 + (i % 3) * 0.00003));
        spikes += spike * (0.1 + (i % 4) * 0.032);
      }
      const dip = Math.sin(progress * 28 - time * 0.0025) > 0.82 ? -0.075 : 0;
      const jitter = Math.sin(progress * 900 + time * 0.08) * 0.01;
      return Math.max(0.2, Math.min(0.88, base + spikes + dip + jitter));
    }

    function afterValue(progress, time) {
      const glide =
        0.4 +
        Math.sin(progress * 7.8 + time * 0.001) * 0.014 +
        Math.sin(progress * 16.0 - time * 0.0006) * 0.007 +
        Math.sin(progress * 3.0 + time * 0.00048) * 0.01;
      return Math.max(0.32, Math.min(0.48, glide));
    }

    function drawGraph(time) {
      graphCtx.clearRect(0, 0, graphW, graphH);
      const padX = graphW * 0.08;
      const padY = graphH * 0.16;
      const x = padX;
      const y = padY;
      const w = graphW - padX * 2;
      const h = graphH - padY * 2;
      drawGrid(graphCtx, x, y, w, h, time);

      const beforePoints = [];
      const afterPoints = [];
      const offsetBefore = (time * 0.00008) % 1;
      const offsetAfter = (time * 0.000048) % 1;
      for (let i = 0; i < 180; i += 1) {
        const progress = i / 179;
        beforePoints.push({ x: x + progress * w, y: y + beforeValue((progress + offsetBefore) % 1, time) * h });
        afterPoints.push({ x: x + progress * w, y: y + afterValue((progress + offsetAfter) % 1, time) * h });
      }

      graphCtx.save();
      const beforeFill = graphCtx.createLinearGradient(0, y + h * 0.4, 0, y + h);
      beforeFill.addColorStop(0, 'rgba(210, 73, 73, 0.06)');
      beforeFill.addColorStop(1, 'rgba(210, 73, 73, 0)');
      graphCtx.beginPath();
      graphCtx.moveTo(beforePoints[0].x, beforePoints[0].y);
      beforePoints.forEach((point) => graphCtx.lineTo(point.x, point.y));
      graphCtx.lineTo(beforePoints[beforePoints.length - 1].x, y + h);
      graphCtx.lineTo(beforePoints[0].x, y + h);
      graphCtx.closePath();
      graphCtx.fillStyle = beforeFill;
      graphCtx.fill();

      const afterFill = graphCtx.createLinearGradient(0, y + h * 0.3, 0, y + h);
      afterFill.addColorStop(0, 'rgba(82, 171, 255, 0.08)');
      afterFill.addColorStop(0.6, 'rgba(82, 171, 255, 0.02)');
      afterFill.addColorStop(1, 'rgba(82, 171, 255, 0)');
      graphCtx.beginPath();
      graphCtx.moveTo(afterPoints[0].x, afterPoints[0].y);
      for (let i = 1; i < afterPoints.length - 2; i += 1) {
        const xc = (afterPoints[i].x + afterPoints[i + 1].x) / 2;
        const yc = (afterPoints[i].y + afterPoints[i + 1].y) / 2;
        graphCtx.quadraticCurveTo(afterPoints[i].x, afterPoints[i].y, xc, yc);
      }
      graphCtx.lineTo(afterPoints[afterPoints.length - 1].x, y + h);
      graphCtx.lineTo(afterPoints[0].x, y + h);
      graphCtx.closePath();
      graphCtx.fillStyle = afterFill;
      graphCtx.fill();

      graphCtx.globalAlpha = 0.72;
      graphCtx.lineWidth = 1.4;
      graphCtx.lineCap = 'round';
      graphCtx.lineJoin = 'miter';
      graphCtx.strokeStyle = 'rgba(210, 73, 73, 0.85)';
      graphCtx.shadowColor = 'rgba(210, 73, 73, 0.25)';
      graphCtx.shadowBlur = 3;
      graphCtx.beginPath();
      graphCtx.moveTo(beforePoints[0].x, beforePoints[0].y);
      beforePoints.forEach((point) => graphCtx.lineTo(point.x, point.y));
      graphCtx.stroke();

      graphCtx.globalAlpha = 0.92;
      graphCtx.lineWidth = 1.95;
      graphCtx.lineJoin = 'round';
      graphCtx.strokeStyle = 'rgba(117, 196, 255, 0.96)';
      graphCtx.shadowColor = 'rgba(87, 178, 255, 0.35)';
      graphCtx.shadowBlur = 8;
      graphCtx.beginPath();
      graphCtx.moveTo(afterPoints[0].x, afterPoints[0].y);
      for (let i = 1; i < afterPoints.length - 2; i += 1) {
        const xc = (afterPoints[i].x + afterPoints[i + 1].x) / 2;
        const yc = (afterPoints[i].y + afterPoints[i + 1].y) / 2;
        graphCtx.quadraticCurveTo(afterPoints[i].x, afterPoints[i].y, xc, yc);
      }
      graphCtx.lineTo(afterPoints[afterPoints.length - 1].x, afterPoints[afterPoints.length - 1].y);
      graphCtx.stroke();

      graphCtx.globalAlpha = 1;
      for (let i = 0; i < 10; i += 1) {
        const progress = ((time * 0.000035) + i / 10) % 1;
        const point = afterPoints[Math.floor(progress * (afterPoints.length - 1))];
        graphCtx.fillStyle = `rgba(125, 205, 255, ${0.035 + (i % 3) * 0.02})`;
        graphCtx.beginPath();
        graphCtx.arc(point.x, point.y, 1.1 + (i % 3) * 0.4, 0, Math.PI * 2);
        graphCtx.fill();
      }

      const last = afterPoints[afterPoints.length - 1];
      const pulse = 0.45 + Math.sin(time * 0.0035) * 0.48;
      const dot = graphCtx.createRadialGradient(last.x, last.y, 0, last.x, last.y, 16 + pulse * 7);
      dot.addColorStop(0, 'rgba(166, 219, 255, 0.78)');
      dot.addColorStop(0.35, 'rgba(83, 177, 255, 0.28)');
      dot.addColorStop(1, 'rgba(83, 177, 255, 0)');
      graphCtx.globalAlpha = 0.8;
      graphCtx.fillStyle = dot;
      graphCtx.beginPath();
      graphCtx.arc(last.x, last.y, 16 + pulse * 7, 0, Math.PI * 2);
      graphCtx.fill();
      graphCtx.restore();
    }

    function drawParticles(time) {
      particleCtx.clearRect(0, 0, particleW, particleH);
      const driftX = Math.sin(time * 0.00012) * particleW * 0.014;
      const driftY = Math.cos(time * 0.0001) * particleH * 0.012;
      for (const particle of particles) {
        particle.y -= particle.speed * (1 + particle.z) * 8;
        if (particle.y < -0.05) {
          particle.y = 1.05;
          particle.x = Math.random();
        }
        const depthScale = 0.32 + particle.z * 1.08;
        const x = particle.x * particleW + Math.sin(time * 0.00018 + particle.phase) * 14 * depthScale + driftX;
        const y = particle.y * particleH + Math.cos(time * 0.00015 + particle.phase) * 8 * depthScale + driftY;
        const alpha = particle.alpha * (0.52 + Math.sin(time * 0.00085 + particle.phase) * 0.32);
        particleCtx.beginPath();
        particleCtx.fillStyle = `rgba(110, 175, 240, ${Math.max(0.012, alpha)})`;
        particleCtx.arc(x, y, particle.r * depthScale, 0, Math.PI * 2);
        particleCtx.fill();
      }
    }

    function animate(time) {
      drawParticles(time);
      drawGraph(time);
      if (!reduceMotion) frame = requestAnimationFrame(animate);
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    frame = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={`cinematic-performance-visual ${active ? 'cinematic-performance-active' : ''}`} ref={wrapRef} aria-label="Cinematic gaming optimization animation">
      <canvas ref={particleCanvasRef} className="cinematic-particle-canvas" aria-hidden="true" />
      <div className="cinematic-ambient-glow" aria-hidden="true" />
      <div className="cinematic-monitor-glow" aria-hidden="true" />
      <div className="cinematic-dashboard-wrap" aria-hidden="true">
        <div className="cinematic-under-shadow" />
        <div className="cinematic-dashboard">
          <canvas ref={graphCanvasRef} className="cinematic-graph-canvas" />
        </div>
      </div>
      <div className="cinematic-depth-accent" aria-hidden="true" />
      <div className="cinematic-vignette" aria-hidden="true" />
    </div>
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
          <h2>Boost FPS stability and eliminate avoidable stutters.</h2>
          <p>Nova focuses on the system conditions that make sessions feel consistent: cleaner background load, steadier frame pacing, and visible performance context before changes are applied.</p>
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
            <CinematicOptimizationVisual active={active} />
          </div>
          <div className="stats-grid">{stats.map((stat) => <AnimatedStat key={stat.label} stat={stat} active={active} />)}</div>
        </div>
      </div>
    </section>
  );
}

function PingDotTrack({ optimized = false }) {
  return (
    <div className={`ping-dot-track ${optimized ? 'ping-dot-track-optimized' : ''}`} aria-hidden="true">
      {Array.from({ length: optimized ? 16 : 6 }).map((_, index) => (
        <span style={{ '--dot-index': index }} key={index} />
      ))}
    </div>
  );
}

function InputLagGraph() {
  return (
    <div className="input-lag-graph" aria-label="Animated input lag comparison">
      <div className="lag-legend">
        <span><i className="legend-dot red" />Before <b>13 ms</b></span>
        <span><i className="legend-dot blue" />After <b>2 ms</b></span>
      </div>
      <svg viewBox="0 0 760 360" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="lagBeforeFill" x1="0" y1="70" x2="0" y2="330" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ff5968" stopOpacity="0.28" />
            <stop offset="1" stopColor="#ff5968" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lagAfterFill" x1="0" y1="190" x2="0" y2="330" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#7c8cff" stopOpacity="0.3" />
            <stop offset="1" stopColor="#7c8cff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="lag-grid">
          <path d="M24 70H736M24 150H736M24 230H736M24 310H736" />
        </g>
        <path className="lag-before-area" d="M24 142 98 196 174 126 252 74 348 112 424 80 492 188 566 78 642 34 716 82 760 58 760 330 24 330Z" />
        <path className="lag-after-area" d="M24 250 174 250 252 216 348 216 424 190 520 190 596 222 680 222 760 244 760 330 24 330Z" />
        <path className="lag-line lag-line-before" d="M24 142 98 196 174 126 252 74 348 112 424 80 492 188 566 78 642 34 716 82 760 58" />
        <path className="lag-line lag-line-after" d="M24 250 174 250 252 216 348 216 424 190 520 190 596 222 680 222 760 244" />
        <circle className="lag-dot lag-dot-before" cx="716" cy="82" r="6" />
        <circle className="lag-dot lag-dot-after" cx="680" cy="222" r="6" />
      </svg>
    </div>
  );
}

function LatencyShowcase() {
  return (
    <section className="section latency-section" id="latency">
      <div className="section-inner latency-grid">
        <article className="latency-panel latency-panel-ping reveal">
          <div className="latency-copy">
            <span className="eyebrow"><Wifi size={14} />Network response</span>
            <h2>Improve ping and bufferbloat.</h2>
            <p>Reduce background traffic and network friction so inputs stay responsive during real sessions.</p>
          </div>
          <div className="ping-demo">
            <div className="ping-watermark">A+</div>
            <div className="ping-row">
              <span>Without Nova</span>
              <PingDotTrack />
              <b>64 ms</b>
            </div>
            <div className="ping-row">
              <span>With Nova</span>
              <PingDotTrack optimized />
              <b>3 ms</b>
            </div>
          </div>
        </article>
        <article className="latency-panel reveal delay-1">
          <div className="latency-copy">
            <span className="eyebrow"><MousePointer2 size={14} />System latency</span>
            <h2>Reduce input lag and background load.</h2>
            <p>Disable unnecessary work, prioritize game sessions, and keep the PC focused while you play.</p>
          </div>
          <InputLagGraph />
        </article>
      </div>
    </section>
  );
}

function LandingFeatureGrid({ id, eyebrow, title, copy, features: cards, premium = false, onUpgrade }) {
  return (
    <section className={`section landing-feature-section ${premium ? 'landing-feature-section-premium' : ''}`} id={id}>
      <div className="section-inner">
        <div className="feature-showcase-head reveal">
          <div>
            <span className="eyebrow">{premium ? <Gem size={14} /> : <Sparkles size={14} />}{eyebrow}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </div>
          {premium ? (
            <button className="btn btn-primary" type="button" onClick={onUpgrade}><Gem size={17} />Upgrade to Premium</button>
          ) : (
            <a className="btn btn-secondary" href="#download"><Download size={17} />Download Free</a>
          )}
        </div>
        <div className="landing-feature-grid">
          {cards.map(({ title: cardTitle, copy: cardCopy, image, icon: Icon }, index) => (
            <article className={`landing-feature-card reveal ${index === 0 ? 'landing-feature-card-large' : ''}`} style={{ transitionDelay: `${index * 70}ms` }} key={cardTitle}>
              <div className="landing-feature-media">
                <img src={image} alt={`${cardTitle} preview`} loading="lazy" />
                <span className="landing-feature-scan" aria-hidden="true" />
              </div>
              <div className="landing-feature-copy">
                <span><Icon size={17} />{premium ? 'Premium' : 'Free'}</span>
                <h3>{cardTitle}</h3>
                <p>{cardCopy}</p>
              </div>
            </article>
          ))}
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
            {['Advanced tuning options', 'Nova Game Mode', 'Future Premium updates'].map((item) => <p key={item}><Check size={16} />{item}</p>)}
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
              <p>Account data, device identifiers, support diagnostics, logs, and payment provider IDs are processed only for product access, security, billing, and support. <a href="/privacy">Read the full privacy policy</a>.</p>
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
      ['Features', '/#features'],
      ['Performance', '/#performance'],
      ['Pricing', '/#pricing'],
      ['Download', '/#download']
    ]],
    ['Resources', [
      ['Documentation', '/#faq'],
      ['Support', `mailto:${SUPPORT_EMAIL}`],
      ['Changelog', '/#top'],
      ['Status', '/#top']
    ]],
      ['Company', [
        ['Imprint', '/#imprint'],
        ['Contact', `mailto:${CONTACT_EMAIL}`],
        ['Privacy', '/privacy'],
        ['Terms', '/#terms']
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

  if (window.location.pathname === '/privacy' || window.location.pathname === '/datenschutz') {
    return (
      <>
        <Nav showAccount={false} />
        <PrivacyPolicyPage />
        <Footer />
      </>
    );
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
        <HomePage onUpgrade={handleUpgrade} />
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
