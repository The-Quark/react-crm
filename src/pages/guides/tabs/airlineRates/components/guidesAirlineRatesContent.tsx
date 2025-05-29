/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getAirlineRates } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useAirlineRatesColumns } from '@/pages/guides/tabs/airlineRates/components/blocks/airlineRatesColumns.tsx';
import { AirlineRatesToolbar } from '@/pages/guides/tabs/airlineRates/components/blocks/airlineRatesToolbar.tsx';

export const GuidesAirlineRatesContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['guidesAirlineRates'],
    queryFn: () => getAirlineRates(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
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
          pagination={{ size: 15 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<AirlineRatesToolbar />}
          layout={{ card: true }}
          messages={{
            empty: isLoading && <SharedLoading simple />
          }}
        />
      )}
    </Container>
  );
};
