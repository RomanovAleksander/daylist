# Sync

## Transport

- Dropbox, **App folder** access, single file `/data.json`.
- OAuth 2 **PKCE** in the browser, no backend. `token_access_type=offline` → refresh token. App key from `VITE_DROPBOX_APP_KEY`. Tokens stay in `localStorage` on the device.
- Redirect URI = the app URL (`https://romanovaleksander.github.io/daylist/` and `http://localhost:5173/daylist/` for dev).

## File shape

```ts
{
  version: (2, categories, tasks, templateItems, days, inboxItems, goals, goalSteps);
}
```

Validated with Zod before merge. A `version: 1` file is read as version 2 with empty inbox and goals; a client that only knows version 1 reports an error instead of overwriting newer data. An invalid file never overwrites local data — status becomes "error".

## Merge

Per entity type, per `id`: keep the record with the larger `updatedAt`; tombstones are ordinary records and win the same way. Pure function in `modules/sync/utils/merge.ts`, covered by vitest (commutative, idempotent, tombstone wins when newer).

Last-write-wins on device clocks is accepted for a single user.

## Write protocol

1. Download `/data.json` with its `rev` (404 → treat as empty).
2. Merge remote into local; write the merge result to IndexedDB.
3. Upload with `mode: { ".tag": "update", update: rev }` (or `add` when the file did not exist).
4. On `409 conflict` → repeat from step 1 (bounded retries).

## Triggers

On start, on `visibilitychange` → visible and `focus`, and ~2 s debounce after any local write. One sync at a time; a trigger during a running sync schedules exactly one more run.

## Status

`ok` / `syncing` / `offline` / `error` in `sync.store.ts`, shown as a small dot in the top bar. No modals; tapping the dot on error opens settings.

## JSON import

Import goes through the same Zod validation and `merge` as sync — it never wipes local data.

## App updates

`vite-plugin-pwa` with `registerType: 'autoUpdate'`: a new version downloads in the background and activates on the next launch, no prompt.
