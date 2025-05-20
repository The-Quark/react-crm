/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getUserByParams } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { useAuthContext } from '@/auth';
import { useCouriersColumns } from '@/pages/hr-module/couriers/couriers-list/components/blocks/couriersColumns.tsx';
import { CouriersToolbar } from '@/pages/hr-module/couriers/couriers-list/components/blocks/couriersToolbar.tsx';

export const CouriersListContent = () => {
  const { currentUser } = useAuthContext();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['couriers'],
    queryFn: () => getUserByParams({ companyId: Number(currentUser?.company_id), role: 'courier' }),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true
  });

  const columns = useCouriersColumns();

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
          toolbar={<CouriersToolbar />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
