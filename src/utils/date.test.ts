import { describe, expect, it } from 'vitest';

import {
  addDays,
  diffDays,
  endOfMonth,
  endOfYear,
  formatDayTitle,
  msUntilNextDay,
  todayKey,
} from './date';

describe('date', () => {
  it('treats hours before day start as the previous day', () => {
    expect(todayKey(new Date(2026, 9, 2, 3, 30), 4)).toBe('2026-10-01');
    expect(todayKey(new Date(2026, 9, 2, 4, 0), 4)).toBe('2026-10-02');
    expect(todayKey(new Date(2026, 9, 2, 0, 5), 0)).toBe('2026-10-02');
  });

  it('adds and diffs days across month boundaries', () => {
    expect(addDays('2026-09-30', 1)).toBe('2026-10-01');
    expect(addDays('2026-10-01', -1)).toBe('2026-09-30');
    expect(diffDays('2026-10-02', '2026-09-28')).toBe(4);
  });

  it('finds the end of month and year', () => {
    expect(endOfMonth('2026-02-10')).toBe('2026-02-28');
    expect(endOfYear('2026-10-02')).toBe('2026-12-31');
  });

  it('counts time until the next day start', () => {
    expect(msUntilNextDay(new Date(2026, 9, 2, 23, 59), 0)).toBe(60_000);
    expect(msUntilNextDay(new Date(2026, 9, 2, 3, 0), 4)).toBe(3_600_000);
  });

  it('formats a ukrainian day title', () => {
    expect(formatDayTitle('2026-10-02')).toBe('П’ятниця, 2 жовтня');
  });
});
