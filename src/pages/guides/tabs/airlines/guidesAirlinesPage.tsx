import React from 'react';
import { GuidesAirlinesContent } from '@/pages/guides/tabs/airlines/components/guidesAirlinesContent.tsx';
import { SharedHeader } from '@/partials/sharedUI';

export const GuidesAirlinesPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesAirlinesContent />
    </>
  );
};
