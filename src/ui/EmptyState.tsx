import type { FC } from 'react';

import { Typography } from '@mui/material';

interface Props {
  title: string;
}

export const EmptyState: FC<Props> = ({ title }) => (
  <Typography align="center" sx={{ py: 8, color: 'text.secondary' }}>
    {title}
  </Typography>
);
