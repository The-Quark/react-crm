/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getApplications } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { useApplicationsColumns } from '@/pages/call-center/applications/applicationsList/components/blocks/applicationsColumns.tsx';
import { ApplicationsToolbar } from '@/pages/call-center/applications/applicationsList/components/blocks/applicationsToolbar.tsx';
import { useState } from 'react';
import { ApplicationsModal } from '@/pages/call-center/applications/applicationsList/components/blocks/applicationsModal.tsx';

export const ApplicationListContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['applications', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getApplications({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        title: searchTerm
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);

  const columns = useApplicationsColumns({
    onRowClick: (id) => {
      setSelectedApplicationId(id);
      setIsModalOpen(true);
    }
  });

  const handleFetchData = async (params: { pageIndex: number; pageSize: number }) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <DataGrid
        serverSide
        columns={columns}
        data={data?.result || []}
        onFetchData={handleFetchData}
        layout={{ card: true }}
        toolbar={<ApplicationsToolbar onSearch={handleSearch} />}
        pagination={{
          page: pagination.pageIndex,
          size: pagination.pageSize,
          total: data?.total || 0
        }}
        messages={{
          empty: isPending && <SharedLoading simple />,
          loading: isFetching && <SharedLoading simple />
        }}
      />
      <ApplicationsModal
        open={isModalOpen}
        id={selectedApplicationId}
        handleClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
};
