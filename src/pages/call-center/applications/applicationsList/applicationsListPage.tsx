import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { ApplicationsTabContent } from '@/pages/call-center/applications/applicationsList/components/applicationsTabContent.tsx';

export const ApplicationsListPage = () => {
  return (
    <>
      <SharedHeader />
      <ApplicationsTabContent />
    </>
  );
};
