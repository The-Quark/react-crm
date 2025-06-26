import { DataGrid, Container } from '@/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteApplication, getUserByParams } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { StaffToolbar } from '@/pages/hr-module/staff/staff-list/components/blocks/staffToolbar.tsx';
import { useStaffColumns } from '@/pages/hr-module/staff/staff-list/components/blocks/staffColumns.tsx';
import { useAuthContext } from '@/auth';
import { useState } from 'react';

export const StaffListContent = () => {
  const { currentUser } = useAuthContext();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : undefined;
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });
  const queryClient = useQueryClient();

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['staff', selectedCompanyId, pagination.pageIndex, pagination.pageSize, searchTerm],
    queryFn: () =>
      getUserByParams({
        companyId: selectedCompanyId,
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize
      }),
    enabled: selectedCompanyId !== undefined
  });

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    setIsDeleting(true);
    try {
      await deleteApplication(selectedId);
      await queryClient.invalidateQueries({ queryKey: ['applications'] });
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting staff:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const columns = useStaffColumns();

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
          <StaffToolbar
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
