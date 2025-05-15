/* eslint-disable prettier/prettier */
import { Container, DataGrid } from '@/components';
import { getUsers } from '@/api/get';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useDriversColumns } from '@/pages/hr-module/drivers/drivers-list/components/blocks/driversColumns.tsx';
import { DriversToolbar } from '@/pages/hr-module/drivers/drivers-list/components/blocks/driversToolbar.tsx';

export const DriversListContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users-drivers'],
    queryFn: () => getUsers(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
  const columns = useDriversColumns();

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <div className="grid gap-5 lg:gap-7.5">
        {isLoading ? (
          <SharedLoading />
        ) : (
          <DataGrid
            columns={columns}
            data={data?.result}
            rowSelection={true}
            pagination={{ size: 15 }}
            sorting={[{ id: 'id', desc: false }]}
            toolbar={<DriversToolbar />}
            layout={{ card: true }}
          />
        )}
      </div>
    </Container>
  );
};
