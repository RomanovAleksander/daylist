import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RepeatIcon from '@mui/icons-material/Repeat';
import { Box, Checkbox, IconButton } from '@mui/material';

import type { Task } from '@/db';
import { promoteTaskToTemplate } from '@/modules/settings/template';
import { InlineInput } from '@/ui/InlineInput';
import { SwipeRow } from '@/ui/SwipeRow';

import { CarryBadge } from './CarryBadge';
import { TaskText } from './TaskText';
import { setTaskDone, updateTaskText } from '../api/tasks.api';

interface Props {
  task: Task;
  onDelete: (task: Task) => void;
}

export const TaskRow: FC<Props> = ({ task, onDelete }) => {
  const [editing, setEditing] = useState(false);

  const { t } = useTranslation();

  // Пустой текст при редактировании означает удаление задачи.
  const save = (text: string) => {
    setEditing(false);
    if (!text) onDelete(task);
    else if (text !== task.text) void updateTaskText(task.id, text);
  };

  return (
    <SwipeRow actionLabel={t('day.swipeDelete')} onSwipe={() => onDelete(task)}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
        <Checkbox
          checked={task.done}
          onChange={(_, done) => void setTaskDone(task.id, done)}
          slotProps={{ input: { 'aria-label': t('day.toggleTask', { text: task.text }) } }}
          sx={{ p: 1.25, ml: -1.25 }}
        />
        {editing ? (
          <>
            <Box sx={{ flex: 1, py: 0.75 }}>
              <InlineInput
                initialValue={task.text}
                ariaLabel={t('day.editTask')}
                onSubmit={save}
                onBlurSubmit={save}
                onClose={() => setEditing(false)}
              />
            </Box>
            {!task.recurring && (
              <IconButton
                aria-label={t('day.makeRecurring')}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setEditing(false);
                  void promoteTaskToTemplate(task);
                }}
                sx={{ mt: 0.25 }}
              >
                <RepeatIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              aria-label={t('day.deleteTask')}
              // mousedown срабатывает раньше blur поля — иначе поле закроется до клика.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onDelete(task)}
              sx={{ mt: 0.25 }}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <TaskText task={task} onEdit={() => setEditing(true)} />
            {task.carryCount > 0 && <CarryBadge task={task} onDelete={onDelete} />}
          </>
        )}
      </Box>
    </SwipeRow>
  );
};
