import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Страховка от XSS: скрипты только свои, сеть только к себе и к Dropbox. Заголовки на GitHub
// Pages не настроить, поэтому политика — meta-тег. Только в сборке: dev-сервер Vite вставляет
// inline-скрипт для hot reload. `unsafe-inline` для стилей нужен Emotion (MUI).
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self' https://api.dropboxapi.com https://content.dropboxapi.com",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const contentSecurityPolicy = (): Plugin => ({
  name: 'daylist-content-security-policy',
  apply: 'build',
  transformIndexHtml: () => [
    {
      tag: 'meta',
      attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY },
      injectTo: 'head-prepend',
    },
  ],
});

// GitHub Pages отдаёт проект из подкаталога `/<repo>/`, поэтому base совпадает с именем репозитория.
export default defineConfig({
  base: '/daylist/',
  plugins: [
    react(),
    contentSecurityPolicy(),
    VitePWA({
      // Новая версия скачивается в фоне и включается при следующем запуске, без вопросов.
      registerType: 'autoUpdate',
      pwaAssets: { config: true, overrideManifestIcons: true },
      manifest: {
        name: 'Daylist',
        short_name: 'Daylist',
        description: 'Список справ на день',
        lang: 'uk',
        display: 'standalone',
        background_color: '#121419',
        theme_color: '#121419',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
  build: {
    // MUI + React + Dexie на главном экране дают ~850 kB (~270 kB gzip). Для PWA это разовая
    // загрузка в precache, поэтому порог поднят, а вторичные экраны грузятся лениво.
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
