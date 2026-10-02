import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import { Box, ButtonBase, Checkbox, IconButton, Typography } from '@mui/material';

import type { InboxItem } from '@/db';
import { InlineInput } from '@/ui/InlineInput';
import { SwipeRow } from '@/ui/SwipeRow';

import { setInboxItemDone, updateInboxItemText } from '../api/inbox.api';
import { ageOf } from '../utils/age';

interface Props {
  item: InboxItem;
  now: number;
  onDelete: (item: InboxItem) => void;
  onToToday: (item: InboxItem) => void;
}

export const InboxRow: FC<Props> = ({ item, now, onDelete, onToToday }) => {
  const [editing, setEditing] = useState(false);

  const { t } = useTranslation();

  const age = ageOf(item.createdAt, now);

  const save = (text: string) => {
    setEditing(false);
    if (!text) onDelete(item);
    else if (text !== item.text) void updateInboxItemText(item.id, text);
  };

  // mousedown срабатывает раньше blur поля — иначе поле закроется до клика по кнопке.
  const keepFocus = (event: { preventDefault: () => void }) => event.preventDefault();

  return (
    <SwipeRow
      actionLabel={t('common.delete')}
      onSwipe={() => onDelete(item)}
      right={item.done ? undefined : { label: t('inbox.toToday'), onSwipe: () => onToToday(item) }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 0.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Checkbox
          checked={item.done}
          onChange={(_, done) => void setInboxItemDone(item.id, done)}
          slotProps={{ input: { 'aria-label': t('inbox.toggle', { text: item.text }) } }}
          sx={{ p: 1.25, ml: -1.25 }}
        />
        {editing ? (
          <>
            <Box sx={{ flex: 1, py: 0.75 }}>
              <InlineInput
                initialValue={item.text}
                ariaLabel={t('inbox.edit')}
                onSubmit={save}
                onBlurSubmit={save}
                onClose={() => setEditing(false)}
              />
            </Box>
            <IconButton
              aria-label={t('inbox.toTodayAction')}
              onMouseDown={keepFocus}
              onClick={() => {
                setEditing(false);
                onToToday(item);
              }}
            >
              <EventAvailableOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label={t('common.delete')}
              onMouseDown={keepFocus}
              onClick={() => onDelete(item)}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <ButtonBase
              onClick={() => setEditing(true)}
              aria-label={t('inbox.edit')}
              sx={{
                flex: 1,
                minWidth: 0,
                justifyContent: 'flex-start',
                textAlign: 'left',
                py: 1.25,
              }}
            >
              <Typography
                component="span"
                sx={{
                  overflowWrap: 'anywhere',
                  color: item.done ? 'text.disabled' : 'text.primary',
                  textDecoration: item.done ? 'line-through' : 'none',
                }}
              >
                {item.text}
              </Typography>
            </ButtonBase>
            {!item.done && (
              <Typography
                component="span"
                sx={{ color: 'text.secondary', fontSize: 12, whiteSpace: 'nowrap', py: 1.5, pl: 1 }}
              >
                {t(`inbox.age.${age.unit}`, { count: age.count })}
              </Typography>
            )}
          </>
        )}
      </Box>
    </SwipeRow>
  );
};
