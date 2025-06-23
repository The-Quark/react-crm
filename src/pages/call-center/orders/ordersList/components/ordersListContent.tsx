/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteOrder, getOrders } from '@/api';
import { SharedLoading, SharedError, SharedDeleteModal } from '@/partials/sharedUI';
import { useState } from 'react';
import { useOrdersColumns } from '@/pages/call-center/orders/ordersList/components/blocks/ordersColumns.tsx';
import { OrdersToolbar } from '@/pages/call-center/orders/ordersList/components/blocks/ordersToolbar.tsx';
import { OrdersModal } from '@/pages/call-center/orders/ordersList/components/blocks/ordersModal.tsx';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

export const OrdersListContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string>();
  const [dateRange, setDateRange] = useState<DateRange>();
  const [deliveryCategory, setDeliveryCategory] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });
  const queryClient = useQueryClient();

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'orders',
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm,
      status,
      deliveryCategory,
      dateRange
    ],
    queryFn: () =>
      getOrders({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        searchorder: searchTerm,
        delivery_category: deliveryCategory,
        status: status,
        start_date: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        end_date: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
        is_draft: false
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
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting order:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useOrdersColumns({
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

  const handleStatus = (status: string | undefined) => {
    setStatus(status);
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  const handleDeliveryCategory = (delivery_category: string | undefined) => {
    setDeliveryCategory(delivery_category);
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
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
          <OrdersToolbar
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
      <OrdersModal open={isModalOpen} id={selectedId} handleClose={() => setIsModalOpen(false)} />
      <SharedDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Order"
        description="Are you sure you want to delete this order? This action cannot be undone."
        isLoading={isDeleting}
      />
    </Container>
  );
};
