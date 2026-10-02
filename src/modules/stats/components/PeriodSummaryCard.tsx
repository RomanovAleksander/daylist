import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import { Card } from '@/ui/Card';

import type { PeriodSummary } from '../utils/period';

interface Props {
  current: PeriodSummary;
  previous: PeriodSummary;
}

/** Главная цифра периода крупно и сдвиг к прошлому периоду той же длины. */
export const PeriodSummaryCard: FC<Props> = ({ current, previous }) => {
  const { t } = useTranslation();

  const percent = Math.round(current.ratio * 100);
  // Без задач в прошлом периоде сравнивать не с чем.
  const delta = previous.total > 0 ? percent - Math.round(previous.ratio * 100) : null;

  return (
    <Card>
      <Box sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1 }}>
            {current.total ? `${percent}%` : '—'}
          </Typography>
          {delta !== null && current.total > 0 && (
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: delta > 0 ? 'primary.main' : delta < 0 ? 'warning.main' : 'text.secondary',
              }}
            >
              {t(delta > 0 ? 'stats.deltaUp' : delta < 0 ? 'stats.deltaDown' : 'stats.deltaSame', {
                count: Math.abs(delta),
              })}
            </Typography>
          )}
        </Box>
        <Typography sx={{ color: 'text.secondary', fontSize: 14, mt: 0.5 }}>
          {current.total
            ? t('stats.tasksDone', { done: current.done, total: current.total })
            : t('stats.noTasks')}
        </Typography>
        {current.activeDays > 0 && (
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
            {t('stats.goodDays', { good: current.goodDays, total: current.activeDays })}
          </Typography>
        )}
      </Box>
    </Card>
  );
};
