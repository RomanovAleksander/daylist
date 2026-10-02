import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import { Box, InputBase, Typography } from '@mui/material';

import type { Category, InboxItem } from '@/db';
import { BottomSheet } from '@/ui/BottomSheet';
import { SheetAction } from '@/ui/SheetAction';

import { updateInboxItem } from '../api/inbox.api';

interface Props {
  item: InboxItem;
  categories: Category[];
  onClose: () => void;
  onDelete: (item: InboxItem) => void;
  onToToday: (item: InboxItem, category: Category) => void;
}

export const InboxSheet: FC<Props> = ({ item, categories, onClose, onDelete, onToToday }) => {
  const [text, setText] = useState(item.text);
  const [note, setNote] = useState(item.note ?? '');
  const [pickCategory, setPickCategory] = useState(false);

  const { t } = useTranslation();

  // Текст и описание сохраняем перед любым действием: перенос в день берёт исправленную формулировку.
  const run = (action: (current: InboxItem) => void) => {
    const current = { ...item, text: text.trim() || item.text, note: note.trim() || undefined };
    if (current.text !== item.text || current.note !== item.note) {
      void updateInboxItem(item.id, { text: current.text, note: current.note });
    }
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
      <InputBase
        fullWidth
        multiline
        minRows={2}
        value={note}
        placeholder={t('inbox.notePlaceholder')}
        inputProps={{ 'aria-label': t('inbox.note') }}
        onChange={(event) => setNote(event.target.value)}
        sx={{
          bgcolor: 'background.default',
          borderRadius: 3,
          px: 1.5,
          py: 1,
          mb: 1,
          fontSize: 15,
          color: 'text.secondary',
        }}
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
