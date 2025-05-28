/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getUserByParams } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { useAuthContext } from '@/auth';
import { useCouriersColumns } from '@/pages/hr-module/couriers/couriers-list/components/blocks/couriersColumns.tsx';
import { CouriersToolbar } from '@/pages/hr-module/couriers/couriers-list/components/blocks/couriersToolbar.tsx';
import { useState } from 'react';

export const CouriersListContent = () => {
  const { currentUser } = useAuthContext();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : undefined;
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['couriers', selectedCompanyId],
    queryFn: () => getUserByParams({ companyId: selectedCompanyId, role: 'courier' }),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true,
    enabled: selectedCompanyId !== undefined
  });

  const columns = useCouriersColumns();

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
          <CouriersToolbar
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
