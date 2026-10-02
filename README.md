# Daylist

Мінімалістичний список справ на день. PWA для Android і Ubuntu, працює офлайн, синхронізується через Dropbox.

Щоранку день уже зібраний: задачі з шаблону плюс невиконане з учора. Разові задачі дописуються вручну, протягом дня відмічаються. Без календаря, пріоритетів, тегів і дедлайнів.

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

## Команди

```bash
npm run dev           # dev-сервер
npm run build         # production-збірка
npm run preview       # перегляд збірки (перевірка PWA й офлайну)
npm run typecheck     # перевірка типів
npm run lint          # ESLint
npm run format        # Prettier
```

## Структура

```
src/
├── app/        # роутер, провайдери, тема, i18n
├── pages/      # точки входу маршрутів (≤30 рядків)
├── modules/    # фіча-модулі: layout, day, history, stats, sync, settings/*
├── db/         # Dexie, схеми й типи сутностей
├── ui/         # тупі примітиви
├── store/ hooks/ config/ locales/ utils/
```

Напрямок залежностей: `pages → modules (через index.ts) → ui`. Повний архітектурний контракт — у `CLAUDE.md` і `docs/claude/`.

## Конвенції

Коміти — Conventional Commits англійською, лише заголовок: `feat(day): add task on enter`. Перевіряє commitlint через lefthook.
