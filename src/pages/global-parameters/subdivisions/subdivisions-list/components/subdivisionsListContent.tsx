import { DataGrid, Container } from '@/components';
import { deleteGlobalParamsSubdivision, getGlobalParamsSubdivisions } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SharedDeleteModal, SharedError, SharedLoading } from '@/partials/sharedUI';
import { useSubdivisionsColumns } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/blocks/subdivisionsColumns.tsx';
import { SubdivisionToolbar } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/blocks/subdivisionsToolbar.tsx';
import { useAuthContext } from '@/auth';
import { useState } from 'react';
import { SubdivisionsViewModal } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/blocks/subdivisionsViewModal.tsx';
import { initialPagination } from '@/utils';
import { SubdivisionsModal } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/blocks/subdivisionsModal.tsx';

type ModalState = {
  type: 'view' | 'form' | 'delete' | null;
  subdivisionId: number | null;
};

export const SubdivisionsListContent = () => {
  const { currentUser } = useAuthContext();
  const queryClient = useQueryClient();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : undefined;

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(initialPagination);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    subdivisionId: null
  });

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'globalParamsSubdivisions',
      selectedCompanyId,
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm
    ],
    queryFn: () =>
      getGlobalParamsSubdivisions({
        company_id: selectedCompanyId,
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        name: searchTerm
      }),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    enabled: selectedCompanyId !== undefined
  });

  const handleModalOpen = (type: ModalState['type'], subdivisionId: number | null = null) => {
    setModalState({ type, subdivisionId });
  };

  const handleModalClose = () => {
    setModalState({ type: null, subdivisionId: null });
  };

  const handleConfirmDelete = async () => {
    if (!modalState.subdivisionId) return;
    setIsDeleting(true);
    try {
      await deleteGlobalParamsSubdivision(modalState.subdivisionId);
      await queryClient.invalidateQueries({ queryKey: ['globalParamsSubdivisions'] });
      handleModalClose();
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useSubdivisionsColumns({
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
        rowSelection={true}
        onFetchData={handleFetchData}
        layout={{ card: true }}
        toolbar={
          <SubdivisionToolbar
            initialCompanyId={initialCompanyId}
            onCompanyChange={(companyId) => setSelectedCompanyId(companyId ?? undefined)}
            onSearch={handleSearch}
            handleFormClick={() => handleModalOpen('form', modalState.subdivisionId)}
            id={modalState.subdivisionId}
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
      <SubdivisionsViewModal
        open={modalState.type === 'view'}
        id={modalState.subdivisionId}
        handleClose={handleModalClose}
        handleFormClick={() => handleModalOpen('form', modalState.subdivisionId)}
      />
      <SubdivisionsModal
        open={modalState.type === 'form'}
        onOpenChange={handleModalClose}
        id={modalState.subdivisionId}
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
