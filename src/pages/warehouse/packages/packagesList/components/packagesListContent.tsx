/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deletePackage, getPackages } from '@/api';
import { SharedLoading, SharedError, SharedDeleteModal } from '@/partials/sharedUI';
import { useState } from 'react';
import { usePackagesColumns } from '@/pages/warehouse/packages/packagesList/components/blocks/packagesColumns.tsx';
import { PackagesToolbar } from '@/pages/warehouse/packages/packagesList/components/blocks/packagesToolbar.tsx';
import { PackagesModal } from '@/pages/warehouse/packages/packagesList/components/blocks/packagesModal.tsx';
import { PackageStatus } from '@/api/enums';
import { PackagesCargoCreateModal } from '@/pages/warehouse/packages/packagesList/components/blocks/packagesCargoCreateModal.tsx';

export const PackagesListContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<PackageStatus>();
  const [deliveryCategory, setDeliveryCategory] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCargoCreateModalOpen, setIsCargoCreateModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });
  const queryClient = useQueryClient();

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
    } catch (error) {
      console.error('Error deleting package:', error);
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
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  const handleStatusChange = (newStatus: PackageStatus | undefined) => {
    setStatus(newStatus);
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  const handleDeliveryCategoryChange = (newCategory: string | undefined) => {
    setDeliveryCategory(newCategory);
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
        title="Delete Package"
        description="Are you sure you want to delete this package? This action cannot be undone."
        isLoading={isDeleting}
      />
      <PackagesCargoCreateModal
        open={isCargoCreateModalOpen}
        handleClose={() => setIsCargoCreateModalOpen(false)}
      />
    </Container>
  );
};
