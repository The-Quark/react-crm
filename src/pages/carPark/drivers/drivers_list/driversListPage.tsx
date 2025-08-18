import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { DriversListContent } from '@/pages/carPark/drivers/drivers_list/components/driversListContent.tsx';

export const DriversListPage = () => {
  return (
    <>
      <SharedHeader />
      <DriversListContent />
    </>
  );
};
