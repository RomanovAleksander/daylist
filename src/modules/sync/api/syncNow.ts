import { useSyncStore } from '../sync.store';
import { isConnected, isDropboxConfigured } from './dropbox.auth';
import { downloadSnapshot, uploadSnapshot } from './dropbox.files';
import { ConflictError, OfflineError } from './errors';
import { applySnapshot, readLocalSnapshot } from './local.snapshot';
import { hasChanges, mergeSnapshots } from '../utils/merge';
import { emptySnapshot } from '../utils/snapshot.schema';

const MAX_ATTEMPTS = 3;

const syncOnce = async () => {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const remote = await downloadSnapshot();
    const merged = mergeSnapshots(await readLocalSnapshot(), remote?.snapshot ?? emptySnapshot());
    await applySnapshot(merged);

    if (remote && !hasChanges(merged, remote.snapshot)) return;
    try {
      await uploadSnapshot(merged, remote?.rev ?? null);
      return;
    } catch (error) {
      // Другое устройство записало файл между download и upload — сливаем заново.
      if (!(error instanceof ConflictError)) throw error;
    }
  }
  throw new Error('sync: too many conflicts');
};

let running: Promise<void> | null = null;
let queued = false;

/**
 * Одновременно идёт один синк. Триггер во время синка ставит ровно один повтор: правка,
 * сделанная посреди синка, могла не попасть в загруженный файл.
 */
export const syncNow = (): Promise<void> => {
  if (running) {
    queued = true;
    return running;
  }

  const { setStatus, markSynced } = useSyncStore.getState();
  if (!isDropboxConfigured() || !isConnected()) {
    setStatus('disconnected');
    return Promise.resolve();
  }

  running = (async () => {
    do {
      queued = false;
      if (!navigator.onLine) {
        setStatus('offline');
        return;
      }
      setStatus('syncing');
      try {
        await syncOnce();
        markSynced();
      } catch (error) {
        setStatus(error instanceof OfflineError ? 'offline' : 'error');
        return;
      }
    } while (queued);
  })().finally(() => {
    running = null;
  });
  return running;
};
