import type { z } from 'zod';

import type {
  categorySchema,
  daySchema,
  goalSchema,
  goalStepSchema,
  inboxItemSchema,
  taskSchema,
  templateItemSchema,
} from './entities.schema';

export type Category = z.infer<typeof categorySchema>;
export type Task = z.infer<typeof taskSchema>;
export type TemplateItem = z.infer<typeof templateItemSchema>;
export type Day = z.infer<typeof daySchema>;
export type InboxItem = z.infer<typeof inboxItemSchema>;
export type Goal = z.infer<typeof goalSchema>;
export type GoalKind = Goal['kind'];
export type GoalMeasure = Goal['measure'];
export type GoalStep = z.infer<typeof goalStepSchema>;
