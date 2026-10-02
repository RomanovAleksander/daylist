import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ButtonBase, Typography } from '@mui/material';

import { PagesConfig } from '@/config/pages.config';

import { useTemplateItems } from '../hooks/useTemplateItems';

export const TemplateLink: FC = () => {
  const { t } = useTranslation();

  const items = useTemplateItems();

  return (
    <ButtonBase
      component={RouterLink}
      to={PagesConfig.TEMPLATE}
      sx={{ width: '100%', justifyContent: 'space-between', minHeight: 48, mt: 2 }}
    >
      <Typography component="span">{t('settings.template')}</Typography>
      <Typography
        component="span"
        sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}
      >
        {items?.length ?? ''}
        <ChevronRightIcon fontSize="small" />
      </Typography>
    </ButtonBase>
  );
};
