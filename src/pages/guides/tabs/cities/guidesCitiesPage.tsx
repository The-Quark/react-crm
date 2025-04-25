import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesCitiesContent } from '@/pages/guides/tabs/cities/components/guidesCitiesContent.tsx';

export const GuidesCitiesPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesCitiesContent />
    </>
  );
};
