import type { FC, ReactNode } from 'react';

import { Paper } from '@mui/material';

interface Props {
  label?: string;
  children: ReactNode;
}

/** Скруглённая карточка-группа строк: категория дня, вхідні, список целей. */
export const Card: FC<Props> = ({ label, children }) => (
  <Paper
    component="section"
    aria-label={label}
    elevation={0}
    sx={{ borderRadius: 5, overflow: 'hidden', px: 2, py: 0.5, mb: 1.5 }}
  >
    {children}
  </Paper>
);
