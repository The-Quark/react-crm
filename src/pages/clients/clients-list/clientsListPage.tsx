import React from 'react';
import { ClientsListContent } from '@/pages/clients/clients-list/components/clientsListContent.tsx';
import { SharedHeader } from '@/partials/sharedUI';

export const ClientsListPage = () => {
  return (
    <>
      <SharedHeader />
      <ClientsListContent />
    </>
  );
};
