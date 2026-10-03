import { useLiveQuery } from 'dexie-react-hooks';

import { db, type InboxItem } from '@/db';

import { inboxKey } from '../utils/sort';

interface InboxData {
  items: InboxItem[];
  /** Момент чтения: от него считаем возраст задач, точности до дня хватает. */
  now: number;
}

export const useInboxItems = (): InboxData | undefined =>
  useLiveQuery(async () => {
    const items = await db.inboxItems.toArray();
    return {
      items: items.filter((item) => !item.deleted).sort((a, b) => inboxKey(a) - inboxKey(b)),
      now: Date.now(),
    };
  }, []);
