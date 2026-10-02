import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography, type Theme } from '@mui/material';
import dayjs from 'dayjs';

import { Card } from '@/ui/Card';
import { formatDayMonth, type DateKey } from '@/utils/date';

import { heatLevel, heatmapWeeks } from '../utils/period';
import { completion, type TasksByDate } from '../utils/stats';

interface Props {
  today: DateKey;
  byDate: TasksByDate;
}

const WEEKS = 18;
const LEVEL_MIX = [0, 22, 45, 70, 100];
const ROW_LABELS = [0, 2, 4];

// Уровни — доля акцента поверх фона карточки: так шкала сама подстраивается под тему.
const cellSx = (level: number) => (theme: Theme) =>
  level === 0
    ? { bgcolor: theme.vars?.palette.divider }
    : {
        bgcolor: `color-mix(in srgb, ${theme.vars?.palette.primary.main} ${LEVEL_MIX[level]}%, transparent)`,
      };

const HeatCell: FC<{ date: DateKey; byDate: TasksByDate }> = ({ date, byDate }) => {
  const { done, total } = completion(byDate.get(date) ?? []);
  return (
    <Box
      title={`${formatDayMonth(date)}: ${done}/${total}`}
      sx={[{ aspectRatio: '1', borderRadius: 1 }, cellSx(heatLevel(byDate, date))]}
    />
  );
};

/** Каждый день — клетка: яркость по доле выполненного, пустые дни — серые. */
export const Heatmap: FC<Props> = ({ today, byDate }) => {
  const { t } = useTranslation();

  const weeks = heatmapWeeks(today, WEEKS);
  const weekdays = weeks[0]?.map((date) => dayjs(date).locale('uk').format('dd')) ?? [];

  const monthLabel = (week: (DateKey | null)[], index: number) => {
    const first = week[0];
    const previous = weeks[index - 1]?.[0];
    if (!first || (previous && dayjs(previous).month() === dayjs(first).month())) return '';
    return dayjs(first).locale('uk').format('MMM');
  };

  return (
    <Card>
      <Box
        role="img"
        aria-label={t('stats.heatmapLabel', { count: WEEKS })}
        sx={{
          display: 'grid',
          // minmax(0, …): иначе подписи месяцев распирают колонки и сетка вылезает за карточку.
          gridTemplateColumns: `20px repeat(${WEEKS}, minmax(0, 1fr))`,
          gridTemplateRows: 'auto repeat(7, auto)',
          gridAutoFlow: 'column',
          gap: '3px',
          py: 1.5,
        }}
      >
        <Box />
        {weekdays.map((label, row) => (
          <Typography
            key={label}
            sx={{ fontSize: 10, lineHeight: 1, color: 'text.secondary', alignSelf: 'center' }}
          >
            {ROW_LABELS.includes(row) ? label : ''}
          </Typography>
        ))}
        {weeks.map((week, index) => [
          <Typography
            key={`m${index}`}
            sx={{
              fontSize: 10,
              lineHeight: 1.4,
              color: 'text.secondary',
              whiteSpace: 'nowrap',
              overflow: 'visible',
            }}
          >
            {monthLabel(week, index)}
          </Typography>,
          ...week.map((date, row) =>
            date ? (
              <HeatCell key={date} date={date} byDate={byDate} />
            ) : (
              <Box key={`f${index}-${row}`} />
            )
          ),
        ])}
      </Box>
      <Box
        aria-hidden
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 0.5,
          pb: 1.5,
        }}
      >
        <Typography sx={{ fontSize: 11, color: 'text.secondary', mr: 0.5 }}>
          {t('stats.less')}
        </Typography>
        {LEVEL_MIX.map((_, level) => (
          <Box key={level} sx={[{ width: 12, height: 12, borderRadius: 0.75 }, cellSx(level)]} />
        ))}
        <Typography sx={{ fontSize: 11, color: 'text.secondary', ml: 0.5 }}>
          {t('stats.more')}
        </Typography>
      </Box>
    </Card>
  );
};
