import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { PositionsListContent } from '@/pages/global-parameters/positions/positions-list/components/positionsListContent.tsx';

export const PositionsListPage = () => {
  return (
    <>
      <SharedHeader />
      <PositionsListContent />
    </>
  );
};
