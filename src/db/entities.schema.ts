import { z } from 'zod';

const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const syncedFields = {
  id: z.string().min(1),
  updatedAt: z.number(),
  deleted: z.literal(true).optional(),
};

export const categorySchema = z.object({
  ...syncedFields,
  name: z.string(),
  emoji: z.string().optional(),
  order: z.number(),
});

export const taskSchema = z.object({
  ...syncedFields,
  date: dateKey,
  categoryId: z.string(),
  text: z.string(),
  done: z.boolean(),
  doneAt: z.number().optional(),
  recurring: z.boolean(),
  /** Пункт шаблона разовой задачи, сделанной ежедневной; у собранных из шаблона он в id. */
  templateItemId: z.string().optional(),
  carriedFrom: z.string().optional(),
  carryCount: z.number().int().min(0),
  order: z.number(),
});

export const templateItemSchema = z.object({
  ...syncedFields,
  categoryId: z.string(),
  text: z.string(),
  order: z.number(),
});

// id дня совпадает с датой: два устройства, собравшие один день, пишут одну и ту же запись.
export const daySchema = z.object({
  ...syncedFields,
  date: dateKey,
  builtAt: z.number(),
});

export const inboxItemSchema = z.object({
  ...syncedFields,
  text: z.string(),
  note: z.string().optional(),
  createdAt: z.number(),
  done: z.boolean(),
  doneAt: z.number().optional(),
});

export const goalSchema = z.object({
  ...syncedFields,
  kind: z.enum(['dated', 'global', 'dream']),
  title: z.string(),
  description: z.string(),
  startDate: dateKey,
  deadline: dateKey.optional(),
  measure: z.enum(['steps', 'number', 'none']),
  current: z.number().optional(),
  target: z.number().optional(),
  unit: z.string().optional(),
  achievedAt: z.number().optional(),
  order: z.number(),
});

export const goalStepSchema = z.object({
  ...syncedFields,
  goalId: z.string(),
  text: z.string(),
  done: z.boolean(),
  order: z.number(),
});
