import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesAirportsContent } from '@/pages/guides/tabs/airports/components/guidesAirportsContent.tsx';

export const GuidesAirportsPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesAirportsContent />
    </>
  );
};
