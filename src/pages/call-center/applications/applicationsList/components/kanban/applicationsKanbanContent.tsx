'use client';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider
} from '@/components/ui/shadcn-io/kanban';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApplications, getSources } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { Source } from '@/api/get/getGuides/getSources/types.ts';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';
import { Application } from '@/api/get/getWorkflow/getApplications/types.ts';
import { initialPagination, initialPaginationSizes } from '@/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { useIntl } from 'react-intl';

export const ApplicationsKanbanContent = () => {
  const { formatMessage } = useIntl();
  const [pagination, setPagination] = useState(initialPagination);

  const {
    data: sourcesData,
    isLoading: sourcesLoading,
    isError: sourcesIsError,
    error: sourcesError
  } = useQuery({
    queryKey: ['sources'],
    queryFn: () =>
      getSources({ is_active: true, page: pagination.pageIndex, per_page: pagination.pageSize })
  });

  const {
    data: applicationsData,
    isError: applicationsIsError,
    error: applicationsError,
    isLoading: applicationsLoading
  } = useQuery({
    queryKey: ['applications', pagination],
    queryFn: () =>
      getApplications({
        page: pagination.pageIndex,
        per_page: pagination.pageSize
      })
  });

  if (sourcesIsError || applicationsIsError) {
    return <SharedError error={sourcesError || applicationsError} />;
  }
  if (sourcesLoading || applicationsLoading) {
    return <SharedLoading simple />;
  }

  const columns =
    sourcesData?.result?.map((source: Source) => ({
      id: source.id.toString(),
      name: source.name
    })) || [];

  const applications =
    applicationsData?.result?.map((app: Application) => ({
      id: app.id.toString(),
      name: app.full_name || `${app.last_name} ${app.first_name} ${app.patronymic}` || '-',
      sourceId: app.source_id.toString(),
      phone: app.phone,
      email: app.email,
      status: app.status,
      createdAt: app.created_at,
      message: app.message,
      clientType: app.client_type,
      companyName: app.company_name
    })) || [];

  const handlePageSizeChange = (value: string) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: Number(value),
      pageIndex: 0
    }));
  };

  return (
    <>
      <div className="flex items-center my-4 gap-3 justify-end">
        <div className="text-sm text-muted-foreground">
          {formatMessage({ id: 'SYSTEM.CARD_COUNT' })}
        </div>
        <Select value={pagination.pageSize.toString()} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-[70px]" size="sm">
            <SelectValue placeholder={pagination.pageSize.toString()} />
          </SelectTrigger>
          <SelectContent side="top">
            {initialPaginationSizes.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <KanbanProvider
        columns={columns}
        data={applications.map((app) => ({
          ...app,
          column: app.sourceId
        }))}
      >
        {(column) => (
          <KanbanBoard id={column.id} key={column.id}>
            <KanbanHeader>{column.name}</KanbanHeader>
            <KanbanCards id={column.id}>
              {(item) => {
                const app = applications.find((a) => a.id === item.id);
                if (!app || app.sourceId !== column.id) return false;
                return (
                  <KanbanCard column={column.id} id={app.id} key={app.id} name={app.name}>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="m-0 font-medium text-sm">{app.name}</p>
                      </div>
                      <SharedStatusBadge status={app.status} />
                    </div>
                  </KanbanCard>
                );
              }}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </>
  );
};
