import { z } from 'zod';

import {
  categorySchema,
  daySchema,
  goalSchema,
  goalStepSchema,
  inboxItemSchema,
  taskSchema,
  templateItemSchema,
} from '@/db';

const snapshotV2Schema = z.object({
  version: z.literal(2),
  categories: z.array(categorySchema),
  tasks: z.array(taskSchema),
  templateItems: z.array(templateItemSchema),
  days: z.array(daySchema),
  inboxItems: z.array(inboxItemSchema),
  goals: z.array(goalSchema),
  goalSteps: z.array(goalStepSchema),
});

// Файл первой версии (до вхідних и целей) читаем как вторую с пустыми новыми списками.
const upgrade = (raw: unknown) =>
  typeof raw === 'object' && raw !== null && 'version' in raw && raw.version === 1
    ? { ...raw, version: 2, inboxItems: [], goals: [], goalSteps: [] }
    : raw;

export const snapshotSchema = z.preprocess(upgrade, snapshotV2Schema);

export type Snapshot = z.infer<typeof snapshotV2Schema>;

export const ENTITY_KEYS = [
  'categories',
  'tasks',
  'templateItems',
  'days',
  'inboxItems',
  'goals',
  'goalSteps',
] as const;

export const emptySnapshot = (): Snapshot => ({
  version: 2,
  categories: [],
  tasks: [],
  templateItems: [],
  days: [],
  inboxItems: [],
  goals: [],
  goalSteps: [],
});
