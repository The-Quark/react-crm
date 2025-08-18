import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@/components';
import { useIntl } from 'react-intl';
import { OrdersTableContent } from '@/pages/call-center/orders/ordersList/components/table/ordersTableContent.tsx';
import { OrdersKanbanContent } from '@/pages/call-center/orders/ordersList/components/kanban/ordersKanbanContent.tsx';

export const OrdersTabContent = () => {
  const { formatMessage } = useIntl();
  return (
    <Container>
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">{formatMessage({ id: 'SYSTEM.TABLE' })}</TabsTrigger>
          <TabsTrigger value="kanban">{formatMessage({ id: 'SYSTEM.KANBAN' })}</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <OrdersTableContent />
        </TabsContent>
        <TabsContent value="kanban">
          <OrdersKanbanContent />
        </TabsContent>
      </Tabs>
    </Container>
  );
};
