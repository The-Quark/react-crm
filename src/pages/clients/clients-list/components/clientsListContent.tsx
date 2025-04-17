/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { RowSelectionState } from '@tanstack/react-table';
import { DataGrid } from '@/components';
import { toast } from 'sonner';
import { CircularProgress } from '@mui/material';
import { ClientsListToolbar } from '@/pages/clients/clients-list/components/blocks/clientsListToolbar.tsx';
import {
  fakeClientsIndividualMock,
  FakeIndividualClient,
  FakeLegalClient,
  fakeLegalClientsMock
} from '@/lib/mocks.ts';
import { useClientsListIndividualColumns } from '@/pages/clients/clients-list/components/blocks/clientsListIndividualColumns.tsx';
import { useClientsListLegalColumns } from '@/pages/clients/clients-list/components/blocks/clientsListLegalColumns.tsx';

type ClientType = 'individual' | 'legal';
type Client = FakeIndividualClient | FakeLegalClient;

export const ClientsListContent = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [clientType, setClientType] = useState<ClientType>('individual');
  const columnsIndividual = useClientsListIndividualColumns({ setReload });
  const columnsLegal = useClientsListLegalColumns({ setReload });
  useEffect(() => {
    setIsLoading(true);
    const loadMockClients = () => {
      if (clientType === 'individual') {
        setClients(fakeClientsIndividualMock);
      } else {
        setClients(fakeLegalClientsMock);
      }
      setIsLoading(false);
    };

    const timeout = setTimeout(loadMockClients, 500);
    return () => clearTimeout(timeout);
  }, [reload, clientType]);

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);

    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} are selected.`, {
        description: `Selected row IDs: ${selectedRowIds}`,
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo')
        }
      });
    }
  };

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <DataGrid
        columns={clientType === 'individual' ? columnsIndividual : columnsLegal}
        data={isLoading ? [] : clients}
        rowSelection={true}
        onRowSelectionChange={handleRowSelection}
        pagination={{ size: 10 }}
        sorting={[{ id: 'id', desc: false }]}
        toolbar={<ClientsListToolbar clientType={clientType} setClientType={setClientType} />}
        layout={{ card: true }}
        messages={{
          empty: (
            <div className="flex justify-center items-center p-5">
              <CircularProgress />
            </div>
          )
        }}
      />
    </div>
  );
};
