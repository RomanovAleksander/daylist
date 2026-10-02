import { useLiveQuery } from 'dexie-react-hooks';

import { db, type Category } from '@/db';

import { sortCategories } from '../utils/sortCategories';

export const useCategories = (): Category[] | undefined =>
  useLiveQuery(async () => sortCategories(await db.categories.toArray()), []);
