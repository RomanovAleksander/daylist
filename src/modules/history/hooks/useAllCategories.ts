import { useLiveQuery } from 'dexie-react-hooks';

import { db, type Category } from '@/db';

/** С удалёнными: прошлые дни показывают задачи под тем именем категории, что было тогда. */
export const useAllCategories = (): Category[] | undefined =>
  useLiveQuery(async () => (await db.categories.toArray()).sort((a, b) => a.order - b.order), []);
