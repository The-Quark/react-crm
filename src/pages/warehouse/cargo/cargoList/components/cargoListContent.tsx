/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getCargo } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { useState } from 'react';
import { CargoToolbar } from '@/pages/warehouse/cargo/cargoList/components/blocks/cargoToolbar.tsx';
import { useCargoColumns } from '@/pages/warehouse/cargo/cargoList/components/blocks/cargoColumns.tsx';
import { CargoModal } from '@/pages/warehouse/cargo/cargoList/components/blocks/cargoModal.tsx';

export const CargoListContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['cargo'],
    queryFn: () => getCargo(),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const columns = useCargoColumns({
    onRowClick: (id) => {
      setSelectedId(id);
      setIsModalOpen(true);
    }
  });

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      {isLoading ? (
        <SharedLoading />
      ) : (
        <DataGrid
          columns={columns}
          data={data?.result}
          rowSelection={true}
          pagination={{ size: 15 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<CargoToolbar />}
          layout={{ card: true }}
        />
      )}
      <CargoModal open={isModalOpen} id={selectedId} handleClose={() => setIsModalOpen(false)} />
    </Container>
  );
};
