/* eslint-disable prettier/prettier */
import { DataGrid } from '@/components';
import { getSources } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { useSourcesColumns } from '@/pages/guides/tabs/sources/components/blocks/sourcesColumns.tsx';
import { SourcesToolbar } from '@/pages/guides/tabs/sources/components/blocks/sourcesToolbar.tsx';
import GuidesError from '@/pages/guides/components/guidesError.tsx';
import GuidesLoading from '@/pages/guides/components/guidesLoading.tsx';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';

export const GuidesSourcesContent = () => {
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['sources'],
    queryFn: () => getSources(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
  const columns = useSourcesColumns({ setReload: () => refetch() });

  if (isError) {
    return <GuidesError error={error} />;
  }

  return (
    <>
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
          toolbar={<SourcesToolbar setReload={() => refetch()} />}
          layout={{ card: true }}
        />
      )}
    </>
  );
};
