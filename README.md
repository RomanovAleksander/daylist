# Daylist

Мінімалістичний список справ на день. PWA для Android і Ubuntu, працює офлайн, синхронізується через Dropbox.

Щоранку день уже зібраний: задачі з шаблону плюс невиконане з учора. Разові задачі дописуються вручну, протягом дня відмічаються. Поруч живуть **Вхідні** (задачі без дати, записані одним рухом) і **Цілі** (з дедлайном і відліком днів, глобальні, мрії): усе, що крутиться в голові, вивантажується на екран. Без календаря, пріоритетів і тегів.

## Стек

| Область       | Технологія                                         |
| ------------- | -------------------------------------------------- |
| Фреймворк     | React 19 + Vite, `vite-plugin-pwa`                 |
| Мова          | TypeScript (strict)                                |
| UI            | MUI + Emotion                                      |
| Сховище       | IndexedDB через Dexie                              |
| UI-стейт      | Zustand                                            |
| Роутинг       | React Router (`HashRouter`)                        |
| Синхронізація | Dropbox, OAuth PKCE з браузера, без бекенду        |
| Хостинг       | GitHub Pages, деплой з `main` через GitHub Actions |

## Запуск

```bash
npm install
npm run dev
```

## Деплой на GitHub Pages

1. **Settings → Pages → Source: GitHub Actions**.
2. Кожен push у `main` запускає `.github/workflows/deploy.yml`: перевірки, збірка, публікація на `https://romanovaleksander.github.io/daylist/`.
3. App key Dropbox для збірки: **Settings → Secrets and variables → Actions → Variables**, змінна `VITE_DROPBOX_APP_KEY`.

## Встановлення

- **Android:** Chrome → адреса застосунку → **⋮ → Встановити застосунок**.
- **Ubuntu:** Chrome або Chromium → іконка встановлення в адресному рядку. Застосунок з’явиться в меню програм.

Після першого відкриття все працює офлайн. Нова версія завантажується у фоні й вмикається при наступному запуску.

## Синхронізація через Dropbox

1. https://www.dropbox.com/developers/apps → **Create app** → **Scoped access** → **App folder**.
2. **Permissions:** `files.content.read`, `files.content.write` → **Submit**.
3. **Settings → OAuth 2 → Redirect URIs:** `https://romanovaleksander.github.io/daylist/` і `http://localhost:5173/daylist/`.
4. **App key** — у змінну `VITE_DROPBOX_APP_KEY` (локально — у `.env.local`, див. `.env.example`). App secret не потрібен: вхід через OAuth PKCE прямо з браузера.
5. У застосунку: **Налаштування → Підключити Dropbox** на кожному пристрої.

Дані лежать у файлі `Apps/<назва застосунку>/data.json`. Кожен пристрій має повну локальну копію; при синку файл зливається з локальними даними за правилом «новіша правка перемагає».

## Команди

```bash
npm run dev           # dev-сервер
npm run build         # production-збірка
npm run preview       # перегляд збірки (перевірка PWA й офлайну)
npm run typecheck     # перевірка типів
npm run lint          # ESLint
npm run format        # Prettier
npm test              # vitest (чиста логіка: збірка дня, merge, статистика)
```

## Структура

```
src/
├── app/        # роутер, провайдери, тема, i18n
├── pages/      # точки входу маршрутів (≤30 рядків)
├── modules/    # фіча-модулі: layout, day, inbox, goals, history, stats, sync, settings/*
├── db/         # Dexie, схеми й типи сутностей
├── ui/         # тупі примітиви
├── store/ hooks/ config/ locales/ utils/
```

Напрямок залежностей: `pages → modules (через index.ts) → ui`. Повний архітектурний контракт — у `CLAUDE.md` і `docs/claude/`.

## Конвенції

Коміти — Conventional Commits англійською, лише заголовок: `feat(day): add task on enter`. Перевіряє commitlint через lefthook.
