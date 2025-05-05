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
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrders(),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const columns = useOrdersColumns({
    onRowClick: (id) => {
      setSelectedId(id);
      setIsModalOpen(true);
    }
  });

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      {isLoading ? (
        <SharedLoading />
      ) : (
        <DataGrid
          columns={columns}
          data={data?.result}
          rowSelection={true}
          pagination={{ size: 15 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<OrdersToolbar />}
          layout={{ card: true }}
        />
      )}
      <OrdersModal open={isModalOpen} id={selectedId} handleClose={() => setIsModalOpen(false)} />
    </Container>
  );
};
