/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getGlobalParamsPositions } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { usePositionsColumns } from '@/pages/global-parameters/positions/positions-list/components/blocks/positionsColumns.tsx';
import { PositionsToolbar } from '@/pages/global-parameters/positions/positions-list/components/blocks/positionsToolbar.tsx';

export const PositionsListContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['globalParamsPositions'],
    queryFn: () => getGlobalParamsPositions(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const columns = usePositionsColumns();

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
          toolbar={<PositionsToolbar />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
