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
import { getPackages } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { initialPagination, initialPaginationSizes, packageStatusOptions } from '@/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { useIntl } from 'react-intl';
import { Package } from '@/api/get/getWorkflow/getPackages/types.ts';

export const PackagesKanbanContent = () => {
  const { formatMessage } = useIntl();
  const [pagination, setPagination] = useState(initialPagination);

  const {
    data: packagesData,
    isError: packagesIsError,
    error: packagesError,
    isLoading: packagesLoading
  } = useQuery({
    queryKey: ['packages', pagination],
    queryFn: () =>
      getPackages({
        page: pagination.pageIndex,
        per_page: pagination.pageSize
      })
  });

  if (packagesIsError) {
    return <SharedError error={packagesError} />;
  }
  if (packagesLoading) {
    return <SharedLoading simple />;
  }

  const columns =
    packageStatusOptions?.map((status) => ({
      id: status.value,
      name: status.name
    })) || [];

  const packages =
    packagesData?.result?.map((app: Package) => ({
      id: app.id.toString(),
      name: app.hawb || '-',
      status: app.status,
      createdAt: app.created_at
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
          {formatMessage({ id: 'SYSTEM.ROWS_PER_PAGE' })}
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
        data={packages.map((app) => ({
          ...app,
          column: app.status
        }))}
      >
        {(column) => (
          <KanbanBoard id={column.id} key={column.id}>
            <KanbanHeader>{column.name}</KanbanHeader>
            <KanbanCards id={column.id}>
              {(item) => {
                const pack = packages.find((a) => a.id === item.id);
                if (!pack || pack.status !== column.id) return false;
                return (
                  <KanbanCard column={column.id} id={pack.id} key={pack.id} name={pack.name}>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="m-0 font-medium text-sm">{pack.name}</p>
                      </div>
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
