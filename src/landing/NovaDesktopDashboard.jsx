import { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  CircleCheck,
  ChevronDown,
  CircuitBoard,
  Clock,
  Cpu,
  DatabaseBackup,
  FileText,
  Gpu,
  HardDrive,
  History,
  LayoutGrid,
  MemoryStick,
  MonitorCog,
  MousePointer2,
  RefreshCw,
  Rocket,
  Sparkles,
  Thermometer,
  Trash2,
  Wifi
} from 'lucide-react';
import { IconContainer, PageSection, PageShell } from './ui';

const HISTORY_LIMIT = 60;
const DETAIL_BIT_UNITS = [
  { threshold: 1_000_000_000_000, suffix: 'Tbit/s', fractionDigits: 2 },
  { threshold: 1_000_000_000, suffix: 'Gbit/s', fractionDigits: 2 },
  { threshold: 1_000_000, suffix: 'Mbit/s', fractionDigits: 2 },
  { threshold: 1_000, suffix: 'kbit/s', fractionDigits: 1 }
];
const MOTHERBOARD_VENDOR_HINTS = [
  'Micro-Star International Co., Ltd.',
  'ASUSTeK COMPUTER INC.',
  'Gigabyte Technology Co., Ltd.',
  'ASRock',
  'BIOSTAR Group',
  'EVGA',
  'Dell Inc.',
  'Hewlett-Packard',
  'HP',
  'LENOVO',
  'Acer',
  'MSI',
  'ASUS',
  'Gigabyte'
];
const LUCIDE_ICON_PROPS = {
  size: 18,
  strokeWidth: 1.8
};

function createEmptySystemDetection() {
  return {
    updatedAt: 0,
    cpu: {
      detected: false,
      name: ''
    },
    gpu: {
      detected: false,
      primary: '',
      secondary: [],
      all: []
    },
    ram: {
      detected: false,
      totalBytes: null,
      label: '',
      type: '',
      speedMTs: null,
      manufacturer: '',
      partNumber: '',
      moduleCount: 0
    },
    motherboard: {
      detected: false,
      name: ''
    }
  };
}

function normalizeTextValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeStringArray(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  const seen = new Set();
  const normalized = [];
  for (const value of values) {
    const text = normalizeTextValue(value);
    if (!text) {
      continue;
    }

    const key = text.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push(text);
  }

  return normalized;
}

function normalizeSystemDetection(payload) {
  const fallback = createEmptySystemDetection();
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  const cpuName = normalizeTextValue(payload?.cpu?.name);
  const gpuPrimary = normalizeTextValue(payload?.gpu?.primary);
  const gpuSecondary = normalizeStringArray(payload?.gpu?.secondary);
  const gpuAll = normalizeStringArray(payload?.gpu?.all);
  const ramLabel = normalizeTextValue(payload?.ram?.label);
  const ramTotalBytes = Number(payload?.ram?.totalBytes);
  const ramType = normalizeTextValue(payload?.ram?.type);
  const ramSpeedMTs = Number(payload?.ram?.speedMTs);
  const ramManufacturer = normalizeTextValue(payload?.ram?.manufacturer);
  const ramPartNumber = normalizeTextValue(payload?.ram?.partNumber);
  const ramModuleCount = Number(payload?.ram?.moduleCount);
  const motherboardName = normalizeTextValue(payload?.motherboard?.name);

  return {
    updatedAt: Number(payload?.updatedAt) || Date.now(),
    cpu: {
      detected: Boolean(payload?.cpu?.detected) && Boolean(cpuName),
      name: cpuName
    },
    gpu: {
      detected: Boolean(payload?.gpu?.detected) && Boolean(gpuPrimary),
      primary: gpuPrimary,
      secondary: gpuSecondary.filter((name) => name.toLowerCase() !== gpuPrimary.toLowerCase()),
      all: gpuAll.length ? gpuAll : [gpuPrimary, ...gpuSecondary].filter(Boolean)
    },
    ram: {
      detected: Boolean(payload?.ram?.detected) && Number.isFinite(ramTotalBytes) && ramTotalBytes > 0,
      totalBytes: Number.isFinite(ramTotalBytes) && ramTotalBytes > 0 ? ramTotalBytes : null,
      label: ramLabel,
      type: ramType,
      speedMTs: Number.isFinite(ramSpeedMTs) && ramSpeedMTs > 0 ? Math.round(ramSpeedMTs) : null,
      manufacturer: ramManufacturer,
      partNumber: ramPartNumber,
      moduleCount: Number.isFinite(ramModuleCount) && ramModuleCount > 0 ? Math.trunc(ramModuleCount) : 0
    },
    motherboard: {
      detected: Boolean(payload?.motherboard?.detected) && Boolean(motherboardName),
      name: motherboardName
    }
  };
}

function clampPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 0;
  }
  return Math.max(0, Math.min(100, number));
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    minute: '2-digit',
    second: '2-digit'
  });
}

function formatPercent(value) {
  return `${Math.round(value)}%`;
}

function formatGigabytes(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    return '0.00 GB';
  }
  return `${number.toFixed(2)} GB`;
}

function normalizeTemperature(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > 150) {
    return null;
  }

  return number;
}

function formatTemperature(value, locale, fallback) {
  const number = normalizeTemperature(value);
  return number === null
    ? fallback
    : `${formatLocalizedNumber(number, locale, 1)} \u00b0C`;
}

function formatRamBytes(value, locale) {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '';
  }

  const gib = bytes / (1024 ** 3);
  if (gib >= 100) {
    return `${formatLocalizedNumber(gib, locale, 0)} GB`;
  }

  if (gib >= 10) {
    return `${formatLocalizedNumber(gib, locale, 1)} GB`;
  }

  return `${formatLocalizedNumber(gib, locale, 2)} GB`;
}

function formatRamTypeLabel(value, t) {
  const type = normalizeTextValue(value);
  if (!type) {
    return '';
  }

  const normalized = type.toLowerCase();
  if (normalized === 'mixed') {
    return t('dashboard.systemDetection.ramType.mixed');
  }

  if (normalized === 'unknown') {
    return t('dashboard.systemDetection.ramType.unknown');
  }

  return type;
}

function buildRamFallbackLabel(ram, locale, t) {
  if (!ram || typeof ram !== 'object') {
    return '';
  }

  const segments = [];
  const capacityLabel = formatRamBytes(ram.totalBytes, locale);
  const typeLabel = formatRamTypeLabel(ram.type, t);
  const speedMTs = Number(ram.speedMTs);
  const speedLabel = Number.isFinite(speedMTs) && speedMTs > 0 ? `${formatLocalizedNumber(speedMTs, locale, 0)} MT/s` : '';
  const vendorLabel = normalizeTextValue(ram.manufacturer) || normalizeTextValue(ram.partNumber);

  if (capacityLabel) {
    segments.push(capacityLabel);
  }

  if (typeLabel) {
    segments.push(typeLabel);
  }

  if (speedLabel) {
    segments.push(speedLabel);
  }

  if (vendorLabel) {
    segments.push(vendorLabel);
  }

  return segments.join(' \u00b7 ');
}

function normalizeHardwareName(value) {
  return normalizeTextValue(value).replace(/\s+/g, ' ');
}

function splitCpuCardLines(value) {
  const normalized = normalizeHardwareName(value);
  if (!normalized) {
    return { primary: '', secondary: '' };
  }

  const coreSuffixMatch = normalized.match(/\s+(\d+\s*[- ]?Core Processor)$/i);
  if (coreSuffixMatch && coreSuffixMatch.index > 0) {
    return {
      primary: normalized.slice(0, coreSuffixMatch.index).trim(),
      secondary: normalizeHardwareName(coreSuffixMatch[1])
    };
  }

  const clockMatch = normalized.match(/\s+@\s+([0-9.]+\s*GHz)$/i);
  if (clockMatch && clockMatch.index > 0) {
    return {
      primary: normalized.slice(0, clockMatch.index).trim(),
      secondary: `@ ${normalizeHardwareName(clockMatch[1])}`
    };
  }

  const commaIndex = normalized.indexOf(',');
  if (commaIndex > 0 && commaIndex < normalized.length - 1 && normalized.length > 48) {
    return {
      primary: normalized.slice(0, commaIndex).trim(),
      secondary: normalized.slice(commaIndex + 1).trim()
    };
  }

  return { primary: normalized, secondary: '' };
}

function splitMotherboardCardLines(value) {
  const normalized = normalizeHardwareName(value);
  if (!normalized) {
    return { primary: '', secondary: '' };
  }

  const lowerName = normalized.toLowerCase();
  for (const hint of MOTHERBOARD_VENDOR_HINTS) {
    const vendor = normalizeHardwareName(hint);
    if (!vendor) {
      continue;
    }

    const lowerVendor = vendor.toLowerCase();
    const vendorIndex = lowerName.indexOf(lowerVendor);
    if (vendorIndex === -1) {
      continue;
    }

    if (vendorIndex === 0) {
      const model = normalized.slice(vendor.length).replace(/^[,\-/| ]+/, '').trim();
      if (model) {
        return { primary: model, secondary: vendor };
      }
      break;
    }

    const leadingModel = normalized.slice(0, vendorIndex).replace(/[,\-/| ]+$/, '').trim();
    if (leadingModel) {
      return { primary: leadingModel, secondary: vendor };
    }
  }

  const pipeSplit = normalized.split(/\s*\|\s*/).map((part) => normalizeHardwareName(part)).filter(Boolean);
  if (pipeSplit.length >= 2) {
    return { primary: pipeSplit[0], secondary: pipeSplit.slice(1).join(' | ') };
  }

  return { primary: normalized, secondary: '' };
}

function buildRamCardLines(ram, locale, t) {
  const capacityLabel = formatRamBytes(ram?.totalBytes, locale);
  const typeLabel = formatRamTypeLabel(ram?.type, t);
  const speedNumber = Number(ram?.speedMTs);
  const speedLabel = Number.isFinite(speedNumber) && speedNumber > 0 ? `${formatLocalizedNumber(speedNumber, locale, 0)} MT/s` : '';
  const vendorLabel = normalizeHardwareName(ram?.manufacturer) || normalizeHardwareName(ram?.partNumber);

  let primary = [capacityLabel, typeLabel].filter(Boolean).join(' ');
  let secondary = [speedLabel, vendorLabel].filter(Boolean).join(' \u00b7 ');

  if (!primary || !secondary) {
    const fallbackLabel = normalizeHardwareName(ram?.label) || buildRamFallbackLabel(ram, locale, t);
    if (fallbackLabel) {
      const fallbackParts = fallbackLabel
        .split(/\s*(?:\u00b7|\|)\s*/u)
        .map((part) => normalizeHardwareName(part))
        .filter(Boolean);

      if (!primary && fallbackParts.length > 0) {
        primary = fallbackParts.shift() || '';
      }

      if (!secondary && fallbackParts.length > 0) {
        secondary = fallbackParts.join(' \u00b7 ');
      }

      if (!primary && !secondary) {
        primary = fallbackLabel;
      }
    }
  }

  return { primary, secondary };
}
function normalizeRateBytes(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    return 0;
  }
  return number;
}

function formatLocalizedNumber(value, locale, maximumFractionDigits) {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits
  }).format(value);
}

function formatRate(value, locale) {
  const number = normalizeRateBytes(value);
  return formatRateBitsDetailed(number, locale);
}

function formatRateBitsDetailed(value, locale) {
  const bytesPerSecond = normalizeRateBytes(value);
  if (bytesPerSecond <= 0) {
    return '0 bit/s';
  }

  const bitsPerSecond = bytesPerSecond * 8;

  for (const { threshold, suffix, fractionDigits } of DETAIL_BIT_UNITS) {
    if (bitsPerSecond >= threshold) {
      return `${formatLocalizedNumber(bitsPerSecond / threshold, locale, fractionDigits)} ${suffix}`;
    }
  }

  return `${formatLocalizedNumber(bitsPerSecond, locale, 0)} bit/s`;
}

function normalizeMetrics(metrics) {
  const memoryNumber = Number(metrics?.memoryUsedGB ?? metrics?.memoryUsage ?? metrics?.memory);

  return {
    cpu: clampPercent(metrics?.cpu ?? metrics?.cpuLoad),
    cpuTemp: normalizeTemperature(metrics?.cpuTemp),
    memory: Number.isFinite(memoryNumber) ? Math.max(0, memoryNumber) : 0,
    gpu: clampPercent(metrics?.gpu ?? metrics?.gpuLoad),
    gpuTemp: normalizeTemperature(metrics?.gpuTemp),
    networkIn: Math.max(0, Number(metrics?.networkIn) || 0),
    networkOut: Math.max(0, Number(metrics?.networkOut) || 0),
    timestamp: Number(metrics?.timestamp) || Date.now()
  };
}

function appendHistory(previous, sample) {
  const next = {
    timestamps: [...previous.timestamps, sample.timestamp],
    cpu: [...previous.cpu, sample.cpu],
    memory: [...previous.memory, sample.memory],
    gpu: [...previous.gpu, sample.gpu],
    networkIn: [...previous.networkIn, sample.networkIn],
    networkOut: [...previous.networkOut, sample.networkOut]
  };

  if (next.timestamps.length <= HISTORY_LIMIT) {
    return next;
  }

  return {
    timestamps: next.timestamps.slice(-HISTORY_LIMIT),
    cpu: next.cpu.slice(-HISTORY_LIMIT),
    memory: next.memory.slice(-HISTORY_LIMIT),
    gpu: next.gpu.slice(-HISTORY_LIMIT),
    networkIn: next.networkIn.slice(-HISTORY_LIMIT),
    networkOut: next.networkOut.slice(-HISTORY_LIMIT)
  };
}

function createInitialMetricsState() {
  return {
    current: {
      cpu: 0,
      cpuTemp: null,
      memory: 0,
      gpu: 0,
      gpuTemp: null,
      networkIn: 0,
      networkOut: 0,
      timestamp: Date.now()
    },
    history: {
      timestamps: [],
      cpu: [],
      memory: [],
      gpu: [],
      networkIn: [],
      networkOut: []
    }
  };
}

function createFallbackMetrics(previous) {
  const baseline = previous || {
    cpu: 35,
    memory: 12.5,
    gpu: 28,
    networkIn: 40 * 1024,
    networkOut: 12 * 1024
  };

  const cpu = clampPercent(baseline.cpu + (Math.random() * 10 - 5));
  const memory = Math.max(0, baseline.memory + (Math.random() * 0.3 - 0.15));
  const gpu = clampPercent(baseline.gpu + (Math.random() * 12 - 6));
  const networkIn = Math.max(0, baseline.networkIn + (Math.random() * 80 * 1024 - 40 * 1024));
  const networkOut = Math.max(0, baseline.networkOut + (Math.random() * 30 * 1024 - 15 * 1024));

  return {
    cpu,
    cpuTemp: null,
    memory,
    gpu,
    gpuTemp: null,
    networkIn,
    networkOut,
    timestamp: Date.now()
  };
}

function formatUptime(milliseconds) {
  const totalMinutes = Math.max(1, Math.floor(milliseconds / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function formatActivityTime(timestamp, now = Date.now()) {
  const elapsedMs = Math.max(0, Number(now || Date.now()) - Number(timestamp || 0));
  const minutes = Math.floor(elapsedMs / 60000);

  if (minutes < 1) {
    return 'just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(hours / 24)}d ago`;
}

function DashboardTopIcon({ icon: Icon, tone = 'accent' }) {
  return (
    <IconContainer className={`dashboard-top-row-icon dashboard-top-row-icon--${tone}`}>
      <Icon {...LUCIDE_ICON_PROPS} aria-hidden="true" />
    </IconContainer>
  );
}

function BackupHeroIllustration() {
  return (
    <svg className="dashboard-top-row-backup-hero" viewBox="0 0 210 160" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="backupHeroAccent" x1="34" y1="18" x2="165" y2="138" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.95" />
          <stop offset="1" stopColor="var(--accent-secondary)" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="backupHeroSurface" x1="64" y1="105" x2="148" y2="145" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--surface-hover)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--surface)" stopOpacity="0.26" />
        </linearGradient>
      </defs>
      <ellipse className="dashboard-top-row-backup-orbit" cx="111" cy="79" rx="77" ry="28" transform="rotate(-24 111 79)" />
      <path className="dashboard-top-row-backup-platform" d="M54 116 103 91c5-3 13-3 18 0l44 22c5 3 5 8 0 10l-49 25c-5 3-13 3-18 0l-44-22c-5-3-5-8 0-10Z" />
      <path className="dashboard-top-row-backup-platform dashboard-top-row-backup-platform--lower" d="M63 129 105 108c4-2 10-2 14 0l37 18c4 2 4 6 0 8l-42 21c-4 2-10 2-14 0l-37-18c-4-2-4-6 0-8Z" />
      <g className="dashboard-top-row-backup-core">
        <ellipse cx="111" cy="54" rx="28" ry="13" fill="url(#backupHeroAccent)" />
        <path d="M83 54v51c0 7 13 13 28 13s28-6 28-13V54c0 7-13 13-28 13S83 61 83 54Z" fill="url(#backupHeroAccent)" opacity="0.68" />
        <path d="M83 73c0 7 13 13 28 13s28-6 28-13M83 92c0 7 13 13 28 13s28-6 28-13" fill="none" stroke="var(--text-primary)" strokeOpacity="0.24" strokeWidth="2" />
        <path d="M92 51c6-5 29-7 39 0" fill="none" stroke="var(--text-primary)" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      </g>
      <path className="dashboard-top-row-backup-shield" d="M111 22 141 34v28c0 24-15 39-30 46-15-7-30-22-30-46V34l30-12Z" />
      <circle className="dashboard-top-row-backup-node dashboard-top-row-backup-node--left" cx="39" cy="101" r="4" />
      <circle className="dashboard-top-row-backup-node dashboard-top-row-backup-node--right" cx="176" cy="40" r="5" />
    </svg>
  );
}

function BackupCard({ t, onAction }) {
  return (
    <article className="dashboard-top-row-card dashboard-top-row-card--backup">
      <BackupHeroIllustration />
      <div className="dashboard-top-row-card-content dashboard-top-row-card-content--backup">
        <div className="dashboard-top-row-card-header">
          <div className="dashboard-top-row-title-group">
            <DashboardTopIcon icon={DatabaseBackup} tone="accent" />
            <h2 className="dashboard-top-row-label">{t('dashboard.actions.createBackup.title')}</h2>
          </div>
        </div>

        <div className="dashboard-top-row-copy">
          <p className="dashboard-top-row-headline">{t('dashboard.actions.createBackup.primary')}</p>
          <p className="dashboard-top-row-description">{t('dashboard.actions.createBackup.secondary')}</p>
        </div>

        <div className="dashboard-top-row-footer dashboard-top-row-footer--backup">
          <button type="button" onClick={onAction} className="ui-btn ui-btn-primary dashboard-top-row-primary-button">
            <DatabaseBackup {...LUCIDE_ICON_PROPS} className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{t('dashboard.actions.createBackup.action')}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function UptimeSparkline() {
  return (
    <svg className="dashboard-top-row-sparkline" viewBox="0 0 240 86" role="img" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id="uptimeSparklineStroke" x1="0" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--dashboard-top-row-accent)" stopOpacity="0.7" />
          <stop offset="1" stopColor="var(--dashboard-top-row-accent)" />
        </linearGradient>
        <linearGradient id="uptimeSparklineFill" x1="0" y1="24" x2="0" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--dashboard-top-row-accent)" stopOpacity="0.2" />
          <stop offset="1" stopColor="var(--dashboard-top-row-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="dashboard-top-row-sparkline-grid" d="M2 72H238M2 58H238M2 44H238M2 30H238" />
      <path d="M4 68 C28 51 48 55 68 59 C92 64 106 33 132 33 C158 33 162 65 190 62 C211 60 220 41 236 29 L236 86 L4 86 Z" fill="url(#uptimeSparklineFill)" />
      <path className="dashboard-top-row-sparkline-line" d="M4 68 C28 51 48 55 68 59 C92 64 106 33 132 33 C158 33 162 65 190 62 C211 60 220 41 236 29" />
      <circle className="dashboard-top-row-sparkline-dot" cx="236" cy="29" r="4" />
    </svg>
  );
}

function UptimeCard({ t, uptime }) {
  return (
    <article className="dashboard-top-row-card dashboard-top-row-card--uptime">
      <div className="dashboard-top-row-card-content">
        <div className="dashboard-top-row-card-header">
          <div className="dashboard-top-row-title-group">
            <DashboardTopIcon icon={Clock} tone="accent" />
            <h2 className="dashboard-top-row-label">{t('dashboard.cards.systemUptime')}</h2>
          </div>
        </div>

        <div className="dashboard-top-row-uptime-body">
          <p className="dashboard-top-row-uptime-value">{uptime}</p>
          <p className="dashboard-top-row-description">{t('dashboard.cards.runningSmoothly')}</p>
        </div>

        <UptimeSparkline />
      </div>
    </article>
  );
}

function OverviewMetricCard({ icon: Icon, label, value, detail, detailIcon: DetailIcon, accent = 'var(--accent)' }) {
  return (
    <article className="dashboard-metric-card ui-card-subtle min-h-[128px] p-4 pb-5">
      <div className="flex items-center justify-between gap-3">
        <IconContainer
          className="h-10 w-10"
          style={{
            color: accent,
            background: `color-mix(in srgb, ${accent} 9%, var(--surface-elevated))`,
            borderColor: `color-mix(in srgb, ${accent} 18%, var(--border))`
          }}
        >
          <Icon {...LUCIDE_ICON_PROPS} className="h-[18px] w-[18px]" aria-hidden="true" />
        </IconContainer>
        <p className="flex items-center justify-end gap-1 text-right text-[12px] font-medium text-[var(--text-muted)]">
          {DetailIcon ? <DetailIcon {...LUCIDE_ICON_PROPS} className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
          <span>{detail}</span>
        </p>
      </div>

      <div className="mt-5 min-w-0">
        <p className="text-[12px] font-medium text-[var(--text-secondary)]">{label}</p>
        <p className="mt-1.5 max-w-full truncate whitespace-nowrap text-[1.26rem] font-semibold leading-none text-[var(--text-primary)] [font-variant-numeric:tabular-nums]" title={String(value || '')}>
          {value}
        </p>
      </div>
    </article>
  );
}

function DashboardSectionTitle({ icon: Icon, title }) {
  return (
    <div className="dashboard-section-title flex items-center gap-2.5">
      <IconContainer className="dashboard-section-title__icon h-8 w-8 shrink-0 text-[var(--accent)]">
        <Icon {...LUCIDE_ICON_PROPS} className="h-4 w-4" aria-hidden="true" />
      </IconContainer>
      <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">{title}</h2>
    </div>
  );
}

function HardwareIcon({ type, className = 'h-5 w-5' }) {
  if (type === 'cpu') {
    return <Cpu {...LUCIDE_ICON_PROPS} className={className} aria-hidden="true" />;
  }

  if (type === 'gpu') {
    return <Gpu {...LUCIDE_ICON_PROPS} className={className} aria-hidden="true" />;
  }

  if (type === 'ram') {
    return <MemoryStick {...LUCIDE_ICON_PROPS} className={className} aria-hidden="true" />;
  }

  if (type === 'mb') {
    return <CircuitBoard {...LUCIDE_ICON_PROPS} className={className} aria-hidden="true" />;
  }

  return <HardDrive {...LUCIDE_ICON_PROPS} className={className} aria-hidden="true" />;
}

function HardwareStatusTile({ card, unavailableLabel }) {
  return (
    <div className={`dashboard-top-row-hardware-tile ${card.detected ? 'is-detected' : ''}`}>
      <IconContainer className={`dashboard-top-row-hardware-icon ${card.detected ? 'is-detected' : ''}`}>
        <HardwareIcon type={card.icon} className="h-4 w-4" />
      </IconContainer>
      <div className="dashboard-top-row-hardware-copy">
        <p className="dashboard-top-row-hardware-label">{card.label}</p>
        <p className="dashboard-top-row-hardware-primary" title={card.primary || unavailableLabel}>
          {card.primary || unavailableLabel}
        </p>
        {card.secondary ? (
          <p className="dashboard-top-row-hardware-secondary" title={card.secondary}>{card.secondary}</p>
        ) : null}
      </div>
      <CircleCheck
        {...LUCIDE_ICON_PROPS}
        className={`dashboard-top-row-hardware-check ${card.detected ? 'is-detected' : ''}`}
        aria-hidden="true"
      />
    </div>
  );
}

function SystemDetectionSummaryCard({ cards, title, subtitle, unavailableLabel, rescanLabel, onRescan, isRescanning }) {
  return (
    <article className="dashboard-top-row-card dashboard-top-row-card--detection">
      <div className="dashboard-top-row-card-content">
        <div className="dashboard-top-row-card-header">
          <div className="dashboard-top-row-title-group">
            <DashboardTopIcon icon={MonitorCog} tone="accent" />
            <div className="min-w-0">
              <h2 className="dashboard-top-row-label">{title}</h2>
              <p className="dashboard-top-row-subtitle">{subtitle}</p>
            </div>
          </div>
          {typeof onRescan === 'function' ? (
            <button
              type="button"
              className="ui-btn ui-btn-secondary ui-btn-sm dashboard-top-row-rescan-button"
              onClick={onRescan}
              disabled={isRescanning}
            >
              <RefreshCw {...LUCIDE_ICON_PROPS} className={isRescanning ? 'animate-spin' : ''} aria-hidden="true" />
              <span className="truncate">{rescanLabel}</span>
            </button>
          ) : null}
        </div>
        <div className="dashboard-top-row-hardware-grid">
          {cards.map((card) => (
            <HardwareStatusTile key={card.key} card={card} unavailableLabel={unavailableLabel} />
          ))}
        </div>
      </div>
    </article>
  );
}

function QuickActionButton({ icon: Icon, label, primary = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 w-full items-center gap-3 rounded-xl border px-4 text-left text-[13px] font-semibold transition ${
        primary
          ? 'border-[color:color-mix(in_srgb,var(--accent)_56%,var(--border))] bg-[var(--accent)] text-white hover:bg-[color:color-mix(in_srgb,var(--accent)_88%,white)]'
          : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-primary)] hover:border-[var(--border)] hover:bg-[var(--surface-hover)]'
      }`}
    >
      <Icon {...LUCIDE_ICON_PROPS} className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function Dashboard({
  onNavigateSection,
  onQuickstartNavigate,
  onOpenUpdateNotes,
  username = '',
  recentActivities = [],
  onRecordActivity
}) {
  const { t, i18n } = useTranslation();
  const activeLocale = i18n.resolvedLanguage || i18n.language || undefined;

  const [now, setNow] = useState(() => Date.now());
  const [systemUptimeMs, setSystemUptimeMs] = useState(0);
  const [selectedPerformanceMetric, setSelectedPerformanceMetric] = useState('cpu');
  const [metricsState, setMetricsState] = useState(() => createInitialMetricsState());
  const [systemDetection, setSystemDetection] = useState(() => createEmptySystemDetection());
  const [isRescanningSystem, setIsRescanningSystem] = useState(false);
  const current = metricsState.current;
  const history = metricsState.history;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 30000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    async function refreshUptime() {
      if (!window.desktopApi?.getSystemUptime) {
        return;
      }

      try {
        const result = await window.desktopApi.getSystemUptime();
        const seconds = Number(result?.uptimeSeconds);
        if (!cancelled && result?.ok && Number.isFinite(seconds)) {
          setSystemUptimeMs(Math.max(0, seconds * 1000));
        }
      } catch (_error) {
        // Keep the card empty if the host uptime API is unavailable.
      }
    }

    void refreshUptime();
    timer = window.setInterval(refreshUptime, 60000);

    return () => {
      cancelled = true;
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, []);

  useEffect(() => {
    let fallbackTimer = null;
    let unsubscribe = () => {};

    const pushMetrics = (incoming) => {
      const sample = normalizeMetrics(incoming);
      setMetricsState((previous) => ({
        current: sample,
        history: appendHistory(previous.history, sample)
      }));
    };

    async function bootstrapMetrics() {
      if (window.desktopApi?.onMetricsUpdate) {
        unsubscribe = window.desktopApi.onMetricsUpdate((payload) => {
          pushMetrics(payload);
        });
        return;
      }

      fallbackTimer = window.setInterval(() => {
        setMetricsState((previous) => {
          const next = createFallbackMetrics(previous.current);
          return {
            current: next,
            history: appendHistory(previous.history, next)
          };
        });
      }, 2000);
    }

    void bootstrapMetrics();

    return () => {
      unsubscribe();
      if (fallbackTimer) {
        window.clearInterval(fallbackTimer);
      }
    };
  }, []);

  const refreshSystemDetection = async ({ showLoading = true } = {}) => {
    if (!window.desktopApi?.getSystemDetection) {
      return;
    }

    if (showLoading) {
      setIsRescanningSystem(true);
    }

    try {
      const result = await window.desktopApi.getSystemDetection();
      if (result?.ok && result?.detection) {
        setSystemDetection(normalizeSystemDetection(result.detection));
      }
    } catch (_error) {
      // Keep fallback detection state when hardware snapshot is unavailable.
    } finally {
      if (showLoading) {
        setIsRescanningSystem(false);
      }
    }
  };

  useEffect(() => {
    void refreshSystemDetection({ showLoading: false });
  }, []);

  const chartData = useMemo(() => {
    return history.timestamps.map((timestamp, index) => ({
      time: formatTime(timestamp),
      cpu: history.cpu[index] || 0,
      memory: history.memory[index] || 0,
      gpu: history.gpu[index] || 0,
      networkIn: history.networkIn[index] || 0,
      networkOut: history.networkOut[index] || 0
    }));
  }, [history]);

  const gpuSecondaryCount = systemDetection.gpu.secondary.length;
  const gpuPrimary = normalizeHardwareName(systemDetection.gpu.primary);
  const gpuSecondary = systemDetection.gpu.detected && gpuSecondaryCount > 0
    ? t('dashboard.systemDetection.gpuAdditionalDetected', { count: gpuSecondaryCount })
    : '';
  const cpuLines = splitCpuCardLines(systemDetection.cpu.name);
  const ramLines = buildRamCardLines(systemDetection.ram, activeLocale, t);
  const motherboardLines = splitMotherboardCardLines(systemDetection.motherboard.name);
  const unavailableLabel = t('dashboard.systemDetection.unavailable');
  const temperatureUnavailableLabel = t('dashboard.performance.temperatureUnavailable');
  const cpuTemperature = formatTemperature(current.cpuTemp, activeLocale, temperatureUnavailableLabel);
  const gpuTemperature = formatTemperature(current.gpuTemp, activeLocale, temperatureUnavailableLabel);
  const processorName = normalizeHardwareName(systemDetection.cpu.name) || unavailableLabel;
  const gpuName = gpuPrimary || unavailableLabel;

  const detectionCards = [
    {
      key: 'gpu',
      label: t('dashboard.systemDetection.labels.gpu'),
      detected: systemDetection.gpu.detected,
      primary: gpuPrimary,
      secondary: gpuSecondary,
      icon: 'gpu'
    },
    {
      key: 'cpu',
      label: t('dashboard.systemDetection.labels.cpu'),
      detected: systemDetection.cpu.detected,
      primary: cpuLines.primary,
      secondary: cpuLines.secondary,
      icon: 'cpu'
    },
    {
      key: 'ram',
      label: t('dashboard.systemDetection.labels.ram'),
      detected: systemDetection.ram.detected,
      primary: ramLines.primary,
      secondary: ramLines.secondary,
      icon: 'ram'
    },
    {
      key: 'mb',
      label: t('dashboard.systemDetection.labels.mb'),
      detected: systemDetection.motherboard.detected,
      primary: motherboardLines.primary,
      secondary: motherboardLines.secondary,
      icon: 'mb'
    }
  ];
  const uptime = systemUptimeMs > 0 ? formatUptime(systemUptimeMs) : '--';
  const selectedMetricColor = selectedPerformanceMetric === 'gpu' ? 'var(--accent-secondary)' : 'var(--accent)';
  const selectedMetricName = selectedPerformanceMetric === 'gpu' ? gpuName : processorName;
  const greetingName = String(username || '').trim() || t('dashboard.defaultUser');

  const recordDashboardAction = (label, tone = 'accent') => {
    if (typeof onRecordActivity === 'function') {
      onRecordActivity(label, tone);
    }
  };

  return (
    <PageShell className="dashboard-shell gap-4 md:gap-5">
      <header className="dashboard-header flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="dashboard-title text-[1.7rem] font-semibold leading-tight text-[var(--text-primary)] md:text-[1.95rem]">
            {t('dashboard.greetingPrefix', { defaultValue: 'Hallo,' })}{' '}
            <span className="text-[var(--accent)]">{greetingName}</span>
          </h1>
          <p className="dashboard-subtitle mt-1 text-[13px] font-medium text-[var(--text-secondary)]">
            {t('dashboard.welcomeBack')}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenUpdateNotes}
          className="dashboard-update-notes-button ui-btn ui-btn-secondary ui-btn-sm self-start md:self-center"
        >
          <FileText {...LUCIDE_ICON_PROPS} aria-hidden="true" />
          <span>{t('dashboard.updateNotes.open', { defaultValue: 'Update Notes' })}</span>
        </button>
      </header>

      <section className="dashboard-top-row">
        <BackupCard
          t={t}
          onAction={() => {
            recordDashboardAction(t('dashboard.activity.createBackupOpened'), 'accent');
            if (typeof onQuickstartNavigate === 'function') {
              onQuickstartNavigate('createBackup');
            } else {
              onNavigateSection?.('backup');
            }
          }}
        />
        <UptimeCard t={t} uptime={uptime} />
        <SystemDetectionSummaryCard
          cards={detectionCards}
          title={t('dashboard.systemDetection.title')}
          subtitle={t('dashboard.systemDetection.snapshot')}
          unavailableLabel={unavailableLabel}
          rescanLabel={t('dashboard.systemDetection.rescan')}
          onRescan={window.desktopApi?.getSystemDetection ? () => refreshSystemDetection() : null}
          isRescanning={isRescanningSystem}
        />
      </section>

      <div className="dashboard-main-row grid items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="dashboard-performance-column min-h-0">
          <PageSection className="dashboard-performance-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <DashboardSectionTitle icon={Activity} title={t('dashboard.performance.title')} />
                <p className="mt-1 truncate pl-10 text-[12px] font-medium text-[var(--text-muted)]">
                  @ {selectedMetricName}
                </p>
              </div>
              <div className="ui-select-shell dashboard-performance-select min-w-[112px]">
                <select
                  value={selectedPerformanceMetric}
                  onChange={(event) => setSelectedPerformanceMetric(event.target.value)}
                  className="ui-select h-8 text-[12px] font-semibold"
                >
                  <option value="cpu">CPU</option>
                  <option value="gpu">GPU</option>
                </select>
                <ChevronDown {...LUCIDE_ICON_PROPS} className="pointer-events-none h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />
              </div>
            </div>

            <div className="dashboard-performance-chart mt-5 h-[290px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-3 md:h-[320px] xl:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 5" stroke="color-mix(in srgb, var(--chart-grid) 58%, transparent)" vertical={false} />
                  <XAxis dataKey="time" stroke="color-mix(in srgb, var(--text-muted) 76%, transparent)" minTickGap={28} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="color-mix(in srgb, var(--text-muted) 72%, transparent)"
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    width={42}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={false}
                    formatter={(value) => formatPercent(Number(value))}
                    contentStyle={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 14,
                      color: 'var(--text-primary)',
                      boxShadow: 'var(--card-shadow-item)'
                    }}
                  />
                  <Line type="monotone" dataKey={selectedPerformanceMetric} stroke={selectedMetricColor} strokeWidth={2.4} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="dashboard-metric-grid mt-4 mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <OverviewMetricCard icon={Cpu} label={t('dashboard.metricsCards.cpu')} value={formatPercent(current.cpu)} detail={cpuTemperature} detailIcon={Thermometer} accent="var(--accent)" />
              <OverviewMetricCard icon={Gpu} label={t('dashboard.metricsCards.gpu')} value={formatPercent(current.gpu)} detail={gpuTemperature} detailIcon={Thermometer} accent="var(--accent-secondary)" />
              <OverviewMetricCard icon={MemoryStick} label={t('dashboard.metricsCards.memory')} value={formatGigabytes(current.memory)} detail={t('dashboard.performance.used')} accent="#8B5CF6" />
              <OverviewMetricCard icon={Wifi} label={t('dashboard.metricsCards.networkUsage', { defaultValue: 'Network Usage' })} value={formatRate(current.networkIn, activeLocale)} detail={t('dashboard.performance.inbound')} accent="#06B6D4" />
            </div>
            <div className="dashboard-performance-bottom-space" aria-hidden="true" />
          </PageSection>
        </div>

        <aside className="dashboard-side-panel">
          <PageSection className="dashboard-quick-actions-card p-5">
            <DashboardSectionTitle icon={Sparkles} title={t('dashboard.quickActions.title')} />
            <div className="dashboard-quick-action-list mt-4 space-y-2.5">
              <QuickActionButton
                icon={Rocket}
                label={t('dashboard.quickActions.applyPowerplan')}
                primary
                onClick={() => {
                  recordDashboardAction(t('dashboard.activity.applyPowerplanOpened'), 'accent');
                  if (typeof onQuickstartNavigate === 'function') {
                    onQuickstartNavigate('applyNovaPowerPlan');
                  } else {
                    onNavigateSection?.('tweaks');
                  }
                }}
              />
              <QuickActionButton
                icon={Trash2}
                label={t('dashboard.quickActions.cleanTemporaryFiles')}
                onClick={() => {
                  recordDashboardAction(t('dashboard.activity.cleanTemporaryFilesOpened'), 'accent');
                  if (typeof onQuickstartNavigate === 'function') {
                    onQuickstartNavigate('cleanUpSystem');
                  } else {
                    onNavigateSection?.('tweaks');
                  }
                }}
              />
              <QuickActionButton
                icon={LayoutGrid}
                label={t('dashboard.quickActions.manageStartupApps')}
                onClick={() => {
                  recordDashboardAction(t('dashboard.activity.manageStartupAppsOpened'), 'accent');
                  if (typeof onQuickstartNavigate === 'function') {
                    onQuickstartNavigate('manageStartupApps');
                  } else {
                    onNavigateSection?.('apps');
                  }
                }}
              />
              <QuickActionButton
                icon={MousePointer2}
                label={t('dashboard.quickActions.reduceInputDelay')}
                onClick={() => {
                  recordDashboardAction(t('dashboard.activity.reduceInputDelayOpened'), 'accent');
                  if (typeof onQuickstartNavigate === 'function') {
                    onQuickstartNavigate('reduceInputDelay');
                  } else {
                    onNavigateSection?.('tweaks');
                  }
                }}
              />
            </div>
          </PageSection>

          <PageSection className="dashboard-recent-activity-card p-5">
            <DashboardSectionTitle icon={History} title={t('dashboard.recentActivity.title')} />
            <div className="dashboard-recent-activity-list mt-4">
              {recentActivities.length === 0 ? (
                <p className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3.5 text-[13px] text-[var(--text-muted)]">
                  {t('dashboard.recentActivity.empty')}
                </p>
              ) : (
                <div className="dashboard-recent-activity-scroll space-y-1.5 pr-1 [scrollbar-color:var(--scrollbar-thumb)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--scrollbar-thumb)] [&::-webkit-scrollbar-thumb:hover]:bg-[var(--scrollbar-thumb-hover)] [&::-webkit-scrollbar-track]:bg-transparent">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex h-8 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: activity.color || 'var(--accent)' }}
                        aria-hidden="true"
                      />
                      <p className="min-w-0 flex-1 truncate text-[12px] font-medium text-[var(--text-primary)]">{activity.label}</p>
                      <p className="shrink-0 text-right text-[11px] text-[var(--text-muted)]">{formatActivityTime(activity.timestamp, now)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PageSection>
        </aside>
      </div>
    </PageShell>
  );
}

export default Dashboard;
