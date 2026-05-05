import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
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

  integrations: [
    sitemap(),
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
    ssr: {
      external: ['cloudflare:workers'],
      noExternal: ['better-auth'],
    },
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
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

});
