import { describe, expect, it } from 'vitest';

import type { Category, Task } from '@/db';

import { hasChanges, mergeSnapshots } from './merge';
import { emptySnapshot, type Snapshot } from './snapshot.schema';

const category = (id: string, updatedAt: number, patch: Partial<Category> = {}): Category => ({
  id,
  name: id,
  order: 1,
  updatedAt,
  ...patch,
});

const task = (id: string, updatedAt: number, patch: Partial<Task> = {}): Task => ({
  id,
  date: '2026-10-02',
  categoryId: 'work',
  text: id,
  done: false,
  recurring: false,
  carryCount: 0,
  order: 1,
  updatedAt,
  ...patch,
});

const snapshot = (patch: Partial<Snapshot>): Snapshot => ({ ...emptySnapshot(), ...patch });

describe('mergeSnapshots', () => {
  it('keeps the newer version of each record', () => {
    const phone = snapshot({ tasks: [task('a', 2, { done: true }), task('b', 1)] });
    const laptop = snapshot({ tasks: [task('a', 1), task('b', 3, { text: 'renamed' })] });

    const merged = mergeSnapshots(phone, laptop);

    expect(merged.tasks).toEqual([task('a', 2, { done: true }), task('b', 3, { text: 'renamed' })]);
  });

  it('lets a newer tombstone win and an older one lose', () => {
    const deleted = snapshot({ categories: [category('work', 5, { deleted: true })] });
    const renamed = snapshot({ categories: [category('work', 4, { name: 'Робота' })] });

    expect(mergeSnapshots(deleted, renamed).categories[0]?.deleted).toBe(true);
    expect(
      mergeSnapshots(snapshot({ categories: [category('work', 6)] }), deleted).categories[0]
        ?.deleted
    ).toBeUndefined();
  });

  it('is commutative even when timestamps tie', () => {
    const a = snapshot({ tasks: [task('x', 7, { text: 'left' })], categories: [category('c', 1)] });
    const b = snapshot({ tasks: [task('x', 7, { text: 'right' })], days: [] });

    expect(mergeSnapshots(a, b)).toEqual(mergeSnapshots(b, a));
  });

  it('is idempotent', () => {
    const a = snapshot({ tasks: [task('x', 1), task('y', 2)] });
    const merged = mergeSnapshots(a, a);

    expect(mergeSnapshots(merged, a)).toEqual(merged);
  });

  it('dedupes generated tasks built on two devices', () => {
    const id = 'tpl:2026-10-02:anki';
    const merged = mergeSnapshots(
      snapshot({ tasks: [task(id, 10)] }),
      snapshot({ tasks: [task(id, 11)] })
    );

    expect(merged.tasks).toHaveLength(1);
  });
});

describe('hasChanges', () => {
  it('detects new and newer records only', () => {
    const base = snapshot({ tasks: [task('a', 1)] });

    expect(hasChanges(base, base)).toBe(false);
    expect(hasChanges(snapshot({ tasks: [task('a', 2)] }), base)).toBe(true);
    expect(hasChanges(snapshot({ tasks: [task('a', 1), task('b', 1)] }), base)).toBe(true);
  });
});
