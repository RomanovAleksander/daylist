import { z } from 'zod';

import { categorySchema, daySchema, taskSchema, templateItemSchema } from '@/db';

export const snapshotSchema = z.object({
  version: z.literal(1),
  categories: z.array(categorySchema),
  tasks: z.array(taskSchema),
  templateItems: z.array(templateItemSchema),
  days: z.array(daySchema),
});

export type Snapshot = z.infer<typeof snapshotSchema>;

export const ENTITY_KEYS = ['categories', 'tasks', 'templateItems', 'days'] as const;

export const emptySnapshot = (): Snapshot => ({
  version: 1,
  categories: [],
  tasks: [],
  templateItems: [],
  days: [],
});
