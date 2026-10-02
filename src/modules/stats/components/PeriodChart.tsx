import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useColorScheme } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

import { Card } from '@/ui/Card';

import type { ChartBucket, Period } from '../utils/period';
import { GOOD_DAY_RATIO } from '../utils/stats';

interface Props {
  buckets: ChartBucket[];
  period: Period;
}

// Цвета прокидываем строками: SVG-атрибуты графика не понимают CSS-переменные темы.
const palette = {
  dark: { good: '#E8A34A', rest: '#3A3F4B', text: '#8A91A3' },
  light: { good: '#B26B12', rest: '#D5D8DF', text: '#5D6475' },
};

export const PeriodChart: FC<Props> = ({ buckets, period }) => {
  const { t } = useTranslation();

  const { colorScheme } = useColorScheme();

  const colors = palette[colorScheme ?? 'dark'];

  return (
    <Card>
      <BarChart
        height={180}
        margin={{ left: 0, right: 0, top: 12, bottom: 4 }}
        aria-label={t('stats.chart')}
        xAxis={[
          {
            scaleType: 'band',
            data: buckets.map((bucket) => bucket.label),
            disableLine: true,
            disableTicks: true,
            // У месяца 30 столбиков: подписываем каждый пятый, иначе цифры слипаются.
            tickLabelInterval: (_, index) => period !== 'month' || index % 5 === 0,
            tickLabelStyle: { fill: colors.text, fontSize: 12 },
          },
        ]}
        yAxis={[
          {
            min: 0,
            max: 100,
            position: 'none',
            // Порог «удачного дня» имеет смысл для дней; месяцы года красим одним акцентом.
            colorMap: {
              type: 'piecewise',
              thresholds: [period === 'year' ? 0 : GOOD_DAY_RATIO * 100],
              colors: [colors.rest, colors.good],
            },
          },
        ]}
        series={[
          {
            data: buckets.map((bucket) => Math.round(bucket.ratio * 100)),
            valueFormatter: (value) => `${value ?? 0}%`,
          },
        ]}
        borderRadius={period === 'month' ? 2 : 4}
        hideLegend
      />
    </Card>
  );
};
