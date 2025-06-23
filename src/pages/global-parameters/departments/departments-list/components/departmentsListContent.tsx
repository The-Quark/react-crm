/* eslint-disable prettier/prettier */
import { Container, DataGrid } from '@/components';
import { getGlobalParamsDepartments } from '@/api/get';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useDepartmentsColumns } from '@/pages/global-parameters/departments/departments-list/components/blocks/departmentsColumns.tsx';
import { DepartmentsToolbar } from '@/pages/global-parameters/departments/departments-list/components/blocks/departmentsToolbar.tsx';
import { useAuthContext } from '@/auth';
import { useState } from 'react';
import { DepartmentsViewModal } from '@/pages/global-parameters/departments/departments-list/components/blocks/departmentsViewModal.tsx';

export const DepartmentsListContent = () => {
  const { currentUser } = useAuthContext();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : undefined;
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'globalParamsDepartments',
      selectedCompanyId,
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm
    ],
    queryFn: () =>
      getGlobalParamsDepartments({
        company_id: selectedCompanyId,
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        name: searchTerm
      }),
    enabled: selectedCompanyId !== undefined
  });

  const columns = useDepartmentsColumns({
    onRowClick: (id) => {
      setSelectedDepartmentId(id);
      setIsModalOpen(true);
    }
  });

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
          <DepartmentsToolbar
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
      <DepartmentsViewModal
        open={isModalOpen}
        id={selectedDepartmentId}
        handleClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
};
