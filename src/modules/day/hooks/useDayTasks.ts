import { useLiveQuery } from 'dexie-react-hooks';

import { db, type Task } from '@/db';
import type { DateKey } from '@/utils/date';

export const useDayTasks = (date: DateKey): Task[] | undefined =>
  useLiveQuery(() => db.tasks.where('date').equals(date).toArray(), [date]);
