import { db, type Task, type TemplateItem } from '@/db';
import type { DateKey } from '@/utils/date';
import { createId } from '@/utils/id';

const nextOrder = async (categoryId: string) => {
  const items = await db.templateItems.where('categoryId').equals(categoryId).toArray();
  return Math.max(0, ...items.map((item) => item.order)) + 1;
};

/**
 * Новая задача шаблона сразу появляется и в сегодня, если день уже собран — иначе её пришлось бы
 * ждать до завтра. Id такой же, как при сборке, поэтому дубля не будет.
 */
export const addTemplateItem = (categoryId: string, text: string, today: DateKey) =>
  db.transaction('rw', db.templateItems, db.tasks, db.days, async () => {
    const now = Date.now();
    const item: TemplateItem = {
      id: createId(),
      categoryId,
      text,
      order: await nextOrder(categoryId),
      updatedAt: now,
    };
    await db.templateItems.add(item);

    if (!(await db.days.get(today))) return;
    await db.tasks.add({
      id: `tpl:${today}:${item.id}`,
      date: today,
      categoryId,
      text,
      done: false,
      recurring: true,
      carryCount: 0,
      order: item.order,
      updatedAt: now,
    });
  });

/** Разовую задачу делаем ежедневной: она сама остаётся в сегодня и больше не переносится. */
export const promoteTaskToTemplate = (task: Task) =>
  db.transaction('rw', db.templateItems, db.tasks, async () => {
    const now = Date.now();
    const templateItemId = createId();
    await db.templateItems.add({
      id: templateItemId,
      categoryId: task.categoryId,
      text: task.text,
      order: await nextOrder(task.categoryId),
      updatedAt: now,
    });
    await db.tasks.update(task.id, { recurring: true, templateItemId, updatedAt: now });
  });

// Задачи, ставшие ежедневными до появления templateItemId, ищем по категории и тексту.
const findTemplateItemId = async (task: Task) => {
  if (task.templateItemId) return task.templateItemId;
  if (task.id.startsWith('tpl:')) return task.id.slice(task.id.lastIndexOf(':') + 1);
  const items = await db.templateItems.where('categoryId').equals(task.categoryId).toArray();
  return items.find((item) => !item.deleted && item.text === task.text)?.id;
};

/** Обратное к promoteTaskToTemplate: пункт шаблона уходит, сегодняшняя задача становится разовой. */
export const stopTaskRecurring = (task: Task) =>
  db.transaction('rw', db.templateItems, db.tasks, async () => {
    const now = Date.now();
    const templateItemId = await findTemplateItemId(task);
    if (templateItemId) {
      await db.templateItems.update(templateItemId, { deleted: true, updatedAt: now });
    }
    await db.tasks.update(task.id, { recurring: false, templateItemId: undefined, updatedAt: now });
  });

export const reorderTemplateItems = (ids: string[]) => {
  const updatedAt = Date.now();
  return db.templateItems.bulkUpdate(
    ids.map((id, index) => ({ key: id, changes: { order: index + 1, updatedAt } }))
  );
};

export const updateTemplateItemText = (id: string, text: string) =>
  db.templateItems.update(id, { text, updatedAt: Date.now() });

/** Сегодняшняя задача из шаблона остаётся: удалённое из шаблона исчезает только с завтра. */
export const deleteTemplateItem = (id: string) =>
  db.templateItems.update(id, { deleted: true, updatedAt: Date.now() });
