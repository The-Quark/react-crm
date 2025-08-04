import { useIntl } from 'react-intl';
import { Container, DataGrid } from '@/components';
import { Application } from '@/api/get/getWorkflow/getApplications/types.ts';
import { useApplicationsBlockColumns } from '@/pages/drafts/blocks/applications/components/applicationsBlockColumns.tsx';
import React, { FC } from 'react';

interface Props {
  applications: Application[];
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  totalCount: number;
}

export const ApplicationsBlock: FC<Props> = ({
  applications,
  pagination,
  onPaginationChange,
  totalCount
}) => {
  const { formatMessage } = useIntl();

  const columns = useApplicationsBlockColumns();

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
        data={applications || []}
        onFetchData={handleFetchData}
        layout={{ card: true }}
        toolbar={
          <div className="card-header px-5 py-5 border-b-0 flex-wrap gap-2">
            <h3 className="card-title"> {formatMessage({ id: 'SYSTEM.APPLICATIONS' })}</h3>
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
