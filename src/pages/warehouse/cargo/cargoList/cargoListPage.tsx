import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { CargoTabContent } from '@/pages/warehouse/cargo/cargoList/components/cargoTabContent.tsx';

export const CargoListPage = () => {
  return (
    <>
      <SharedHeader />
      <CargoTabContent />
    </>
  );
};
