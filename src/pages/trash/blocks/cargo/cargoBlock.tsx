import { useIntl } from 'react-intl';
import { Container, DataGrid } from '@/components';
import React, { FC } from 'react';
import { Cargo } from '@/api/get/getWorkflow/getCargo/types.ts';
import { useCargoBlockColumns } from '@/pages/trash/blocks/cargo/components/cargoBlockColumns.tsx';

interface Props {
  orders: Cargo[];
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  totalCount: number;
}

export const CargoBlock: FC<Props> = ({ orders, pagination, onPaginationChange, totalCount }) => {
  const { formatMessage } = useIntl();

  const columns = useCargoBlockColumns();

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
            <h3 className="card-title"> {formatMessage({ id: 'SYSTEM.CARGO' })}</h3>
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
