import { Dexie, type EntityTable } from 'dexie';

import type {
  Category,
  Day,
  Goal,
  GoalStep,
  InboxItem,
  Task,
  TemplateItem,
} from './entities.types';

class DaylistDb extends Dexie {
  categories!: EntityTable<Category, 'id'>;
  tasks!: EntityTable<Task, 'id'>;
  templateItems!: EntityTable<TemplateItem, 'id'>;
  days!: EntityTable<Day, 'id'>;
  inboxItems!: EntityTable<InboxItem, 'id'>;
  goals!: EntityTable<Goal, 'id'>;
  goalSteps!: EntityTable<GoalStep, 'id'>;

  constructor() {
    // Оптимистичный кеш liveQuery в Dexie 4 терял из выборки по `date` задачу, добавленную в
    // другой транзакции, после следующей записи в тот же день. Данных у нас мало — читаем из базы.
    super('daylist', { cache: 'disabled' });
    this.version(1).stores({
      categories: 'id',
      tasks: 'id, date, categoryId',
      templateItems: 'id, categoryId',
      days: 'id, date',
    });
    this.version(2).stores({
      inboxItems: 'id, createdAt',
      goals: 'id',
      goalSteps: 'id, goalId',
    });
  }
}

export const db = new DaylistDb();
