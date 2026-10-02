import dayjs from 'dayjs';

import type { Category, Task } from '@/db';
import { addDays, type DateKey } from '@/utils/date';

/** День считается удачным от 80% выполненного. */
export const GOOD_DAY_RATIO = 0.8;

export type TasksByDate = Map<DateKey, Task[]>;

export interface StatsInput {
  byDate: TasksByDate;
  categories: Category[];
}

export interface Completion {
  done: number;
  total: number;
  ratio: number;
}

export const completion = (tasks: Task[]): Completion => {
  const live = tasks.filter((task) => !task.deleted);
  const done = live.filter((task) => task.done).length;
  return { done, total: live.length, ratio: live.length === 0 ? 0 : done / live.length };
};

export const groupByDate = (tasks: Task[]): TasksByDate => {
  const map: TasksByDate = new Map();
  for (const task of tasks) map.set(task.date, [...(map.get(task.date) ?? []), task]);
  return map;
};

/** Понедельник–воскресенье недели, в которую входит `today`. */
export const weekDates = (today: DateKey): DateKey[] => {
  const monday = addDays(today, -((dayjs(today).day() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
};

export const lastDates = (today: DateKey, count: number): DateKey[] =>
  Array.from({ length: count }, (_, i) => addDays(today, i - count + 1));

/**
 * Дни подряд с выполнением ≥ 80%, считая назад от вчера. Сегодня добавляется, только если уже
 * удачный: незаконченный день серию не рвёт. Собранный пропущенный день — 0% и рвёт её;
 * дни без задач не считаются ни в плюс, ни в минус.
 */
export const streak = (byDate: TasksByDate, builtDates: Set<DateKey>, today: DateKey): number => {
  const isGood = (date: DateKey) => completion(byDate.get(date) ?? []).ratio >= GOOD_DAY_RATIO;
  let count = isGood(today) ? 1 : 0;
  for (let date = addDays(today, -1); builtDates.has(date); date = addDays(date, -1)) {
    if (completion(byDate.get(date) ?? []).total === 0) continue;
    if (!isGood(date)) break;
    count += 1;
  }
  return count;
};

export interface CategoryClosure {
  category: Category;
  closed: number;
  withTasks: number;
}

/** Сколько дней категория была закрыта полностью — из дней, когда в ней вообще были задачи. */
export const categoryClosure = (
  categories: Category[],
  byDate: TasksByDate,
  dates: DateKey[]
): CategoryClosure[] =>
  categories.map((category) => {
    let closed = 0;
    let withTasks = 0;
    for (const date of dates) {
      const own = (byDate.get(date) ?? []).filter((t) => t.categoryId === category.id);
      const { done, total } = completion(own);
      if (total === 0) continue;
      withTasks += 1;
      if (done === total) closed += 1;
    }
    return { category, closed, withTasks };
  });
