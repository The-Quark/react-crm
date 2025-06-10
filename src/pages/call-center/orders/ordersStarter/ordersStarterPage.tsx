import React from 'react';
import { Container } from '@/components';
import { OrdersStarterContent } from '@/pages/call-center/orders/ordersStarter/components/ordersStarterContent.tsx';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

export const OrdersStarterPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    data: orderData,
    isLoading,
    error,
    isError
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrders({ id: Number(id) }),
    enabled: !!id
  });

  if (isEditMode && isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      {isEditMode && isLoading ? (
        <SharedLoading />
      ) : (
        <OrdersStarterContent
          isEditMode={isEditMode}
          orderId={Number(id)}
          orderData={orderData?.result[0]}
        />
      )}
    </Container>
  );
};
