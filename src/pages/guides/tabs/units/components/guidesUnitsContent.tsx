/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getUnits } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useUnitsColumns } from '@/pages/guides/tabs/units/components/blocks/unitsColumns.tsx';
import { UnitsToolbar } from '@/pages/guides/tabs/units/components/blocks/unitsToolbar.tsx';

export const GuidesUnitsContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['guidesUnits'],
    queryFn: () => getUnits(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const columns = useUnitsColumns();

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
          toolbar={<UnitsToolbar />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
