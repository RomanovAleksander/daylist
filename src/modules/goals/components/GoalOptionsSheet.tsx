import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { PagesConfig } from '@/config/pages.config';
import type { Goal } from '@/db';
import { BottomSheet } from '@/ui/BottomSheet';
import { SheetAction } from '@/ui/SheetAction';

import { GoalNumberFields } from './GoalNumberFields';
import { GoalSettings } from './GoalSettings';
import { deleteGoal, setGoalAchieved } from '../api/goals.api';

interface Props {
  goal: Goal;
  onClose: () => void;
}

/** Всё, что меняется редко: тип, дата, мера, удаление — подальше от главной кнопки. */
export const GoalOptionsSheet: FC<Props> = ({ goal, onClose }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDelete = () => {
    setConfirmDelete(false);
    void deleteGoal(goal.id);
    navigate(PagesConfig.GOALS, { replace: true });
  };

  return (
    <BottomSheet open onClose={onClose} title={t('goals.card.options')}>
      <Box sx={{ mt: -1.5 }}>
        <GoalSettings goal={goal} />
        {goal.measure === 'number' && <GoalNumberFields goal={goal} />}
      </Box>
      <Box sx={{ mt: 2 }}>
        <SheetAction
          icon={goal.achievedAt ? <ReplayIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
          label={goal.achievedAt ? t('goals.card.reopen') : t('goals.card.markAchieved')}
          onClick={() => {
            void setGoalAchieved(goal.id, !goal.achievedAt);
            onClose();
          }}
        />
        <SheetAction
          danger
          icon={<DeleteOutlineOutlinedIcon fontSize="small" />}
          label={t('goals.card.delete')}
          onClick={() => setConfirmDelete(true)}
        />
      </Box>
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>{t('goals.card.deleteTitle', { title: goal.title })}</DialogTitle>
        <DialogContent sx={{ color: 'text.secondary' }}>{t('goals.card.deleteText')}</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>{t('common.cancel')}</Button>
          <Button color="error" onClick={handleDelete}>
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </BottomSheet>
  );
};
