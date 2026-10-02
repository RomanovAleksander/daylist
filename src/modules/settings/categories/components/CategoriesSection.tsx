import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import type { Category } from '@/db';
import { useToday } from '@/hooks/useToday';
import { AddInlineRow } from '@/ui/AddInlineRow';
import { SettingsSection } from '@/ui/SettingsSection';
import { SortableList } from '@/ui/SortableList';

import { CategoryRow } from './CategoryRow';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';
import { addCategory, deleteCategory, reorderCategories } from '../api/categories.api';
import { useCategories } from '../hooks/useCategories';

export const CategoriesSection: FC = () => {
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const { t } = useTranslation();

  const today = useToday();
  const categories = useCategories();

  const handleConfirmDelete = (category: Category) => {
    setToDelete(null);
    void deleteCategory(category.id, today);
  };

  return (
    <SettingsSection title={t('settings.categories')}>
      <SortableList
        ids={categories?.map((category) => category.id) ?? []}
        onReorder={(ids) => void reorderCategories(ids)}
      >
        {categories?.map((category) => (
          <CategoryRow key={category.id} category={category} onDelete={setToDelete} />
        ))}
      </SortableList>
      <AddInlineRow
        label={t('settings.addCategory')}
        placeholder={t('settings.categoryName')}
        onAdd={(name) => void addCategory(name)}
      />
      <DeleteCategoryDialog
        category={toDelete}
        onConfirm={handleConfirmDelete}
        onClose={() => setToDelete(null)}
      />
    </SettingsSection>
  );
};
