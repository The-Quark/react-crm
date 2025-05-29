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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['clients', clientType],
    queryFn: () => getClients({ type: clientType }),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true
  });

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <div className="grid gap-5 lg:gap-7.5">
        <DataGrid
          columns={clientType === 'individual' ? columnsIndividual : columnsLegal}
          data={isLoading ? [] : data?.result}
          rowSelection={true}
          pagination={{ size: 15 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<ClientsListToolbar clientType={clientType} setClientType={setClientType} />}
          layout={{ card: true }}
          messages={{
            empty: isLoading && <SharedLoading simple />
          }}
        />
      </div>
      <ClientsListProfileModal
        open={isModalOpen}
        id={selectedId}
        handleClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
};
