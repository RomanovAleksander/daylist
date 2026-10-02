import { Dexie, type EntityTable } from 'dexie';

import type { Category, Day, Task, TemplateItem } from './entities.types';

class DaylistDb extends Dexie {
  categories!: EntityTable<Category, 'id'>;
  tasks!: EntityTable<Task, 'id'>;
  templateItems!: EntityTable<TemplateItem, 'id'>;
  days!: EntityTable<Day, 'id'>;

  constructor() {
    super('daylist');
    this.version(1).stores({
      categories: 'id',
      tasks: 'id, date, categoryId',
      templateItems: 'id, categoryId',
      days: 'id, date',
    });
  }
}

export const db = new DaylistDb();
