/* eslint-disable prettier/prettier */
import { DataGrid } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { useVehiclesColumns } from '@/pages/guides/tabs/vehicles/components/blocks/vehiclesColumns.tsx';
import { VehiclesToolbar } from '@/pages/guides/tabs/vehicles/components/blocks/vehiclesToolbar.tsx';
import { getVehicles } from '@/api';
import GuidesError from '@/pages/guides/components/guidesError.tsx';
import GuidesLoading from '@/pages/guides/components/guidesLoading.tsx';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';

export const GuidesVehiclesContent = () => {
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => getVehicles(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
  const columns = useVehiclesColumns({ setReload: () => refetch() });

  if (isError) {
    return <GuidesError error={error} />;
  }

  return (
    <>
      {isLoading ? (
        <GuidesLoading />
      ) : (
        <DataGrid
          columns={columns}
          data={data?.result}
          rowSelection={true}
          onRowSelectionChange={handleRowSelection}
          pagination={{ size: 10 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<VehiclesToolbar setReload={() => refetch()} />}
          layout={{ card: true }}
        />
      )}
    </>
  );
};
