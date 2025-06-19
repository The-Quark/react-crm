import React from 'react';
import { Container } from '@/components';
import { OrdersStarterContent } from '@/pages/call-center/orders/ordersStarter/components/ordersStarterContent.tsx';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { OrderCreationProvider } from '@/pages/call-center/orders/ordersStarter/components/context/orderCreationContext.tsx';

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
    enabled: isEditMode
  });

  if (isEditMode && isError) {
    return (
      <Container>
        <SharedError error={error} />
      </Container>
    );
  }

  if (isEditMode && isLoading) {
    return (
      <Container>
        <SharedLoading />
      </Container>
    );
  }

  return (
    <Container>
      <OrderCreationProvider initialData={isEditMode ? orderData?.result[0] : null}>
        <OrdersStarterContent isEditMode={isEditMode} orderId={Number(id)} />
      </OrderCreationProvider>
    </Container>
  );
};
