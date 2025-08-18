import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@/components';
import { useIntl } from 'react-intl';
import { PackagesTableContent } from '@/pages/warehouse/packages/packagesList/components/table/packagesTableContent.tsx';
import { PackagesKanbanContent } from '@/pages/warehouse/packages/packagesList/components/kanban/packagesKanbanContent.tsx';

export const PackagesTabContent = () => {
  const { formatMessage } = useIntl();
  return (
    <Container>
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">{formatMessage({ id: 'SYSTEM.TABLE' })}</TabsTrigger>
          <TabsTrigger value="kanban">{formatMessage({ id: 'SYSTEM.KANBAN' })}</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <PackagesTableContent />
        </TabsContent>
        <TabsContent value="kanban">
          <PackagesKanbanContent />
        </TabsContent>
      </Tabs>
    </Container>
  );
};
