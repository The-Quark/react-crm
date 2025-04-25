import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesLanguagesContent } from '@/pages/guides/tabs/languages/components/guidesLanguagesContent.tsx';

export const GuidesLanguagesPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesLanguagesContent />
    </>
  );
};
