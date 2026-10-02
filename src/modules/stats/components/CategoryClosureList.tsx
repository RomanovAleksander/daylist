import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, LinearProgress, Typography } from '@mui/material';

import { Card } from '@/ui/Card';
import type { DateKey } from '@/utils/date';

import { categoryClosure, type StatsInput } from '../utils/stats';

interface Props extends StatsInput {
  dates: DateKey[];
}

export const CategoryClosureList: FC<Props> = ({ dates, byDate, categories }) => {
  const { t } = useTranslation();

  const rows = categoryClosure(categories, byDate, dates);

  return (
    <Card>
      {rows.map(({ category, closed, withTasks }) => (
        <Box key={category.id} sx={{ py: 1.25 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Typography sx={{ overflowWrap: 'anywhere' }}>
              {category.emoji ? `${category.emoji} ` : ''}
              {category.name}
            </Typography>
            <Typography
              sx={{ color: 'text.secondary', fontSize: 14, fontVariantNumeric: 'tabular-nums' }}
            >
              {withTasks === 0 ? '—' : t('stats.closure', { closed, total: withTasks })}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={withTasks ? Math.round((closed / withTasks) * 100) : 0}
            aria-label={category.name}
            sx={{
              mt: 0.75,
              height: 6,
              borderRadius: 3,
              bgcolor: 'divider',
              '& .MuiLinearProgress-bar': { borderRadius: 3 },
            }}
          />
        </Box>
      ))}
    </Card>
  );
};
