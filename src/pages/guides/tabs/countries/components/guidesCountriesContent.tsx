/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getCountries } from '@/api';
import { SharedLoading, SharedError } from '@/partials/sharedUI';
import { CountriesToolbar } from '@/pages/guides/tabs/countries/components/blocks/countriesToolbar.tsx';
import { useCountriesColumns } from '@/pages/guides/tabs/countries/components/blocks/countriesColumns.tsx';

export const GuidesCountriesContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['guidesCountries'],
    queryFn: () => getCountries('iso2,phone_code,currency,timezones'),
    staleTime: Infinity
  });

  const columns = useCountriesColumns();

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <DataGrid
        columns={columns}
        data={data?.data}
        rowSelection={true}
        pagination={{ size: 15 }}
        sorting={[{ id: 'id', desc: false }]}
        toolbar={<CountriesToolbar />}
        layout={{ card: true }}
        messages={{
          empty: isLoading && <SharedLoading simple />
        }}
      />
    </Container>
  );
};
