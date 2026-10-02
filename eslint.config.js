import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Модуль лежит максимум на двух сегментах (`область/суб-фича`), а импорты внутри модуля
// по конвенции относительные — значит абсолютный путь на три сегмента и глубже это всегда
// залезание в чужие внутренности мимо index.ts.
const moduleInternalsPattern = {
  group: ['@/modules/*/*/*', '@/modules/*/*/*/**'],
  message: 'Публичный API модуля — его index.ts; импорты внутри модуля — относительные.',
};

// Примитив из папки (`ui/SwipeRow/`) отдаёт себя через index.ts ровно так же: путь глубже
// `@/ui/<Примитив>` тянет внутренность мимо публичного API.
const uiInternalsPattern = {
  group: ['@/ui/*/*', '@/ui/*/*/**'],
  message: 'Публичный API примитива — его index.ts; импорты внутри примитива — относительные.',
};

export default tseslint.config(
  // `dev-dist` — сервис-воркер, который vite-plugin-pwa генерирует в dev-режиме.
  { ignores: ['dist', 'dev-dist', '.vite'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.app.json' },
        node: true,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // jsx-a11y инспектирует только DOM-теги и молчит на MUI-обёртках, поэтому проверяем ровно
      // класс ошибки: кликабельная обёртка обязана объявить, во что рендерится.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'JSXOpeningElement[name.name=/^(Box|Stack|Typography|Paper|Card|Grid|Chip)$/]:has(JSXAttribute[name.name="onClick"]):not(:has(JSXAttribute[name.name="component"])):not(:has(JSXAttribute[name.name="onKeyDown"]))',
          message:
            'Кликабельная обёртка рендерится div\'ом: переход — component={RouterLink}, действие — component="button" type="button", выбор — component="label".',
        },
        {
          // Одной проверки на наличие `component` мало: она пропускает `component="span"`.
          selector:
            'JSXOpeningElement[name.name=/^(Box|Stack|Typography|Paper|Card|Grid|Chip)$/]:has(JSXAttribute[name.name="onClick"]):has(JSXAttribute[name.name="component"][value.value=/^(div|span|p|li|ul|ol|section|article|header|footer|main|aside|nav|table|thead|tbody|tr|td|th)$/]):not(:has(JSXAttribute[name.name="onKeyDown"]))',
          message:
            'Кликабельная обёртка рендерится неинтерактивным тегом: переход — component={RouterLink}, действие — component="button" type="button", выбор — component="label".',
        },
      ],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'import/no-duplicates': 'error',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            // Одна группа на всю React-экосистему: каждая отдельная pathGroup — это своя группа
            // с пустой строкой, и `react` отрывался бы от `react-dom/client`.
            { pattern: '{react,react-*,react-*/**}', group: 'external', position: 'before' },
            { pattern: '@/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    // Architecture guardrail: module public API. Cross-module imports go through index.ts.
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        { patterns: [moduleInternalsPattern, uiInternalsPattern] },
      ],
    },
  },
  {
    // Architecture guardrail: dependency direction is `pages → modules → ui`. `ui/`, `hooks/`,
    // `utils/`, `db/` — листья графа: данные принимают пропсами/параметрами, о модулях не знают.
    files: [
      'src/ui/**/*.{ts,tsx}',
      'src/hooks/**/*.{ts,tsx}',
      'src/utils/**/*.{ts,tsx}',
      'src/db/**/*.{ts,tsx}',
    ],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/modules/*', '@/modules/*/**'],
              message:
                'ui/hooks/utils/db — листья графа: принимай данные пропсами/параметрами, не импортируй модули.',
            },
            uiInternalsPattern,
          ],
        },
      ],
    },
  },
  {
    // Architecture guardrail: `api/` (доступ к Dexie и Dropbox), `utils/` (чистые функции) и `db/`
    // остаются без React. Хуки, `useLiveQuery` и побочные эффекты живут в `hooks/` или компонентах.
    files: [
      'src/db/**/*.{ts,tsx}',
      'src/utils/**/*.{ts,tsx}',
      'src/modules/**/api/**/*.{ts,tsx}',
      'src/modules/**/utils/**/*.{ts,tsx}',
    ],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              message: 'api/, utils/ и db/ без React — хуки кладём в hooks/.',
              allowTypeImports: true,
            },
            {
              name: 'react-dom',
              message: 'api/, utils/ и db/ без React.',
              allowTypeImports: true,
            },
            { name: 'react-i18next', message: 'i18n — в компонентах и хуках, не в данных.' },
            { name: 'dexie-react-hooks', message: '`useLiveQuery` — в hooks/, не в api/utils.' },
          ],
          // Повтор: этот блок перекрывает правило целиком для своих файлов.
          patterns: [moduleInternalsPattern, uiInternalsPattern],
        },
      ],
    },
  },
  prettierConfig
);
