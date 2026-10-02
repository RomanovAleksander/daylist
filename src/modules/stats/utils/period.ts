import dayjs from 'dayjs';

import { addDays, type DateKey } from '@/utils/date';

import { completion, GOOD_DAY_RATIO, lastDates, type TasksByDate } from './stats';

export type Period = 'week' | 'month' | 'year';

const PERIOD_DAYS: Record<Period, number> = { week: 7, month: 30, year: 365 };

/** Скользящее окно, заканчивающееся сегодня: так прошлый период той же длины честно сравним. */
export const periodDates = (today: DateKey, period: Period): DateKey[] =>
  lastDates(today, PERIOD_DAYS[period]);

export const previousPeriodDates = (today: DateKey, period: Period): DateKey[] =>
  lastDates(addDays(today, -PERIOD_DAYS[period]), PERIOD_DAYS[period]);

export interface PeriodSummary {
  done: number;
  total: number;
  ratio: number;
  goodDays: number;
  /** Дни, в которых вообще были задачи. */
  activeDays: number;
}

/** Процент считается по задачам, а не средним по дням: день с одной задачей не весит как полный. */
export const periodSummary = (byDate: TasksByDate, dates: DateKey[]): PeriodSummary => {
  let done = 0;
  let total = 0;
  let goodDays = 0;
  let activeDays = 0;
  for (const date of dates) {
    const day = completion(byDate.get(date) ?? []);
    if (day.total === 0) continue;
    done += day.done;
    total += day.total;
    activeDays += 1;
    if (day.ratio >= GOOD_DAY_RATIO) goodDays += 1;
  }
  return { done, total, ratio: total === 0 ? 0 : done / total, goodDays, activeDays };
};

export interface ChartBucket {
  key: string;
  label: string;
  ratio: number;
  total: number;
}

/** Столбики графика: по дню для недели и месяца, по календарному месяцу для года. */
export const chartBuckets = (
  byDate: TasksByDate,
  today: DateKey,
  period: Period
): ChartBucket[] => {
  if (period !== 'year') {
    return periodDates(today, period).map((date) => {
      const { ratio, total } = completion(byDate.get(date) ?? []);
      const label = dayjs(date)
        .locale('uk')
        .format(period === 'week' ? 'dd' : 'D');
      return { key: date, label, ratio, total };
    });
  }
  return Array.from({ length: 12 }, (_, i) => {
    const month = dayjs(today)
      .startOf('month')
      .subtract(11 - i, 'month');
    const dates = Array.from({ length: month.daysInMonth() }, (_, d) =>
      month.add(d, 'day').format('YYYY-MM-DD')
    );
    const { ratio, total } = periodSummary(byDate, dates);
    // Три буквы без точки: двенадцать подписей должны влезть в ширину телефона.
    const label = month.locale('uk').format('MMMM').slice(0, 3);
    return { key: month.format('YYYY-MM'), label, ratio, total };
  });
};

/** Колонки тепловой карты: недели с понедельника, последняя — текущая; будущие дни — `null`. */
export const heatmapWeeks = (today: DateKey, weeks: number): (DateKey | null)[][] => {
  const monday = addDays(today, -((dayjs(today).day() + 6) % 7));
  const start = addDays(monday, -7 * (weeks - 1));
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = addDays(start, w * 7 + d);
      return date > today ? null : date;
    })
  );
};

/** Уровень яркости клетки: 0 — задач не было, 1–4 — по доле выполненного. */
export const heatLevel = (byDate: TasksByDate, date: DateKey): number => {
  const { ratio, total } = completion(byDate.get(date) ?? []);
  if (total === 0) return 0;
  if (ratio >= GOOD_DAY_RATIO) return 4;
  if (ratio >= 0.5) return 3;
  if (ratio > 0) return 2;
  return 1;
};
