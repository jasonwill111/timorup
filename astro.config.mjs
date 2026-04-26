import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import cloudflare from '@astrojs/cloudflare';

// Platform detection:
// - Windows local dev: USE_CLOUDFLARE=0 → Node adapter
// - CI / production: USE_CLOUDFLARE=1 → Cloudflare Workers adapter
const isWindows = process.platform === 'win32';
const useCloudflare = process.env.USE_CLOUDFLARE === '1' || (!isWindows && process.env.USE_CLOUDFLARE !== '0');

const adapter = useCloudflare
  ? cloudflare({
      // Workerd runtime for SSR in production
      prerenderEnvironment: 'cloudflare',
    })
  : node({
      mode: 'standalone',
      // Ensure prerendered pages work correctly with Node adapter
      prerenderEnvironment: undefined,
    });

export default defineConfig({
  output: 'server',

  site: 'https://timorlist.com',

  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: true,
    defaultBundler: 'astro',
  },

  // Enable Rust compiler for faster builds (requires @astrojs/compiler-rs)
  experimental: {
    rustCompiler: true,
  },

  adapter,

  integrations: [
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
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
