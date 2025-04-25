import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesVehiclesContent } from '@/pages/guides/tabs/vehicles/components/guidesVehiclesContent.tsx';

export const GuidesVehiclesPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesVehiclesContent />
    </>
  );
};
