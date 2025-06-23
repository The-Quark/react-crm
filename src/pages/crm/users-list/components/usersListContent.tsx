/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getUserList } from '@/api/get/getUser';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { useUsersColumns } from '@/pages/crm/users-list/components/blocks/usersColumns.tsx';
import { UsersToolbar } from '@/pages/crm/users-list/components/blocks/usersToolbar.tsx';
import { useState } from 'react';

export const UsersListContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['users', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getUserList({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        full_name: searchTerm
      })
  });

  const columns = useUsersColumns();

  const handleFetchData = async (params: { pageIndex: number; pageSize: number }) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <DataGrid
        serverSide
        columns={columns}
        data={data?.result || []}
        onFetchData={handleFetchData}
        layout={{ card: true }}
        toolbar={<UsersToolbar onSearch={handleSearch} />}
        pagination={{
          page: pagination.pageIndex,
          size: pagination.pageSize,
          total: data?.total || 0
        }}
        messages={{
          empty: isPending && <SharedLoading simple />,
          loading: isFetching && <SharedLoading simple />
        }}
      />
    </Container>
  );
};
