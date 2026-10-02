import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/ui/EmptyState';

const StatsPage = () => {
  const { t } = useTranslation();

  return <EmptyState title={t('stub.soon')} />;
};

export default StatsPage;
