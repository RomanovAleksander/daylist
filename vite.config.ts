import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// GitHub Pages отдаёт проект из подкаталога `/<repo>/`, поэтому base совпадает с именем репозитория.
export default defineConfig({
  base: '/daylist/',
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
