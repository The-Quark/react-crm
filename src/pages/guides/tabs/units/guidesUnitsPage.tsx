import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesUnitsContent } from '@/pages/guides/tabs/units/components/guidesUnitsContent.tsx';

export const GuidesUnitsPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesUnitsContent />
    </>
  );
};
