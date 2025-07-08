import { DataGrid, Container } from '@/components';
import { useIntl } from 'react-intl';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deletePackage, getPackages } from '@/api';
import { SharedLoading, SharedError, SharedDeleteModal } from '@/partials/sharedUI';
import { useState } from 'react';
import { usePackagesColumns } from '@/pages/warehouse/packages/packagesList/components/blocks/packagesColumns.tsx';
import { PackagesToolbar } from '@/pages/warehouse/packages/packagesList/components/blocks/packagesToolbar.tsx';
import { PackagesModal } from '@/pages/warehouse/packages/packagesList/components/blocks/packagesModal.tsx';
import { PackageStatus } from '@/api/enums';
import { PackagesCargoCreateModal } from '@/pages/warehouse/packages/packagesList/components/blocks/packagesCargoCreateModal.tsx';
import { initialPagination } from '@/utils';
import { useParams } from 'react-router';

export const PackagesListContent = () => {
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<PackageStatus>();
  const [deliveryCategory, setDeliveryCategory] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(id ? true : false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCargoCreateModalOpen, setIsCargoCreateModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(id ? Number(id) : null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'packages',
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm,
      status,
      deliveryCategory
    ],
    queryFn: () =>
      getPackages({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        status: status,
        hawb: searchTerm,
        delivery_category: deliveryCategory
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
      await deletePackage(selectedId);
      await queryClient.invalidateQueries({ queryKey: ['packages'] });
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = usePackagesColumns({
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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination(initialPagination);
  };

  const handleStatusChange = (newStatus: PackageStatus | undefined) => {
    setStatus(newStatus);
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
        data={data?.result || []}
        onFetchData={handleFetchData}
        layout={{ card: true }}
        toolbar={
          <PackagesToolbar
            onSearch={handleSearch}
            currentStatus={status}
            onStatusChange={handleStatusChange}
            currentDeliveryCategory={deliveryCategory}
            onDeliveryCategoryChange={handleDeliveryCategoryChange}
            onCreateCargo={() => setIsCargoCreateModalOpen(true)}
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
      <PackagesModal open={isModalOpen} id={selectedId} handleClose={() => setIsModalOpen(false)} />
      <SharedDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={formatMessage({ id: 'SYSTEM.DELETE_PACKAGE' })}
        description={formatMessage({ id: 'SYSTEM.CONFIRM_DELETE_PACKAGE_DESCRIPTION' })}
        isLoading={isDeleting}
      />
      <PackagesCargoCreateModal
        open={isCargoCreateModalOpen}
        handleClose={() => setIsCargoCreateModalOpen(false)}
      />
    </Container>
  );
};
