/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { CurrenciesToolbar } from '@/pages/guides/tabs/currencies/components/blocks/currenciesToolbar.tsx';
import { useCurrenciesColumns } from '@/pages/guides/tabs/currencies/components/blocks/currenciesColumns.tsx';
import { getCurrencies } from '@/api';
import GuidesError from '@/pages/guides/components/guidesError.tsx';
import GuidesLoading from '@/pages/guides/components/guidesLoading.tsx';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';

export const GuidesCurrenciesContent = () => {
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['currencies'],
    queryFn: () => getCurrencies(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const columns = useCurrenciesColumns({ setReload: () => refetch() });

  if (isError) {
    return <GuidesError error={error} />;
  }

  return (
    <Container>
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
          toolbar={<CurrenciesToolbar setReload={() => refetch()} />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
