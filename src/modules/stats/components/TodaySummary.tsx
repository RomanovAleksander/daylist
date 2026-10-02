import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import type { Completion } from '../utils/stats';

interface Props {
  today: Completion;
  streak: number;
}

export const TodaySummary: FC<Props> = ({ today, streak }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap', mt: 2 }}>
      <Typography sx={{ fontSize: 34, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
        {today.done}/{today.total}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {t('stats.today')} · {t('stats.streak', { count: streak })}
      </Typography>
    </Box>
  );
};
