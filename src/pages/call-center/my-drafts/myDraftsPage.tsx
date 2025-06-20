import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { MyDraftsContent } from '@/pages/call-center/my-drafts/components/myDraftsContent.tsx';

export const MyDraftsPage = () => {
  return (
    <>
      <SharedHeader />
      <MyDraftsContent />
    </>
  );
};
