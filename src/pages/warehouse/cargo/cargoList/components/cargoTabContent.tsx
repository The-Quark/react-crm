import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@/components';
import { useIntl } from 'react-intl';
import { CargoTableContent } from '@/pages/warehouse/cargo/cargoList/components/table/cargoTableContent.tsx';
import { CargoKanbanContent } from '@/pages/warehouse/cargo/cargoList/components/kanban/cargoKanbanContent.tsx';

export const CargoTabContent = () => {
  const { formatMessage } = useIntl();
  return (
    <Container>
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">{formatMessage({ id: 'SYSTEM.TABLE' })}</TabsTrigger>
          <TabsTrigger value="kanban">{formatMessage({ id: 'SYSTEM.KANBAN' })}</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <CargoTableContent />
        </TabsContent>
        <TabsContent value="kanban">
          <CargoKanbanContent />
        </TabsContent>
      </Tabs>
    </Container>
  );
};
