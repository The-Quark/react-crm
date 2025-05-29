/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { useVehiclesColumns } from '@/pages/guides/tabs/vehicles/components/blocks/vehiclesColumns.tsx';
import { VehiclesToolbar } from '@/pages/guides/tabs/vehicles/components/blocks/vehiclesToolbar.tsx';
import { getVehicles } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

export const GuidesVehiclesContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['guidesVehicles'],
    queryFn: () => getVehicles(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
  const columns = useVehiclesColumns();

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <DataGrid
        columns={columns}
        data={data?.result}
        rowSelection={true}
        pagination={{ size: 15 }}
        sorting={[{ id: 'id', desc: false }]}
        toolbar={<VehiclesToolbar />}
        layout={{ card: true }}
        messages={{
          empty: isLoading && <SharedLoading simple />
        }}
      />
    </Container>
  );
};
