import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import { SyncIndicator } from '@/modules/sync';
import { formatDayTitle, type DateKey } from '@/utils/date';

interface Props {
  date: DateKey;
  done: number;
  total: number;
  carried: number;
}

export const DayHeader: FC<Props> = ({ date, done, total, carried }) => {
  const { t } = useTranslation();

  const closed = total > 0 && done === total;

  return (
    <Box component="header" sx={{ mb: 1 }}>
      <Typography component="h1" sx={{ fontSize: 22, fontWeight: 600 }}>
        {formatDayTitle(date)}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 20 }}>
        <Typography variant="body2" sx={{ color: closed ? 'primary.main' : 'text.secondary' }}>
          {closed ? t('day.closed') : total > 0 && t('day.progress', { done, total })}
        </Typography>
        <SyncIndicator />
      </Box>
      {carried > 0 && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {t('day.carriedNotice', { count: carried })}
        </Typography>
      )}
    </Box>
  );
};
