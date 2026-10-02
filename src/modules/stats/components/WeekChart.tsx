import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useColorScheme } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import dayjs from 'dayjs';

import type { DateKey } from '@/utils/date';

import { completion, GOOD_DAY_RATIO, type TasksByDate } from '../utils/stats';

interface Props {
  dates: DateKey[];
  byDate: TasksByDate;
}

// Цвета прокидываем строками: SVG-атрибуты графика не понимают CSS-переменные темы.
const palette = {
  dark: { good: '#E8A34A', rest: '#3A3F4B', text: '#8A91A3' },
  light: { good: '#B26B12', rest: '#D5D8DF', text: '#5D6475' },
};

export const WeekChart: FC<Props> = ({ dates, byDate }) => {
  const { t } = useTranslation();

  const { colorScheme } = useColorScheme();

  const colors = palette[colorScheme ?? 'dark'];
  const values = dates.map((date) => Math.round(completion(byDate.get(date) ?? []).ratio * 100));

  return (
    <BarChart
      height={180}
      margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
      aria-label={t('stats.weekChart')}
      xAxis={[
        {
          scaleType: 'band',
          data: dates.map((date) => dayjs(date).locale('uk').format('dd')),
          disableLine: true,
          disableTicks: true,
          tickLabelStyle: { fill: colors.text, fontSize: 12 },
        },
      ]}
      yAxis={[
        {
          min: 0,
          max: 100,
          position: 'none',
          colorMap: {
            type: 'piecewise',
            thresholds: [GOOD_DAY_RATIO * 100],
            colors: [colors.rest, colors.good],
          },
        },
      ]}
      series={[{ data: values, valueFormatter: (value) => `${value ?? 0}%` }]}
      borderRadius={4}
      grid={{ horizontal: false }}
      hideLegend
    />
  );
};
