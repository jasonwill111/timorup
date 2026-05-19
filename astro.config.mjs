import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    // Astro sessions disabled - better-auth handles its own sessions
    kvNamespaces: [],
    imageService: 'passthrough',
  }),
  site: 'https://timorlist.com',

  prefetch: {
    defaultStrategy: 'viewport',
    defaultBundler: 'astro',
  },

  // compressHTML: 'jsx', // ⚠️暂禁用，CI环境schema验证问题

  server: {
    allowedHosts: ['timorlist.com', 'www.timorlist.com', 'localhost', '127.0.0.1'],
  },

  integrations: [
    // sitemap() removed - using custom src/pages/sitemap.xml.ts for dynamic sitemap
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
    ssr: {
      external: ['cloudflare:workers'],
      noExternal: ['better-auth', 'better-auth-cloudflare', '@better-auth/drizzle-adapter'],
    },
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
        'better-auth-cloudflare': new URL('./node_modules/better-auth-cloudflare/dist/index.mjs', import.meta.url).pathname,
      },
    },
    optimizeDeps: {
      exclude: [],
    },
    // Disable all caching in development for real-time updates
    ...(process.env.NODE_ENV === 'development' ? {
      build: {
        sourcemap: true,
        minify: false,
      },
    } : {
      build: {
        minify: 'terser',
        cssMinify: true,
      },
    }),
  },

});