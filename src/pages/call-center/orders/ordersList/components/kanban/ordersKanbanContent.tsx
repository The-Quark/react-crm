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
import { getOrders } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { initialPagination, initialPaginationSizes, mockOrdersStatus } from '@/utils';
import { Order } from '@/api/get/getWorkflow/getOrder/types.ts';
import { SharedStatusBadge } from '@/partials/sharedUI/sharedStatusBadge.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { useIntl } from 'react-intl';

export const OrdersKanbanContent = () => {
  const { formatMessage } = useIntl();
  const [pagination, setPagination] = useState(initialPagination);
  const {
    data: ordersData,
    isError: ordersIsError,
    error: ordersError,
    isLoading: ordersLoading
  } = useQuery({
    queryKey: ['orders'],
    queryFn: () =>
      getOrders({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        is_draft: false
      })
  });

  if (ordersIsError) {
    return <SharedError error={ordersError} />;
  }
  if (ordersLoading) {
    return <SharedLoading simple />;
  }

  const columns =
    mockOrdersStatus?.map((status) => ({
      id: status.value,
      name: status.name
    })) || [];

  const orders =
    ordersData?.result?.map((app: Order) => ({
      id: app.id.toString(),
      name: app.order_code || '-',
      status: app.status,
      createdAt: app.created_at,
      is_express: app.is_express
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
        data={orders.map((app) => ({
          ...app,
          column: app.status
        }))}
      >
        {(column) => (
          <KanbanBoard id={column.id} key={column.id}>
            <KanbanHeader>{column.name}</KanbanHeader>
            <KanbanCards id={column.id}>
              {(item) => {
                const order = orders.find((a) => a.id === item.id);
                if (!order || order.status !== column.id) return false;
                return (
                  <KanbanCard column={column.id} id={order.id} key={order.id} name={order.name}>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="m-0 font-medium text-sm">{order.name}</p>
                      </div>
                    </div>
                    {order.is_express && <SharedStatusBadge status="express" />}
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
