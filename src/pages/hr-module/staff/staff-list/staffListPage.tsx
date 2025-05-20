import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { StaffListContent } from '@/pages/hr-module/staff/staff-list/components/staffListContent.tsx';

export const StaffListPage = () => {
  return (
    <>
      <SharedHeader />
      <StaffListContent />
    </>
  );
};
