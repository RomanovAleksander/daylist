import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ButtonBase, Collapse, Typography } from '@mui/material';

import type { Category, InboxItem } from '@/db';
import { useToday } from '@/hooks/useToday';
import { useCategories } from '@/modules/settings/categories';
import { Composer } from '@/ui/Composer';
import { EmptyState } from '@/ui/EmptyState';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { UndoSnackbar } from '@/ui/UndoSnackbar';

import {
  addInboxItem,
  deleteInboxItem,
  moveInboxItemToToday,
  restoreInboxItem,
} from './api/inbox.api';
import { CategoryPicker } from './components/CategoryPicker';
import { InboxRow } from './components/InboxRow';
import { InboxSheet } from './components/InboxSheet';
import { useInboxItems } from './hooks/useInboxItems';
import { isRecentlyDone } from './utils/age';

export const InboxScreen: FC = () => {
  const [deleted, setDeleted] = useState<InboxItem | null>(null);
  const [moving, setMoving] = useState<InboxItem | null>(null);
  const [opened, setOpened] = useState<InboxItem | null>(null);
  const [showDone, setShowDone] = useState(false);

  const { t } = useTranslation();

  const today = useToday();
  const categories = useCategories();
  const inbox = useInboxItems();

  const now = inbox?.now ?? 0;
  const open = inbox?.items.filter((item) => !item.done) ?? [];
  const done = (inbox?.items ?? [])
    .filter((item) => item.done && isRecentlyDone(item.doneAt, now))
    .sort((a, b) => (b.doneAt ?? 0) - (a.doneAt ?? 0));

  const handleDelete = (item: InboxItem) => {
    void deleteInboxItem(item.id);
    setDeleted(item);
  };

  const moveToToday = (item: InboxItem, category: Category) =>
    void moveInboxItemToToday(item.id, item.text, category.id, today);

  const handlePick = (category: Category) => {
    if (moving) moveToToday(moving, category);
    setMoving(null);
  };

  if (!inbox || !categories) return null;

  return (
    <>
      <ScreenHeader
        title={t('nav.inbox')}
        action={
          open.length > 0 && <Typography sx={{ color: 'text.secondary' }}>{open.length}</Typography>
        }
      />
      {open.length === 0 && <EmptyState title={t('inbox.empty')} />}
      {open.map((item) => (
        <InboxRow
          key={item.id}
          item={item}
          now={now}
          onOpen={setOpened}
          onDelete={handleDelete}
          onToToday={setMoving}
        />
      ))}
      {done.length > 0 && (
        <>
          <ButtonBase
            onClick={() => setShowDone((value) => !value)}
            aria-expanded={showDone}
            sx={{
              mt: 3,
              py: 1,
              gap: 0.5,
              color: 'text.secondary',
              fontSize: 12,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {t('inbox.done', { count: done.length })}
            <ExpandMoreIcon
              fontSize="small"
              sx={{
                transform: showDone ? 'rotate(180deg)' : 'none',
                transition: 'transform 150ms',
              }}
            />
          </ButtonBase>
          <Collapse in={showDone} unmountOnExit>
            {done.map((item) => (
              <InboxRow
                key={item.id}
                item={item}
                now={now}
                onOpen={setOpened}
                onDelete={handleDelete}
                onToToday={setMoving}
              />
            ))}
          </Collapse>
        </>
      )}
      <Composer
        placeholder={t('inbox.capture')}
        submitLabel={t('common.add')}
        onSubmit={(text) => void addInboxItem(text)}
      />
      {opened && (
        <InboxSheet
          key={opened.id}
          item={opened}
          categories={categories}
          onClose={() => setOpened(null)}
          onDelete={handleDelete}
          onToToday={moveToToday}
        />
      )}
      <CategoryPicker
        open={moving !== null}
        categories={categories}
        onPick={handlePick}
        onClose={() => setMoving(null)}
      />
      <UndoSnackbar
        open={deleted !== null}
        message={t('inbox.deleted')}
        actionLabel={t('day.undo')}
        onUndo={() => {
          if (deleted) void restoreInboxItem(deleted.id);
          setDeleted(null);
        }}
        onClose={() => setDeleted(null)}
      />
    </>
  );
};
