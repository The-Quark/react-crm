import { DataGrid } from '@/components';
import { useIntl } from 'react-intl';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deletePackage, getPackages } from '@/api';
import { SharedLoading, SharedError, SharedDeleteModal } from '@/partials/sharedUI';
import { useState } from 'react';
import { usePackagesColumns } from '@/pages/warehouse/packages/packagesList/components/table/blocks/packagesColumns.tsx';
import { PackagesToolbar } from '@/pages/warehouse/packages/packagesList/components/table/blocks/packagesToolbar.tsx';
import { PackagesModal } from '@/pages/warehouse/packages/packagesList/components/table/blocks/packagesModal.tsx';
import { PackageStatus } from '@/api/enums';
import { PackagesCargoCreateModal } from '@/pages/warehouse/packages/packagesList/components/table/blocks/packagesCargoCreateModal.tsx';
import { initialPagination } from '@/utils';
import { useParams } from 'react-router';

type ModalType = 'view' | 'delete' | 'createCargo' | null;

export const PackagesTableContent = () => {
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<PackageStatus>();
  const [deliveryCategory, setDeliveryCategory] = useState<string>();
  const [modal, setModal] = useState<{
    type: ModalType;
    id?: number | null;
  }>({
    type: id ? 'view' : null,
    id: id ? Number(id) : null
  });
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
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        status: status,
        hawb: searchTerm,
        delivery_category: deliveryCategory
      })
  });

  const handleDeleteClick = (id: number) => {
    setModal({ type: 'delete', id });
  };

  const handleConfirmDelete = async () => {
    if (!modal.id) return;

    setIsDeleting(true);
    try {
      await deletePackage(modal.id);
      await queryClient.invalidateQueries({ queryKey: ['packages'] });
      setModal({ type: null });
    } catch (error) {
      console.error('Failed to delete package:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = usePackagesColumns({
    onRowClick: (id) => setModal({ type: 'view', id }),
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
    <>
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
            onCreateCargo={() => setModal({ type: 'createCargo' })}
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
      <PackagesModal
        open={modal.type === 'view'}
        id={modal.id ?? null}
        handleClose={() => setModal({ type: null })}
      />
      <SharedDeleteModal
        open={modal.type === 'delete'}
        onClose={() => setModal({ type: null })}
        onConfirm={handleConfirmDelete}
        title={formatMessage({ id: 'SYSTEM.DELETE_PACKAGE' })}
        description={formatMessage({ id: 'SYSTEM.CONFIRM_DELETE_PACKAGE_DESCRIPTION' })}
        isLoading={isDeleting}
      />
      <PackagesCargoCreateModal
        open={modal.type === 'createCargo'}
        handleClose={() => setModal({ type: null })}
      />
    </>
  );
};
