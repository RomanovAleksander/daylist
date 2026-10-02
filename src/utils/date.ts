import dayjs from 'dayjs';
import 'dayjs/locale/uk';

/** Локальная дата `YYYY-MM-DD`; UTC не используем — день определяет время на устройстве. */
export type DateKey = string;

const FORMAT = 'YYYY-MM-DD';

export const toDateKey = (date: Date): DateKey => dayjs(date).format(FORMAT);

/** До часа начала дня «сегодня» — ещё вчерашняя дата: ночные отметки идут в текущий день. */
export const todayKey = (now: Date, dayStartHour: number): DateKey =>
  dayjs(now).subtract(dayStartHour, 'hour').format(FORMAT);

export const addDays = (key: DateKey, days: number): DateKey =>
  dayjs(key).add(days, 'day').format(FORMAT);

export const diffDays = (later: DateKey, earlier: DateKey): number =>
  dayjs(later).diff(dayjs(earlier), 'day');

/** Миллисекунды до момента, когда `todayKey` сменится. */
export const msUntilNextDay = (now: Date, dayStartHour: number): number => {
  const shifted = dayjs(now).subtract(dayStartHour, 'hour');
  return shifted.add(1, 'day').startOf('day').diff(shifted);
};

export const formatDayTitle = (key: DateKey): string => {
  const title = dayjs(key).locale('uk').format('dddd, D MMMM');
  return title.charAt(0).toUpperCase() + title.slice(1);
};

export const formatShortDay = (key: DateKey): string => {
  const title = dayjs(key).locale('uk').format('dd, D MMMM');
  return title.charAt(0).toUpperCase() + title.slice(1);
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const formatWeekday = (key: DateKey): string =>
  capitalize(dayjs(key).locale('uk').format('dddd'));

export const formatDayMonth = (key: DateKey): string => dayjs(key).locale('uk').format('D MMMM');

export const endOfMonth = (key: DateKey): DateKey => dayjs(key).endOf('month').format(FORMAT);

export const endOfYear = (key: DateKey): DateKey => dayjs(key).endOf('year').format(FORMAT);
