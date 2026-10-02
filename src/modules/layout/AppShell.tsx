import type { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import { useSyncEngine } from '@/modules/sync';

import { BottomNav } from './BottomNav';

// Высота BottomNavigation в MUI — 56px; контент не должен уходить под панель.
const NAV_HEIGHT = 56;

export const AppShell: FC = () => {
  useSyncEngine();

  return (
    <>
      <Box
        component="main"
        sx={{
          maxWidth: 600,
          mx: 'auto',
          px: 2,
          pt: 'calc(env(safe-area-inset-top, 0px) + 16px)',
          pb: `calc(env(safe-area-inset-bottom, 0px) + ${NAV_HEIGHT + 16}px)`,
        }}
      >
        <Outlet />
      </Box>
      <BottomNav />
    </>
  );
};
