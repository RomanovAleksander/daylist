import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import type { Category } from '@/db';
import { useBackToClose } from '@/hooks/useBackToClose';

interface Props {
  category: Category | null;
  onConfirm: (category: Category) => void;
  onClose: () => void;
}

export const DeleteCategoryDialog: FC<Props> = ({ category, onConfirm, onClose }) => {
  const { t } = useTranslation();

  useBackToClose(category !== null, onClose);

  return (
    <Dialog open={category !== null} onClose={onClose}>
      <DialogTitle>{t('settings.deleteCategoryTitle', { name: category?.name ?? '' })}</DialogTitle>
      <DialogContent sx={{ color: 'text.secondary' }}>
        {t('settings.deleteCategoryText')}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button color="error" onClick={() => category && onConfirm(category)}>
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
