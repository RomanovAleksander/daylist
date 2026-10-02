import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, ButtonBase, Checkbox, Typography } from '@mui/material';

import type { InboxItem } from '@/db';
import { SwipeRow } from '@/ui/SwipeRow';

import { setInboxItemDone } from '../api/inbox.api';
import { ageOf } from '../utils/age';

interface Props {
  item: InboxItem;
  now: number;
  onOpen: (item: InboxItem) => void;
  onDelete: (item: InboxItem) => void;
  onToToday: (item: InboxItem) => void;
}

export const InboxRow: FC<Props> = ({ item, now, onOpen, onDelete, onToToday }) => {
  const { t } = useTranslation();

  const age = ageOf(item.createdAt, now);

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
          bgcolor: 'background.paper',
        }}
      >
        <Checkbox
          checked={item.done}
          onChange={(_, done) => void setInboxItemDone(item.id, done)}
          slotProps={{ input: { 'aria-label': t('inbox.toggle', { text: item.text }) } }}
          sx={{ p: 1.25, ml: -1.25 }}
        />
        <ButtonBase
          onClick={() => onOpen(item)}
          aria-label={t('inbox.edit')}
          sx={{ flex: 1, minWidth: 0, justifyContent: 'flex-start', textAlign: 'left', py: 1.25 }}
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
      </Box>
    </SwipeRow>
  );
};
