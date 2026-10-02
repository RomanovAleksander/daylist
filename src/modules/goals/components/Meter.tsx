import type { FC } from 'react';

import { LinearProgress } from '@mui/material';

interface Props {
  ratio: number;
  /** Полоса времени — нейтральная, полоса прогресса — акцентная. */
  tone?: 'progress' | 'time';
  label: string;
}

export const Meter: FC<Props> = ({ ratio, tone = 'progress', label }) => (
  <LinearProgress
    variant="determinate"
    value={Math.round(ratio * 100)}
    aria-label={label}
    sx={{
      height: 6,
      borderRadius: 99,
      bgcolor: 'divider',
      '& .MuiLinearProgress-bar': {
        borderRadius: 99,
        bgcolor: tone === 'time' ? 'text.disabled' : 'primary.main',
      },
    }}
  />
);
