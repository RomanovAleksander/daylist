import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ButtonBase, Typography } from '@mui/material';

import { PagesConfig } from '@/config/pages.config';
import { ScreenHeader } from '@/ui/ScreenHeader';

const links = [
  { to: PagesConfig.HISTORY, labelKey: 'nav.history' },
  { to: PagesConfig.STATS, labelKey: 'nav.stats' },
  { to: PagesConfig.SETTINGS, labelKey: 'nav.settings' },
] as const;

export const MoreScreen: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <ScreenHeader title={t('nav.more')} />
      {links.map(({ to, labelKey }) => (
        <ButtonBase
          key={to}
          component={RouterLink}
          to={to}
          sx={{
            width: '100%',
            justifyContent: 'space-between',
            minHeight: 56,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography component="span">{t(labelKey)}</Typography>
          <ChevronRightIcon sx={{ color: 'text.secondary' }} />
        </ButtonBase>
      ))}
    </>
  );
};
