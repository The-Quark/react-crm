/* eslint-disable prettier/prettier */
import { RowSelectionState } from '@tanstack/react-table';
import { DataGrid } from '@/components';
import { toast } from 'sonner';
import { CircularProgress } from '@mui/material';
import { getSources } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { useSourcesColumns } from '@/pages/guides/sources/components/blocks/sourcesColumns.tsx';
import { SourcesToolbar } from '@/pages/guides/sources/components/blocks/sourcesToolbar.tsx';

export const GuidesSourcesContent = () => {
  const {
    data: sources,
    isLoading,
    refetch,
    isError,
    error
  } = useQuery({
    queryKey: ['sources'],
    queryFn: () => getSources(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
  const columns = useSourcesColumns({ setReload: () => refetch() });

  const handleRowSelection = (state: RowSelectionState) => {
    const selectedRowIds = Object.keys(state);

    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} are selected.`, {
        description: `Selected row IDs: ${selectedRowIds}`,
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo')
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="card flex justify-center items-center p-5">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card flex justify-center items-center p-5 text-red-500">
        <span>
          Error loading sources: {error instanceof Error ? error.message : 'Unknown error'}
        </span>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className="card flex justify-center items-center p-5">
          <CircularProgress />
        </div>
      ) : (
        <DataGrid
          columns={columns}
          data={sources?.result}
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
