import { createHashRouter, Navigate } from 'react-router-dom';

import { PagesConfig } from '@/config/pages.config';
import { AppShell } from '@/modules/layout';
import HistoryPage from '@/pages/history';
import SettingsPage from '@/pages/settings';
import TemplatePage from '@/pages/template';
import TodayPage from '@/pages/today';

// HashRouter: GitHub Pages не умеет отдавать index.html на произвольный путь.
export const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { path: PagesConfig.TODAY, element: <TodayPage /> },
      { path: PagesConfig.HISTORY, element: <HistoryPage /> },
      {
        path: PagesConfig.STATS,
        // Графики тянут @mui/x-charts — грузим их только при открытии статистики.
        lazy: async () => ({ Component: (await import('@/pages/stats')).default }),
      },
      { path: PagesConfig.SETTINGS, element: <SettingsPage /> },
      { path: PagesConfig.TEMPLATE, element: <TemplatePage /> },
      { path: '*', element: <Navigate to={PagesConfig.TODAY} replace /> },
    ],
  },
]);
