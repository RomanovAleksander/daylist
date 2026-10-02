export const PagesConfig = {
  TODAY: '/',
  INBOX: '/inbox',
  GOALS: '/goals',
  GOAL: '/goals/:id',
  MORE: '/more',
  HISTORY: '/history',
  STATS: '/stats',
  SETTINGS: '/settings',
  TEMPLATE: '/settings/template',
} as const;

export const goalPath = (id: string) => PagesConfig.GOAL.replace(':id', encodeURIComponent(id));
