/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getAirlines } from '@/api';
import { useAirlinesColumns } from '@/pages/guides/tabs/airlines/components/blocks/airlinesColumns.tsx';
import { AirlinesToolbar } from '@/pages/guides/tabs/airlines/components/blocks/airlinesToolbar.tsx';
import { SharedError, SharedLoading } from '@/partials/sharedUI';

export const GuidesAirlinesContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['guidesAirlines'],
    queryFn: () => getAirlines(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
  const columns = useAirlinesColumns();

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
          toolbar={<AirlinesToolbar />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
