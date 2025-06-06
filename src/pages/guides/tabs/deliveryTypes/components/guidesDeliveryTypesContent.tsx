/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getDeliveryTypes } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useDeliveryTypesColumns } from '@/pages/guides/tabs/deliveryTypes/components/blocks/deliveryTypesColumns.tsx';
import { DeliveryTypesToolbar } from '@/pages/guides/tabs/deliveryTypes/components/blocks/deliveryTypesToolbar.tsx';
import { useState } from 'react';

export const GuidesDeliveryTypesContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['guidesDeliveryTypes', pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getDeliveryTypes({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        title: searchTerm
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });

  const columns = useDeliveryTypesColumns();

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
        toolbar={<DeliveryTypesToolbar onSearch={handleSearch} />}
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
