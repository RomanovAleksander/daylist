import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/ui/EmptyState';

const TodayPage = () => {
  const { t } = useTranslation();

  return <EmptyState title={t('stub.soon')} />;
};

export default TodayPage;
