import React, { useRef } from 'react';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Clock,
  DatabaseBackup,
  Download,
  Gamepad2,
  Gauge,
  Gem,
  HardDrive,
  LayoutGrid,
  Lock,
  MonitorCheck,
  MousePointer2,
  PlayCircle,
  Radar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Rocket,
  Settings2,
  ShieldCheck,
  Sparkles,
  Timer,
  Wifi,
  Wrench
} from 'lucide-react';
import NovaDashboardShowcase from './NovaDashboardShowcase';

const overviewTabImage = new URL('../assets/Nova_Tweaks_Website_Pictures/Overview Tab.png', import.meta.url).href;
const freeTweaksImage = new URL('../assets/Nova_Tweaks_Website_Pictures/111+ Free Tweaks.png', import.meta.url).href;
const statusDetectionImage = new URL('../assets/Nova_Tweaks_Website_Pictures/111+ Free Tweaks 2.png', import.meta.url).href;
const backupsRestoreImage = new URL('../assets/Nova_Tweaks_Website_Pictures/Backups and Restore.png', import.meta.url).href;
const appsStartupImage = new URL('../assets/Nova_Tweaks_Website_Pictures/Apps and Startup.png', import.meta.url).href;
const settingsDataToolsImage = new URL('../assets/Nova_Tweaks_Website_Pictures/Settings and Data Tools.png', import.meta.url).href;
const novaGameModeImage = new URL('../assets/Nova_Tweaks_Website_Pictures/Nova Game Mod.png', import.meta.url).href;
const runtimeTuningImage = new URL('../assets/Nova_Tweaks_Website_Pictures/Runtime Tuning.png', import.meta.url).href;
const sessionRecordingImage = new URL('../assets/Nova_Tweaks_Website_Pictures/Session Recording.png', import.meta.url).href;
const perGameProfilesImage = new URL('../assets/Nova_Tweaks_Website_Pictures/Per-Game Profiles.png', import.meta.url).href;
const latencyToolingImage = new URL('../assets/Nova_Tweaks_Website_Pictures/Latency Tooling.png', import.meta.url).href;

const freeHighlights = [
  { icon: LayoutGrid, title: 'Overview', copy: 'See hardware status, uptime, storage, and current system state before you tune anything.', image: overviewTabImage },
  { icon: Wrench, title: '111+ Free Tweaks', copy: 'Apply practical Windows tweaks for power, cleanup, network, privacy, services, and daily performance.', image: freeTweaksImage },
  { icon: Radar, title: 'Status Detection', copy: 'Check what is already enabled, what changed, and which tweaks still need attention.', image: statusDetectionImage },
  { icon: DatabaseBackup, title: 'Backups and Restore', copy: 'Create restore points and Nova backups before making bigger system changes.', image: backupsRestoreImage },
  { icon: Rocket, title: 'Apps and Startup', copy: 'Clean up installed apps, startup entries, and background load from one place.', image: appsStartupImage },
  { icon: Settings2, title: 'Settings and Data Tools', copy: 'Manage theme, language, startup behavior, cache cleanup, exports, and backup paths.', image: settingsDataToolsImage },
  { icon: Gauge, title: 'Per-Game Profiles', copy: 'Save tuning presets per game so your settings are ready when you launch.', image: perGameProfilesImage }
];

const premiumHighlights = [
  { icon: Gamepad2, title: 'Nova Game Mode', copy: 'Switch into a focused game session with the tools you need while you play.', image: novaGameModeImage },
  { icon: MousePointer2, title: 'Runtime Tuning', copy: 'Adjust priority, affinity, and fullscreen behavior for active games and processes.', image: runtimeTuningImage },
  { icon: Activity, title: 'Session Recording', copy: 'Track FPS, 1% lows, frametime, and session data for later review.', image: sessionRecordingImage },
  { icon: Timer, title: 'Advanced Tweaks', copy: 'Use deeper tuning controls for latency, timers, and responsiveness.', image: latencyToolingImage }
];

const proofStats = [
  ['Frame pacing', 'Smoother sessions', Activity],
  ['Input latency', 'Faster response', MousePointer2],
  ['Background load', 'Less overhead', Gauge],
  ['Rollback safety', 'Backups first', ShieldCheck]
];

function PlaceholderFrame({ label, tall = false }) {
  return (
    <div className={`nova-placeholder-frame ${tall ? 'nova-placeholder-tall' : ''}`} aria-label={`${label} preview`}>
      <div className="nova-placeholder-top">
        <span />
        <span />
        <span />
        <b>{label}</b>
      </div>
      <div className="nova-placeholder-screen">
        <div className="nova-placeholder-grid" aria-hidden="true" />
        <div className="nova-placeholder-module primary">
          <i />
          <strong>Nova Tweaks Preview</strong>
          <small>{label}</small>
        </div>
        <div className="nova-placeholder-row"><span /><span /><span /></div>
        <div className="nova-placeholder-row short"><span /><span /></div>
        <div className="nova-placeholder-scan" aria-hidden="true" />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="section nova-hero" id="top">
      <div className="nova-stars" aria-hidden="true" />
      <div className="section-inner nova-hero-inner">
        <div className="nova-hero-copy reveal">
          <span className="nova-kicker"><ShieldCheck size={14} />Nova Tweaks for Windows</span>
          <h1>Optimize your PC for gaming</h1>
          <div className="nova-hero-actions">
            <a className="btn btn-primary" href="#download"><Download size={17} />Download for free</a>
            <a className="btn btn-secondary" href="#dashboard-showcase"><MonitorCheck size={17} />View dashboard</a>
          </div>
          <div className="nova-hero-pills" aria-label="Nova Tweaks product signals">
            <span><BadgeCheck size={15} />Free tweak toolkit</span>
            <span><Gem size={15} />Premium Game Mode</span>
            <span><Lock size={15} />No adware</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section className="section nova-proof-section" id="performance">
      <div className="section-inner nova-proof-grid">
        <div className="nova-section-head reveal">
          <span className="nova-kicker"><Activity size={14} />Performance workflow</span>
          <h2>Tune Windows with status, safety, and clear feedback.</h2>
          <p>Nova Tweaks helps you reduce background load, apply proven tweak sets, and keep rollback options visible before you make changes.</p>
        </div>
        <div className="nova-proof-visual reveal delay-1">
          <div className="nova-trace-chart" aria-hidden="true">
            <svg viewBox="0 0 900 360" preserveAspectRatio="none">
              <path className="nova-trace-grid" d="M20 70H880M20 140H880M20 210H880M20 280H880" />
              <path className="nova-trace-before" d="M20 230 80 180 130 260 190 150 250 250 310 130 380 210 450 110 520 220 590 120 670 190 740 90 820 160 880 120" />
              <path className="nova-trace-after" d="M20 178 100 166 180 170 260 154 340 162 420 150 500 158 580 148 660 152 740 145 820 148 880 142" />
            </svg>
          </div>
          <div className="nova-proof-stats">
            {proofStats.map(([label, value, Icon]) => (
              <article key={label}>
                <Icon size={18} />
                <span>{label}</span>
                <b>{value}</b>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureGrid({ id, title, copy, items, premium = false, onUpgrade }) {
  const carouselRef = useRef(null);

  const scrollFeatures = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: direction * Math.min(carousel.clientWidth * 0.86, 520),
      behavior: 'smooth'
    });
  };

  return (
    <section className={`section nova-feature-section ${premium ? 'is-premium' : ''}`} id={id}>
      <div className="section-inner">
        <div className="nova-feature-header">
          <div className="nova-section-head reveal">
            <span className="nova-kicker">{premium ? <Gem size={14} /> : <Sparkles size={14} />}{premium ? 'Premium' : 'Free'}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
            {premium ? (
              <button className="btn btn-primary" type="button" onClick={onUpgrade}><Gem size={17} />Unlock Premium</button>
            ) : (
              <a className="btn btn-secondary" href="#download"><Download size={17} />Start free</a>
            )}
          </div>
          <div className="nova-feature-carousel-actions reveal delay-1" aria-label={`${premium ? 'Premium' : 'Free'} feature carousel controls`}>
            <button type="button" onClick={() => scrollFeatures(-1)} aria-label="Scroll feature cards left">
              <ChevronLeft size={19} />
            </button>
            <button type="button" onClick={() => scrollFeatures(1)} aria-label="Scroll feature cards right">
              <ChevronRight size={19} />
            </button>
          </div>
        </div>
        <div className="nova-feature-grid" ref={carouselRef} tabIndex={0} aria-label={`${premium ? 'Premium' : 'Free'} feature screenshots`}>
          {items.map(({ icon: Icon, title: itemTitle, copy: itemCopy, image }, index) => (
            <article className="nova-feature-card reveal" style={{ transitionDelay: `${index * 60}ms` }} key={itemTitle}>
              <div className="nova-feature-icon"><Icon size={20} /></div>
              {image ? (
                <a
                  className="nova-feature-image-frame"
                  href={image}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${itemTitle} screenshot`}
                >
                  <img src={image} alt={`${itemTitle} tab screenshot`} loading="lazy" />
                </a>
              ) : (
                <PlaceholderFrame label={itemTitle} />
              )}
              <div className="nova-feature-copy">
                <h3>{itemTitle}</h3>
                <p>{itemCopy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConversionBridge({ onUpgrade }) {
  return (
    <section className="section nova-bridge-section">
      <div className="section-inner nova-bridge-panel reveal">
        <div>
          <span className="nova-kicker"><RefreshCw size={14} />Start tuning</span>
          <h2>Clean up Windows, reduce background load, and keep control.</h2>
          <p>Download Nova Tweaks for the free toolkit, then upgrade when you want the Premium game-session layer.</p>
        </div>
        <div className="nova-bridge-actions">
          <a className="btn btn-primary" href="#download"><Download size={17} />Download free</a>
          <button className="btn btn-secondary" type="button" onClick={onUpgrade}>Premium checkout<ArrowRight size={17} /></button>
        </div>
      </div>
    </section>
  );
}

function HomePage({ onUpgrade }) {
  return (
    <>
      <HeroSection />
      <NovaDashboardShowcase />
      <ProofSection />
      <FeatureGrid
        id="nova-free"
        title="Powerful PC tuning, free from the start."
        copy="Start with the core Nova Tweaks toolkit: system overview, tweak presets, status checks, backups, startup cleanup, settings tools, and per-game profiles."
        items={freeHighlights}
      />
      <FeatureGrid
        id="nova-premium"
        title="Premium adds the game-session tools."
        copy="Unlock Game Mode, live runtime tuning, session recording, and advanced tweak controls for deeper performance work."
        items={premiumHighlights}
        premium
        onUpgrade={onUpgrade}
      />
      <ConversionBridge onUpgrade={onUpgrade} />
    </>
  );
}

export default HomePage;
