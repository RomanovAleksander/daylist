import { createHashRouter, Navigate } from 'react-router-dom';

import { PagesConfig } from '@/config/pages.config';
import { AppShell } from '@/modules/layout';
import HistoryPage from '@/pages/history';
import SettingsPage from '@/pages/settings';
import StatsPage from '@/pages/stats';
import TodayPage from '@/pages/today';

// HashRouter: GitHub Pages не умеет отдавать index.html на произвольный путь.
export const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { path: PagesConfig.TODAY, element: <TodayPage /> },
      { path: PagesConfig.HISTORY, element: <HistoryPage /> },
      { path: PagesConfig.STATS, element: <StatsPage /> },
      { path: PagesConfig.SETTINGS, element: <SettingsPage /> },
      { path: '*', element: <Navigate to={PagesConfig.TODAY} replace /> },
    ],
  },
]);
