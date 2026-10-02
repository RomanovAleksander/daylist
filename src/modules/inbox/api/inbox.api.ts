import { db, type InboxItem } from '@/db';
import { addTask } from '@/modules/day';
import type { DateKey } from '@/utils/date';
import { createId } from '@/utils/id';
import { reorderKeys } from '@/utils/order';

import { inboxKey } from '../utils/sort';

export const addInboxItem = (text: string) => {
  const now = Date.now();
  return db.inboxItems.add({ id: createId(), text, createdAt: now, done: false, updatedAt: now });
};

export const setInboxItemDone = (id: string, done: boolean) => {
  const now = Date.now();
  return db.inboxItems.update(id, { done, doneAt: done ? now : undefined, updatedAt: now });
};

export const updateInboxItem = (id: string, changes: Pick<InboxItem, 'text' | 'note'>) =>
  db.inboxItems.update(id, { ...changes, updatedAt: Date.now() });

export const reorderInboxItems = (items: InboxItem[], ids: string[]) => {
  const keys = reorderKeys(ids, new Map(items.map((item) => [item.id, inboxKey(item)])), true);
  const updatedAt = Date.now();
  return db.inboxItems.bulkUpdate(
    [...keys].map(([id, order]) => ({ key: id, changes: { order, updatedAt } }))
  );
};

export const deleteInboxItem = (id: string) =>
  db.inboxItems.update(id, { deleted: true, updatedAt: Date.now() });

export const restoreInboxItem = (id: string) =>
  db.inboxItems.update(id, { deleted: undefined, updatedAt: Date.now() });

/** Задача уходит в день целиком: дальше она живёт по правилам дня и во вхідні не возвращается. */
export const moveInboxItemToToday = (
  id: string,
  text: string,
  categoryId: string,
  today: DateKey
) =>
  db.transaction('rw', db.inboxItems, db.tasks, async () => {
    await addTask(today, categoryId, text);
    await deleteInboxItem(id);
  });
