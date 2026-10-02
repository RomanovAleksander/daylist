import { useLiveQuery } from 'dexie-react-hooks';

import { db, type InboxItem } from '@/db';

interface InboxData {
  items: InboxItem[];
  /** Момент чтения: от него считаем возраст задач, точности до дня хватает. */
  now: number;
}

export const useInboxItems = (): InboxData | undefined =>
  useLiveQuery(async () => {
    const items = await db.inboxItems.orderBy('createdAt').reverse().toArray();
    return { items: items.filter((item) => !item.deleted), now: Date.now() };
  }, []);
