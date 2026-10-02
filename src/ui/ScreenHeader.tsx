import type { FC, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, IconButton, Typography } from '@mui/material';

interface Props {
  title: ReactNode;
  back?: { to: string; label: string };
  action?: ReactNode;
  /** `false`, когда вместо заголовка стоит поле ввода: div внутри h1 — невалидная разметка. */
  heading?: boolean;
}

export const ScreenHeader: FC<Props> = ({ title, back, action, heading = true }) => (
  <Box
    component="header"
    sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: back ? -1.5 : 0, mb: 1 }}
  >
    {back && (
      <IconButton component={RouterLink} to={back.to} aria-label={back.label}>
        <ArrowBackIcon />
      </IconButton>
    )}
    <Typography
      component={heading ? 'h1' : 'div'}
      sx={{ fontSize: 22, fontWeight: 600, flex: 1, minWidth: 0 }}
    >
      {title}
    </Typography>
    {action}
  </Box>
);
