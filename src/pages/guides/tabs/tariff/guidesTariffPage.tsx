import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesTariffsContent } from '@/pages/guides/tabs/tariff/components/guidesTariffContent.tsx';

export const GuidesTariffPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesTariffsContent />
    </>
  );
};
