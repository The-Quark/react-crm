import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesSourcesContent } from '@/pages/guides/tabs/sources/components/guidesSourcesContent.tsx';

export const GuidesSourcesPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesSourcesContent />
    </>
  );
};
