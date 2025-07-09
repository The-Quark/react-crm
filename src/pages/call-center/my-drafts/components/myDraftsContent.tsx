import { DataGrid, Container } from '@/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteOrder, getOrders } from '@/api';
import { SharedLoading, SharedError, SharedDeleteModal } from '@/partials/sharedUI';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { useMyDraftsColumn } from '@/pages/call-center/my-drafts/components/blocks/myDraftsColumns.tsx';
import { MyDraftsToolbar } from '@/pages/call-center/my-drafts/components/blocks/myDraftsToolbar.tsx';
import { initialPagination } from '@/utils';

export const MyDraftsContent = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string>();
  const [dateRange, setDateRange] = useState<DateRange>();
  const [deliveryCategory, setDeliveryCategory] = useState<string>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'myDrafts',
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm,
      status,
      deliveryCategory,
      dateRange
    ],
    queryFn: () =>
      getOrders({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        searchorder: searchTerm,
        delivery_category: deliveryCategory,
        status: status,
        start_date: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        end_date: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
        is_draft: true
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
      await deleteOrder(selectedId);
      await queryClient.invalidateQueries({ queryKey: ['myDrafts'] });
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useMyDraftsColumn({ onDeleteClick: handleDeleteClick });

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

  const handleStatus = (status: string | undefined) => {
    setStatus(status);
    setPagination(initialPagination);
  };

  const handleDeliveryCategory = (delivery_category: string | undefined) => {
    setDeliveryCategory(delivery_category);
    setPagination(initialPagination);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
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
          <MyDraftsToolbar
            onSearch={handleSearch}
            onStatus={handleStatus}
            onDeliveryCategory={handleDeliveryCategory}
            currentStatus={status}
            currentDeliveryCategory={deliveryCategory}
            currentDateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
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
