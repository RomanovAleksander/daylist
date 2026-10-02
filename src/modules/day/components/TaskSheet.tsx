import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOnIcon from '@mui/icons-material/RepeatOn';
import { Box, InputBase } from '@mui/material';

import type { Category, Task } from '@/db';
import { promoteTaskToTemplate, stopTaskRecurring } from '@/modules/settings/template';
import { BottomSheet } from '@/ui/BottomSheet';
import { SheetAction } from '@/ui/SheetAction';

import { CategoryEmoji } from './CategoryCard';
import { moveTaskToInbox, setTaskCategory, updateTaskText } from '../api/tasks.api';

interface Props {
  task: Task;
  categories: Category[];
  onClose: () => void;
  onDelete: (task: Task) => void;
}

export const TaskSheet: FC<Props> = ({ task, categories, onClose, onDelete }) => {
  const [text, setText] = useState(task.text);
  const [pickCategory, setPickCategory] = useState(false);

  const { t } = useTranslation();

  // Текст сохраняем при закрытии шторки и перед любым действием, чтобы правка не потерялась.
  const saveText = () => {
    const trimmed = text.trim();
    if (trimmed && trimmed !== task.text) void updateTaskText(task.id, trimmed);
  };

  const run = (action: () => void) => {
    saveText();
    action();
    onClose();
  };

  return (
    <BottomSheet open onClose={() => run(() => undefined)} title={t('day.taskSheet')}>
      <InputBase
        fullWidth
        multiline
        value={text}
        inputProps={{ 'aria-label': t('day.editTask') }}
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
          {categories.map((category) => (
            <SheetAction
              key={category.id}
              icon={<CategoryEmoji emoji={category.emoji ?? '·'} />}
              label={category.name}
              onClick={() => run(() => void setTaskCategory(task.id, category.id))}
            />
          ))}
        </Box>
      ) : (
        <Box>
          {task.recurring ? (
            <SheetAction
              icon={<RepeatOnIcon fontSize="small" />}
              label={t('day.stopRecurringAction')}
              onClick={() => run(() => void stopTaskRecurring(task))}
            />
          ) : (
            <SheetAction
              icon={<RepeatIcon fontSize="small" />}
              label={t('day.makeRecurringAction')}
              onClick={() => run(() => void promoteTaskToTemplate(task))}
            />
          )}
          <SheetAction
            icon={<InboxOutlinedIcon fontSize="small" />}
            label={t('day.toInbox')}
            onClick={() => run(() => void moveTaskToInbox(task))}
          />
          <SheetAction
            icon={<DriveFileMoveOutlinedIcon fontSize="small" />}
            label={t('day.otherCategory')}
            onClick={() => setPickCategory(true)}
          />
          <SheetAction
            danger
            icon={<DeleteOutlineOutlinedIcon fontSize="small" />}
            label={t('day.deleteTask')}
            onClick={() => run(() => onDelete(task))}
          />
        </Box>
      )}
    </BottomSheet>
  );
};
