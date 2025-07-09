import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getTariffs } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useState } from 'react';
import { CACHE_TIME, initialPagination } from '@/utils';
import { useTariffColumns } from '@/pages/guides/tabs/tariff/components/blocks/tariffColumns.tsx';
import { TariffToolbar } from '@/pages/guides/tabs/tariff/components/blocks/tariffToolbar.tsx';

export const GuidesTariffsContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(initialPagination);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['guidesTariffs', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getTariffs({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        country: searchTerm
      }),
    staleTime: CACHE_TIME
  });

  const columns = useTariffColumns();

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
        toolbar={<TariffToolbar onSearch={handleSearch} />}
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
