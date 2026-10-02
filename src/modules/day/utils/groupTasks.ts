import type { Category, Task } from '@/db';

export interface CategoryGroup {
  category: Category;
  tasks: Task[];
  doneCount: number;
}

// Отметка не двигает задачу: позиция меняется только перетаскиванием.
const compareTasks = (a: Task, b: Task) => a.order - b.order || a.id.localeCompare(b.id);

export const groupTasks = (categories: Category[], tasks: Task[]): CategoryGroup[] =>
  categories.map((category) => {
    const own = tasks.filter((t) => !t.deleted && t.categoryId === category.id).sort(compareTasks);
    return { category, tasks: own, doneCount: own.filter((t) => t.done).length };
  });
