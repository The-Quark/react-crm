/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { getCitiesByCountryCode, getCountries } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';
import { CitiesToolbar } from '@/pages/guides/tabs/cities/components/blocks/citiesToolbar.tsx';
import { useState } from 'react';
import { useCitiesColumns } from '@/pages/guides/tabs/cities/components/blocks/citiesColumns.tsx';

export const GuidesCitiesContent = () => {
  const getDefaultCountryCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('country') || 'US';
  };
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountryCode());
  const {
    data: countriesData,
    isLoading: countriesLoading,
    isError: countriesIsError,
    error: countriesError
  } = useQuery({
    queryKey: ['countries'],
    queryFn: () => getCountries('id,iso2,name'),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const {
    data: citiesData,
    isLoading: citiesLoading,
    isError: citiesIsError,
    error: citiesError
  } = useQuery({
    queryKey: ['cities', selectedCountry],
    queryFn: () => getCitiesByCountryCode(selectedCountry, 'iso2'),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    window.history.pushState(null, '', `?country=${countryCode}`);
  };

  const columns = useCitiesColumns();

  if (countriesIsError || citiesIsError) {
    return <SharedError error={countriesError || citiesError} />;
  }

  return (
    <Container>
      {countriesLoading || citiesLoading ? (
        <SharedLoading />
      ) : (
        <DataGrid
          columns={columns}
          data={citiesData?.data[0].cities || []}
          rowSelection={true}
          onRowSelectionChange={handleRowSelection}
          pagination={{ size: 10 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={
            <CitiesToolbar
              currentCountry={selectedCountry}
              countries={countriesData?.data || []}
              onCountryChange={handleCountryChange}
            />
          }
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
