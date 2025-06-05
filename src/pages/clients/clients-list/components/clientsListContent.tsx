/* eslint-disable prettier/prettier */
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
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(15);

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

  const { data, isError, error, isFetching, isPending } = useQuery({
    queryKey: ['clients', clientType, pageIndex, pageSize, searchTerm],
    queryFn: () => getClients({ type: clientType, page: pageIndex + 1, per_page: pageSize }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });

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
        columns={clientType === 'individual' ? columnsIndividual : columnsLegal}
        data={data?.result || []}
        rowSelection={true}
        pagination={{
          page: pageIndex,
          size: pageSize
        }}
        toolbar={
          <ClientsListToolbar
            clientType={clientType}
            setClientType={setClientType}
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
      <ClientsListProfileModal
        open={isModalOpen}
        id={selectedId}
        handleClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
};
