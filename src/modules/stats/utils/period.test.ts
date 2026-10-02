import { describe, expect, it } from 'vitest';

import type { Task } from '@/db';

import {
  chartBuckets,
  heatLevel,
  heatmapWeeks,
  periodDates,
  periodSummary,
  previousPeriodDates,
} from './period';
import { groupByDate } from './stats';

let seq = 0;
const task = (date: string, done: boolean): Task => ({
  id: `t${seq++}`,
  date,
  categoryId: 'work',
  text: 'x',
  done,
  recurring: false,
  carryCount: 0,
  order: 1,
  updatedAt: 0,
});

const day = (date: string, done: number, total: number) =>
  Array.from({ length: total }, (_, i) => task(date, i < done));

describe('period dates', () => {
  it('ends the window today and puts the previous one right before it', () => {
    const week = periodDates('2026-10-02', 'week');
    expect(week).toHaveLength(7);
    expect(week[0]).toBe('2026-09-26');
    expect(week[6]).toBe('2026-10-02');
    expect(previousPeriodDates('2026-10-02', 'week').at(-1)).toBe('2026-09-25');
  });
});

describe('periodSummary', () => {
  it('weights by tasks and counts good days among days with tasks', () => {
    const byDate = groupByDate([...day('2026-10-01', 1, 1), ...day('2026-10-02', 1, 4)]);
    expect(periodSummary(byDate, ['2026-09-30', '2026-10-01', '2026-10-02'])).toEqual({
      done: 2,
      total: 5,
      ratio: 0.4,
      goodDays: 1,
      activeDays: 2,
    });
  });
});

describe('chartBuckets', () => {
  it('gives twelve calendar months for a year ending with the current one', () => {
    const byDate = groupByDate(day('2026-10-02', 3, 4));
    const buckets = chartBuckets(byDate, '2026-10-02', 'year');
    expect(buckets).toHaveLength(12);
    expect(buckets[0]?.key).toBe('2025-11');
    expect(buckets[11]).toMatchObject({ key: '2026-10', ratio: 0.75, total: 4 });
  });
});

describe('heatmap', () => {
  it('starts columns on Monday and hides future days', () => {
    const weeks = heatmapWeeks('2026-10-02', 2);
    expect(weeks[0]?.[0]).toBe('2026-09-21');
    expect(weeks[1]?.[4]).toBe('2026-10-02');
    expect(weeks[1]?.[5]).toBeNull();
  });

  it('maps completion to levels', () => {
    const byDate = groupByDate([
      ...day('a', 0, 2),
      ...day('b', 1, 3),
      ...day('c', 1, 2),
      ...day('d', 4, 5),
    ]);
    expect(['none', 'a', 'b', 'c', 'd'].map((date) => heatLevel(byDate, date))).toEqual([
      0, 1, 2, 3, 4,
    ]);
  });
});
