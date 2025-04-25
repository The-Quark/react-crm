import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesPackageMaterialsContent } from '@/pages/guides/tabs/packageMaterials/components/guidesPackageMaterialsContent.tsx';

export const GuidesPackageMaterialsPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesPackageMaterialsContent />
    </>
  );
};
