import { useIntl } from 'react-intl';
import { Container, DataGrid } from '@/components';
import { Application } from '@/api/get/getWorkflow/getApplications/types.ts';
import { useApplicationsBlockColumns } from '@/pages/drafts/blocks/applications/components/applicationsBlockColumns.tsx';
import React, { FC, useState } from 'react';
import { initialPagination } from '@/utils';

interface Props {
  applications: Application[];
}

export const ApplicationsBlock: FC<Props> = ({ applications }) => {
  const { formatMessage } = useIntl();
  const [pagination, setPagination] = useState(initialPagination);
  const [selectedId, setSelectedId] = useState<number>(0);

  const columns = useApplicationsBlockColumns({
    onRowClick: (id) => setSelectedId(id)
  });

  const handleFetchData = async (params: { pageIndex: number; pageSize: number }) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    }));
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
          total: applications.length || 0
        }}
      />
    </Container>
  );
};
