import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Server output for SSR (can be changed to 'static' with prerender for SSG)
  output: 'server',

  // Site URL for sitemap and canonical URLs
  site: 'https://timorbiz.com',

  // Prefetch for faster navigation - use viewport strategy for faster page loads
  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: true,
    defaultBundler: 'astro',
  },

  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
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
        // Enable CSS minification for production
        cssMinify: true,
      },
    }),
    ssr: {
      noExternal: ['better-auth'],
    },
  },

  // Image optimization - uses Sharp for optimal performance
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  // Development-specific settings
  developmentClosestEnvironment: true,

  // Enable streaming for faster initial page loads
  streaming: true,
});
