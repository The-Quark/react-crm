import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getAirlineRates } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useAirlineRatesColumns } from '@/pages/guides/tabs/airlineRates/components/blocks/airlineRatesColumns.tsx';
import { AirlineRatesToolbar } from '@/pages/guides/tabs/airlineRates/components/blocks/airlineRatesToolbar.tsx';
import { useState } from 'react';
import { CACHE_TIME, initialPagination } from '@/utils';

export const GuidesAirlineRatesContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(initialPagination);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['guidesAirlineRates', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getAirlineRates({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        title: searchTerm
      }),
    staleTime: CACHE_TIME
  });

  const columns = useAirlineRatesColumns();

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
        toolbar={<AirlineRatesToolbar onSearch={handleSearch} />}
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
