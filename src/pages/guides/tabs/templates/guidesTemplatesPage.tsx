import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { GuidesTemplatesContent } from '@/pages/guides/tabs/templates/components/guidesTemplatesContent.tsx';

export const GuidesTemplatesPage = () => {
  return (
    <>
      <SharedHeader />
      <GuidesTemplatesContent />
    </>
  );
};
