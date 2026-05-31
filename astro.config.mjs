import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    kvNamespaces: [],
    imageService: 'passthrough',
  }),
  site: 'https://timorup.com',

  prefetch: {
    defaultStrategy: 'viewport',
    defaultBundler: 'astro',
  },

  compressHTML: true,

  server: {
    allowedHosts: ['timorup.com', 'www.timorup.com', 'localhost', '127.0.0.1'],
  },

  integrations: [],

  vite: {
    plugins: [
      tailwindcss(),
    ],
    ssr: {
      external: ['cloudflare:workers'],
    },
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
    optimizeDeps: {
      exclude: ['better-auth'],
      noDiscovery: true,
    },
    noExternal: [],
  },
});
