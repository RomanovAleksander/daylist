import { useLiveQuery } from 'dexie-react-hooks';

import { db, type TemplateItem } from '@/db';

export const useTemplateItems = (): TemplateItem[] | undefined =>
  useLiveQuery(
    async () =>
      (await db.templateItems.toArray())
        .filter((item) => !item.deleted)
        .sort((a, b) => a.order - b.order),
    []
  );
