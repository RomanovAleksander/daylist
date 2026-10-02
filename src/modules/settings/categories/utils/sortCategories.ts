import type { Category } from '@/db';

export const sortCategories = (categories: Category[]): Category[] =>
  categories.filter((c) => !c.deleted).sort((a, b) => a.order - b.order);
