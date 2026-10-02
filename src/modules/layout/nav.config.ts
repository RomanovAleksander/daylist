import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import MenuIcon from '@mui/icons-material/Menu';

import { PagesConfig } from '@/config/pages.config';

/** `sections` — экраны, на которых вкладка подсвечена: «Ще» открывает историю, статистику и настройки. */
export const navItems = [
  {
    path: PagesConfig.TODAY,
    labelKey: 'nav.today',
    Icon: CheckBoxOutlinedIcon,
    sections: [] as string[],
  },
  {
    path: PagesConfig.INBOX,
    labelKey: 'nav.inbox',
    Icon: InboxOutlinedIcon,
    sections: [PagesConfig.INBOX],
  },
  {
    path: PagesConfig.GOALS,
    labelKey: 'nav.goals',
    Icon: FlagOutlinedIcon,
    sections: [PagesConfig.GOALS],
  },
  {
    path: PagesConfig.MORE,
    labelKey: 'nav.more',
    Icon: MenuIcon,
    sections: [PagesConfig.MORE, PagesConfig.HISTORY, PagesConfig.STATS, PagesConfig.SETTINGS],
  },
] as const;
