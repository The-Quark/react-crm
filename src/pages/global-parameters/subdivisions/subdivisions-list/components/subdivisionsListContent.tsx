import { DataGrid, Container } from '@/components';
import { deleteGlobalParamsSubdivision, getGlobalParamsSubdivisions } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SharedDeleteModal, SharedError, SharedLoading } from '@/partials/sharedUI';
import { useSubdivisionsColumns } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/blocks/subdivisionsColumns.tsx';
import { SubdivisionToolbar } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/blocks/subdivisionsToolbar.tsx';
import { useAuthContext } from '@/auth';
import { useState } from 'react';
import { SubdivisionsViewModal } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/blocks/subdivisionsViewModal.tsx';
import { initialPagination } from '@/utils';

export const SubdivisionsListContent = () => {
  const { currentUser } = useAuthContext();
  const queryClient = useQueryClient();
  const initialCompanyId = currentUser?.company_id ? Number(currentUser.company_id) : undefined;

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(initialCompanyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
  const [pagination, setPagination] = useState(initialPagination);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'globalParamsSubdivisions',
      selectedCompanyId,
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm
    ],
    queryFn: () =>
      getGlobalParamsSubdivisions({
        company_id: selectedCompanyId,
        page: pagination.pageIndex,
        per_page: pagination.pageSize,
        name: searchTerm
      }),
    enabled: selectedCompanyId !== undefined
  });

  const handleConfirmDelete = async () => {
    if (!selectedSubId) return;

    setIsDeleting(true);
    try {
      await deleteGlobalParamsSubdivision(selectedSubId);
      await queryClient.invalidateQueries({ queryKey: ['globalParamsSubdivisions'] });
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedSubId(id);
    setIsDeleteModalOpen(true);
  };

  const columns = useSubdivisionsColumns({
    onRowClick: (id) => {
      setSelectedSubId(id);
      setIsModalOpen(true);
    },
    onDeleteClick: handleDeleteClick
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
    setPagination(initialPagination);
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
        rowSelection={true}
        onFetchData={handleFetchData}
        layout={{ card: true }}
        toolbar={
          <SubdivisionToolbar
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
      <SubdivisionsViewModal
        open={isModalOpen}
        id={selectedSubId}
        handleClose={() => setIsModalOpen(false)}
      />
      <SharedDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </Container>
  );
};
