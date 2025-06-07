/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getPackageMaterials } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { usePackageMaterialsColumns } from '@/pages/guides/tabs/packageMaterials/components/blocks/packageMaterialsColumns.tsx';
import { PackageMaterialsToolbar } from '@/pages/guides/tabs/packageMaterials/components/blocks/packageMaterialsToolbar.tsx';
import { useState } from 'react';

export const GuidesPackageMaterialsContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['packageMaterials', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getPackageMaterials({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        name: searchTerm
      }),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: true
  });

  const columns = usePackageMaterialsColumns();

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
        toolbar={<PackageMaterialsToolbar onSearch={handleSearch} />}
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
