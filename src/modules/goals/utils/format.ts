import dayjs from 'dayjs';

import type { DateKey } from '@/utils/date';

export const formatDeadline = (date: DateKey) => dayjs(date).locale('uk').format('D MMMM');

export const formatAchievedAt = (timestamp: number) =>
  dayjs(timestamp).locale('uk').format('D MMMM YYYY');
