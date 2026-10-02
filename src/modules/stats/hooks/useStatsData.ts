import { useLiveQuery } from 'dexie-react-hooks';

import { db, type Category } from '@/db';
import type { DateKey } from '@/utils/date';

import { groupByDate, type TasksByDate } from '../utils/stats';

export interface StatsData {
  byDate: TasksByDate;
  builtDates: Set<DateKey>;
  categories: Category[];
}

// Задач за год — несколько тысяч строк: считать статистику в памяти дешевле, чем индексы.
export const useStatsData = (): StatsData | undefined =>
  useLiveQuery(async () => {
    const [tasks, days, categories] = await Promise.all([
      db.tasks.toArray(),
      db.days.toArray(),
      db.categories.toArray(),
    ]);
    return {
      byDate: groupByDate(tasks.filter((task) => !task.deleted)),
      builtDates: new Set(days.map((day) => day.date)),
      categories: categories.filter((c) => !c.deleted).sort((a, b) => a.order - b.order),
    };
  }, []);
