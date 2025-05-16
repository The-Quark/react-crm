/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getUserList } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { useUsersColumns } from '@/pages/crm/users-list/components/blocks/usersColumns.tsx';
import { UsersToolbar } from '@/pages/crm/users-list/components/blocks/usersToolbar.tsx';

export const UsersListContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUserList(),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true
  });

  const columns = useUsersColumns();

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
          toolbar={<UsersToolbar />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
