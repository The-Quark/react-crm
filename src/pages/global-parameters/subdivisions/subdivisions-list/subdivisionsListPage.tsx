import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { SubdivisionsListContent } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/subdivisionsListContent.tsx';

export const SubdivisionsListPage = () => {
  return (
    <>
      <SharedHeader />
      <SubdivisionsListContent />
    </>
  );
};
