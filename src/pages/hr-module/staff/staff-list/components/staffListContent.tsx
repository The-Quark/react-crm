/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getUserList } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { StaffToolbar } from '@/pages/hr-module/staff/staff-list/components/blocks/staffToolbar.tsx';
import { useStaffColumns } from '@/pages/hr-module/staff/staff-list/components/blocks/staffColumns.tsx';

export const StaffListContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUserList(),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true
  });

  const columns = useStaffColumns();

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
          toolbar={<StaffToolbar />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
