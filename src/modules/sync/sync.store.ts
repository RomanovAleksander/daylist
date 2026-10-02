import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SyncStatus = 'disconnected' | 'syncing' | 'ok' | 'offline' | 'error';

interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number | null;
  setStatus: (status: SyncStatus) => void;
  markSynced: () => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      status: 'disconnected',
      lastSyncedAt: null,
      setStatus: (status) => set({ status }),
      markSynced: () => set({ status: 'ok', lastSyncedAt: Date.now() }),
    }),
    // Статус после перезапуска неизвестен до первого синка, сохраняем только время.
    { name: 'daylist-sync', partialize: ({ lastSyncedAt }) => ({ lastSyncedAt }) }
  )
);
