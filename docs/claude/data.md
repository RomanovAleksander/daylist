# Data

## Entities

All synced entities carry `id: string`, `updatedAt: number` (ms, `Date.now()`), `deleted?: true`.

```ts
Category     { id, name, order, updatedAt, deleted? }
Task         { id, date, categoryId, text, done, doneAt?, recurring,
               carriedFrom?, carryCount, order, updatedAt, deleted? }
TemplateItem { id, categoryId, text, order, updatedAt, deleted? }
Day          { id /* = date */, date, builtAt, updatedAt }
```

- `date` is a local `YYYY-MM-DD` string (`DateKey`), never a timestamp or UTC. All date math goes through `utils/date.ts` (dayjs).
- A day starts at the per-device "day start hour" (default 00:00): before it, "today" is still the previous date.
- Zod schemas for every entity live in `db/` and validate anything coming from outside (Dropbox, JSON import).

## Ids

- User-created entities: `crypto.randomUUID()`.
- **Generated tasks get deterministic ids** so two devices assembling the same day converge on the same rows:
  - from template: `tpl:<date>:<templateItemId>`
  - carried over: `carry:<date>:<rootTaskId>` where `rootTaskId` is the first appearance (`carriedFrom ?? id`).
- Assembly inserts only ids that do not exist yet — **including tombstones**, so a template task deleted today is not resurrected.

## Deletion

Tombstone only: set `deleted: true` and bump `updatedAt`. Undo clears `deleted` and bumps `updatedAt` again. Queries filter tombstones out. Tombstones are never purged (≈1 MB/year).

## Day assembly (`ensureDay(today)`)

Runs on start, on `visibilitychange`/`focus` and on the local midnight (day start) timer. Idempotent.

1. Find the latest existing `Day` before today. Every date from the day after it up to today that has no `Day` is assembled in order — **missed days are created**, so history and stats show them as days with nothing done. Capped at 60 days back.
2. For each date, template: one task per live `TemplateItem` (`recurring: true`, `carryCount: 0`).
3. Carry-over from the previous date: every live, not done, **non-recurring** task gets a copy with `carriedFrom = rootTaskId` and `carryCount` = calendar days since the root's date.
4. Write tasks + `Day { builtAt }` in one Dexie transaction.
5. No `Day` exists at all (first launch) → assemble today only.

- Recurring tasks never carry — the template recreates them.
- The source task stays undone in its day; history shows it as "→ перенесено".
- A new template item is also added to today if today is already built; a removed one disappears from tomorrow.
- "Stale" (висяк) = `carryCount >= 3`.

## Past days

Read-only in history, except ticking a task done retroactively.

## Category deletion

Tombstones the category, its template items and its tasks of today. Tasks of past days stay; history keeps the category name via the tombstoned row.
