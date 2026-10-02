import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Растровые иконки генерируются из public/icon.svg при сборке и в репозиторий не попадают.
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#121419' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#121419' } },
  },
  images: ['public/icon.svg'],
});
