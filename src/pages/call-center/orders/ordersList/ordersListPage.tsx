import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { OrdersListContent } from '@/pages/call-center/orders/ordersList/components/ordersListContent.tsx';

export const OrdersListPage = () => {
  return (
    <>
      <SharedHeader />
      <OrdersListContent />
    </>
  );
};
