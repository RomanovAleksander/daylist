import { db } from '@/db';
import { createId } from '@/utils/id';

// Чтение максимального order и запись — в одной транзакции: при быстром вводе двух категорий
// подряд иначе обе получают один номер и порядок между ними случаен.
export const addCategory = (name: string, emoji?: string) =>
  db.transaction('rw', db.categories, async () => {
    const all = await db.categories.toArray();
    const order = Math.max(0, ...all.map((c) => c.order)) + 1;
    const id = createId();
    await db.categories.add({ id, name, emoji, order, updatedAt: Date.now() });
    return id;
  });

export const setCategoryEmoji = (id: string, emoji: string | undefined) =>
  db.categories.update(id, { emoji, updatedAt: Date.now() });

/** Сдвиг на одну позицию вверх или вниз среди живых категорий. */
export const moveCategory = (ids: string[], id: string, direction: -1 | 1) => {
  const from = ids.indexOf(id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= ids.length) return Promise.resolve();
  const next = [...ids];
  [next[from], next[to]] = [next[to] as string, next[from] as string];
  return reorderCategories(next);
};

export const renameCategory = (id: string, name: string) =>
  db.categories.update(id, { name, updatedAt: Date.now() });

/** Порядок пишем всем категориям сразу: иначе на другом устройстве смешаются старые и новые значения. */
export const reorderCategories = (ids: string[]) => {
  const updatedAt = Date.now();
  return db.categories.bulkUpdate(
    ids.map((id, index) => ({ key: id, changes: { order: index + 1, updatedAt } }))
  );
};

/** Прошлые дни сохраняют задачи; сегодняшние задачи и шаблон категории уходят вместе с ней. */
export const deleteCategory = (id: string, today: string) =>
  db.transaction('rw', db.categories, db.templateItems, db.tasks, async () => {
    const updatedAt = Date.now();
    const tombstone = { deleted: true as const, updatedAt };
    await db.categories.update(id, tombstone);
    await db.templateItems.where('categoryId').equals(id).modify(tombstone);
    await db.tasks
      .where('categoryId')
      .equals(id)
      .filter((task) => task.date >= today)
      .modify(tombstone);
  });
