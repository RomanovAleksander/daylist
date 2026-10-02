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

/** Порядок пишем всей категории разом: см. reorderCategories. */
export const reorderTasks = (ids: string[]) => {
  const updatedAt = Date.now();
  return db.tasks.bulkUpdate(
    ids.map((id, index) => ({ key: id, changes: { order: index + 1, updatedAt } }))
  );
};

export const setTaskCategory = (id: string, categoryId: string) =>
  db.tasks.update(id, { categoryId, updatedAt: Date.now() });

/** «Не сегодня»: задача уходит во вхідні как новая мысль, а в дне остаётся tombstone. */
export const moveTaskToInbox = (task: Task) =>
  db.transaction('rw', db.tasks, db.inboxItems, async () => {
    const now = Date.now();
    await db.inboxItems.add({
      id: createId(),
      text: task.text,
      createdAt: now,
      done: false,
      updatedAt: now,
    });
    await db.tasks.update(task.id, { deleted: true, updatedAt: now });
  });
