/* eslint-disable prettier/prettier */
import { Container, DataGrid } from '@/components';
import { getGlobalParamsDepartments } from '@/api/get';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useDepartmentsColumns } from '@/pages/global-parameters/departments/departments-list/components/blocks/departmentsColumns.tsx';
import { DepartmentsToolbar } from '@/pages/global-parameters/departments/departments-list/components/blocks/departmentsToolbar.tsx';
import { useAuthContext } from '@/auth';
import { useState } from 'react';

export const DepartmentsListContent = () => {
  const { currentUser } = useAuthContext();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : undefined;
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['globalParamsDepartments', selectedCompanyId, pageIndex, pageSize, searchTerm],
    queryFn: () =>
      getGlobalParamsDepartments({
        company_id: selectedCompanyId,
        page: pageIndex + 1,
        per_page: pageSize
      }),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
    enabled: selectedCompanyId !== undefined
  });

  const columns = useDepartmentsColumns();

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
          <DepartmentsToolbar
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
