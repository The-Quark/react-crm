import { useState } from 'react';
import { Container, DataGrid } from '@/components';
import { ClientsListToolbar } from '@/pages/clients/clients-list/components/blocks/clientsListToolbar.tsx';
import { useClientsListIndividualColumns } from '@/pages/clients/clients-list/components/blocks/clientsListIndividualColumns.tsx';
import { useClientsListLegalColumns } from '@/pages/clients/clients-list/components/blocks/clientsListLegalColumns.tsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteClient, getClients } from '@/api';
import { SharedDeleteModal, SharedError, SharedLoading } from '@/partials/sharedUI';
import { ClientsListProfileModal } from '@/pages/clients/clients-list/components/blocks/clientsListProfileModal.tsx';
import { ClientType } from '@/api/generalManualTypes';
import { initialPagination } from '@/utils';
import { useParams } from 'react-router';

export const ClientsListContent = () => {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const [clientType, setClientType] = useState<ClientType>('individual');
  const [isModalOpen, setIsModalOpen] = useState(id ? true : false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(id ? Number(id) : null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [clientCityId, setClientCityId] = useState<number>();
  const [pagination, setPagination] = useState(initialPagination);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: [
      'clients',
      clientType,
      pagination.pageIndex,
      pagination.pageSize,
      searchTerm,
      searchPhone,
      clientCityId
    ],
    queryFn: () =>
      getClients({
        type: clientType,
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        full_name: searchTerm,
        phones: searchPhone,
        city_id: clientCityId
      })
  });

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    setIsDeleting(true);
    try {
      await deleteClient(selectedId);
      await queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const columnsIndividual = useClientsListIndividualColumns({
    onRowClick: (id) => {
      setSelectedId(id);
      setIsModalOpen(true);
    },
    onDeleteClick: handleDeleteClick
  });

  const columnsLegal = useClientsListLegalColumns({
    onRowClick: (id) => {
      setSelectedId(id);
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

  const handleSearchTerm = (term: string) => {
    setSearchTerm(term);
    setPagination(initialPagination);
  };

  const handleSearchPhone = (phone: string) => {
    setSearchPhone(phone);
    setPagination(initialPagination);
  };

  const handleClientCity = (cityId: number) => {
    setClientCityId(cityId);
    setPagination(initialPagination);
  };

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <DataGrid
        serverSide
        columns={clientType === 'individual' ? columnsIndividual : columnsLegal}
        data={data?.result || []}
        onFetchData={handleFetchData}
        layout={{ card: true }}
        toolbar={
          <ClientsListToolbar
            clientType={clientType}
            setClientType={setClientType}
            onSearchTerm={handleSearchTerm}
            onSearchPhone={handleSearchPhone}
            currentCityId={clientCityId}
            onClientCity={handleClientCity}
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
      <ClientsListProfileModal
        open={isModalOpen}
        id={selectedId}
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
