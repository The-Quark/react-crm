import React from 'react';
import { ApplicationsTableContent } from '@/pages/call-center/applications/applicationsList/components/table/applicationsTableContent.tsx';
import { ApplicationsKanbanContent } from '@/pages/call-center/applications/applicationsList/components/kanban/applicationsKanbanContent.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@/components';
import { useIntl } from 'react-intl';

export const ApplicationsTabContent = () => {
  const { formatMessage } = useIntl();
  return (
    <Container>
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">{formatMessage({ id: 'SYSTEM.TABLE' })}</TabsTrigger>
          <TabsTrigger value="kanban">{formatMessage({ id: 'SYSTEM.KANBAN' })}</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <ApplicationsTableContent />
        </TabsContent>
        <TabsContent value="kanban">
          <ApplicationsKanbanContent />
        </TabsContent>
      </Tabs>
    </Container>
  );
};
