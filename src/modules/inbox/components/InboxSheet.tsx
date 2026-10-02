import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import { Box, InputBase, Typography } from '@mui/material';

import type { Category, InboxItem } from '@/db';
import { BottomSheet } from '@/ui/BottomSheet';
import { SheetAction } from '@/ui/SheetAction';

import { updateInboxItemText } from '../api/inbox.api';

interface Props {
  item: InboxItem;
  categories: Category[];
  onClose: () => void;
  onDelete: (item: InboxItem) => void;
  onToToday: (item: InboxItem, category: Category) => void;
}

export const InboxSheet: FC<Props> = ({ item, categories, onClose, onDelete, onToToday }) => {
  const [text, setText] = useState(item.text);
  const [pickCategory, setPickCategory] = useState(false);

  const { t } = useTranslation();

  // Текст сохраняем перед любым действием: перенос в день берёт уже исправленную формулировку.
  const run = (action: (current: InboxItem) => void) => {
    const trimmed = text.trim();
    const current = trimmed && trimmed !== item.text ? { ...item, text: trimmed } : item;
    if (current !== item) void updateInboxItemText(item.id, trimmed);
    action(current);
    onClose();
  };

  return (
    <BottomSheet open onClose={() => run(() => undefined)} title={t('nav.inbox')}>
      <InputBase
        fullWidth
        multiline
        value={text}
        inputProps={{ 'aria-label': t('inbox.edit') }}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            run(() => undefined);
          }
        }}
        sx={{ bgcolor: 'background.default', borderRadius: 3, px: 1.5, py: 1, mb: 1 }}
      />
      {pickCategory ? (
        <Box>
          <Typography sx={{ color: 'text.secondary', fontSize: 14, my: 1 }}>
            {categories.length ? t('inbox.pickCategory') : t('inbox.noCategories')}
          </Typography>
          {categories.map((category) => (
            <SheetAction
              key={category.id}
              icon={<span>{category.emoji ?? '·'}</span>}
              label={category.name}
              onClick={() => run((current) => onToToday(current, category))}
            />
          ))}
        </Box>
      ) : (
        <Box>
          {!item.done && (
            <SheetAction
              icon={<EventAvailableOutlinedIcon fontSize="small" />}
              label={t('inbox.toTodayAction')}
              onClick={() => setPickCategory(true)}
            />
          )}
          <SheetAction
            danger
            icon={<DeleteOutlineOutlinedIcon fontSize="small" />}
            label={t('common.delete')}
            onClick={() => run(onDelete)}
          />
        </Box>
      )}
    </BottomSheet>
  );
};
