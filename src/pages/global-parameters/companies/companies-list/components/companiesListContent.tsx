/* eslint-disable prettier/prettier */
import { Container, DataGrid } from '@/components';
import { getGlobalParameters } from '@/api/get';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { CompaniesToolbar } from '@/pages/global-parameters/companies/companies-list/components/blocks/companiesToolbar.tsx';
import { useParametersColumns } from '@/pages/global-parameters/companies/companies-list/components/blocks/companiesColumns.tsx';

export const CompaniesListContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['global-parameters'],
    queryFn: () => getGlobalParameters(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
  const columns = useParametersColumns();

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <div className="grid gap-5 lg:gap-7.5">
        <DataGrid
          columns={columns}
          data={data?.result}
          rowSelection={true}
          pagination={{ size: 15 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<CompaniesToolbar />}
          layout={{ card: true }}
          messages={{
            empty: isLoading && <SharedLoading simple />
          }}
        />
      </div>
    </Container>
  );
};
