/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getUserByParams } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { StaffToolbar } from '@/pages/hr-module/staff/staff-list/components/blocks/staffToolbar.tsx';
import { useStaffColumns } from '@/pages/hr-module/staff/staff-list/components/blocks/staffColumns.tsx';
import { useAuthContext } from '@/auth';
import { useState } from 'react';

export const StaffListContent = () => {
  const { currentUser } = useAuthContext();
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(
    currentUser?.company_id ? Number(currentUser.company_id) : undefined
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['staff', selectedCompanyId],
    queryFn: () => getUserByParams({ companyId: selectedCompanyId }),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true,
    enabled: selectedCompanyId !== null
  });

  const columns = useStaffColumns();

  const handleCompanyChange = (companyId: number | null) => {
    setSelectedCompanyId(companyId === null ? undefined : companyId);
  };

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      {isLoading ? (
        <SharedLoading />
      ) : (
        <DataGrid
          columns={columns}
          data={data?.result}
          rowSelection={true}
          pagination={{ size: 15 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<StaffToolbar onCompanyChange={handleCompanyChange} />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
