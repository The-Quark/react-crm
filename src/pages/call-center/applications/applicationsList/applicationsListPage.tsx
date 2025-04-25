import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { ApplicationListContent } from '@/pages/call-center/applications/applicationsList/components/applicationsListContent.tsx';

export const ApplicationsListPage = () => {
  return (
    <>
      <SharedHeader />
      <ApplicationListContent />
    </>
  );
};
