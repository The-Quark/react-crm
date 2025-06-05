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
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['globalParamsPositions', selectedCompanyId, pageIndex, pageSize, searchTerm],
    queryFn: () =>
      getGlobalParamsPositions({
        company_id: selectedCompanyId,
        page: pageIndex + 1,
        per_page: pageSize
      }),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
    enabled: selectedCompanyId !== undefined
  });

  const columns = usePositionsColumns();

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
        toolbar={
          <PositionsToolbar
            initialCompanyId={initialCompanyId}
            onCompanyChange={(companyId) => setSelectedCompanyId(companyId ?? undefined)}
            onSearch={handleSearch}
          />
        }
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
