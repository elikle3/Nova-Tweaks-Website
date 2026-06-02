import React, { useEffect, useRef } from 'react';
import Dashboard from './NovaDesktopDashboard';
import './dashboardI18n';
import './dashboard-exact.css';

const mockActivities = [
  { id: 'act-power', label: 'Apply Powerplan opened', color: 'var(--accent)', timestamp: Date.now() - 90_000 },
  { id: 'act-clean', label: 'Clean Temporary Files opened', color: 'var(--accent-secondary)', timestamp: Date.now() - 240_000 },
  { id: 'act-apps', label: 'Manage Startup Apps opened', color: '#8B5CF6', timestamp: Date.now() - 520_000 },
  { id: 'act-input', label: 'Reduce Input Delay opened', color: '#06B6D4', timestamp: Date.now() - 830_000 }
];

function createMetricSample() {
  const time = Date.now() / 1000;
  return {
    cpu: 23 + Math.sin(time * 0.9) * 8 + Math.random() * 4,
    cpuTemp: 47 + Math.sin(time * 0.4) * 3,
    memoryUsedGB: 9.8 + Math.sin(time * 0.27) * 0.6,
    gpu: 18 + Math.cos(time * 0.75) * 9 + Math.random() * 5,
    gpuTemp: 44 + Math.cos(time * 0.35) * 4,
    networkIn: 1_900_000 + Math.max(0, Math.sin(time * 1.2)) * 1_600_000,
    networkOut: 340_000 + Math.max(0, Math.cos(time * 0.8)) * 380_000,
    timestamp: Date.now()
  };
}

function createDashboardApiMock() {
  return {
    getSystemUptime: async () => ({
      ok: true,
      uptimeSeconds: 86400 * 2 + 3600 * 6 + 60 * 24
    }),
    getSystemDetection: async () => ({
      ok: true,
      detection: {
        updatedAt: Date.now(),
        cpu: { detected: true, name: 'AMD Ryzen 7 7800X3D' },
        gpu: { detected: true, primary: 'NVIDIA GeForce RTX 4070', secondary: [], all: ['NVIDIA GeForce RTX 4070'] },
        ram: {
          detected: true,
          totalBytes: 34_359_738_368,
          label: '32 GB DDR5',
          type: 'DDR5',
          speedMTs: 6000,
          manufacturer: 'G.Skill',
          partNumber: 'Trident Z5',
          moduleCount: 2
        },
        motherboard: { detected: true, name: 'MSI MAG B650 Tomahawk' }
      }
    }),
    onMetricsUpdate: (callback) => {
      callback(createMetricSample());
      const timer = window.setInterval(() => callback(createMetricSample()), 1600);
      return () => window.clearInterval(timer);
    }
  };
}

function installDashboardMock() {
  if (typeof window === 'undefined') return () => {};
  const previousApi = window.desktopApi;
  window.desktopApi = {
    ...(previousApi || {}),
    ...createDashboardApiMock()
  };
  return () => {
    if (previousApi) {
      window.desktopApi = previousApi;
    } else {
      delete window.desktopApi;
    }
  };
}

function NovaDashboardShowcase() {
  const cleanupRef = useRef(null);
  if (!cleanupRef.current) {
    cleanupRef.current = installDashboardMock();
  }

  useEffect(() => () => {
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  return (
    <section className="section nova-dashboard-section" id="dashboard-showcase">
      <div className="section-inner">
        <div className="nova-section-head reveal">
          <span className="nova-kicker">Real Nova Tweaks Dashboard</span>
          <h2>The actual desktop command center, staged for the web.</h2>
          <p>
            This showcase uses the Nova Tweaks dashboard component with website mock telemetry, so the landing page reflects the product instead of a generic mockup.
          </p>
        </div>

        <div className="dashboard-cinema-stage reveal">
          <div className="dashboard-cinema-orbit" aria-hidden="true" />
          <div className="dashboard-cinema-frame">
            <Dashboard
              username="Nova"
              recentActivities={mockActivities}
              onNavigateSection={() => {}}
              onQuickstartNavigate={() => {}}
              onOpenUpdateNotes={() => {}}
              onRecordActivity={() => {}}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default NovaDashboardShowcase;
