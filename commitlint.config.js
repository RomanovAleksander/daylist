export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Тело коммита не пишем: смысл шага должен помещаться в одну строку заголовка.
    'body-empty': [2, 'always'],
    'scope-enum': [
      2,
      'always',
      [
        'app',
        'layout',
        'day',
        'inbox',
        'goals',
        'history',
        'stats',
        'settings',
        'sync',
        'db',
        'ui',
        'pwa',
        'deps',
      ],
    ],
  },
};
