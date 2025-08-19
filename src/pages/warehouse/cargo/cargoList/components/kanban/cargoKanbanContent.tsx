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
import { getCargo } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { cargoStatusOptions, initialPagination, initialPaginationSizes } from '@/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { useIntl } from 'react-intl';
import { Cargo } from '@/api/get/getWorkflow/getCargo/types.ts';

export const CargoKanbanContent = () => {
  const { formatMessage } = useIntl();
  const [pagination, setPagination] = useState(initialPagination);

  const {
    data: cargoData,
    isError: cargoIsError,
    error: cargoError,
    isLoading: cargoLoading
  } = useQuery({
    queryKey: ['cargo', pagination],
    queryFn: () =>
      getCargo({
        page: pagination.pageIndex,
        per_page: pagination.pageSize
      })
  });

  if (cargoIsError) {
    return <SharedError error={cargoError} />;
  }
  if (cargoLoading) {
    return <SharedLoading simple />;
  }

  const columns =
    cargoStatusOptions?.map((status) => ({
      id: status.value,
      name: status.name
    })) || [];

  const cargoInfo =
    cargoData?.result?.map((app: Cargo) => ({
      id: app.id.toString(),
      name: app.code || '-',
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
        data={cargoInfo.map((app) => ({
          ...app,
          column: app.status
        }))}
      >
        {(column) => (
          <KanbanBoard id={column.id} key={column.id}>
            <KanbanHeader>{column.name}</KanbanHeader>
            <KanbanCards id={column.id}>
              {(item) => {
                const cargo = cargoInfo.find((a) => a.id === item.id);
                if (!cargo || cargo.status !== column.id) return false;
                return (
                  <KanbanCard column={column.id} id={cargo.id} key={cargo.id} name={cargo.name}>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="m-0 font-medium text-sm">{cargo.name}</p>
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
