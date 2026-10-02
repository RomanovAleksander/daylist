import BarChartIcon from '@mui/icons-material/BarChart';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import HistoryIcon from '@mui/icons-material/History';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import { PagesConfig } from '@/config/pages.config';

export const navItems = [
  { path: PagesConfig.TODAY, labelKey: 'nav.today', Icon: CheckBoxOutlinedIcon },
  { path: PagesConfig.HISTORY, labelKey: 'nav.history', Icon: HistoryIcon },
  { path: PagesConfig.STATS, labelKey: 'nav.stats', Icon: BarChartIcon },
  { path: PagesConfig.SETTINGS, labelKey: 'nav.settings', Icon: SettingsOutlinedIcon },
] as const;
