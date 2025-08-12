import { Container, DataGrid } from '@/components';
import { getGlobalParamsDepartments } from '@/api/get';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SharedDeleteModal, SharedError, SharedLoading } from '@/partials/sharedUI';
import { useDepartmentsColumns } from '@/pages/global-parameters/departments/departments-list/components/blocks/departmentsColumns.tsx';
import { DepartmentsToolbar } from '@/pages/global-parameters/departments/departments-list/components/blocks/departmentsToolbar.tsx';
import { useAuthContext } from '@/auth';
import React, { useState } from 'react';
import { DepartmentsViewModal } from '@/pages/global-parameters/departments/departments-list/components/blocks/departmentsViewModal.tsx';
import { deleteGlobalParamsDepartments } from '@/api';
import { initialPagination } from '@/utils';
import { DepartmentsModal } from '@/pages/global-parameters/departments/departments-list/components/blocks/departmentsModal.tsx';

type ModalState = {
  type: 'view' | 'form' | 'delete' | null;
  departmentId: number | null;
};

export const DepartmentsListContent = () => {
  const { currentUser } = useAuthContext();
  const queryClient = useQueryClient();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : undefined;
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(initialPagination);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    departmentId: null
  });

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'globalParamsDepartments',
      selectedCompanyId,
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm
    ],
    queryFn: () =>
      getGlobalParamsDepartments({
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

  const handleModalOpen = (type: ModalState['type'], departmentId: number | null = null) => {
    setModalState({ type, departmentId });
  };

  const handleModalClose = () => {
    setModalState({ type: null, departmentId: null });
  };

  const handleConfirmDelete = async () => {
    if (!modalState.departmentId) return;

    setIsDeleting(true);
    try {
      await deleteGlobalParamsDepartments(modalState.departmentId);
      await queryClient.invalidateQueries({ queryKey: ['globalParamsDepartments'] });
      handleModalClose();
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useDepartmentsColumns({
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
          <DepartmentsToolbar
            initialCompanyId={initialCompanyId}
            onCompanyChange={(companyId) => setSelectedCompanyId(companyId ?? undefined)}
            onSearch={handleSearch}
            handleFormClick={() => handleModalOpen('form', modalState.departmentId)}
            id={modalState.departmentId}
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

      <DepartmentsViewModal
        open={modalState.type === 'view'}
        id={modalState.departmentId}
        handleClose={handleModalClose}
        handleFormClick={() => handleModalOpen('form', modalState.departmentId)}
      />

      <DepartmentsModal
        open={modalState.type === 'form'}
        onOpenChange={handleModalClose}
        id={modalState.departmentId}
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
