import React from 'react';
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

const freeHighlights = [
  { icon: LayoutGrid, title: 'Dashboard Overview', copy: 'A live starting point for hardware status, quick actions, recent activity, and monitoring.' },
  { icon: Wrench, title: '111+ Free Tweaks', copy: 'Current tweak configs are free: power, cleanup, network, privacy, services, and Windows behavior.' },
  { icon: Radar, title: 'Status Detection', copy: 'Check current state before changing settings so users do not apply tweaks blindly.' },
  { icon: DatabaseBackup, title: 'Backups and Restore', copy: 'Create Nova config saves and Windows restore points before larger optimization passes.' },
  { icon: Rocket, title: 'Apps and Startup', copy: 'Review installed apps, startup entries, and cleanup actions in one practical workflow.' },
  { icon: Settings2, title: 'Settings and Data Tools', copy: 'Theme, language, startup behavior, cache cleanup, import/export, and backup location controls.' }
];

const premiumHighlights = [
  { icon: Gamepad2, title: 'Nova Game Mode', copy: 'Premium game-session workspace for detected games and focused tuning controls.' },
  { icon: MousePointer2, title: 'Runtime Tuning', copy: 'Priority, affinity, fullscreen optimization, and session behavior controls while a game is active.' },
  { icon: Activity, title: 'Session Recording', copy: 'Capture FPS, 1% low, frametime, and session state for later review.' },
  { icon: Gauge, title: 'Per-Game Profiles', copy: 'Premium profiles keep tuning choices attached to individual games.' },
  { icon: Timer, title: 'Latency Tooling', copy: 'Advanced timer and responsiveness workflows built around deliberate Premium controls.' },
  { icon: Sparkles, title: 'Future Premium Updates', copy: 'Access upcoming premium workflows as Nova expands its performance toolset.' }
];

const proofStats = [
  ['Frame pacing', 'Stable trace', Activity],
  ['Input delay', 'Lower friction', MousePointer2],
  ['Background load', 'Cleaner sessions', Gauge],
  ['Rollback safety', 'Always visible', ShieldCheck]
];

function PlaceholderFrame({ label, tall = false }) {
  return (
    <div className={`nova-placeholder-frame ${tall ? 'nova-placeholder-tall' : ''}`} aria-label={`${label} final screenshot placeholder`}>
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
          <strong>Final screenshot slot</strong>
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
          <p>
            Nova Tweaks brings Windows optimization, rollback safety, monitoring, and Premium game-session tooling into one modern desktop app.
          </p>
          <div className="nova-hero-actions">
            <a className="btn btn-primary" href="#download"><Download size={17} />Download for free</a>
            <a className="btn btn-secondary" href="#dashboard-showcase"><MonitorCheck size={17} />View dashboard</a>
          </div>
          <div className="nova-hero-pills" aria-label="Nova Tweaks product signals">
            <span><BadgeCheck size={15} />Free tweak library</span>
            <span><Gem size={15} />Premium Game Mode</span>
            <span><Lock size={15} />No tracking embeds</span>
          </div>
        </div>
        <div className="nova-hero-visual reveal delay-1">
          <PlaceholderFrame label="Hero product render" tall />
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
          <span className="nova-kicker"><Activity size={14} />Performance proof layout</span>
          <h2>Animated examples that feel like a tuning tool, not a template.</h2>
          <p>These modules stay as designed placeholders until final captures are produced, while the motion and section rhythm are already production-ready.</p>
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
  return (
    <section className={`section nova-feature-section ${premium ? 'is-premium' : ''}`} id={id}>
      <div className="section-inner">
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
        <div className="nova-feature-grid">
          {items.map(({ icon: Icon, title: itemTitle, copy: itemCopy }, index) => (
            <article className="nova-feature-card reveal" style={{ transitionDelay: `${index * 60}ms` }} key={itemTitle}>
              <div className="nova-feature-icon"><Icon size={20} /></div>
              <PlaceholderFrame label={itemTitle} />
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
          <span className="nova-kicker"><RefreshCw size={14} />Ready for final captures</span>
          <h2>The layout is built for your future screenshots.</h2>
          <p>Every placeholder is intentionally framed as a final asset slot, so replacing it later means swapping content, not redesigning the page.</p>
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
        title="Everything most users need starts free."
        copy="The current tweak configs are not Premium-gated. The free story should feel honest: powerful baseline tuning, readable status, backups, apps, settings, and monitoring."
        items={freeHighlights}
      />
      <FeatureGrid
        id="nova-premium"
        title="Premium is the game-session layer."
        copy="Premium is positioned around actual locked desktop functionality: Game Mode, runtime tuning, session recording, per-game profiles, telemetry, and future Premium updates."
        items={premiumHighlights}
        premium
        onUpgrade={onUpgrade}
      />
      <ConversionBridge onUpgrade={onUpgrade} />
    </>
  );
}

export default HomePage;
