import { useLiveQuery } from 'dexie-react-hooks';

import { db, type Task } from '@/db';
import type { DateKey } from '@/utils/date';

export interface PastDay {
  date: DateKey;
  tasks: Task[];
}

/** Последние `limit` собранных дней до сегодня, от новых к старым. */
export const usePastDays = (today: DateKey, limit: number): PastDay[] | undefined =>
  useLiveQuery(async () => {
    const days = await db.days.where('date').below(today).reverse().limit(limit).toArray();
    const oldest = days.at(-1);
    if (!oldest) return [];

    const tasks = await db.tasks.where('date').between(oldest.date, today).toArray();
    return days.map(({ date }) => ({ date, tasks: tasks.filter((task) => task.date === date) }));
  }, [today, limit]);
