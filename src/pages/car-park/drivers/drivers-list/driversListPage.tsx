import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { DriversListContent } from '@/pages/car-park/drivers/drivers-list/components/driversListContent.tsx';

export const DriversListPage = () => {
  return (
    <>
      <SharedHeader />
      <DriversListContent />
    </>
  );
};
