import { db } from '@/db';
import { createId } from '@/utils/id';

export const addCategory = async (name: string): Promise<void> => {
  const all = await db.categories.toArray();
  const order = Math.max(0, ...all.map((c) => c.order)) + 1;
  await db.categories.add({ id: createId(), name, order, updatedAt: Date.now() });
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
