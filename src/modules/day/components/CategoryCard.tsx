import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, ButtonBase, Collapse, IconButton, Typography } from '@mui/material';

import type { Category, Task } from '@/db';
import { Card } from '@/ui/Card';

import { TaskRow } from './TaskRow';
import type { CategoryGroup } from '../utils/groupTasks';

interface Props {
  group: CategoryGroup;
  onOpenCategory: (category: Category) => void;
  onOpenTask: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const CategoryEmoji: FC<{ emoji?: string }> = ({ emoji }) =>
  emoji ? (
    <Box
      component="span"
      aria-hidden
      sx={{
        width: 30,
        height: 30,
        borderRadius: 2.5,
        bgcolor: 'action.hover',
        display: 'inline-grid',
        placeItems: 'center',
        fontSize: 16,
        flex: 'none',
      }}
    >
      {emoji}
    </Box>
  ) : null;

/** Закрытая категория сворачивается в одну строку; развернуть можно стрелкой. */
export const CategoryCard: FC<Props> = ({ group, onOpenCategory, onOpenTask, onDelete }) => {
  const { category, tasks, doneCount } = group;
  const closed = tasks.length > 0 && doneCount === tasks.length;

  // Развёрнутость помним только для закрытой категории: отметил последнюю задачу — карточка
  // сворачивается сама.
  const [expanded, setExpanded] = useState(false);

  const { t } = useTranslation();

  const open = !closed || expanded;

  return (
    <Card label={category.name}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ButtonBase
          onClick={() => onOpenCategory(category)}
          sx={{
            flex: 1,
            minWidth: 0,
            justifyContent: 'flex-start',
            gap: 1,
            py: 0.75,
            textAlign: 'left',
          }}
        >
          <CategoryEmoji emoji={category.emoji} />
          <Typography component="h2" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
            {category.name}
          </Typography>
        </ButtonBase>
        {tasks.length > 0 && (
          <Typography
            sx={{
              color: closed ? 'primary.main' : 'text.secondary',
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            {doneCount}/{tasks.length}
            {closed && ' ✓'}
          </Typography>
        )}
        {closed && (
          <IconButton
            size="small"
            aria-expanded={open}
            aria-label={t(open ? 'day.collapse' : 'day.expand')}
            onClick={() => setExpanded((value) => !value)}
          >
            <ExpandMoreIcon
              fontSize="small"
              sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
            />
          </IconButton>
        )}
      </Box>
      <Collapse in={open}>
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} onOpen={onOpenTask} onDelete={onDelete} />
        ))}
      </Collapse>
    </Card>
  );
};
