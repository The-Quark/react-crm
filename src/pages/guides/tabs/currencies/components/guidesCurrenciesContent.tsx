/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { CurrenciesToolbar } from '@/pages/guides/tabs/currencies/components/blocks/currenciesToolbar.tsx';
import { useCurrenciesColumns } from '@/pages/guides/tabs/currencies/components/blocks/currenciesColumns.tsx';
import { getCurrencies } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useState } from 'react';

export const GuidesCurrenciesContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['guidesCurrencies', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getCurrencies({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        name: searchTerm
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });

  const columns = useCurrenciesColumns();

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
        toolbar={<CurrenciesToolbar onSearch={handleSearch} />}
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
