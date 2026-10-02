import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  dayStartHour: number;
  setDayStartHour: (hour: number) => void;
}

// Настройки устройства: не синхронизируются, у телефона и ноутбука могут отличаться.
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      dayStartHour: 0,
      setDayStartHour: (dayStartHour) => set({ dayStartHour }),
    }),
    { name: 'daylist-ui' }
  )
);
