/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getCountries } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';
import { CountriesToolbar } from '@/pages/guides/tabs/countries/components/blocks/countriesToolbar.tsx';
import { useCountriesColumns } from '@/pages/guides/tabs/countries/components/blocks/countriesColumns.tsx';

export const GuidesCountriesContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['countries'],
    queryFn: () => getCountries('iso2,phone_code,currency,timezones'),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const columns = useCountriesColumns();

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
          data={data?.data}
          rowSelection={true}
          onRowSelectionChange={handleRowSelection}
          pagination={{ size: 10 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<CountriesToolbar />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
