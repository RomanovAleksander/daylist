import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import { formatDayTitle, type DateKey } from '@/utils/date';

interface Props {
  date: DateKey;
  done: number;
  total: number;
}

export const DayHeader: FC<Props> = ({ date, done, total }) => {
  const { t } = useTranslation();

  const closed = total > 0 && done === total;

  return (
    <Box component="header" sx={{ mb: 1 }}>
      <Typography component="h1" sx={{ fontSize: 22, fontWeight: 600 }}>
        {formatDayTitle(date)}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: closed ? 'primary.main' : 'text.secondary', minHeight: 20 }}
      >
        {closed ? t('day.closed') : total > 0 && t('day.progress', { done, total })}
      </Typography>
    </Box>
  );
};
