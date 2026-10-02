import { useState, type FC, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';

import type { Category } from '@/db';

interface Props {
  categories: Category[];
  selected: Category;
  onSelect: (category: Category) => void;
  onCreate: () => void;
}

/** Куда упадёт новая задача; выбор запоминается до следующего раза. */
export const CategoryChip: FC<Props> = ({ categories, selected, onSelect, onCreate }) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const { t } = useTranslation();

  const pick = (action: () => void) => {
    setAnchor(null);
    action();
  };

  return (
    <>
      <Button
        variant="contained"
        disableElevation
        aria-label={t('day.pickCategory')}
        aria-haspopup="menu"
        onClick={(event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          borderRadius: 3,
          flex: 'none',
          maxWidth: '42%',
          fontWeight: 600,
          px: 1.5,
          '& .MuiButton-endIcon': { ml: 0.25 },
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected.emoji ? `${selected.emoji} ` : ''}
          {selected.name}
        </span>
      </Button>
      <Menu anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
        {categories.map((category) => (
          <MenuItem
            key={category.id}
            selected={category.id === selected.id}
            onClick={() => pick(() => onSelect(category))}
          >
            {category.emoji ? `${category.emoji}  ` : ''}
            {category.name}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => pick(onCreate)}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          {t('day.newCategory')}
        </MenuItem>
      </Menu>
    </>
  );
};
