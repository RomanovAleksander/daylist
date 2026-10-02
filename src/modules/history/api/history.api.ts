import { db, type Task } from '@/db';

/**
 * Отметка задним числом. Если задачу на самом деле сделали в тот день, её перенесённые копии
 * в следующих днях больше не нужны — снимаем их, иначе «висяк» продолжит расти.
 */
export const setPastTaskDone = (task: Task, done: boolean) =>
  db.transaction('rw', db.tasks, async () => {
    const now = Date.now();
    await db.tasks.update(task.id, { done, doneAt: done ? now : undefined, updatedAt: now });
    if (!done) return;

    const rootId = task.carriedFrom ?? task.id;
    await db.tasks
      .where('date')
      .above(task.date)
      .filter((later) => later.carriedFrom === rootId && !later.done && !later.deleted)
      .modify({ deleted: true, updatedAt: now });
  });
