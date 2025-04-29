/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { useVehiclesColumns } from '@/pages/guides/tabs/vehicles/components/blocks/vehiclesColumns.tsx';
import { VehiclesToolbar } from '@/pages/guides/tabs/vehicles/components/blocks/vehiclesToolbar.tsx';
import { getVehicles } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';

export const GuidesVehiclesContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => getVehicles()
  });
  const columns = useVehiclesColumns();

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
          onRowSelectionChange={handleRowSelection}
          pagination={{ size: 10 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<VehiclesToolbar />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
