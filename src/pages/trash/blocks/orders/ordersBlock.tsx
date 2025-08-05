import { useIntl } from 'react-intl';
import { Container, DataGrid } from '@/components';
import React, { FC } from 'react';
import { Order } from '@/api/get/getWorkflow/getOrder/types.ts';
import { useOrdersBlockColumns } from '@/pages/trash/blocks/orders/components/ordersBlockColumns.tsx';

interface Props {
  orders: Order[];
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  totalCount: number;
}

export const OrdersBlock: FC<Props> = ({ orders, pagination, onPaginationChange, totalCount }) => {
  const { formatMessage } = useIntl();

  const columns = useOrdersBlockColumns();

  const handleFetchData = async (params: { pageIndex: number; pageSize: number }) => {
    onPaginationChange({
      ...pagination,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    });
  };

  return (
    <Container>
      <DataGrid
        serverSide
        columns={columns}
        data={orders || []}
        onFetchData={handleFetchData}
        layout={{ card: true }}
        toolbar={
          <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
            <h3 className="card-title"> {formatMessage({ id: 'SYSTEM.ORDERS' })}</h3>
          </div>
        }
        pagination={{
          page: pagination.pageIndex,
          size: pagination.pageSize,
          total: totalCount
        }}
      />
    </Container>
  );
};
