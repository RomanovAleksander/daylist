import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, Button, InputBase } from '@mui/material';

import type { Category } from '@/db';
import { useToday } from '@/hooks/useToday';
import { BottomSheet } from '@/ui/BottomSheet';
import { SheetAction } from '@/ui/SheetAction';

import { DeleteCategoryDialog } from './DeleteCategoryDialog';
import { EmojiPicker } from './EmojiPicker';
import {
  addCategory,
  deleteCategory,
  moveCategory,
  renameCategory,
  setCategoryEmoji,
} from '../api/categories.api';
import { useCategories } from '../hooks/useCategories';

interface Props {
  open: boolean;
  /** Без категории — шторка создания новой. */
  category?: Category;
  onClose: () => void;
  onCreated?: (id: string) => void;
  onAddTaskHere?: (category: Category) => void;
}

const inputSx = {
  bgcolor: 'background.default',
  borderRadius: 3,
  px: 1.5,
  py: 1,
  my: 1.5,
} as const;

export const CategorySheet: FC<Props> = ({ open, category, onClose, onCreated, onAddTaskHere }) => {
  const [name, setName] = useState(category?.name ?? '');
  const [emoji, setEmoji] = useState(category?.emoji);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { t } = useTranslation();

  const today = useToday();
  const categories = useCategories();

  const ids = categories?.map((c) => c.id) ?? [];

  const commitName = () => {
    const trimmed = name.trim();
    if (category && trimmed && trimmed !== category.name) void renameCategory(category.id, trimmed);
  };

  const handleEmoji = (next: string | undefined) => {
    setEmoji(next);
    if (category) void setCategoryEmoji(category.id, next);
  };

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = await addCategory(trimmed, emoji);
    onCreated?.(id);
    onClose();
  };

  const close = () => {
    commitName();
    onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={close}
      title={category ? t('settings.categorySheet') : t('settings.newCategoryTitle')}
    >
      <EmojiPicker value={emoji} onChange={handleEmoji} />
      <InputBase
        fullWidth
        value={name}
        placeholder={t('settings.categoryName')}
        inputProps={{ 'aria-label': t('settings.categoryName'), enterKeyHint: 'done' }}
        onChange={(event) => setName(event.target.value)}
        onBlur={commitName}
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          if (category) close();
          else void handleCreate();
        }}
        sx={inputSx}
      />
      {category ? (
        <Box>
          {onAddTaskHere && (
            <SheetAction
              icon={<AddIcon fontSize="small" />}
              label={t('settings.addTaskHere')}
              onClick={() => {
                commitName();
                onAddTaskHere(category);
              }}
            />
          )}
          <SheetAction
            icon={<ArrowUpwardIcon fontSize="small" />}
            label={t('settings.moveUp')}
            onClick={() => void moveCategory(ids, category.id, -1)}
          />
          <SheetAction
            icon={<ArrowDownwardIcon fontSize="small" />}
            label={t('settings.moveDown')}
            onClick={() => void moveCategory(ids, category.id, 1)}
          />
          <SheetAction
            danger
            icon={<DeleteOutlineOutlinedIcon fontSize="small" />}
            label={t('settings.deleteCategory')}
            onClick={() => setConfirmDelete(true)}
          />
          <DeleteCategoryDialog
            category={confirmDelete ? category : null}
            onClose={() => setConfirmDelete(false)}
            onConfirm={() => {
              setConfirmDelete(false);
              void deleteCategory(category.id, today);
              onClose();
            }}
          />
        </Box>
      ) : (
        <Button
          fullWidth
          variant="contained"
          disableElevation
          size="large"
          onClick={() => void handleCreate()}
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          {t('settings.create')}
        </Button>
      )}
    </BottomSheet>
  );
};
