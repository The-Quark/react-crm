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
import { PositionsModal } from '@/pages/global-parameters/positions/positions-list/components/blocks/positionsModal.tsx';

type ModalState = {
  type: 'view' | 'form' | 'delete' | null;
  positionId: number | null;
};

export const PositionsListContent = () => {
  const { currentUser } = useAuthContext();
  const queryClient = useQueryClient();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : undefined;

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(initialPagination);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    positionId: null
  });

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
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    enabled: selectedCompanyId !== undefined
  });

  const handleModalOpen = (type: ModalState['type'], positionId: number | null = null) => {
    setModalState({ type, positionId });
  };

  const handleModalClose = () => {
    setModalState({ type: null, positionId: null });
  };

  const handleConfirmDelete = async () => {
    if (!modalState.positionId) return;
    setIsDeleting(true);
    try {
      await deleteGlobalParamsPosition(modalState.positionId);
      await queryClient.invalidateQueries({ queryKey: ['globalParamsPositions'] });
      handleModalClose();
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = usePositionsColumns({
    onRowClick: (id) => handleModalOpen('view', id),
    onDeleteClick: (id) => handleModalOpen('delete', id),
    onViewClick: (id) => handleModalOpen('view', id),
    onFormClick: (id) => handleModalOpen('form', id)
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
            handleFormClick={() => handleModalOpen('form', modalState.positionId)}
            id={modalState.positionId}
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
        open={modalState.type === 'view'}
        id={modalState.positionId}
        handleClose={handleModalClose}
        handleFormClick={() => handleModalOpen('form', modalState.positionId)}
      />
      <PositionsModal
        open={modalState.type === 'form'}
        onOpenChange={handleModalClose}
        id={modalState.positionId}
      />
      <SharedDeleteModal
        open={modalState.type === 'delete'}
        onClose={handleModalClose}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </Container>
  );
};
