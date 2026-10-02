# UI

## Principles

Simple like a banking app: one primary action per screen, the key number large, item actions in a bottom sheet with labelled rows (`BottomSheet` + `SheetAction`) instead of small unlabeled icons, rarely changed settings behind «⋯». Mobile-first, one column, max ~600px centred on desktop. Dark theme by default, light and system available. System font stack. Accent: amber `#E8A34A` (dark); stale badges use a terracotta warning colour. No haptics. Tap targets ≥ 48px. Cards have large radii (~20px).

## Today screen

- Hero: `ProgressRing` with `4/9` and `%`, weekday in bold, date (or `День закрито ✓`) and the one-time line `Перенесено N задачі з минулого дня`.
- Each category is a rounded card: optional emoji, name, `1/3` counter. A fully done category collapses to one line with `✓`; the arrow expands it.
- Tap on the category name → category sheet: emoji picker, name, «Додати задачу сюди» (switches the composer to this category and focuses it), «Вище» / «Нижче», delete with confirmation.
- Task row: checkbox (toggles), text (tap → task sheet), carry badge `↻ N дн.` (warning colour when stale). Swipe left deletes with an undo snackbar.
- Task sheet: editable text (saved on close and before any action), «Робити щодня» (→ template), «Перенести у Вхідні», «Інша категорія», «Видалити задачу».
- Adding: only through the bottom `Composer` above the navigation — a category chip (last choice remembered per device, menu also has «Нова категорія») and the input; Enter adds and keeps focus. No add rows inside cards.
- Done tasks are struck through and sink to the bottom of their card. New tasks go to the end of the undone ones; no drag-and-drop for tasks.
- Empty state (no categories): `Додай першу категорію` with an inline input; the composer appears once a category exists.

## Loading

Only the today screen is in the entry chunk; history, stats (with `@mui/x-charts`), settings and template are lazy routes.

## Navigation

Bottom navigation with four tabs: Сьогодні / Вхідні / Цілі / Ще. «Ще» is a menu screen with Історія, Статистика, Налаштування; those screens show a back arrow to «Ще» and keep the «Ще» tab active. The template editor and the goal card are nested screens with a back arrow.

## Inbox screen

- The same bottom `Composer` («Що спало на думку?»): Enter adds and keeps focus. No reminder on the today screen.
- Rows: checkbox, text (tap → sheet: edit text, «Перенести в сьогодні» with a category list, delete), age on the right (`щойно`, `3 дн.`, `2 тиж.`, `3 міс.`).
- Swipe left deletes (undo snackbar), swipe right opens the category picker and moves the task to today.
- Collapsed «Зроблено · N» at the bottom (last 30 days).

## Goals screen

- One list of «jars», no sections: dated goals by deadline, then global goals, then dreams; collapsed «Досягнуто · N» below. Each jar: `ProgressRing` (steps `1/2`, percent, time elapsed for a dated goal without a measure, `→` global, `✦` dream), title, subtitle (amount, next step, deadline, «без дати», «мрія»), days left on the right (`−N дн.` when overdue).
- «+ Ціль» in the header opens a three-step wizard, one question per screen: name + goal/dream (a dream is created right away) → date (end of month / end of year / custom / no date → global) → measure (steps / amount with target and unit / just the countdown).
- Goal screen: big ring (amount and target for number goals), one context line (days left, ≈ per month), one primary button («+ Додати суму» → amount sheet, «Досягнуто ✓», «Збулось ✓»; none for step goals — the steps list is the action), overdue → three actions, steps list, «Що робити» description. Type, deadline, measure, number fields, reopen and delete live in the «⋯» sheet.

## Other screens

- **History** — feed of past days, newest first, loading backwards on scroll; each day shows `7/9 · 78%` and expands into `DayView` (read-only, retroactive tick allowed).
- **Stats** — today `X/Y`; week bars (`@mui/x-charts`) with days ≥ 80% in accent; per category "closed fully N of M days" for week/month; streak of days ≥ 80% (a missed day is assembled with everything undone, so it breaks the streak); stale tasks list.
- **Settings** — one scrolling screen: categories (also manageable from the today screen; here rename inline and reorder by drag via `@dnd-kit`), template link, Dropbox (status, last sync time, connect/disconnect), appearance (theme dark / light / system via MUI `useColorScheme`, day start hour 00:00–06:00), data (export/import JSON).

## Out of scope

Reminders, notifications and app badges — reliable PWA push needs a server, and they drift towards a planner.

## MUI

- Colours, radii and spacing come from theme tokens in `app/theme/` — no literal colours in components.
- Clickable wrappers declare what they render (`component="button"` / `RouterLink`) — linted.
- Every icon-only button has an accessible name via `aria-label` from i18n.

## i18n

One dictionary `src/locales/uk.json`. Every user-facing string goes through `t()`. Keys are grouped by module (`day.newTaskIn`, `goals.wizard.next`). Remove keys that lose their last usage. Plurals via i18next plural suffixes (`_one`, `_few`, `_many`).
