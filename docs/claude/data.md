# Data

## Entities

All synced entities carry `id: string`, `updatedAt: number` (ms, `Date.now()`), `deleted?: true`.

```ts
Category     { id, name, order, updatedAt, deleted? }
Task         { id, date, categoryId, text, done, doneAt?, recurring,
               carriedFrom?, carryCount, order, updatedAt, deleted? }
TemplateItem { id, categoryId, text, order, updatedAt, deleted? }
Day          { id /* = date */, date, builtAt, updatedAt }
InboxItem    { id, text, createdAt, done, doneAt?, updatedAt, deleted? }
Goal         { id, kind: 'dated' | 'global' | 'dream', title, description,
               startDate, deadline?, measure: 'steps' | 'number' | 'none',
               current?, target?, unit?, achievedAt?, order, updatedAt, deleted? }
GoalStep     { id, goalId, text, done, order, updatedAt, deleted? }
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

## Inbox

- Newest first; age shown relative to `createdAt`.
- Moving to today creates an ordinary one-off task in the chosen category and tombstones the inbox item. If it is not done today, it carries like any task — it never returns to the inbox.
- Done items stay in a collapsed «Зроблено» section for 30 days after `doneAt`, then are hidden (not deleted).

## Goals

- `dated` goals show days left to `deadline` and a time bar from `startDate` to `deadline`; `global` goals have no date; `dream` is a wish ticked when it comes true.
- Progress is chosen per goal: `steps` (done / total), `number` (`current` / `target`, with `unit`) or `none`.
- Goal steps are not linked to the day.
- Past deadline and not achieved: show `−N дн.` with three actions — achieved / new date / move to global.
- `achievedAt` moves a goal (or dream) to the collapsed «Досягнуто» section.

## Past days

Read-only in history, except ticking a task done retroactively. Ticking a carried task done in the past also tombstones its undone copies on later days (same `carriedFrom` root) — it was finished, so it must stop hanging.

## Category deletion

Tombstones the category, its template items and its tasks of today. Tasks of past days stay; history keeps the category name via the tombstoned row.

## Known pitfalls

- Dexie's optimistic `liveQuery` cache is disabled (`cache: 'disabled'`): it dropped rows written by another transaction from cached `where()` results. Do not re-enable it without an end-to-end check of the today screen.
- Changing the day start hour late at night can make "today" move back to a date before the latest built day; that date is then assembled as a fresh day without carry-over. Accepted: the setting is changed rarely.
- Any write that derives `order` from existing rows (max + 1) runs the read and the write in one Dexie `rw` transaction — two quick adds otherwise get the same `order` and an arbitrary relative position.
