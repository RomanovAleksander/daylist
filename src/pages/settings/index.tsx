import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/ui/EmptyState';

const SettingsPage = () => {
  const { t } = useTranslation();

  return <EmptyState title={t('stub.soon')} />;
};

export default SettingsPage;
