import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { DriversListContent } from '@/pages/hr-module/drivers/drivers-list/components/driversListContent.tsx';

export const DriversListPage = () => {
  return (
    <>
      <SharedHeader />
      <DriversListContent />
    </>
  );
};
