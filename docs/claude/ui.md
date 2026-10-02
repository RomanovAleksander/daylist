# UI

## Principles

Simple like a banking app: one primary action per screen, the key number large, item actions in a bottom sheet with labelled rows (`BottomSheet` + `SheetAction`) instead of small unlabeled icons, rarely changed settings behind «⋯». Mobile-first, one column, max ~600px centred on desktop. Dark theme by default, light and system available. System font stack. Accent: amber `#E8A34A` (dark); stale badges use a terracotta warning colour. No haptics. Tap targets ≥ 48px.

Scale: rows are grouped in `ui/Card` (radius 20px, 16px side padding, 12px between cards); sheets 24px; inputs, the composer and large buttons 14px, 48–52px high; chips and buttons 12px; icon tiles 10px. Section labels are 12px uppercase secondary. Body text 16px, secondary lines 13px, screen titles 22px.

## Today screen

Two layouts, chosen per device in Settings → «Вигляд «Сьогодні»» (`todayLayout` in `ui.store`): «Картки» (default, described below) and «Список» — a `DayHeader` with `Пʼятниця, 2 жовтня`, `4 з 9 · 44%` and a thin bar, then each category as an uppercase label with its counter and flat task rows on the screen background. Rows, sheets and the composer are the same in both.

- Hero: `ProgressRing` with `4/9` and `%`, weekday in bold, date (or `День закрито ✓`) and the one-time line `Перенесено N задачі з минулого дня`.
- Each category is a rounded card: optional emoji, name, `1/3` counter. A fully done category collapses to one line with `✓`; the arrow expands it.
- Tap on the category name → category sheet: emoji picker, name, «Додати задачу сюди» (switches the composer to this category and focuses it), «Вище» / «Нижче», delete with confirmation.
- Task row: checkbox (toggles), text (tap → task sheet), carry badge `↻ N дн.` (warning colour when stale). Swipe left deletes with an undo snackbar.
- Task sheet: editable text (saved on close and before any action), «Робити щодня» (→ template) or, for a daily task, «Більше не робити щодня» (tombstones its template item; today's task stays as a one-off), «Перенести у Вхідні», «Інша категорія», «Видалити задачу».
- Adding: only through the bottom `Composer` above the navigation — a category chip (last choice remembered per device, menu also has «Нова категорія») and the input; Enter adds and keeps focus. No add rows inside cards.
- Done tasks are struck through and sink to the bottom of their card. New tasks go to the end of the undone ones; no drag-and-drop for tasks.
- Empty state (no categories): `Додай першу категорію` with an inline input; the composer appears once a category exists.

## On-screen keyboard

The viewport uses `interactive-widget=resizes-content`, so the Android keyboard shrinks the layout and anything pinned to the bottom (composer, sheets, buttons) stays above it. While `useKeyboardOpen` is true the bottom navigation is hidden and the composer sits right on the keyboard. Never pin a submit button with `100vh`/`dvh` maths — put it in a sheet or right after the field.

## Loading

Only the today screen is in the entry chunk; history, stats (with `@mui/x-charts`), settings and template are lazy routes.

## Navigation

Bottom navigation with four tabs: Сьогодні / Вхідні / Цілі / Ще. «Ще» is a menu screen with Історія, Статистика, Налаштування; those screens show a back arrow to «Ще» and keep the «Ще» tab active. The template editor and the goal card are nested screens with a back arrow.

## Inbox screen

- The same bottom `Composer` («Що спало на думку?»): Enter adds and keeps focus. No reminder on the today screen.
- Rows: checkbox, text with up to two grey lines of its description below, age on the right (`щойно`, `3 дн.`, `2 тиж.`, `3 міс.`). Tap → sheet: edit text, «Опис» (multiline, saved on close), «Перенести в сьогодні» with a category list, delete. Day tasks have no description, so moving to today keeps only the text.
- Swipe left deletes (undo snackbar), swipe right opens the category picker and moves the task to today.
- Collapsed «Зроблено · N» at the bottom (last 30 days).

## Goals screen

- One card of rows, no rings: title with days left on the right (`−N дн.` when overdue), a subtitle (`Кроки 1/3 · наступне: …`, `$4 315 з $12 000`, deadline, «без дати») and a thin bar — accent for steps/amount, grey for elapsed time of a dated goal without a measure. Dated goals by deadline, then global goals. Dreams follow under «Мрії» as `✦ title` rows; collapsed «Досягнуто · N» below.
- «+ Ціль» in the header opens one sheet: name, «Коли?» (end of month / end of year / custom / no date → global / ✦ dream) and, unless it is a dream, «Як міряти прогрес?» (just the time, default / steps / amount with target and unit). The measure stays an explicit choice; it can be changed later in «⋯».
- Goal screen: big ring (amount and target for number goals), one context line (days left, ≈ per month), one primary button («+ Додати суму» → amount sheet, «Досягнуто ✓», «Збулось ✓»; none for step goals — the steps list is the action), overdue → three actions, steps list, «Що робити» description. Type, deadline, measure, number fields, reopen and delete live in the «⋯» sheet.

## Other screens

- **History** — feed of past days, newest first, loading backwards on scroll; each day shows `7/9 · 78%` and expands into `DayView` (read-only, retroactive tick allowed).
- **Stats** — tiles «Сьогодні X/Y» and the streak of days ≥ 80% (a missed day is assembled with everything undone, so it breaks the streak); a Тиждень / Місяць / Рік switch over rolling 7 / 30 / 365 days drives the big `%` (task-weighted) with `↑/↓ N%` against the previous window of the same length, closed tasks and good days, a bar chart (days ≥ 80% in accent; the year shows 12 calendar months, all accent) and categories closed fully with bars; then a heatmap of the last 18 weeks (Monday rows, 5 levels of the accent, grey = no tasks) and the stale tasks list.
- **Settings** — one scrolling screen: categories (also manageable from the today screen; here rename inline and reorder by drag via `@dnd-kit`), template link, Dropbox (status, last sync time, connect/disconnect), appearance (theme dark / light / system via MUI `useColorScheme`, today layout cards / list, day start hour 00:00–06:00), data (export/import JSON).

## Out of scope

Reminders, notifications and app badges — reliable PWA push needs a server, and they drift towards a planner.

## MUI

- Colours, radii and spacing come from theme tokens in `app/theme/` — no literal colours in components.
- A numeric `borderRadius` in `sx` is multiplied by `shape.borderRadius`; keep that unit at 4px, or every radius in the app scales with it.
- Clickable wrappers declare what they render (`component="button"` / `RouterLink`) — linted.
- Every icon-only button has an accessible name via `aria-label` from i18n.

## i18n

One dictionary `src/locales/uk.json`. Every user-facing string goes through `t()`. Keys are grouped by module (`day.newTaskIn`, `goals.create.submit`). Remove keys that lose their last usage. Plurals via i18next plural suffixes (`_one`, `_few`, `_many`).
