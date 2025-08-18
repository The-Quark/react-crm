import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { PackagesTabContent } from '@/pages/warehouse/packages/packagesList/components/packagesTabPage.tsx';

export const PackagesListPage = () => {
  return (
    <>
      <SharedHeader />
      <PackagesTabContent />
    </>
  );
};
