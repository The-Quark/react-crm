import { DataGrid, Container } from '@/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserList } from '@/api/get/getUser';
import { SharedLoading, SharedError, SharedDeleteModal } from '@/partials/sharedUI';
import { useUsersColumns } from '@/pages/crm/users-list/components/blocks/usersColumns.tsx';
import { UsersToolbar } from '@/pages/crm/users-list/components/blocks/usersToolbar.tsx';
import { useState } from 'react';
import { deleteUser } from '@/api';
import { initialPagination } from '@/utils';

export const UsersListContent = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['users', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getUserList({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        full_name: searchTerm
      })
  });

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    setIsDeleting(true);
    try {
      await deleteUser(selectedId);
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };
  const columns = useUsersColumns({
    onDeleteClick: handleDeleteClick
  });

  const handleFetchData = async (params: { pageIndex: number; pageSize: number }) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination(initialPagination);
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
      <SharedDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </Container>
  );
};
