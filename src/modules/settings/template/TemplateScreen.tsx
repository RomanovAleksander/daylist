import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import { PagesConfig } from '@/config/pages.config';
import { useToday } from '@/hooks/useToday';
import { AddInlineRow } from '@/ui/AddInlineRow';
import { EmptyState } from '@/ui/EmptyState';
import { ScreenHeader } from '@/ui/ScreenHeader';

import { useCategories } from '../categories';
import { addTemplateItem } from './api/template.api';
import { TemplateRow } from './components/TemplateRow';
import { useTemplateItems } from './hooks/useTemplateItems';

export const TemplateScreen: FC = () => {
  const { t } = useTranslation();

  const today = useToday();
  const categories = useCategories();
  const items = useTemplateItems();

  if (!categories || !items) return null;

  return (
    <>
      <ScreenHeader
        title={t('template.title')}
        back={{ to: PagesConfig.SETTINGS, label: t('common.back') }}
      />
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
        {t('template.hint')}
      </Typography>
      {categories.length === 0 && <EmptyState title={t('template.noCategories')} />}
      {categories.map((category) => (
        <Box component="section" aria-label={category.name} key={category.id} sx={{ mt: 2.5 }}>
          <Typography
            component="h2"
            sx={{
              color: 'text.secondary',
              fontSize: 12,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {category.name}
          </Typography>
          {items
            .filter((item) => item.categoryId === category.id)
            .map((item) => (
              <TemplateRow key={item.id} item={item} />
            ))}
          <AddInlineRow
            label={t('template.add')}
            placeholder={t('day.newTask')}
            onAdd={(text) => void addTemplateItem(category.id, text, today)}
          />
        </Box>
      ))}
    </>
  );
};
