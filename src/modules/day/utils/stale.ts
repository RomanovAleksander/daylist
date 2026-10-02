import type { Task } from '@/db';

/** С трёх дней переноса задача считается «висяком». */
export const STALE_CARRY_DAYS = 3;

export const isStale = (task: Task) => task.carryCount >= STALE_CARRY_DAYS;
