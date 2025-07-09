/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { deleteGlobalParamsPosition, getGlobalParamsPositions } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SharedDeleteModal, SharedError, SharedLoading } from '@/partials/sharedUI';
import { usePositionsColumns } from '@/pages/global-parameters/positions/positions-list/components/blocks/positionsColumns.tsx';
import { PositionsToolbar } from '@/pages/global-parameters/positions/positions-list/components/blocks/positionsToolbar.tsx';
import { useAuthContext } from '@/auth';
import { useState } from 'react';
import { PositionsViewModal } from '@/pages/global-parameters/positions/positions-list/components/blocks/positionsViewModal.tsx';
import { initialPagination } from '@/utils';

export const PositionsListContent = () => {
  const { currentUser } = useAuthContext();
  const queryClient = useQueryClient();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : undefined;

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(null);
  const [pagination, setPagination] = useState(initialPagination);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'globalParamsPositions',
      selectedCompanyId,
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm
    ],
    queryFn: () =>
      getGlobalParamsPositions({
        company_id: selectedCompanyId,
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        title: searchTerm
      }),
    enabled: selectedCompanyId !== undefined
  });

  const handleConfirmDelete = async () => {
    if (!selectedPositionId) return;
    setIsDeleting(true);
    try {
      await deleteGlobalParamsPosition(selectedPositionId);
      await queryClient.invalidateQueries({ queryKey: ['globalParamsPositions'] });
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedPositionId(id);
    setIsDeleteModalOpen(true);
  };

  const columns = usePositionsColumns({
    onRowClick: (id) => {
      setSelectedPositionId(id);
      setIsModalOpen(true);
    },
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
        toolbar={
          <PositionsToolbar
            initialCompanyId={initialCompanyId}
            onCompanyChange={(companyId) => setSelectedCompanyId(companyId ?? undefined)}
            onSearch={handleSearch}
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
      <PositionsViewModal
        open={isModalOpen}
        id={selectedPositionId}
        handleClose={() => setIsModalOpen(false)}
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
