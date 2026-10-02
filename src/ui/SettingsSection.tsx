import type { FC, ReactNode } from 'react';

import { Box, Typography } from '@mui/material';

interface Props {
  title: string;
  children: ReactNode;
}

export const SettingsSection: FC<Props> = ({ title, children }) => (
  <Box component="section" aria-label={title} sx={{ mt: 3 }}>
    <Typography
      component="h2"
      sx={{
        color: 'text.secondary',
        fontSize: 12,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        mb: 0.5,
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);
