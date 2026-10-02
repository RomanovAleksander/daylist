import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, LinearProgress, Typography } from '@mui/material';

import { SyncIndicator } from '@/modules/sync';
import { formatDayTitle, type DateKey } from '@/utils/date';

interface Props {
  date: DateKey;
  done: number;
  total: number;
  carried: number;
}

/** Компактная шапка для вида «список»: дата строкой и тонкая полоса прогресса. */
export const DayHeader: FC<Props> = ({ date, done, total, carried }) => {
  const { t } = useTranslation();

  const percent = total ? Math.round((done / total) * 100) : 0;
  const closed = total > 0 && done === total;

  return (
    <Box component="header" sx={{ mb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography component="h1" sx={{ fontSize: 22, fontWeight: 700 }}>
          {formatDayTitle(date)}
        </Typography>
        <SyncIndicator />
      </Box>
      <Typography sx={{ color: closed ? 'primary.main' : 'text.secondary', fontSize: 14 }}>
        {closed ? t('day.closed') : t('day.progressLine', { done, total, percent })}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={percent}
        aria-label={t('day.ringLabel', { done, total })}
        sx={{
          mt: 1,
          height: 4,
          borderRadius: 2,
          bgcolor: 'divider',
          '& .MuiLinearProgress-bar': { borderRadius: 2 },
        }}
      />
      {carried > 0 && (
        <Typography sx={{ color: 'text.secondary', fontSize: 13, mt: 1 }}>
          {t('day.carriedNotice', { count: carried })}
        </Typography>
      )}
    </Box>
  );
};
