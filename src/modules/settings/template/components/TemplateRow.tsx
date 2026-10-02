import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, ButtonBase, IconButton, Typography } from '@mui/material';

import type { TemplateItem } from '@/db';
import { InlineInput } from '@/ui/InlineInput';
import { SwipeRow } from '@/ui/SwipeRow';

import { deleteTemplateItem, updateTemplateItemText } from '../api/template.api';

interface Props {
  item: TemplateItem;
}

export const TemplateRow: FC<Props> = ({ item }) => {
  const [editing, setEditing] = useState(false);

  const { t } = useTranslation();

  const save = (text: string) => {
    setEditing(false);
    if (!text) void deleteTemplateItem(item.id);
    else if (text !== item.text) void updateTemplateItemText(item.id, text);
  };

  return (
    <SwipeRow actionLabel={t('day.swipeDelete')} onSwipe={() => void deleteTemplateItem(item.id)}>
      <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 48 }}>
        {editing ? (
          <>
            <Box sx={{ flex: 1 }}>
              <InlineInput
                initialValue={item.text}
                ariaLabel={t('template.edit')}
                onSubmit={save}
                onBlurSubmit={save}
                onClose={() => setEditing(false)}
              />
            </Box>
            <IconButton
              aria-label={t('template.delete')}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => void deleteTemplateItem(item.id)}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <ButtonBase
            onClick={() => setEditing(true)}
            aria-label={t('template.edit')}
            sx={{ flex: 1, justifyContent: 'flex-start', textAlign: 'left', py: 1.25 }}
          >
            <Typography component="span" sx={{ overflowWrap: 'anywhere' }}>
              {item.text}
            </Typography>
          </ButtonBase>
        )}
      </Box>
    </SwipeRow>
  );
};
