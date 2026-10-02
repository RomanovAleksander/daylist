import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/ui/EmptyState';

const InboxPage = () => {
  const { t } = useTranslation();

  return <EmptyState title={t('stub.soon')} />;
};

export default InboxPage;
