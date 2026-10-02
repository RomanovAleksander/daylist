import type { Task } from '@/db';

export interface DaySummary {
  done: number;
  total: number;
  percent: number;
}

export const summarizeDay = (tasks: Task[]): DaySummary => {
  const live = tasks.filter((task) => !task.deleted);
  const done = live.filter((task) => task.done).length;
  const total = live.length;
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
};
