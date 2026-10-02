import type { FC } from 'react';

import type { Task } from '@/db';
import { SortableItem, SortableList } from '@/ui/SortableList';

import { TaskRow } from './TaskRow';
import { reorderTasks } from '../api/tasks.api';

interface Props {
  tasks: Task[];
  flat?: boolean;
  onOpenTask: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/** Задачи одной категории; порядок меняется только долгим нажатием. */
export const TaskList: FC<Props> = ({ tasks, flat, onOpenTask, onDelete }) => (
  <SortableList ids={tasks.map((task) => task.id)} onReorder={(ids) => void reorderTasks(ids)}>
    {tasks.map((task) => (
      <SortableItem key={task.id} id={task.id}>
        <TaskRow task={task} flat={flat} onOpen={onOpenTask} onDelete={onDelete} />
      </SortableItem>
    ))}
  </SortableList>
);
