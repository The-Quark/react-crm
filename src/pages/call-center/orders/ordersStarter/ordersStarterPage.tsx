import React from 'react';
import { Container } from '@/components';
import { OrdersStarterContent } from '@/pages/call-center/orders/ordersStarter/components/ordersStarterContent.tsx';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { OrderCreationProvider } from '@/pages/call-center/orders/ordersStarter/components/context/orderCreationContext.tsx';
import { useIntl } from 'react-intl';

export const OrdersStarterPage = () => {
  const { id } = useParams<{ id: string }>();
  const { formatMessage } = useIntl();
  const isEditMode = !!id;
  const orderId = id ? parseInt(id, 10) : undefined;

  const {
    data: orderData,
    isLoading,
    error,
    isError
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrders({ id: orderId! }),
    enabled: isEditMode
  });

  if (isEditMode && (orderId === undefined || isNaN(orderId))) {
    return (
      <Container>
        <SharedError error={new Error(formatMessage({ id: 'SYSTEM.ERROR.INVALID_ID' }))} />
      </Container>
    );
  }

  if (isEditMode) {
    if (isLoading) {
      return (
        <Container>
          <SharedLoading />
        </Container>
      );
    }
    if (isError) {
      return (
        <Container>
          <SharedError error={error} />
        </Container>
      );
    }
  }

  const initialData = isEditMode ? (orderData?.result?.[0] ?? null) : null;

  return (
    <Container>
      <OrderCreationProvider initialData={initialData}>
        <OrdersStarterContent isEditMode={isEditMode} orderId={orderId} />
      </OrderCreationProvider>
    </Container>
  );
};
