import { useTranslation } from 'react-i18next';

import { PagesConfig } from '@/config/pages.config';
import { AppearanceSection } from '@/modules/settings/appearance';
import { BackupSection } from '@/modules/settings/backup';
import { CategoriesSection } from '@/modules/settings/categories';
import { TemplateLink } from '@/modules/settings/template';
import { DropboxSection } from '@/modules/sync';
import { ScreenHeader } from '@/ui/ScreenHeader';

const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <ScreenHeader
        title={t('nav.settings')}
        back={{ to: PagesConfig.MORE, label: t('common.back') }}
      />
      <CategoriesSection />
      <TemplateLink />
      <DropboxSection />
      <AppearanceSection />
      <BackupSection />
    </>
  );
};

export default SettingsPage;
