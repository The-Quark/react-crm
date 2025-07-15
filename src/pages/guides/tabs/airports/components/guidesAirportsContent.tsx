import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getAirports } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useState } from 'react';
import { CACHE_TIME, initialPagination } from '@/utils';
import { useAirportsColumns } from '@/pages/guides/tabs/airports/components/blocks/airportsColumns.tsx';
import { AirportsToolbar } from '@/pages/guides/tabs/airports/components/blocks/airportsToolbar.tsx';

export const GuidesAirportsContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(initialPagination);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['guidesAirports', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getAirports({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        name: searchTerm
      }),
    staleTime: CACHE_TIME
  });

  const columns = useAirportsColumns();

  const handleFetchData = async (params: { pageIndex: number; pageSize: number }) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination(initialPagination);
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
        toolbar={<AirportsToolbar onSearch={handleSearch} />}
        layout={{ card: true }}
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
    </Container>
  );
};
