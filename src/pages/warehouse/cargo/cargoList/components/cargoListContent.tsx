/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCargo, getCargo } from '@/api';
import { SharedLoading, SharedError, SharedDeleteModal } from '@/partials/sharedUI';
import { useState } from 'react';
import { CargoToolbar } from '@/pages/warehouse/cargo/cargoList/components/blocks/cargoToolbar.tsx';
import { useCargoColumns } from '@/pages/warehouse/cargo/cargoList/components/blocks/cargoColumns.tsx';
import { CargoModal } from '@/pages/warehouse/cargo/cargoList/components/blocks/cargoModal.tsx';
import { CargoStatus } from '@/api/enums';
import { useIntl } from 'react-intl';
import { initialPagination } from '@/utils';
import { useParams } from 'react-router';

export const CargoListContent = () => {
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const [searchTermCode, setSearchTermCode] = useState('');
  const [searchTermPackage, setSearchTermPackage] = useState('');
  const [status, setStatus] = useState<CargoStatus>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deliveryCategory, setDeliveryCategory] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(id ? true : false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(id ? Number(id) : null);
  const [pagination, setPagination] = useState(initialPagination);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'cargo',
      pagination.pageIndex,
      pagination.pageSize,
      searchTermCode,
      searchTermPackage,
      status,
      deliveryCategory
    ],
    queryFn: () =>
      getCargo({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        code: searchTermCode,
        hawb: searchTermPackage,
        delivery_category: deliveryCategory,
        status: status
      })
  });

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    setIsDeleting(true);
    try {
      await deleteCargo(selectedId);
      await queryClient.invalidateQueries({ queryKey: ['cargo'] });
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting cargo:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useCargoColumns({
    onRowClick: (id) => {
      setSelectedId(id);
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

  const handleSearchCode = (term: string) => {
    setSearchTermCode(term);
    setPagination(initialPagination);
  };

  const handleStatusChange = (newStatus: CargoStatus | undefined) => {
    setStatus(newStatus);
    setPagination(initialPagination);
  };

  const handleSearchPackage = (term: string) => {
    setSearchTermPackage(term);
    setPagination(initialPagination);
  };

  const handleDeliveryCategoryChange = (newCategory: string | undefined) => {
    setDeliveryCategory(newCategory);
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
        layout={{ card: true }}
        data={data?.result || []}
        onFetchData={handleFetchData}
        toolbar={
          <CargoToolbar
            onSearchCode={handleSearchCode}
            onSearchPackage={handleSearchPackage}
            currentStatus={status}
            onStatusChange={handleStatusChange}
            currentDeliveryCategory={deliveryCategory}
            onDeliveryCategoryChange={handleDeliveryCategoryChange}
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
      <CargoModal open={isModalOpen} id={selectedId} handleClose={() => setIsModalOpen(false)} />
      <SharedDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={formatMessage({ id: 'SYSTEM.DELETE_CARGO' })}
        description={formatMessage({ id: 'SYSTEM.CONFIRM_DELETE_CARGO_DESCRIPTION' })}
        isLoading={isDeleting}
      />
    </Container>
  );
};
