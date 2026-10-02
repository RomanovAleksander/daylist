import { createHashRouter, Navigate } from 'react-router-dom';

import { PagesConfig } from '@/config/pages.config';
import { AppShell } from '@/modules/layout';
import TodayPage from '@/pages/today';

// HashRouter: GitHub Pages не умеет отдавать index.html на произвольный путь.
// Всё, кроме «Сегодня», грузится по требованию: утром важен быстрый старт главного экрана.
export const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { path: PagesConfig.TODAY, element: <TodayPage /> },
      {
        path: PagesConfig.HISTORY,
        lazy: async () => ({ Component: (await import('@/pages/history')).default }),
      },
      {
        path: PagesConfig.STATS,
        lazy: async () => ({ Component: (await import('@/pages/stats')).default }),
      },
      {
        path: PagesConfig.SETTINGS,
        lazy: async () => ({ Component: (await import('@/pages/settings')).default }),
      },
      {
        path: PagesConfig.TEMPLATE,
        lazy: async () => ({ Component: (await import('@/pages/template')).default }),
      },
      { path: '*', element: <Navigate to={PagesConfig.TODAY} replace /> },
    ],
  },
]);
