# Architecture

## Layers

```
pages ──▶ modules (index.ts) ──▶ ui
              │
              ├──▶ db      (Dexie instance, schemas, entity types)
              ├──▶ hooks   (app-generic: useToday, useOnline)
              ├──▶ utils   (pure: date.ts, id.ts)
              └──▶ store   (Zustand: ui.store.ts)
```

- `pages/<name>/index.tsx` — default export, ≤30 lines, renders one module screen. No logic.
- `modules/*` — features. Each exposes only what other modules or pages need from `index.ts`.
- `ui/*` — dumb primitives (`InlineInput`, `SwipeRow`, `EmptyState`, `UndoSnackbar`). Props in, callbacks out. Extracted just-in-time on the second consumer.
- `db/` — the only place that creates the Dexie instance and declares schema versions. Leaf: imports nothing from `modules/`.

## Modules

| Module                | Owns                                                                     |
| --------------------- | ------------------------------------------------------------------------ |
| `layout`              | `AppShell` (single 600px column), `TopBar`, `SyncIndicator`              |
| `day`                 | today screen, `DayView` (reused by history), day assembly, carry-over    |
| `inbox`               | undated tasks: capture field, list, move to today, done section          |
| `goals`               | goals list (deadline / global / dreams), goal card, steps, progress math |
| `history`             | feed of past days, lazy loading backwards                                |
| `stats`               | pure calculations + charts, streak, stale tasks                          |
| `sync`                | Dropbox OAuth PKCE, file transport, merge, sync engine, status store     |
| `settings/categories` | add / rename / reorder / delete categories                               |
| `settings/template`   | recurring tasks editor (same look as today, no checkboxes)               |
| `settings/appearance` | theme, day start hour                                                    |
| `settings/backup`     | JSON export / import                                                     |

## Segments inside a heavy module

```
modules/day/
├── TodayScreen.tsx     # orchestrator
├── index.ts            # public API
├── api/                # Dexie queries/writes (*.api.ts) — no React
├── utils/              # pure functions + *.test.ts — no React
├── hooks/              # useLiveQuery readers, action hooks
└── components/         # CategoryBlock, TaskRow, AddTaskInput, CarryBadge
```

`api/` and `utils/` are React-free (linted). Reads go through `useLiveQuery` in `hooks/`; components never touch `db` directly.

## Reuse ladder

One section → `components/`; two modules → nearest common ancestor (`settings/shared/` inside an area); dumb and app-generic → `src/ui/`. Domain logic never goes to `ui/`.

## Stubs

`export {}` in an `index.ts` is an architectural placeholder. Do not import from it; replace it with real exports in the same change that adds logic.
