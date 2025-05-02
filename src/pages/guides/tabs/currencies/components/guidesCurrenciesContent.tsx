/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { CurrenciesToolbar } from '@/pages/guides/tabs/currencies/components/blocks/currenciesToolbar.tsx';
import { useCurrenciesColumns } from '@/pages/guides/tabs/currencies/components/blocks/currenciesColumns.tsx';
import { getCurrencies } from '@/api';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';

export const GuidesCurrenciesContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['guidesCurrencies'],
    queryFn: () => getCurrencies(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const columns = useCurrenciesColumns();

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
          toolbar={<CurrenciesToolbar />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
