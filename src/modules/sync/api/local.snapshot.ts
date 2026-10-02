import type { EntityTable, IDType } from 'dexie';

import { db } from '@/db';

import { pickNewer, type Versioned } from '../utils/merge';
import type { Snapshot } from '../utils/snapshot.schema';

export const readLocalSnapshot = async (): Promise<Snapshot> => ({
  version: 1,
  categories: await db.categories.toArray(),
  tasks: await db.tasks.toArray(),
  templateItems: await db.templateItems.toArray(),
  days: await db.days.toArray(),
});

const putNewer = async <T extends Versioned>(table: EntityTable<T, 'id'>, incoming: T[]) => {
  const local = await table.bulkGet(incoming.map((item) => item.id as IDType<T, 'id'>));
  const newer = incoming.filter((item, i) => {
    const current = local[i];
    return !current || pickNewer(current, item) === item;
  });
  await table.bulkPut(newer);
  return newer.length;
};

/**
 * Пишет только записи новее локальных и сравнивает их внутри транзакции: пока шёл запрос
 * к Dropbox, пользователь мог что-то отметить, и эту правку нельзя затереть старой версией.
 * Возвращает число изменённых записей.
 */
export const applySnapshot = (snapshot: Snapshot): Promise<number> =>
  db.transaction('rw', db.categories, db.tasks, db.templateItems, db.days, async () => {
    const counts = await Promise.all([
      putNewer(db.categories, snapshot.categories),
      putNewer(db.tasks, snapshot.tasks),
      putNewer(db.templateItems, snapshot.templateItems),
      putNewer(db.days, snapshot.days),
    ]);
    return counts.reduce((sum, count) => sum + count, 0);
  });
