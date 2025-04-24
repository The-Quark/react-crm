import React from 'react';
import { GuidesPackagesContent } from '@/pages/guides/tabs/packageTypes/components/guidesPackageTypesContent.tsx';
import GuidesHeader from '@/pages/guides/components/guidesHeader.tsx';

export const GuidesPackageTypesPage = () => {
  return (
    <>
      <GuidesHeader />
      <GuidesPackagesContent />
    </>
  );
};
