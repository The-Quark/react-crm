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
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : undefined;
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['staff', selectedCompanyId],
    queryFn: () => getUserByParams({ companyId: selectedCompanyId }),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true,
    enabled: selectedCompanyId !== undefined
  });

  const columns = useStaffColumns();

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <DataGrid
        columns={columns}
        data={data?.result}
        rowSelection={true}
        pagination={{ size: 15 }}
        sorting={[{ id: 'id', desc: false }]}
        toolbar={
          <StaffToolbar
            initialCompanyId={initialCompanyId}
            onCompanyChange={(companyId) => setSelectedCompanyId(companyId ?? undefined)}
          />
        }
        layout={{ card: true }}
        messages={{
          empty: isLoading && <SharedLoading simple />
        }}
      />
    </Container>
  );
};
