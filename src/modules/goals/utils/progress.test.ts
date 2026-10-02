import { describe, expect, it } from 'vitest';

import type { Goal, GoalStep } from '@/db';

import {
  compareDated,
  compareGoals,
  formatAmount,
  goalProgress,
  isOverdue,
  neededPerMonth,
  parseAmount,
  timeRatio,
} from './progress';

const goal = (patch: Partial<Goal> = {}): Goal => ({
  id: 'g',
  kind: 'dated',
  title: 'Накопичити',
  description: '',
  startDate: '2026-09-22',
  deadline: '2026-12-20',
  measure: 'none',
  order: 1,
  updatedAt: 0,
  ...patch,
});

const step = (done: boolean, deleted?: true): GoalStep => ({
  id: crypto.randomUUID(),
  goalId: 'g',
  text: 'x',
  done,
  order: 1,
  updatedAt: 0,
  deleted,
});

describe('timeRatio', () => {
  it('measures elapsed time between start and deadline', () => {
    expect(timeRatio('2026-09-22', '2026-12-20', '2026-09-22')).toBe(0);
    expect(timeRatio('2026-10-01', '2026-10-11', '2026-10-06')).toBe(0.5);
    expect(timeRatio('2026-10-01', '2026-10-11', '2026-11-01')).toBe(1);
  });
});

describe('goalProgress', () => {
  it('counts live steps', () => {
    expect(
      goalProgress(goal({ measure: 'steps' }), [step(true), step(false), step(true, true)])
    ).toEqual({
      kind: 'steps',
      done: 1,
      total: 2,
      ratio: 0.5,
    });
  });

  it('caps a number goal at 100%', () => {
    expect(
      goalProgress(goal({ measure: 'number', current: 15000, target: 12000 }), [])
    ).toMatchObject({
      ratio: 1,
    });
  });

  it('has no progress without a measure or a target', () => {
    expect(goalProgress(goal(), [])).toBeNull();
    expect(goalProgress(goal({ measure: 'number' }), [])).toBeNull();
  });
});

describe('isOverdue', () => {
  it('is only for dated, unachieved goals past the deadline', () => {
    expect(isOverdue(goal({ deadline: '2026-09-29' }), '2026-10-02')).toBe(true);
    expect(isOverdue(goal({ deadline: '2026-10-02' }), '2026-10-02')).toBe(false);
    expect(isOverdue(goal({ deadline: '2026-09-29', achievedAt: 1 }), '2026-10-02')).toBe(false);
    expect(isOverdue(goal({ kind: 'global', deadline: undefined }), '2026-10-02')).toBe(false);
  });
});

describe('neededPerMonth', () => {
  it('spreads the rest over the months left', () => {
    const value = neededPerMonth(
      goal({ measure: 'number', current: 4315, target: 12000 }),
      '2026-10-02'
    );
    expect(value).toBeCloseTo(7685 / (79 / 30.4), 5);
  });
});

describe('compareDated', () => {
  it('orders by deadline and puts undated last', () => {
    const goals = [
      goal({ id: 'none', deadline: undefined }),
      goal({ id: 'late', deadline: '2026-12-20' }),
      goal({ id: 'soon', deadline: '2026-11-16' }),
    ];
    expect(goals.sort(compareDated).map((g) => g.id)).toEqual(['soon', 'late', 'none']);
  });
});

describe('compareGoals', () => {
  it('lists dated goals by deadline, then global goals, then dreams', () => {
    const goals = [
      goal({ id: 'dream', kind: 'dream', deadline: undefined }),
      goal({ id: 'global', kind: 'global', deadline: undefined }),
      goal({ id: 'late', deadline: '2026-12-20' }),
      goal({ id: 'soon', deadline: '2026-11-16' }),
    ];
    expect(goals.sort(compareGoals).map((g) => g.id)).toEqual(['soon', 'late', 'global', 'dream']);
  });
});

describe('parseAmount', () => {
  it('reads grouped and comma-decimal numbers', () => {
    expect(parseAmount('12 000')).toBe(12000);
    expect(parseAmount('4315,5')).toBe(4315.5);
    expect(parseAmount('')).toBeUndefined();
    expect(parseAmount('abc')).toBeUndefined();
  });
});

describe('formatAmount', () => {
  it('puts currency symbols first and other units after', () => {
    expect(formatAmount(12000, '$')).toBe('$12 000');
    expect(formatAmount(42, 'км')).toBe('42 км');
  });
});
