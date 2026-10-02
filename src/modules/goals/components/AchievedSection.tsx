import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ButtonBase, Collapse, Typography } from '@mui/material';

import { goalPath } from '@/config/pages.config';
import type { Goal } from '@/db';

import { formatAchievedAt } from '../utils/format';

interface Props {
  goals: Goal[];
}

export const AchievedSection: FC<Props> = ({ goals }) => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  if (goals.length === 0) return null;

  return (
    <>
      <ButtonBase
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
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
        {t('goals.achieved', { count: goals.length })}
        <ExpandMoreIcon
          fontSize="small"
          sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
        />
      </ButtonBase>
      <Collapse in={open} unmountOnExit>
        {goals.map((goal) => (
          <ButtonBase
            key={goal.id}
            component={RouterLink}
            to={goalPath(goal.id)}
            sx={{
              width: '100%',
              justifyContent: 'space-between',
              gap: 1,
              py: 1.25,
              textAlign: 'left',
            }}
          >
            <Typography
              component="span"
              sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
            >
              {goal.title}
            </Typography>
            <Typography
              component="span"
              sx={{ color: 'text.secondary', fontSize: 13, whiteSpace: 'nowrap' }}
            >
              {goal.achievedAt && formatAchievedAt(goal.achievedAt)}
            </Typography>
          </ButtonBase>
        ))}
      </Collapse>
    </>
  );
};
