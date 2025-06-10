import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesFileTypesContent } from '@/pages/guides/tabs/fileTypes/components/guidesFileTypesContent.tsx';

export const GuidesFileTypesPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesFileTypesContent />
    </>
  );
};
