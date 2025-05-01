import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesAirlineRatesContent } from '@/pages/guides/tabs/airlineRates/components/guidesAirlineRatesContent.tsx';

export const GuidesAirlineRatesPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesAirlineRatesContent />
    </>
  );
};
