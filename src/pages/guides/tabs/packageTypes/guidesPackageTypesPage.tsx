import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesPackagesContent } from '@/pages/guides/tabs/packageTypes/components/guidesPackageTypesContent.tsx';

export const GuidesPackageTypesPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesPackagesContent />
    </>
  );
};
