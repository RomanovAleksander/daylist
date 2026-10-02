import { db } from '@/db';
import type { DateKey } from '@/utils/date';

import { assembleDays } from '../utils/assembleDays';

/**
 * Собирает недостающие дни до `today` включительно и возвращает, сколько задач перенесено в
 * сегодня. Идемпотентна: повторный вызов (StrictMode, второй таб) видит готовый Day и выходит.
 */
export const ensureDays = (today: DateKey): Promise<number> =>
  db.transaction('rw', db.days, db.tasks, db.templateItems, async () => {
    const lastDay = await db.days.where('date').belowOrEqual(today).last();
    if (lastDay?.date === today) return 0;

    const lastTasks = lastDay ? await db.tasks.where('date').equals(lastDay.date).toArray() : [];
    const templateItems = await db.templateItems.toArray();
    const existingTasks = await db.tasks
      .where('date')
      .between(lastDay?.date ?? today, today, false, true)
      .toArray();

    const { days, tasks } = assembleDays({
      today,
      lastDay: lastDay ? { date: lastDay.date, tasks: lastTasks } : null,
      templateItems,
      existing: new Map(existingTasks.map((task) => [task.id, task])),
      now: Date.now(),
    });

    await db.tasks.bulkPut(tasks);
    await db.days.bulkPut(days);

    return tasks.filter((task) => task.date === today && task.carriedFrom).length;
  });
