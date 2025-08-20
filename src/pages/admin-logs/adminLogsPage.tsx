import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { AdminLogsTable } from '@/pages/admin-logs/components/adminLogsTable.tsx';

const AdminLogsPage = () => {
  return (
    <>
      <SharedHeader />
      <AdminLogsTable />
    </>
  );
};

export default AdminLogsPage;
