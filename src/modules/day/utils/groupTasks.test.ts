import { describe, expect, it } from 'vitest';

import type { Category, Task } from '@/db';

import { groupTasks } from './groupTasks';

const category = (id: string, order: number): Category => ({ id, name: id, order, updatedAt: 0 });

const task = (id: string, categoryId: string, order: number, patch: Partial<Task> = {}): Task => ({
  id,
  date: '2026-10-02',
  categoryId,
  text: id,
  done: false,
  recurring: false,
  carryCount: 0,
  order,
  updatedAt: 0,
  ...patch,
});

describe('groupTasks', () => {
  it('keeps category order and leaves done tasks where they were', () => {
    const groups = groupTasks(
      [category('work', 1), category('english', 2)],
      [
        task('a', 'work', 1, { done: true }),
        task('b', 'work', 2),
        task('c', 'english', 1),
        task('d', 'work', 3),
      ]
    );

    expect(groups.map((g) => g.category.id)).toEqual(['work', 'english']);
    expect(groups[0]?.tasks.map((t) => t.id)).toEqual(['a', 'b', 'd']);
    expect(groups[0]?.doneCount).toBe(1);
  });

  it('hides tombstones and keeps empty categories', () => {
    const groups = groupTasks(
      [category('work', 1), category('ai', 2)],
      [task('a', 'work', 1, { deleted: true })]
    );

    expect(groups.map((g) => g.tasks.length)).toEqual([0, 0]);
  });
});
