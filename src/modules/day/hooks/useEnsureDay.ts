import { useEffect, useState } from 'react';

import type { DateKey } from '@/utils/date';

import { ensureDays } from '../api/days.api';

/** Собирает день при открытии и при смене даты; возвращает число перенесённых в него задач. */
export const useEnsureDay = (today: DateKey): number => {
  const [carried, setCarried] = useState({ date: today, count: 0 });

  useEffect(() => {
    void ensureDays(today).then((count) => {
      // Повторный вызов (StrictMode, второй таб) вернёт 0 — не затираем им реальное число.
      if (count > 0) setCarried({ date: today, count });
    });
  }, [today]);

  return carried.date === today ? carried.count : 0;
};
