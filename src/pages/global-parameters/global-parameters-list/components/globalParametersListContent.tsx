/* eslint-disable prettier/prettier */
import { Container, DataGrid } from '@/components';
import { getGlobalParameters } from '@/api/get';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { ParametersToolbar } from '@/pages/global-parameters/global-parameters-list/components/blocks/parametersToolbar.tsx';
import { useParametersColumns } from '@/pages/global-parameters/global-parameters-list/components/blocks/parametersColumns.tsx';

export const GlobalParametersListContent = () => {
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
        {isLoading ? (
          <SharedLoading />
        ) : (
          <DataGrid
            columns={columns}
            data={data?.result}
            rowSelection={true}
            pagination={{ size: 15 }}
            sorting={[{ id: 'id', desc: false }]}
            toolbar={<ParametersToolbar />}
            layout={{ card: true }}
          />
        )}
      </div>
    </Container>
  );
};
