import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { PackagesListContent } from '@/pages/warehouse/packages/packagesList/components/packagesListContent.tsx';

export const PackagesListPage = () => {
  return (
    <>
      <SharedHeader />
      <PackagesListContent />
    </>
  );
};
