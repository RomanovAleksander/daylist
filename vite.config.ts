import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages отдаёт проект из подкаталога `/<repo>/`, поэтому base совпадает с именем репозитория.
export default defineConfig({
  base: '/daylist/',
  plugins: [
    react(),
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
