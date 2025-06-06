/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { useState } from 'react';
import { useOrdersColumns } from '@/pages/call-center/orders/ordersList/components/blocks/ordersColumns.tsx';
import { OrdersToolbar } from '@/pages/call-center/orders/ordersList/components/blocks/ordersToolbar.tsx';
import { OrdersModal } from '@/pages/call-center/orders/ordersList/components/blocks/ordersModal.tsx';

export const OrdersListContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['orders', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getOrders({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        title: searchTerm
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const columns = useOrdersColumns({
    onRowClick: (id) => {
      setSelectedId(id);
      setIsModalOpen(true);
    }
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

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <DataGrid
        serverSide
        columns={columns}
        data={data?.result || []}
        layout={{ card: true }}
        toolbar={<OrdersToolbar onSearch={handleSearch} />}
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
    </Container>
  );
};
