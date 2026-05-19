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
    },
    optimizeDeps: {
      exclude: [],
      include: ['better-auth-cloudflare'],
    },
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
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