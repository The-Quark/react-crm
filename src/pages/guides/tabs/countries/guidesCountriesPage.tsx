import React from 'react';
import GuidesHeader from '@/pages/guides/components/guidesHeader.tsx';
import { GuidesCountriesContent } from '@/pages/guides/tabs/countries/components/guidesCountriesContent.tsx';

export const GuidesCountriesPage = () => {
  return (
    <>
      <GuidesHeader />
      <GuidesCountriesContent />
    </>
  );
};
