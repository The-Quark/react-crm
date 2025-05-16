import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { UsersListContent } from '@/pages/crm/users-list/components/usersListContent.tsx';

export const UsersListPage = () => {
  return (
    <>
      <SharedHeader />
      <UsersListContent />
    </>
  );
};
