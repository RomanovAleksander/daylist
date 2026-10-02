import type { FC, ReactNode } from 'react';

import { Box, CircularProgress } from '@mui/material';

interface Props {
  ratio: number;
  size: number;
  thickness?: number;
  label: string;
  children?: ReactNode;
}

export const ProgressRing: FC<Props> = ({ ratio, size, thickness = 5, label, children }) => (
  <Box
    role="img"
    aria-label={label}
    sx={{ position: 'relative', width: size, height: size, flex: 'none' }}
  >
    <CircularProgress
      variant="determinate"
      value={100}
      size={size}
      thickness={thickness}
      sx={{ color: 'divider', position: 'absolute', inset: 0 }}
    />
    <CircularProgress
      variant="determinate"
      value={Math.round(Math.min(1, Math.max(0, ratio)) * 100)}
      size={size}
      thickness={thickness}
      sx={{
        position: 'absolute',
        inset: 0,
        '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
      }}
    />
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        lineHeight: 1.1,
      }}
    >
      {children}
    </Box>
  </Box>
);
