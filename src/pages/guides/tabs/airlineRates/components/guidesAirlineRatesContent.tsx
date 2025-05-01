/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getAirlineRates } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';
import { useAirlineRatesColumns } from '@/pages/guides/tabs/airlineRates/components/blocks/airlineRatesColumns.tsx';
import { AirlineRatesToolbar } from '@/pages/guides/tabs/airlineRates/components/blocks/airlineRatesToolbar.tsx';

export const GuidesAirlineRatesContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['guidesAirlineRates'],
    queryFn: () => getAirlineRates()
  });
  const columns = useAirlineRatesColumns();

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
          toolbar={<AirlineRatesToolbar />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
