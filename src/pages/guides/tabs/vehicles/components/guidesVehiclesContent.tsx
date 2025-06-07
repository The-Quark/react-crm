/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { useVehiclesColumns } from '@/pages/guides/tabs/vehicles/components/blocks/vehiclesColumns.tsx';
import { VehiclesToolbar } from '@/pages/guides/tabs/vehicles/components/blocks/vehiclesToolbar.tsx';
import { getVehicles } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useState } from 'react';

export const GuidesVehiclesContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['guidesVehicles', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getVehicles({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        plate_number: searchTerm
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });

  const columns = useVehiclesColumns();

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
        toolbar={<VehiclesToolbar onSearch={handleSearch} />}
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
