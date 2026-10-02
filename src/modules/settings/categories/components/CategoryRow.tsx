import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, ButtonBase, IconButton, Typography } from '@mui/material';

import type { Category } from '@/db';
import { InlineInput } from '@/ui/InlineInput';
import { draggingSx, useSortableRow } from '@/ui/useSortableRow';

import { renameCategory } from '../api/categories.api';

interface Props {
  category: Category;
  onDelete: (category: Category) => void;
}

export const CategoryRow: FC<Props> = ({ category, onDelete }) => {
  const [editing, setEditing] = useState(false);

  const { t } = useTranslation();

  const { setNodeRef, style, dragProps, isDragging } = useSortableRow(category.id, editing);

  const save = (name: string) => {
    setEditing(false);
    if (name && name !== category.name) void renameCategory(category.id, name);
  };

  return (
    <Box
      ref={setNodeRef}
      {...dragProps}
      style={{ ...style, ...dragProps.style }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: 48,
        ...(isDragging && { ...draggingSx, px: 1 }),
      }}
    >
      {editing ? (
        <Box sx={{ flex: 1 }}>
          <InlineInput
            initialValue={category.name}
            ariaLabel={t('settings.renameCategory')}
            onSubmit={save}
            onBlurSubmit={save}
            onClose={() => setEditing(false)}
          />
        </Box>
      ) : (
        <ButtonBase
          onClick={() => setEditing(true)}
          aria-label={t('settings.renameCategory')}
          sx={{ flex: 1, justifyContent: 'flex-start', textAlign: 'left', py: 1.25 }}
        >
          <Typography component="span">{category.name}</Typography>
        </ButtonBase>
      )}
      <IconButton aria-label={t('settings.deleteCategory')} onClick={() => onDelete(category)}>
        <DeleteOutlineOutlinedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};
