import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getBoxTypes } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useState } from 'react';
import { CACHE_TIME, initialPagination } from '@/utils';
import { useBoxTypesColumns } from '@/pages/guides/tabs/boxTypes/components/blocks/boxTypesColumns.tsx';
import { BoxTypesToolbar } from '@/pages/guides/tabs/boxTypes/components/blocks/boxTypesToolbar.tsx';

export const GuidesBoxTypesContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(initialPagination);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['guidesBoxTypes', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getBoxTypes({
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        name: searchTerm
      }),
    staleTime: CACHE_TIME
  });

  const columns = useBoxTypesColumns();

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
        toolbar={<BoxTypesToolbar onSearch={handleSearch} />}
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
