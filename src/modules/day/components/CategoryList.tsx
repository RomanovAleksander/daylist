import type { FC } from 'react';

import { Box, ButtonBase, Typography } from '@mui/material';

import type { Category, Task } from '@/db';
import { draggingSx, useSortableRow } from '@/ui/useSortableRow';

import { CategoryEmoji } from './CategoryCard';
import { TaskList } from './TaskList';
import type { CategoryGroup } from '../utils/groupTasks';

interface Props {
  group: CategoryGroup;
  onOpenCategory: (category: Category) => void;
  onOpenTask: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/** Категория в виде «список»: подпись-заголовок и строки задач прямо на фоне экрана. */
export const CategoryList: FC<Props> = ({ group, onOpenCategory, onOpenTask, onDelete }) => {
  const { category, tasks, doneCount } = group;
  const closed = tasks.length > 0 && doneCount === tasks.length;

  const { setNodeRef, style, dragProps, isDragging } = useSortableRow(category.id);

  return (
    <Box
      ref={setNodeRef}
      style={style}
      component="section"
      aria-label={category.name}
      sx={{ mb: 1.5, ...(isDragging && { ...draggingSx, px: 1 }) }}
    >
      <Box
        {...dragProps}
        style={dragProps.style}
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <ButtonBase
          onClick={() => onOpenCategory(category)}
          sx={{ flex: 1, minWidth: 0, justifyContent: 'flex-start', gap: 1, py: 1 }}
        >
          <CategoryEmoji emoji={category.emoji} />
          <Typography
            component="h2"
            sx={{
              color: 'text.secondary',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              overflowWrap: 'anywhere',
              textAlign: 'left',
            }}
          >
            {category.name}
          </Typography>
        </ButtonBase>
        {tasks.length > 0 && (
          <Typography
            sx={{ color: closed ? 'primary.main' : 'text.secondary', fontSize: 12, flex: 'none' }}
          >
            {doneCount}/{tasks.length}
            {closed && ' ✓'}
          </Typography>
        )}
      </Box>
      <TaskList tasks={tasks} flat onOpenTask={onOpenTask} onDelete={onDelete} />
    </Box>
  );
};
