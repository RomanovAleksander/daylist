import type { Day, Task, TemplateItem } from '@/db';
import { addDays, diffDays, type DateKey } from '@/utils/date';

/** Дальше этого пропущенные дни не восстанавливаем: после долгого перерыва история не нужна. */
export const MAX_MISSED_DAYS = 60;

export const templateTaskId = (date: DateKey, templateItemId: string) =>
  `tpl:${date}:${templateItemId}`;

export const carryTaskId = (date: DateKey, rootTaskId: string) => `carry:${date}:${rootTaskId}`;

interface Input {
  today: DateKey;
  /** Последний собранный день до сегодня и его задачи; `null` — первый запуск. */
  lastDay: { date: DateKey; tasks: Task[] } | null;
  templateItems: TemplateItem[];
  /** Уже существующие задачи собираемых дат, включая tombstones — их не пересоздаём. */
  existing: Map<string, Task>;
  now: number;
}

interface Output {
  days: Day[];
  tasks: Task[];
}

const datesToAssemble = (today: DateKey, lastDate: DateKey | undefined): DateKey[] => {
  if (!lastDate) return [today];
  if (lastDate >= today) return [];
  const gap = Math.min(diffDays(today, lastDate), MAX_MISSED_DAYS);
  return Array.from({ length: gap }, (_, i) => addDays(today, i - gap + 1));
};

const fromTemplate = (date: DateKey, item: TemplateItem, now: number): Task => ({
  id: templateTaskId(date, item.id),
  date,
  categoryId: item.categoryId,
  text: item.text,
  done: false,
  recurring: true,
  carryCount: 0,
  order: item.order,
  updatedAt: now,
});

// Счётчик — календарные дни от первого появления задачи, а не число переносов.
const carried = (date: DateKey, source: Task, now: number): Task => {
  const rootId = source.carriedFrom ?? source.id;
  return {
    id: carryTaskId(date, rootId),
    date,
    categoryId: source.categoryId,
    text: source.text,
    done: false,
    recurring: false,
    carriedFrom: rootId,
    carryCount: source.carryCount + diffDays(date, source.date),
    order: source.order,
    updatedAt: now,
  };
};

const shouldCarry = (task: Task) => !task.deleted && !task.done && !task.recurring;

/**
 * Собирает все дни от последнего собранного до сегодня. Id сгенерированных задач детерминированы,
 * поэтому два устройства, собравшие один день независимо, после merge получат одни и те же задачи.
 */
export const assembleDays = ({ today, lastDay, templateItems, existing, now }: Input): Output => {
  const liveTemplate = templateItems.filter((item) => !item.deleted);
  const days: Day[] = [];
  const tasks: Task[] = [];
  let previous = lastDay?.tasks ?? [];

  for (const date of datesToAssemble(today, lastDay?.date)) {
    const planned = [
      ...liveTemplate.map((item) => fromTemplate(date, item, now)),
      ...previous.filter(shouldCarry).map((task) => carried(date, task, now)),
    ];
    // Если день уже частично пришёл с другого устройства, переносим дальше его версию задач.
    previous = planned.map((task) => existing.get(task.id) ?? task);
    tasks.push(...planned.filter((task) => !existing.has(task.id)));
    days.push({ id: date, date, builtAt: now, updatedAt: now });
  }

  return { days, tasks };
};
