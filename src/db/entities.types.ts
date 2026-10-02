import type { z } from 'zod';

import type { categorySchema, daySchema, taskSchema, templateItemSchema } from './entities.schema';

export type Category = z.infer<typeof categorySchema>;
export type Task = z.infer<typeof taskSchema>;
export type TemplateItem = z.infer<typeof templateItemSchema>;
export type Day = z.infer<typeof daySchema>;
