import { DataGrid, Container } from '@/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useVehiclesColumns } from '@/pages/car-park/vehicles/components/blocks/vehiclesColumn.tsx';
import { VehiclesToolbar } from '@/pages/car-park/vehicles/components/blocks/vehiclesToolbar.tsx';
import { deleteVehicle, getVehicles } from '@/api';
import { SharedDeleteModal, SharedError, SharedLoading } from '@/partials/sharedUI';
import React, { useState } from 'react';
import { initialPagination } from '@/utils';
import { VehiclesViewModal } from '@/pages/car-park/vehicles/components/blocks/vehiclesViewModal.tsx';
import VehiclesModal from '@/pages/car-park/vehicles/components/blocks/vehiclesModal.tsx';

type ModalState = {
  type: 'view' | 'form' | 'delete' | null;
  vehicleId: number | null;
};

export const VehiclesContent = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(initialPagination);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    vehicleId: null
  });

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['vehicles', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getVehicles({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        plate_number: searchTerm
      }),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true
  });

  const handleModalOpen = (type: ModalState['type'], vehicleId: number | null = null) => {
    setModalState({ type, vehicleId });
  };

  const handleModalClose = () => {
    setModalState({ type: null, vehicleId: null });
  };

  const handleConfirmDelete = async () => {
    if (!modalState.vehicleId) return;

    setIsDeleting(true);
    try {
      await deleteVehicle(modalState.vehicleId);
      await queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      handleModalClose();
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useVehiclesColumns({
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
          <VehiclesToolbar
            id={modalState.vehicleId}
            onSearch={handleSearch}
            handleFormClick={() => handleModalOpen('form', modalState.vehicleId)}
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
      <VehiclesViewModal
        open={modalState.type === 'view'}
        id={modalState.vehicleId}
        handleClose={handleModalClose}
        handleFormClick={() => handleModalOpen('form', modalState.vehicleId)}
      />
      <VehiclesModal
        open={modalState.type === 'form'}
        onOpenChange={handleModalClose}
        id={modalState.vehicleId}
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
