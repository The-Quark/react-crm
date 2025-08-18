import React from 'react';
import { SharedHeader } from '@/partials/sharedUI';
import { OrdersTabContent } from '@/pages/call-center/orders/ordersList/components/ordersTabContent.tsx';

export const OrdersListPage = () => {
  return (
    <>
      <SharedHeader />
      <OrdersTabContent />
    </>
  );
};
