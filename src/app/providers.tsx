import type { FC, ReactNode } from 'react';

import { CssBaseline, ThemeProvider } from '@mui/material';

import { theme } from './theme';

interface Props {
  children: ReactNode;
}

// Режим темы MUI сам хранит в localStorage, поэтому в Zustand его не дублируем.
export const Providers: FC<Props> = ({ children }) => (
  <ThemeProvider theme={theme} defaultMode="dark">
    <CssBaseline />
    {children}
  </ThemeProvider>
);
