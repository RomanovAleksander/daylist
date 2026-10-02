import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Paper, Typography } from '@mui/material';

import type { Completion } from '../utils/stats';

interface Props {
  today: Completion;
  streak: number;
}

const Tile: FC<{ value: string; label: string }> = ({ value, label }) => (
  <Paper elevation={0} sx={{ borderRadius: 5, px: 2, py: 1.5 }}>
    <Typography sx={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
      {value}
    </Typography>
    <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>{label}</Typography>
  </Paper>
);

export const StatTiles: FC<Props> = ({ today, streak }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
      <Tile value={`${today.done}/${today.total}`} label={t('stats.today')} />
      <Tile value={t('stats.streakValue', { count: streak })} label={t('stats.streak')} />
    </Box>
  );
};
