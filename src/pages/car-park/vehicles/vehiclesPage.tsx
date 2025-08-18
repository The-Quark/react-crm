import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { VehiclesContent } from '@/pages/car-park/vehicles/components/vehiclesContent.tsx';

export const VehiclesPage = () => {
  return (
    <>
      <SharedHeader />
      <VehiclesContent />
    </>
  );
};
