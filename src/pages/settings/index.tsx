import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';

import { AppearanceSection } from '@/modules/settings/appearance';
import { CategoriesSection } from '@/modules/settings/categories';
import { TemplateLink } from '@/modules/settings/template';
import { DropboxSection } from '@/modules/sync';

const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography component="h1" sx={{ fontSize: 22, fontWeight: 600 }}>
        {t('nav.settings')}
      </Typography>
      <CategoriesSection />
      <TemplateLink />
      <DropboxSection />
      <AppearanceSection />
    </>
  );
};

export default SettingsPage;
