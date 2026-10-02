import { describe, expect, it } from 'vitest';

import type { Task, TemplateItem } from '@/db';

import { assembleDays, carryTaskId, MAX_MISSED_DAYS, templateTaskId } from './assembleDays';

const NOW = 1_000;

const template = (id: string, patch: Partial<TemplateItem> = {}): TemplateItem => ({
  id,
  categoryId: 'english',
  text: id,
  order: 1,
  updatedAt: 0,
  ...patch,
});

const task = (id: string, date: string, patch: Partial<Task> = {}): Task => ({
  id,
  date,
  categoryId: 'work',
  text: id,
  done: false,
  recurring: false,
  carryCount: 0,
  order: 1,
  updatedAt: 0,
  ...patch,
});

const run = (input: Partial<Parameters<typeof assembleDays>[0]> = {}) =>
  assembleDays({
    today: '2026-10-02',
    lastDay: null,
    templateItems: [],
    existing: new Map(),
    now: NOW,
    ...input,
  });

describe('assembleDays', () => {
  it('builds only today on first launch', () => {
    const { days, tasks } = run({ templateItems: [template('anki')] });

    expect(days.map((d) => d.date)).toEqual(['2026-10-02']);
    expect(tasks.map((t) => t.id)).toEqual([templateTaskId('2026-10-02', 'anki')]);
    expect(tasks[0]).toMatchObject({ recurring: true, carryCount: 0 });
  });

  it('does nothing when today is already built', () => {
    expect(run({ lastDay: { date: '2026-10-02', tasks: [] } })).toEqual({ days: [], tasks: [] });
  });

  it('carries only live, undone, one-off tasks', () => {
    const yesterday = '2026-10-01';
    const { tasks } = run({
      lastDay: {
        date: yesterday,
        tasks: [
          task('jira', yesterday),
          task('cv', yesterday, { done: true }),
          task('gone', yesterday, { deleted: true }),
          task(templateTaskId(yesterday, 'anki'), yesterday, { recurring: true }),
        ],
      },
    });

    expect(tasks).toEqual([
      expect.objectContaining({
        id: carryTaskId('2026-10-02', 'jira'),
        carriedFrom: 'jira',
        carryCount: 1,
      }),
    ]);
  });

  it('keeps the root id and counts calendar days across a carry chain', () => {
    const { tasks } = run({
      lastDay: {
        date: '2026-10-01',
        tasks: [
          task(carryTaskId('2026-10-01', 'cubes'), '2026-10-01', {
            carriedFrom: 'cubes',
            carryCount: 3,
          }),
        ],
      },
    });

    expect(tasks[0]).toMatchObject({ id: carryTaskId('2026-10-02', 'cubes'), carryCount: 4 });
  });

  it('creates missed days and carries through them', () => {
    const { days, tasks } = run({
      lastDay: { date: '2026-09-29', tasks: [task('theory', '2026-09-29')] },
      templateItems: [template('anki')],
    });

    expect(days.map((d) => d.date)).toEqual(['2026-09-30', '2026-10-01', '2026-10-02']);
    const carriedToday = tasks.find((t) => t.id === carryTaskId('2026-10-02', 'theory'));
    expect(carriedToday?.carryCount).toBe(3);
    expect(tasks.filter((t) => t.recurring)).toHaveLength(3);
  });

  it('caps missed days', () => {
    const { days } = run({ lastDay: { date: '2025-01-01', tasks: [] } });

    expect(days).toHaveLength(MAX_MISSED_DAYS);
    expect(days.at(-1)?.date).toBe('2026-10-02');
  });

  it('never recreates existing tasks, tombstones included', () => {
    const deletedToday = task(templateTaskId('2026-10-02', 'anki'), '2026-10-02', {
      recurring: true,
      deleted: true,
    });
    const { tasks } = run({
      templateItems: [template('anki')],
      existing: new Map([[deletedToday.id, deletedToday]]),
    });

    expect(tasks).toEqual([]);
  });

  it('skips deleted template items', () => {
    const { tasks } = run({ templateItems: [template('old', { deleted: true })] });

    expect(tasks).toEqual([]);
  });
});
