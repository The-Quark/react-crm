/* eslint-disable prettier/prettier */
import { Container, DataGrid } from '@/components';
import { getGlobalParameters } from '@/api/get';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { CompaniesToolbar } from '@/pages/global-parameters/companies/companies-list/components/blocks/companiesToolbar.tsx';
import { useParametersColumns } from '@/pages/global-parameters/companies/companies-list/components/blocks/companiesColumns.tsx';
import { useState } from 'react';

export const CompaniesListContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['global-parameters', pageIndex, pageSize, searchTerm],
    queryFn: () =>
      getGlobalParameters({
        page: pageIndex + 1,
        per_page: pageSize
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });

  const columns = useParametersColumns();

  const handleFetchData = async (params: { pageIndex: number; pageSize: number }) => {
    setPageIndex(params.pageIndex);
    setPageSize(params.pageSize);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPageIndex(0);
    setPageSize(15);
  };

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <DataGrid
        columns={columns}
        data={data?.result || []}
        rowSelection={true}
        pagination={{
          page: pageIndex,
          size: pageSize
        }}
        onFetchData={handleFetchData}
        toolbar={<CompaniesToolbar onSearch={handleSearch} />}
        layout={{ card: true }}
        messages={{
          empty: isPending && <SharedLoading simple />,
          loading: isFetching && <SharedLoading simple />
        }}
        serverSide
      />
    </Container>
  );
};
