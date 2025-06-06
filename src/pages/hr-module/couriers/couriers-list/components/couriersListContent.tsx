/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getUserByParams } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { useAuthContext } from '@/auth';
import { useCouriersColumns } from '@/pages/hr-module/couriers/couriers-list/components/blocks/couriersColumns.tsx';
import { CouriersToolbar } from '@/pages/hr-module/couriers/couriers-list/components/blocks/couriersToolbar.tsx';
import { useState } from 'react';

export const CouriersListContent = () => {
  const { currentUser } = useAuthContext();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : undefined;
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'couriers',
      selectedCompanyId,
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm
    ],
    queryFn: () =>
      getUserByParams({
        companyId: selectedCompanyId,
        role: 'courier',
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    enabled: selectedCompanyId !== undefined
  });

  const columns = useCouriersColumns();

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
        layout={{ card: true }}
        toolbar={
          <CouriersToolbar
            onSearch={handleSearch}
            initialCompanyId={initialCompanyId}
            onCompanyChange={(companyId) => setSelectedCompanyId(companyId ?? undefined)}
          />
        }
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
