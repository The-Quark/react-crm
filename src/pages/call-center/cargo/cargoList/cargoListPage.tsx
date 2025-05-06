import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { CargoListContent } from '@/pages/call-center/cargo/cargoList/components/cargoListContent.tsx';

export const CargoListPage = () => {
  return (
    <>
      <SharedHeader />
      <CargoListContent />
    </>
  );
};
