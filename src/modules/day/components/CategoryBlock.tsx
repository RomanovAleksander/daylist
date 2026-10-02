import type { FC } from 'react';

import { Box, Typography } from '@mui/material';

import type { Task } from '@/db';

import { AddTaskInput } from './AddTaskInput';
import { TaskRow } from './TaskRow';
import type { CategoryGroup } from '../utils/groupTasks';

interface Props {
  group: CategoryGroup;
  onAdd: (categoryId: string, text: string) => void;
  onDelete: (task: Task) => void;
}

export const CategoryBlock: FC<Props> = ({ group, onAdd, onDelete }) => {
  const { category, tasks, doneCount } = group;

  return (
    <Box component="section" aria-label={category.name} sx={{ mt: 2.5 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          color: 'text.secondary',
          fontSize: 12,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        <Typography component="h2" sx={{ font: 'inherit' }}>
          {category.name}
        </Typography>
        {tasks.length > 0 && (
          <span>
            {doneCount}/{tasks.length}
          </span>
        )}
      </Box>
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} onDelete={onDelete} />
      ))}
      <AddTaskInput onAdd={(text) => onAdd(category.id, text)} />
    </Box>
  );
};
