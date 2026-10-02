import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import { PagesConfig } from '@/config/pages.config';
import type { TemplateItem } from '@/db';
import { useToday } from '@/hooks/useToday';
import { AddInlineRow } from '@/ui/AddInlineRow';
import { EmptyState } from '@/ui/EmptyState';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { SortableList } from '@/ui/SortableList';

import { useCategories } from '../categories';
import { addTemplateItem, reorderTemplateItems } from './api/template.api';
import { TemplateRow } from './components/TemplateRow';
import { useTemplateItems } from './hooks/useTemplateItems';

const TemplateList: FC<{ items: TemplateItem[] }> = ({ items }) => (
  <SortableList
    ids={items.map((item) => item.id)}
    onReorder={(ids) => void reorderTemplateItems(ids)}
  >
    {items.map((item) => (
      <TemplateRow key={item.id} item={item} />
    ))}
  </SortableList>
);

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
          <TemplateList items={items.filter((item) => item.categoryId === category.id)} />
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
