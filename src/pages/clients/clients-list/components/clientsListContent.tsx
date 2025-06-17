import { useState } from 'react';
import { Container, DataGrid } from '@/components';
import { ClientsListToolbar } from '@/pages/clients/clients-list/components/blocks/clientsListToolbar.tsx';
import { useClientsListIndividualColumns } from '@/pages/clients/clients-list/components/blocks/clientsListIndividualColumns.tsx';
import { useClientsListLegalColumns } from '@/pages/clients/clients-list/components/blocks/clientsListLegalColumns.tsx';
import { useQuery } from '@tanstack/react-query';
import { getClients } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { ClientsListProfileModal } from '@/pages/clients/clients-list/components/blocks/clientsListProfileModal.tsx';

type ClientType = 'individual' | 'legal';

export const ClientsListContent = () => {
  const [clientType, setClientType] = useState<ClientType>('individual');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [clientCityId, setClientCityId] = useState<number>();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15
  });

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
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });

  const columnsIndividual = useClientsListIndividualColumns({
    onRowClick: (id) => {
      setSelectedId(id);
      setIsModalOpen(true);
    }
  });

  const columnsLegal = useClientsListLegalColumns({
    onRowClick: (id) => {
      setSelectedId(id);
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

  const handleSearchTerm = (term: string) => {
    setSearchTerm(term);
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  const handleSearchPhone = (phone: string) => {
    setSearchPhone(phone);
    setPagination({
      pageIndex: 0,
      pageSize: 15
    });
  };

  const handleClientCity = (cityId: number) => {
    setClientCityId(cityId);
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
    </Container>
  );
};
