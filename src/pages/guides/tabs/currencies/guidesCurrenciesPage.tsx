import React from 'react';
import { GuidesCurrenciesContent } from '@/pages/guides/tabs/currencies/components/guidesCurrenciesContent.tsx';
import GuidesHeader from '@/pages/guides/components/guidesHeader.tsx';

export const GuidesCurrenciesPage = () => {
  return (
    <>
      <GuidesHeader />
      <GuidesCurrenciesContent />
    </>
  );
};
