/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getLanguages } from '@/api';
import { useLanguagesColumns } from '@/pages/guides/tabs/languages/components/blocks/languagesColumns.tsx';
import { LanguagesToolbar } from '@/pages/guides/tabs/languages/components/blocks/languagesToolbar.tsx';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useState } from 'react';
import { CACHE_TIME, initialPagination } from '@/utils';

export const GuidesLanguagesContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(initialPagination);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['guidesLanguages', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getLanguages({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        name: searchTerm
      }),
    staleTime: CACHE_TIME
  });

  const columns = useLanguagesColumns();

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
        toolbar={<LanguagesToolbar onSearch={handleSearch} />}
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
