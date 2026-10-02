import { describe, expect, it } from 'vitest';

import type { Category, Task } from '@/db';

import { categoryClosure, completion, groupByDate, streak, weekDates } from './stats';

let seq = 0;
const task = (date: string, done: boolean, patch: Partial<Task> = {}): Task => ({
  id: `t${seq++}`,
  date,
  categoryId: 'work',
  text: 'x',
  done,
  recurring: false,
  carryCount: 0,
  order: 1,
  updatedAt: 0,
  ...patch,
});

const day = (date: string, done: number, total: number) =>
  Array.from({ length: total }, (_, i) => task(date, i < done));

describe('completion', () => {
  it('ignores tombstones', () => {
    expect(completion([task('d', true), task('d', false, { deleted: true })])).toEqual({
      done: 1,
      total: 1,
      ratio: 1,
    });
  });
});

describe('weekDates', () => {
  it('starts the week on monday', () => {
    expect(weekDates('2026-10-02')).toEqual([
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
      '2026-10-03',
      '2026-10-04',
    ]);
    expect(weekDates('2026-10-04')[0]).toBe('2026-09-28');
  });
});

describe('streak', () => {
  const build = (days: Record<string, Task[]>) => ({
    byDate: groupByDate(Object.values(days).flat()),
    built: new Set(Object.keys(days)),
  });

  it('counts good days back from yesterday and adds today only when already good', () => {
    const past = {
      '2026-09-29': day('2026-09-29', 1, 4),
      '2026-09-30': day('2026-09-30', 4, 5),
      '2026-10-01': day('2026-10-01', 5, 5),
    };
    const inProgress = build({ ...past, '2026-10-02': day('2026-10-02', 1, 5) });
    const alreadyGood = build({ ...past, '2026-10-02': day('2026-10-02', 4, 5) });

    expect(streak(inProgress.byDate, inProgress.built, '2026-10-02')).toBe(2);
    expect(streak(alreadyGood.byDate, alreadyGood.built, '2026-10-02')).toBe(3);
  });

  it('breaks on a missed day assembled with nothing done and skips empty days', () => {
    const { byDate, built } = build({
      '2026-09-29': day('2026-09-29', 5, 5),
      '2026-09-30': day('2026-09-30', 0, 3),
      '2026-10-01': [],
      '2026-10-02': [],
    });

    expect(streak(byDate, built, '2026-10-02')).toBe(0);
  });
});

describe('categoryClosure', () => {
  it('counts fully closed days among days with tasks', () => {
    const categories: Category[] = [{ id: 'work', name: 'Робота', order: 1, updatedAt: 0 }];
    const byDate = groupByDate([...day('2026-10-01', 2, 2), ...day('2026-10-02', 1, 2)]);

    expect(categoryClosure(categories, byDate, ['2026-09-30', '2026-10-01', '2026-10-02'])).toEqual(
      [{ category: categories[0], closed: 1, withTasks: 2 }]
    );
  });
});
