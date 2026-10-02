import { useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, ButtonBase, Collapse, Typography } from '@mui/material';

import type { Category } from '@/db';
import { groupTasks } from '@/modules/day';
import { formatShortDay } from '@/utils/date';

import { PastTaskRow } from './PastTaskRow';
import type { PastDay } from '../hooks/usePastDays';
import { summarizeDay } from '../utils/summarizeDay';

interface Props {
  day: PastDay;
  categories: Category[];
}

export const HistoryDay: FC<Props> = ({ day, categories }) => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  const summary = summarizeDay(day.tasks);
  const groups = useMemo(
    () => groupTasks(categories, day.tasks).filter((group) => group.tasks.length > 0),
    [categories, day.tasks]
  );

  return (
    <Box component="article" sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <ButtonBase
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={t(open ? 'history.collapse' : 'history.expand')}
        sx={{ width: '100%', justifyContent: 'space-between', minHeight: 56 }}
      >
        <Typography component="h2" sx={{ fontWeight: 600 }}>
          {formatShortDay(day.date)}
        </Typography>
        <Typography
          component="span"
          variant="body2"
          sx={{ color: summary.percent >= 80 ? 'primary.main' : 'text.secondary' }}
        >
          {summary.total === 0 ? t('history.noTasks') : t('history.progress', { ...summary })}
        </Typography>
      </ButtonBase>
      <Collapse in={open} unmountOnExit>
        <Box sx={{ pb: 1.5 }}>
          {groups.map(({ category, tasks }) => (
            <Box component="section" aria-label={category.name} key={category.id} sx={{ mt: 1 }}>
              <Typography
                component="h3"
                sx={{
                  color: 'text.secondary',
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {category.name}
              </Typography>
              {tasks.map((task) => (
                <PastTaskRow key={task.id} task={task} />
              ))}
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};
