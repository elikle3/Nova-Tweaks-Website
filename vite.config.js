import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function resolveProxyTarget(value) {
  const parsed = new URL(value || 'https://api.nova-tweaks.com');
  const loopback = parsed.protocol === 'http:'
    && ['127.0.0.1', 'localhost'].includes(parsed.hostname)
    && parsed.port === '3000';
  if (
    (parsed.origin !== 'https://api.nova-tweaks.com' && !loopback)
    || parsed.username
    || parsed.password
    || parsed.pathname !== '/'
    || parsed.search
    || parsed.hash
  ) {
    throw new Error('VITE_PROXY_API_TARGET must be the production API or loopback port 3000.');
  }
  return parsed.origin;
}

const API_TARGET = resolveProxyTarget(process.env.VITE_PROXY_API_TARGET);

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5175,
    strictPort: true,
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    host: '127.0.0.1',
    port: 4175
  }
});
