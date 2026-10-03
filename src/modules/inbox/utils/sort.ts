import type { InboxItem } from '@/db';

/** Ключ сортировки: свежая запись получает createdAt больше всех ключей и встаёт в конец, над полем. */
export const inboxKey = (item: InboxItem) => item.order ?? item.createdAt;
