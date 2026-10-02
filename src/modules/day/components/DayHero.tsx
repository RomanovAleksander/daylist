import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import { ProgressRing } from '@/ui/ProgressRing';
import { formatDayMonth, formatWeekday, type DateKey } from '@/utils/date';

interface Props {
  date: DateKey;
  done: number;
  total: number;
  carried: number;
}

/** Главная цифра дня крупно, как баланс в банке. */
export const DayHero: FC<Props> = ({ date, done, total, carried }) => {
  const { t } = useTranslation();

  const ratio = total ? done / total : 0;
  const closed = total > 0 && done === total;

  return (
    <Box component="header" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <ProgressRing
        ratio={ratio}
        size={96}
        thickness={4.5}
        label={t('day.ringLabel', { done, total })}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          {done}/{total}
        </Typography>
        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
          {t('day.percent', { percent: Math.round(ratio * 100) })}
        </Typography>
      </ProgressRing>
      <Box sx={{ minWidth: 0 }}>
        <Typography component="h1" sx={{ fontSize: 22, fontWeight: 700 }}>
          {formatWeekday(date)}
        </Typography>
        <Typography sx={{ color: closed ? 'primary.main' : 'text.secondary', fontSize: 14 }}>
          {closed ? t('day.closed') : formatDayMonth(date)}
        </Typography>
        {carried > 0 && (
          <Typography sx={{ color: 'text.secondary', fontSize: 13, mt: 0.5 }}>
            {t('day.carriedNotice', { count: carried })}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
