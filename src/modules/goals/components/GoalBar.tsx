import type { FC } from 'react';

import { Box, LinearProgress } from '@mui/material';

interface Props {
  ratio: number;
  /** Время — серым, прогресс — акцентом: две полосы рядом не должны путаться. */
  tone: 'progress' | 'time';
  label: string;
  height?: number;
  /** Где был бы прогресс, если идти ровно по времени. */
  marker?: number;
}

export const GoalBar: FC<Props> = ({ ratio, tone, label, height = 6, marker }) => (
  <Box sx={{ position: 'relative' }}>
    <LinearProgress
      variant="determinate"
      value={Math.round(Math.min(1, Math.max(0, ratio)) * 100)}
      aria-label={label}
      sx={{
        height,
        borderRadius: height / 2,
        bgcolor: 'divider',
        '& .MuiLinearProgress-bar': {
          borderRadius: height / 2,
          bgcolor: tone === 'progress' ? 'primary.main' : 'text.disabled',
        },
      }}
    />
    {marker !== undefined && (
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: -4,
          bottom: -4,
          left: `calc(${Math.min(1, Math.max(0, marker)) * 100}% - 1px)`,
          width: 2,
          borderRadius: 1,
          bgcolor: 'text.primary',
        }}
      />
    )}
  </Box>
);
