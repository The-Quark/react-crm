import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { CouriersListContent } from '@/pages/hr-module/couriers/couriers-list/components/couriersListContent.tsx';

export const CouriersListPage = () => {
  return (
    <>
      <SharedHeader />
      <CouriersListContent />
    </>
  );
};
