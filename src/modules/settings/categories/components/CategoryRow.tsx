import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, ButtonBase, IconButton, Typography } from '@mui/material';

import type { Category } from '@/db';
import { InlineInput } from '@/ui/InlineInput';

import { renameCategory } from '../api/categories.api';

interface Props {
  category: Category;
  onDelete: (category: Category) => void;
}

export const CategoryRow: FC<Props> = ({ category, onDelete }) => {
  const [editing, setEditing] = useState(false);

  const { t } = useTranslation();

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } =
    useSortable({ id: category.id });

  const save = (name: string) => {
    setEditing(false);
    if (name && name !== category.name) void renameCategory(category.id, name);
  };

  return (
    <Box
      ref={setNodeRef}
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: 48,
        bgcolor: 'background.default',
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <IconButton
        ref={setActivatorNodeRef}
        aria-label={t('settings.dragCategory')}
        sx={{ ml: -1.5, cursor: 'grab', touchAction: 'none', color: 'text.secondary' }}
        {...attributes}
        {...listeners}
      >
        <DragIndicatorIcon fontSize="small" />
      </IconButton>
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
