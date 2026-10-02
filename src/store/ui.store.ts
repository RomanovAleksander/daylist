import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  dayStartHour: number;
  setDayStartHour: (hour: number) => void;
  /** Категория, в которую поле внизу «Сьогодні» добавляет задачи. */
  composerCategoryId: string | null;
  setComposerCategoryId: (id: string) => void;
}

// Настройки устройства: не синхронизируются, у телефона и ноутбука могут отличаться.
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      dayStartHour: 0,
      setDayStartHour: (dayStartHour) => set({ dayStartHour }),
      composerCategoryId: null,
      setComposerCategoryId: (composerCategoryId) => set({ composerCategoryId }),
    }),
    { name: 'daylist-ui' }
  )
);
