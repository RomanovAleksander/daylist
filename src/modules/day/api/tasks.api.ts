import { db, type Task } from '@/db';
import type { DateKey } from '@/utils/date';
import { createId } from '@/utils/id';

/** Транзакция: см. addCategory — иначе две быстро добавленные задачи получат один order. */
export const addTask = (date: DateKey, categoryId: string, text: string) =>
  db.transaction('rw', db.tasks, async () => {
    const siblings = await db.tasks.where('date').equals(date).toArray();
    const order =
      Math.max(0, ...siblings.filter((t) => t.categoryId === categoryId).map((t) => t.order)) + 1;
    const task: Task = {
      id: createId(),
      date,
      categoryId,
      text,
      done: false,
      recurring: false,
      carryCount: 0,
      order,
      updatedAt: Date.now(),
    };
    await db.tasks.add(task);
  });

export const setTaskDone = (id: string, done: boolean) => {
  const now = Date.now();
  return db.tasks.update(id, { done, doneAt: done ? now : undefined, updatedAt: now });
};

export const updateTaskText = (id: string, text: string) =>
  db.tasks.update(id, { text, updatedAt: Date.now() });

export const deleteTask = (id: string) =>
  db.tasks.update(id, { deleted: true, updatedAt: Date.now() });

export const restoreTask = (id: string) =>
  db.tasks.update(id, { deleted: undefined, updatedAt: Date.now() });
