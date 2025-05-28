/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getGlobalParamsSubdivisions } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { SharedError, SharedLoading } from '@/partials/sharedUI';
import { useSubdivisionsColumns } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/blocks/subdivisionsColumns.tsx';
import { SubdivisionToolbar } from '@/pages/global-parameters/subdivisions/subdivisions-list/components/blocks/subdivisionsToolbar.tsx';

export const SubdivisionsListContent = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['globalParamsSubdivisions'],
    queryFn: () => getGlobalParamsSubdivisions(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });

  const columns = useSubdivisionsColumns();

  if (isError) {
    return <SharedError error={error} />;
  }

  return (
    <Container>
      <DataGrid
        columns={columns}
        data={data?.result}
        rowSelection={true}
        pagination={{ size: 15 }}
        sorting={[{ id: 'id', desc: false }]}
        toolbar={<SubdivisionToolbar />}
        layout={{ card: true }}
        messages={{
          empty: isLoading && <SharedLoading simple />
        }}
      />
    </Container>
  );
};
