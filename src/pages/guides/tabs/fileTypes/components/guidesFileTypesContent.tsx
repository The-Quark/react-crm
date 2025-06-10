/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getFileTypes } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useUnitsColumns } from '@/pages/guides/tabs/units/components/blocks/unitsColumns.tsx';
import { useState } from 'react';
import { FileTypesToolbar } from '@/pages/guides/tabs/fileTypes/components/blocks/fileTypesToolbar.tsx';
import { useFileTypesColumns } from '@/pages/guides/tabs/fileTypes/components/blocks/fileTypesColumns.tsx';

export const GuidesFileTypesContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['guidesFileTypes', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getFileTypes({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        name: searchTerm
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });

  const columns = useFileTypesColumns();

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
        toolbar={<FileTypesToolbar onSearch={handleSearch} />}
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
