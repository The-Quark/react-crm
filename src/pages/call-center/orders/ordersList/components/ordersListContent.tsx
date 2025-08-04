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
import { useIntl } from 'react-intl';
import { initialPagination } from '@/utils';
import { useParams } from 'react-router';

type ModalType = 'view' | 'delete' | null;

export const OrdersListContent = () => {
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string>();
  const [dateRange, setDateRange] = useState<DateRange>();
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
        page: pagination.pageIndex,
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
    setModal({ type: 'delete', id });
  };

  const handleConfirmDelete = async () => {
    if (!modal.id) return;
    setIsDeleting(true);
    try {
      await deleteOrder(modal.id);
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      setModal({ type: null });
    } catch (error) {
      console.error('Failed to delete order:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useOrdersColumns({
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
      <OrdersModal
        open={modal.type === 'view'}
        id={modal.id ?? null}
        handleClose={() => setModal({ type: null })}
      />
      <SharedDeleteModal
        open={modal.type === 'delete'}
        onClose={() => setModal({ type: null })}
        onConfirm={handleConfirmDelete}
        title={formatMessage({ id: 'SYSTEM.DELETE_ORDER' })}
        description={formatMessage({ id: 'SYSTEM.CONFIRM_DELETE_ORDER_DESCRIPTION' })}
        isLoading={isDeleting}
      />
    </Container>
  );
};
