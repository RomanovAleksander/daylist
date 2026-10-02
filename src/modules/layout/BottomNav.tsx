import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';

import { PagesConfig } from '@/config/pages.config';
import { useKeyboardOpen } from '@/hooks/useKeyboardOpen';

import { navItems } from './nav.config';

export const BottomNav: FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const keyboardOpen = useKeyboardOpen();

  // Активная вкладка выводится из URL: вложенные экраны подсвечивают свой раздел.
  const active =
    navItems.find((item) => item.sections.some((section) => pathname.startsWith(section)))?.path ??
    PagesConfig.TODAY;

  if (keyboardOpen) return null;

  return (
    <Paper
      component="nav"
      square
      elevation={0}
      sx={{
        position: 'fixed',
        insetInline: 0,
        bottom: 0,
        borderTop: 1,
        borderColor: 'divider',
        pb: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <BottomNavigation
        value={active}
        showLabels
        sx={{
          maxWidth: 600,
          mx: 'auto',
          // «Налаштування» — самая длинная подпись: на 360px она влезает только без увеличения
          // активной вкладки и без боковых отступов MUI.
          '& .MuiBottomNavigationAction-root': { minWidth: 0, px: 0.5 },
          '& .MuiBottomNavigationAction-label, & .MuiBottomNavigationAction-label.Mui-selected': {
            fontSize: '0.6875rem',
          },
        }}
      >
        {navItems.map(({ path, labelKey, Icon }) => (
          <BottomNavigationAction
            key={path}
            value={path}
            label={t(labelKey)}
            icon={<Icon />}
            component={RouterLink}
            to={path}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};
