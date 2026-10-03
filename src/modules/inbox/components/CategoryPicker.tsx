import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, DialogTitle, List, ListItemButton, Typography } from '@mui/material';

import type { Category } from '@/db';
import { useBackToClose } from '@/hooks/useBackToClose';

interface Props {
  open: boolean;
  categories: Category[];
  onPick: (category: Category) => void;
  onClose: () => void;
}

export const CategoryPicker: FC<Props> = ({ open, categories, onPick, onClose }) => {
  const { t } = useTranslation();

  useBackToClose(open, onClose);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('inbox.pickCategory')}</DialogTitle>
      {categories.length === 0 ? (
        <Typography sx={{ px: 3, pb: 3, color: 'text.secondary' }}>
          {t('inbox.noCategories')}
        </Typography>
      ) : (
        <List sx={{ pt: 0 }}>
          {categories.map((category) => (
            <ListItemButton key={category.id} onClick={() => onPick(category)} sx={{ px: 3 }}>
              {category.name}
            </ListItemButton>
          ))}
        </List>
      )}
    </Dialog>
  );
};
