import React from 'react';
import GuidesHeader from '@/pages/guides/components/guidesHeader.tsx';
import { GuidesPackageMaterialsContent } from '@/pages/guides/tabs/packageMaterials/components/guidesPackageMaterialsContent.tsx';

export const GuidesPackageMaterialsPage = () => {
  return (
    <>
      <GuidesHeader />
      <GuidesPackageMaterialsContent />
    </>
  );
};
