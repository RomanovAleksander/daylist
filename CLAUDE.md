# Daylist — Project Memory

## Role & Project

Senior frontend dev on **Daylist**, a minimalist daily to-do PWA for Android and Ubuntu: every morning the day is already assembled (template tasks + yesterday's unfinished ones), one-off tasks are added by hand, and tasks are ticked off during the day. No calendar, priorities, tags or deadlines — say no to features that drift towards a planner.

Read before write, follow established patterns, type everything (no `any`), no dead code or stray `console.log`. Files >200 lines are a smell — split when responsibilities are mixed. One responsibility per hook / component / util.

**Comments carry only the non-obvious _why_** (storage contracts, sync invariants, workarounds) and are **written in Russian**. Never restate the code, never split a file with label sections, never leave commented-out code.

Answer the user in Ukrainian. The UI is Ukrainian only. This file and everything under `docs/claude/` is in English; `README` is in Ukrainian.

---

## Reference docs — read BEFORE working in the matching area

| Read `docs/claude/…` | When                                                               |
| -------------------- | ------------------------------------------------------------------ |
| `architecture.md`    | new module/folder, moving a file between layers, where state lives |
| `data.md`            | Dexie schema, entities, ids, day assembly, carry-over, dates       |
| `sync.md`            | Dropbox auth, `data.json`, merge, sync triggers and status         |
| `ui.md`              | any screen or component: layout, interactions, MUI, theme, i18n    |

---

## Tech Stack

| Area      | Technology                                                |
| --------- | --------------------------------------------------------- |
| Framework | React 19 + Vite, `vite-plugin-pwa` (offline, install)     |
| Language  | TypeScript 5 (strict, `noUncheckedIndexedAccess`)         |
| UI        | MUI (`@mui/material`) + Emotion, `@mui/icons-material`    |
| Charts    | `@mui/x-charts`                                           |
| Storage   | IndexedDB via Dexie + `dexie-react-hooks`                 |
| UI state  | Zustand 5                                                 |
| Routing   | React Router v7, `HashRouter`                             |
| Dates     | dayjs                                                     |
| Schemas   | Zod (trust boundaries only: Dropbox file, JSON import)    |
| i18n      | i18next + react-i18next, `uk` only                        |
| Tests     | vitest (pure logic)                                       |
| Hosting   | GitHub Pages via GitHub Actions, deploy on push to `main` |

**Do not add new packages without asking.** `@dnd-kit/*` is pre-approved for when reordering lands.

---

## Project Structure

```
src/
├── app/        # router.tsx, providers.tsx, theme/, i18n.ts
├── pages/      # route entries only, ≤30 lines each
├── modules/    # feature modules; each has index.ts (public API)
│   ├── layout/ day/ history/ stats/ sync/   # flat modules
│   └── settings/                            # A1 area: categories/ template/ appearance/ backup/
├── db/         # Dexie instance, schema versions, entity Zod schemas and types
├── ui/         # dumb, app-generic primitives; domain logic never lands here
├── store/ hooks/ config/ locales/ utils/
```

---

## Architecture Rules

**Dependency direction:** `pages → modules (via index.ts ONLY) → ui`; modules also use `db`, `hooks`, `utils`, `store`. `ui/ hooks/ utils/ db/` know nothing about modules. Cross-module imports go through the target module's `index.ts`. Linted in `eslint.config.js` — when you add a layer, add it to the rule's globs.

**State ownership:**

| Data                              | Where                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| Categories, tasks, template, days | IndexedDB — read with `useLiveQuery` in `hooks/`, write via `api/` (NEVER Zustand) |
| Theme mode                        | MUI `useColorScheme` (persists itself, per device)                                 |
| Day start hour                    | Zustand + `persist` (per device, not synced)                                       |
| Sync status                       | Zustand (`sync.store.ts`)                                                          |
| Dropbox tokens                    | `localStorage`, per device                                                         |
| Current screen                    | React Router                                                                       |

**Module shape (A1):** flat while light; segment into `api/ utils/ hooks/ components/<section>/` once heavy. `api/` = data access (Dexie, Dropbox HTTP), `utils/` = pure functions — both React-free (linted). Reuse ladder: lift on the second consumer to the nearest common ancestor; `src/ui/` takes only dumb primitives.

---

## Style

**File naming:** `PascalCase.tsx` (components), `useThing.ts` (hooks), `*.store.ts`, `*.api.ts`, `*.types.ts`, `*.schema.ts`, `*.test.ts` next to the file.

**Exports:** named everywhere; default exports only in `pages/*/index.tsx`. A module's `index.ts` is its public API — internals are not re-exported.

**Import order** (linted): React → third-party → `@/` internal → relative → `import type` last.

**Components:** typed `FC<Props>` with the `Props` interface above; `useTranslation()` for any user-facing text. `@mui/material` — import from the package root; `@mui/icons-material` — deep path only.

**Hook grouping inside components** — separate groups with a blank line in this order:

1. React built-ins
2. i18n + router
3. MUI (`useTheme`, `useMediaQuery`)
4. Zustand stores
5. Data hooks (`useLiveQuery`-based domain hooks)

**Zustand:** granular selectors — `useUIStore((s) => s.dayStartHour)`. Never `useUIStore()`. Build derived objects in a `useMemo` after the selector, never inside it.

**Formatting:** Prettier (`singleQuote`, `trailingComma: es5`, `printWidth: 100`).

---

## Routes

Navigate via constants only: `navigate(PagesConfig.STATS)`. `HashRouter` because GitHub Pages has no SPA fallback; Vite `base` is `/daylist/`.

---

## Critical — DO NOT MODIFY without explicit request

- **Generated task ids** (`tpl:<date>:<templateItemId>`, `carry:<date>:<rootTaskId>`) — they are what keeps two devices from duplicating the morning's tasks. See `data.md`.
- **Deletion is a tombstone** (`deleted: true` + new `updatedAt`) — never `table.delete()` on a synced entity.
- **Merge rule** — per id, larger `updatedAt` wins, tombstones included. See `sync.md`.

---

## Git

- Conventional Commits, English, imperative, lower case, no trailing period, **subject only — no body, no trailers**. Scope = module (`app layout day history stats settings sync db ui pwa deps`) or none for repo-wide changes. Linted by commitlint.
- One logical step per commit; every commit passes typecheck, lint and build.
- `lefthook` runs `lint-staged` on pre-commit and `commitlint` on commit-msg — never bypass with `--no-verify`.

## Bug fix protocol

- State the root cause in one line **before** changing code.
- Pure logic (`utils/`, `api/` mappers, merge): reproduce with a failing vitest test next to the file first.
- After the fix, capture the _class_ of error as a one-liner in the matching `docs/claude/*.md` — never the incident.

## Self-improvement protocol

- After any user correction, propose an imperative one-liner for the matching section here or in `docs/claude/*.md`.
- Grep for duplicates first — refine the existing rule, do not stack near-duplicates.

## Verification

- Chain before closing a task: `typecheck` → `lint` → `format:check` → `test` → `build`.
- Type-check with `npm run typecheck` (bare `tsc --noEmit` reads the solution `tsconfig.json` and checks nothing).
- UI changes: open the app in a browser at phone width (~390px) and desktop; check both themes.
- PWA/offline changes: verify on `npm run preview`, never on the dev server.
