import type { FC, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, IconButton, Typography } from '@mui/material';

interface Props {
  title: ReactNode;
  back?: { to: string; label: string };
  action?: ReactNode;
}

export const ScreenHeader: FC<Props> = ({ title, back, action }) => (
  <Box
    component="header"
    sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: back ? -1.5 : 0, mb: 1 }}
  >
    {back && (
      <IconButton component={RouterLink} to={back.to} aria-label={back.label}>
        <ArrowBackIcon />
      </IconButton>
    )}
    <Typography component="h1" sx={{ fontSize: 22, fontWeight: 600, flex: 1, minWidth: 0 }}>
      {title}
    </Typography>
    {action}
  </Box>
);
