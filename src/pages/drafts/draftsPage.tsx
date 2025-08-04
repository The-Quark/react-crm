import React, { useState } from 'react';
import { Container, Tab } from '@/components';
import { Toolbar, ToolbarHeading } from '@/partials/toolbar';
import { useIntl } from 'react-intl';
import { useQuery } from '@tanstack/react-query';
import { getTrash } from '@/api';
import { initialPagination } from '@/utils';
import { TabPanel, Tabs, TabsList } from '@mui/base';
import { ApplicationsBlock } from '@/pages/drafts/blocks/applications/applicationsBlock.tsx';
import { Application } from '@/api/get/getWorkflow/getApplications/types.ts';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

type TabType = 'application' | 'order' | 'package' | 'cargo';

export const DraftsPage = () => {
  const { formatMessage } = useIntl();
  const [pagination, setPagination] = useState(initialPagination);
  const [activeTab, setActiveTab] = useState<TabType>('application');

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['trash', activeTab, pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      getTrash({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        type: activeTab
      })
  });

  const handleTabChange = (value: number) => {
    const tabTypes: TabType[] = ['application', 'order', 'package', 'cargo'];
    setActiveTab(tabTypes[value - 1]);
    setPagination(initialPagination);
  };

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <Toolbar>
        <ToolbarHeading>
          <h1 className="text-xl font-medium leading-none text-gray-900">
            {formatMessage({ id: 'SYSTEM.DRAFTS' })}
          </h1>
        </ToolbarHeading>
      </Toolbar>
      <Tabs
        defaultValue={1}
        className="justify-between px-5 mb-2"
        onChange={(_, value) => handleTabChange(value as number)}
      >
        <TabsList className="justify-between px-5 mb-2.5">
          <div className="flex items-center gap-5">
            <Tab value={1}>{formatMessage({ id: 'SYSTEM.APPLICATIONS' })}</Tab>
            <Tab value={2}>{formatMessage({ id: 'SYSTEM.ORDERS' })}</Tab>
            <Tab value={3}>{formatMessage({ id: 'SYSTEM.PACKAGES' })}</Tab>
            <Tab value={4}>{formatMessage({ id: 'SYSTEM.CARGO' })}</Tab>
          </div>
        </TabsList>
        {isLoading ? (
          <SharedLoading simple />
        ) : (
          <>
            <TabPanel value={1}>
              <ApplicationsBlock applications={(data?.result as Application[]) || []} />
            </TabPanel>
            <TabPanel value={2}>
              <div>Orders content</div>
            </TabPanel>
            <TabPanel value={3}>
              <div>Packages content</div>
            </TabPanel>
            <TabPanel value={4}>
              <div>Cargo content</div>
            </TabPanel>
          </>
        )}
      </Tabs>
    </Container>
  );
};
