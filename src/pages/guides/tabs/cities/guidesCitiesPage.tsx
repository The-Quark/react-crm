import React from 'react';
import GuidesHeader from '@/pages/guides/components/guidesHeader.tsx';
import { GuidesCitiesContent } from '@/pages/guides/tabs/cities/components/guidesCitiesContent.tsx';

export const GuidesCitiesPage = () => {
  return (
    <>
      <GuidesHeader />
      <GuidesCitiesContent />
    </>
  );
};
