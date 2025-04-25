import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesCountriesContent } from '@/pages/guides/tabs/countries/components/guidesCountriesContent.tsx';

export const GuidesCountriesPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesCountriesContent />
    </>
  );
};
