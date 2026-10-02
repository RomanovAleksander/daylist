import { describe, expect, it } from 'vitest';

import type { Task } from '@/db';

import { summarizeDay } from './summarizeDay';

const task = (done: boolean, deleted?: true): Task => ({
  id: crypto.randomUUID(),
  date: '2026-10-01',
  categoryId: 'work',
  text: 'x',
  done,
  recurring: false,
  carryCount: 0,
  order: 1,
  updatedAt: 0,
  deleted,
});

describe('summarizeDay', () => {
  it('counts live tasks and rounds the percent', () => {
    expect(summarizeDay([task(true), task(true), task(false), task(true, true)])).toEqual({
      done: 2,
      total: 3,
      percent: 67,
    });
  });

  it('treats an empty day as 0%', () => {
    expect(summarizeDay([])).toEqual({ done: 0, total: 0, percent: 0 });
  });
});
