import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import cloudflare from '@astrojs/cloudflare';

// Platform detection:
// - CI / production: USE_CLOUDFLARE=1 → Cloudflare Workers adapter
// - Local development (no CI, no explicit force): Node adapter
const isCI = process.env.CI === 'true';
const useCloudflare = process.env.USE_CLOUDFLARE === '1' || (isCI && process.env.USE_CLOUDFLARE !== '0');

const adapter = useCloudflare
  ? cloudflare({})
  : node({
      mode: 'standalone',
    });

export default defineConfig({
  // Default: SSR. Static pages add `export const prerender = true`
  output: 'server',

  site: 'https://timorlist.com',

  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: true,
    defaultBundler: 'astro',
  },

  // compressHTML: 'jsx', // ⚠️暂禁用，CI环境schema验证问题

  server: {
    allowedHosts: ['timorlist.com', 'www.timorlist.com', 'localhost', '127.0.0.1'],
  },

  adapter,

  integrations: [
    sitemap(),
  ],

  vite: {
    plugins: [
      tailwindcss(),
      // Shim cloudflare:workers for non-Cloudflare builds
      {
        name: 'cloudflare-workers-shim',
        resolveId(id) {
          if (id === 'cloudflare:workers') {
            return '\0cloudflare:workers-shim';
          }
        },
        load(id) {
          if (id === '\0cloudflare:workers-shim') {
            return `export const env = { get DB() { throw new Error('cloudflare:workers only in Workers'); } };`;
          }
        }
      }
    ],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
    ssr: {
      noExternal: ['better-auth'],
    },
    // Disable all caching in development for real-time updates
    ...(process.env.NODE_ENV === 'development' ? {
      optimizeDeps: {
        include: [],
      },
      build: {
        sourcemap: true,
        minify: false,
      },
      cache: false,
    } : {
      build: {
        cssMinify: true,
      },
    }),
  },

  streaming: true,
});
