import { useEffect } from 'react';

import { Dexie } from 'dexie';

import { completeLoginFromUrl } from '../api/dropbox.auth';
import { syncNow } from '../api/syncNow';
import { useSyncStore } from '../sync.store';

const DEBOUNCE_MS = 2000;

/** Запускает синк при старте, при возврате в приложение, появлении сети и после правок. */
export const useSyncEngine = () => {
  const setStatus = useSyncStore((s) => s.setStatus);

  useEffect(() => {
    let timer = 0;

    void completeLoginFromUrl()
      .catch(() => setStatus('error'))
      .finally(() => void syncNow());

    const now = () => void syncNow();
    const onVisible = () => document.visibilityState === 'visible' && now();
    const onOffline = () => setStatus('offline');
    // Собственная запись синка тоже даёт событие; следующий прогон ничего не загрузит.
    const onMutated = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(now, DEBOUNCE_MS);
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', now);
    window.addEventListener('online', now);
    window.addEventListener('offline', onOffline);
    Dexie.on('storagemutated', onMutated);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', now);
      window.removeEventListener('online', now);
      window.removeEventListener('offline', onOffline);
      Dexie.on('storagemutated').unsubscribe(onMutated);
    };
  }, [setStatus]);
};
