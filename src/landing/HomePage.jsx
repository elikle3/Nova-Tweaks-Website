import React, { useRef } from 'react';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bell,
  Clock,
  DatabaseBackup,
  Download,
  Gamepad2,
  Gauge,
  Gem,
  LayoutGrid,
  Lock,
  MousePointer2,
  Play,
  PlayCircle,
  Plus,
  Radar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Rocket,
  Settings2,
  ShieldCheck,
  Sparkles,
  Timer,
  Wrench,
  Zap
} from 'lucide-react';
import HeroTypewriterTitle from '../components/HeroTypewriterTitle';

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

const reelFpsImage = new URL('../assets/Nova_Tweaks_Website_Pictures/reels/reel-fps.png', import.meta.url).href;
const reelLatencyImage = new URL('../assets/Nova_Tweaks_Website_Pictures/reels/reel-latency.png', import.meta.url).href;
const reelDebloatImage = new URL('../assets/Nova_Tweaks_Website_Pictures/reels/reel-debloat.png', import.meta.url).href;
const reelRulesImage = new URL('../assets/Nova_Tweaks_Website_Pictures/reels/reel-rules.png', import.meta.url).href;

const freeHighlights = [
  { icon: LayoutGrid, title: 'Overview', copy: 'See hardware, uptime, storage, and live system load before you change a single setting.', image: overviewTabImage },
  { icon: Wrench, title: '111+ Free Tweaks', copy: 'Apply proven Windows tweaks for power, cleanup, network, privacy, services, and everyday performance.', image: freeTweaksImage },
  { icon: Radar, title: 'Status Detection', copy: 'Nova reads the current state first, so you always know what is active and what still needs attention.', image: statusDetectionImage },
  { icon: DatabaseBackup, title: 'Backups & Restore', copy: 'Create restore points and Nova config saves before bigger changes, then roll back in one click.', image: backupsRestoreImage },
  { icon: Rocket, title: 'Apps & Startup', copy: 'Cut clutter from installed apps, startup entries, and background load from a single view.', image: appsStartupImage },
  { icon: Settings2, title: 'Settings & Data Tools', copy: 'Control theme, language, startup behavior, cache cleanup, exports, and backup paths.', image: settingsDataToolsImage },
  { icon: Gauge, title: 'Per-Game Profiles', copy: 'Save tuning presets per game so the right settings load the moment you launch.', image: perGameProfilesImage }
];

const premiumHighlights = [
  { icon: Gamepad2, title: 'Nova Game Mode', copy: 'Drop into a focused game session with the exact tuning your setup needs, then restore afterwards.', image: novaGameModeImage },
  { icon: MousePointer2, title: 'Runtime Tuning', copy: 'Adjust priority, affinity, and fullscreen behavior for the game or process running right now.', image: runtimeTuningImage },
  { icon: Activity, title: 'Session Recording', copy: 'Capture FPS, 1% lows, frametime, and session data so you can measure what actually improved.', image: sessionRecordingImage },
  { icon: Timer, title: 'Advanced Tweaks', copy: 'Reach deeper controls for latency, timers, and responsiveness when defaults are not enough.', image: latencyToolingImage }
];

const heroSignals = [
  { icon: Wrench, label: '111+ tweaks' },
  { icon: ShieldCheck, label: 'Backups & restore' },
  { icon: Zap, label: 'Rule automation' },
  { icon: Lock, label: 'No adware' }
];

const heroPreviewStats = [
  { icon: MousePointer2, label: 'Input latency', value: 'Reduced' },
  { icon: Gauge, label: 'Background load', value: 'Lower' }
];

const proofStats = [
  ['Frame pacing', 'Smoother sessions', Activity],
  ['Input latency', 'Faster response', MousePointer2],
  ['Background load', 'Less overhead', Gauge],
  ['Rollback safety', 'Backups first', ShieldCheck]
];

const ruleCapabilities = [
  { icon: Radar, title: 'React to activity', copy: 'Trigger tuning when a game launches, a process starts, or the system changes state.' },
  { icon: Activity, title: 'Match conditions', copy: 'Check power source, load, or hardware state before an automation runs.' },
  { icon: Play, title: 'Run actions automatically', copy: 'Apply presets, clean temporary files, or switch profiles without lifting a finger.' }
];

const exampleRules = [
  { when: 'A game launches', then: 'Apply Game Mode preset', icon: Gamepad2 },
  { when: 'On AC power', then: 'Switch to max performance', icon: Zap },
  { when: 'Every startup', then: 'Clean temporary files', icon: RefreshCw }
];

const shortFormGuides = [
  { title: 'Boost your FPS', tag: 'Performance', duration: '0:48', image: reelFpsImage },
  { title: 'Cut input latency', tag: 'Latency', duration: '0:37', image: reelLatencyImage },
  { title: 'Debloat Windows', tag: 'Cleanup', duration: '0:52', image: reelDebloatImage },
  { title: 'Automate with Rules', tag: 'Premium', duration: '1:04', image: reelRulesImage }
];

const HERO_TITLE = 'Optimize and automate your Windows PC';

function HeroSection() {
  return (
    <section className="section nova-hero" id="top">
      <div className="section-inner nova-hero-inner">
        <div className="nova-hero-copy reveal" data-typewriter-scope>
          <span className="nova-kicker hero-intro-secondary nova-hero-kicker"><ShieldCheck size={14} />Windows optimization &amp; automation</span>
          <HeroTypewriterTitle text={HERO_TITLE} characterDelay={38} />
          <p className="nova-hero-lead hero-intro-secondary hero-intro-delay-1">
            Nova Tweaks is a Windows tuning suite that clears background load, lowers input latency,
            and keeps your system fast — with backups, one-click restore, and rules that automate the work for you.
          </p>
          <div className="nova-hero-actions hero-intro-secondary hero-intro-delay-1">
            <a className="btn btn-primary" href="#download"><Download size={17} />Download for free</a>
            <a className="btn btn-secondary" href="#automation"><Sparkles size={17} />See automation</a>
          </div>
          <ul className="nova-hero-signals hero-intro-secondary hero-intro-delay-2" aria-label="Nova Tweaks highlights">
            {heroSignals.map(({ icon: Icon, label }) => (
              <li key={label}><Icon size={15} />{label}</li>
            ))}
          </ul>
        </div>
        <div className="nova-hero-preview reveal delay-1 hero-intro-secondary hero-intro-delay-2">
          <div className="nova-window">
            <div className="nova-window-bar">
              <span className="nova-window-dot" />
              <span className="nova-window-dot" />
              <span className="nova-window-dot" />
              <b>Nova Tweaks — System Overview</b>
            </div>
            <div className="nova-window-body">
              <img src={overviewTabImage} alt="Nova Tweaks system overview showing CPU, GPU, memory, and storage" loading="eager" />
            </div>
          </div>
          <div className="nova-hero-preview-stats" aria-hidden="true">
            {heroPreviewStats.map(({ icon: Icon, label, value }) => (
              <div className="nova-hero-preview-chip" key={label}>
                <Icon size={16} />
                <span>{label}</span>
                <b>{value}</b>
              </div>
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
      <div className="section-inner" data-typewriter-scope>
        <div className="nova-feature-header">
          <div className="nova-section-head reveal">
            <span className="nova-kicker hero-intro-secondary">{premium ? <Gem size={14} /> : <Sparkles size={14} />}{premium ? 'Premium' : 'Free toolkit'}</span>
            <HeroTypewriterTitle as="h2" text={title} startOnView hideNavigation={false} />
            <p className="hero-intro-secondary hero-intro-delay-1">{copy}</p>
            {premium ? (
              <button className="btn btn-primary hero-intro-secondary hero-intro-delay-2" type="button" onClick={onUpgrade}><Gem size={17} />Unlock Premium</button>
            ) : (
              <a className="btn btn-secondary hero-intro-secondary hero-intro-delay-2" href="#download"><Download size={17} />Start free</a>
            )}
          </div>
          <div className="nova-feature-carousel-actions reveal delay-1 hero-intro-secondary hero-intro-delay-2" aria-label={`${premium ? 'Premium' : 'Free'} feature carousel controls`}>
            <button type="button" onClick={() => scrollFeatures(-1)} aria-label="Scroll feature cards left">
              <ChevronLeft size={19} />
            </button>
            <button type="button" onClick={() => scrollFeatures(1)} aria-label="Scroll feature cards right">
              <ChevronRight size={19} />
            </button>
          </div>
        </div>
        <div className="nova-feature-grid hero-intro-secondary hero-intro-delay-2" ref={carouselRef} tabIndex={0} aria-label={`${premium ? 'Premium' : 'Free'} feature screenshots`}>
          {items.map(({ icon: Icon, title: itemTitle, copy: itemCopy, image }, index) => (
            <article className="nova-feature-card reveal" style={{ transitionDelay: `${index * 60}ms` }} key={itemTitle}>
              <div className="nova-feature-icon"><Icon size={20} /></div>
              <a
                className="nova-feature-image-frame"
                href={image}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${itemTitle} screenshot`}
              >
                <img src={image} alt={`${itemTitle} tab screenshot`} loading="lazy" />
              </a>
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

function AutomationRules({ onUpgrade }) {
  return (
    <section className="section nova-automation-section" id="automation">
      <div className="section-inner nova-automation-grid" data-typewriter-scope>
        <div className="nova-automation-copy reveal">
          <span className="nova-kicker hero-intro-secondary"><Zap size={14} />Premium automation</span>
          <HeroTypewriterTitle as="h2" text="Automate your PC with Rules." startOnView />
          <p className="hero-intro-secondary hero-intro-delay-1">
            Rules live in the Premium Automation tab. Create conditions that automatically react to activity,
            hardware state, or events — so your PC tunes itself instead of waiting on you.
          </p>
          <ul className="nova-automation-list hero-intro-secondary hero-intro-delay-1">
            {ruleCapabilities.map(({ icon: Icon, title, copy }) => (
              <li key={title}>
                <span className="nova-automation-list-icon"><Icon size={18} /></span>
                <span>
                  <b>{title}</b>
                  {copy}
                </span>
              </li>
            ))}
          </ul>
          <button className="btn btn-primary hero-intro-secondary hero-intro-delay-2" type="button" onClick={onUpgrade}>
            <Gem size={17} />Unlock automation
          </button>
        </div>

        <div className="nova-automation-visual reveal delay-1 hero-intro-secondary hero-intro-delay-2" aria-hidden="true">
          <div className="nova-rule-builder">
            <div className="nova-rule-builder-head">
              <span className="nova-rule-badge"><Zap size={14} />Active rule</span>
              <span className="nova-rule-toggle"><i />On</span>
            </div>
            <div className="nova-rule-flow">
              <div className="nova-rule-step">
                <span className="nova-rule-step-label"><Radar size={14} />When</span>
                <p>A game launches</p>
              </div>
              <div className="nova-rule-connector"><ChevronRight size={16} /></div>
              <div className="nova-rule-step">
                <span className="nova-rule-step-label"><Activity size={14} />If</span>
                <p>Background load is high</p>
              </div>
              <div className="nova-rule-connector"><ChevronRight size={16} /></div>
              <div className="nova-rule-step is-action">
                <span className="nova-rule-step-label"><Play size={14} />Then</span>
                <p>Apply Game Mode preset</p>
              </div>
            </div>
          </div>

          <ul className="nova-rule-examples">
            {exampleRules.map(({ when, then, icon: Icon }) => (
              <li key={when}>
                <span className="nova-rule-example-icon"><Icon size={16} /></span>
                <span className="nova-rule-example-copy">
                  <b>When {when.toLowerCase()}</b>
                  <span>{then}</span>
                </span>
                <ArrowRight size={15} />
              </li>
            ))}
            <li className="nova-rule-add">
              <span className="nova-rule-example-icon"><Plus size={16} /></span>
              <span className="nova-rule-example-copy"><b>New rule</b><span>Build your own automation</span></span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ShortFormGuides() {
  return (
    <section className="section nova-reels-section" id="guides">
      <div className="section-inner" data-typewriter-scope>
        <div className="nova-section-head nova-reels-head reveal">
          <span className="nova-kicker hero-intro-secondary"><PlayCircle size={14} />Short-form guides</span>
          <HeroTypewriterTitle as="h2" text="Learn every tweak in under a minute." startOnView />
          <p className="hero-intro-secondary hero-intro-delay-1">
            Follow along with bite-sized video guides for the tweaks that matter most — vertical, fast, and made for how you actually watch.
          </p>
        </div>
        <div className="nova-reels-row hero-intro-secondary hero-intro-delay-2">
          {shortFormGuides.map(({ title, tag, duration, image }, index) => (
            <article className="nova-reel-card reveal" style={{ transitionDelay: `${index * 70}ms` }} key={title}>
              <div className="nova-reel-media">
                <img src={image} alt={`${title} short guide thumbnail`} loading="lazy" />
                <span className="nova-reel-tag">{tag}</span>
                <span className="nova-reel-duration"><Clock size={12} />{duration}</span>
                <span className="nova-reel-play" aria-hidden="true"><Play size={22} /></span>
              </div>
              <h3>{title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section className="section nova-proof-section" id="performance">
      <div className="section-inner nova-proof-grid" data-typewriter-scope>
        <div className="nova-section-head reveal">
          <span className="nova-kicker hero-intro-secondary"><Activity size={14} />Measured results</span>
          <HeroTypewriterTitle as="h2" text="Tune with status, safety, and clear feedback." startOnView hideNavigation={false} />
          <p className="hero-intro-secondary hero-intro-delay-1">Nova reduces background load, applies proven tweak sets, and keeps rollback options in view before you make a change.</p>
        </div>
        <div className="nova-proof-visual reveal delay-1 hero-intro-secondary hero-intro-delay-2">
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

function ConversionBridge({ onUpgrade }) {
  return (
    <section className="section nova-bridge-section">
      <div className="section-inner nova-bridge-panel reveal" data-typewriter-scope>
        <div>
          <span className="nova-kicker hero-intro-secondary"><RefreshCw size={14} />Get started</span>
          <HeroTypewriterTitle as="h2" text="Clean up Windows, then let Nova keep it that way." startOnView hideNavigation={false} />
          <p className="hero-intro-secondary hero-intro-delay-1">Download the free toolkit today, then upgrade to Premium for Game Mode, runtime tuning, and rule-based automation.</p>
        </div>
        <div className="nova-bridge-actions hero-intro-secondary hero-intro-delay-2">
          <a className="btn btn-primary" href="#download"><Download size={17} />Download free</a>
          <button className="btn btn-secondary" type="button" onClick={onUpgrade}>Get Premium<ArrowRight size={17} /></button>
        </div>
      </div>
    </section>
  );
}

function HomePage({ onUpgrade }) {
  return (
    <>
      <HeroSection />
      <FeatureGrid
        id="nova-free"
        title="Everything you need to tune Windows — free."
        copy="Start with the full Nova toolkit: system overview, 111+ tweaks, status checks, backups, startup cleanup, settings tools, and per-game profiles."
        items={freeHighlights}
      />
      <AutomationRules onUpgrade={onUpgrade} />
      <FeatureGrid
        id="nova-premium"
        title="Premium unlocks the game-session layer."
        copy="Go beyond one-off tweaks with Game Mode, live runtime tuning, session recording, and advanced controls for serious performance work."
        items={premiumHighlights}
        premium
        onUpgrade={onUpgrade}
      />
      <ShortFormGuides />
      <ProofSection />
      <ConversionBridge onUpgrade={onUpgrade} />
    </>
  );
}

export default HomePage;
