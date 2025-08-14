import { DataGrid, Container } from '@/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUser, getUserByParams } from '@/api';
import { SharedLoading, SharedError, SharedDeleteModal } from '@/partials/sharedUI';
import { useAuthContext } from '@/auth';
import { useCouriersColumns } from '@/pages/hr-module/couriers/couriers-list/components/blocks/couriersColumns.tsx';
import { CouriersToolbar } from '@/pages/hr-module/couriers/couriers-list/components/blocks/couriersToolbar.tsx';
import { useState } from 'react';
import { initialPagination } from '@/utils';

export const CouriersListContent = () => {
  const { currentUser } = useAuthContext();
  const queryClient = useQueryClient();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : undefined;

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pagination, setPagination] = useState(initialPagination);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'couriers',
      selectedCompanyId,
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm
    ],
    queryFn: () =>
      getUserByParams({
        companyId: selectedCompanyId,
        role: 'courier',
        page: pagination.pageIndex,
        per_page: pagination.pageSize
      }),
    enabled: selectedCompanyId !== undefined
  });

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    setIsDeleting(true);
    try {
      await deleteUser(selectedId);
      await queryClient.invalidateQueries({ queryKey: ['couriers'] });
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const columns = useCouriersColumns({ onDeleteClick: handleDeleteClick });

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
        toolbar={
          <CouriersToolbar
            onSearch={handleSearch}
            initialCompanyId={initialCompanyId}
            onCompanyChange={(companyId) => setSelectedCompanyId(companyId ?? undefined)}
          />
        }
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
