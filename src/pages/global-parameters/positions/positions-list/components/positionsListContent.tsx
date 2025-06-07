/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getGlobalParamsPositions } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { usePositionsColumns } from '@/pages/global-parameters/positions/positions-list/components/blocks/positionsColumns.tsx';
import { PositionsToolbar } from '@/pages/global-parameters/positions/positions-list/components/blocks/positionsToolbar.tsx';
import { useAuthContext } from '@/auth';
import { useState } from 'react';

export const PositionsListContent = () => {
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
      'globalParamsPositions',
      selectedCompanyId,
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm
    ],
    queryFn: () =>
      getGlobalParamsPositions({
        company_id: selectedCompanyId,
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        title: searchTerm
      }),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
    enabled: selectedCompanyId !== undefined
  });

  const columns = usePositionsColumns();

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
          <PositionsToolbar
            initialCompanyId={initialCompanyId}
            onCompanyChange={(companyId) => setSelectedCompanyId(companyId ?? undefined)}
            onSearch={handleSearch}
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
