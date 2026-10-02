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
