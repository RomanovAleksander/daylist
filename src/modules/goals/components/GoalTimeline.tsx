import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import type { DateKey } from '@/utils/date';

import { GoalBar } from './GoalBar';
import { formatDeadline } from '../utils/format';
import { daysLeft, timeRatio } from '../utils/progress';

interface Props {
  startDate: DateKey;
  deadline: DateKey;
  today: DateKey;
}

/** Главная цифра цели с дедлайном — сколько дней осталось; под ней шкала от старта до финиша. */
export const GoalTimeline: FC<Props> = ({ startDate, deadline, today }) => {
  const { t } = useTranslation();

  const left = daysLeft(deadline, today);
  const ratio = timeRatio(startDate, deadline, today);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1, mb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography
          sx={{
            fontSize: 44,
            fontWeight: 700,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            color: left < 0 ? 'warning.main' : 'text.primary',
          }}
        >
          {left < 0 ? `−${-left}` : left}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {t('goals.daysWord', { count: Math.abs(left) })}{' '}
          {t(left < 0 ? 'goals.card.afterDeadline' : 'goals.card.toFinish')}
        </Typography>
      </Box>
      <GoalBar ratio={ratio} tone="time" label={t('goals.timeLabel')} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1,
          fontSize: 12,
          color: 'text.disabled',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span>{formatDeadline(startDate)}</span>
        <Box component="span" sx={{ color: 'text.secondary' }}>
          {t('goals.timeElapsed', { percent: Math.round(ratio * 100) })}
        </Box>
        <span>{formatDeadline(deadline)}</span>
      </Box>
    </Box>
  );
};
