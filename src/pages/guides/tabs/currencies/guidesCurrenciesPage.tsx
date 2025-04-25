import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesCurrenciesContent } from '@/pages/guides/tabs/currencies/components/guidesCurrenciesContent.tsx';

export const GuidesCurrenciesPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesCurrenciesContent />
    </>
  );
};
