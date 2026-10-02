import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { ButtonBase, Typography } from '@mui/material';

import { goalPath } from '@/config/pages.config';
import type { Goal } from '@/db';
import { Card } from '@/ui/Card';

interface Props {
  dreams: Goal[];
}

export const DreamsSection: FC<Props> = ({ dreams }) => {
  const { t } = useTranslation();

  if (dreams.length === 0) return null;

  return (
    <>
      <Typography
        component="h2"
        sx={{
          mt: 1.5,
          mb: 1,
          color: 'text.secondary',
          fontSize: 12,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {t('goals.dreams')}
      </Typography>
      <Card>
        {dreams.map((dream) => (
          <ButtonBase
            key={dream.id}
            component={RouterLink}
            to={goalPath(dream.id)}
            aria-label={t('goals.open', { title: dream.title })}
            sx={{ width: '100%', justifyContent: 'flex-start', gap: 1.5, py: 1.5 }}
          >
            <Typography component="span" aria-hidden sx={{ color: 'primary.main' }}>
              ✦
            </Typography>
            <Typography component="span" sx={{ overflowWrap: 'anywhere', textAlign: 'left' }}>
              {dream.title}
            </Typography>
          </ButtonBase>
        ))}
      </Card>
    </>
  );
};
