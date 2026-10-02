# UI

## Principles

Mobile-first, one column, max ~600px centred on desktop. Dark theme by default, light and system available. System font stack (no web fonts). Accent: amber `#E8A34A` (dark) — checkboxes, carry badges, active tab, chart; stale badges use a terracotta warning colour. No haptics. Tap targets ≥ 48px. Nothing on the today screen that is not a task, a category or the add row.

## Today screen (variant "Note")

- Header: date (`П’ятниця, 2 жовтня`), under it `2 з 9` and the sync dot. Nothing else.
- Category = small uppercase muted heading with a muted `1/3` counter on the right.
- Task row: checkbox (own 48px tap zone, toggles), text (tap → inline edit), carry badge `↻ N дн.` (accent; warning colour when stale).
- Done tasks are struck through and move to the bottom of their block with a short animation. Tapping again un-ticks.
- `+ задача` closes each block: Enter adds and keeps the input open for the next task; empty Enter, Esc or blur closes it.
- Edit mode: Enter / blur saves, Esc cancels, empty text deletes; inline actions `↻` (make recurring → template) and delete (for desktop).
- Task order inside a category: new tasks go to the end of the undone ones; no drag-and-drop for tasks.
- Delete: swipe left on touch, delete action in edit mode on desktop; no confirmation, `UndoSnackbar` for ~5 s.
- After assembly with carried tasks, a one-time quiet line: `Перенесено N задачі з минулого дня`.
- Tap on a stale badge → actions: to template / delete / keep.
- A category with no tasks today still shows its heading and `+ задача`.
- All done: the `9 з 9` line becomes `День закрито ✓` in accent. No animation beyond that.
- Empty state (no categories): `Додай першу категорію` with an inline input.

## Navigation

Bottom navigation with four tabs: Сьогодні / Історія / Статистика / Налаштування. The template editor opens from settings as a nested screen (bottom nav stays).

## Other screens

- **History** — feed of past days, newest first, loading backwards on scroll; each day shows `7/9 · 78%` and expands into `DayView` (read-only, retroactive tick allowed).
- **Stats** — today `X/Y`; week bars (`@mui/x-charts`) with days ≥ 80% in accent; per category "closed fully N of M days" for week/month; streak of days ≥ 80% (a missed day is assembled with everything undone, so it breaks the streak); stale tasks list.
- **Settings** — one scrolling screen: categories (rename inline, reorder by drag via `@dnd-kit`), template link, Dropbox (status, last sync time, connect/disconnect), appearance (theme, day start hour), data (export/import JSON).

## Out of scope

Reminders, notifications and app badges — reliable PWA push needs a server, and they drift towards a planner.

## MUI

- Colours, radii and spacing come from theme tokens in `app/theme/` — no literal colours in components.
- Clickable wrappers declare what they render (`component="button"` / `RouterLink`) — linted.
- Every icon-only button has an accessible name via `aria-label` from i18n.

## i18n

One dictionary `src/locales/uk.json`. Every user-facing string goes through `t()`. Keys are grouped by module (`day.addTask`, `settings.theme.dark`). Plurals via i18next plural suffixes (`_one`, `_few`, `_many`).
