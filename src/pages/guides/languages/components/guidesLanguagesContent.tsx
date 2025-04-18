/* eslint-disable prettier/prettier */
import { RowSelectionState } from '@tanstack/react-table';
import { DataGrid } from '@/components';
import { toast } from 'sonner';
import { CircularProgress } from '@mui/material';
import { getLanguages } from '@/api/get/getLanguages';
import { useLanguagesColumns } from '@/pages/guides/languages/components/blocks/languagesColumns.tsx';
import { LanguagesToolbar } from '@/pages/guides/languages/components/blocks/languagesToolbar.tsx';
import { useQuery } from '@tanstack/react-query';

export const GuidesLanguagesContent = () => {
  const {
    data: languages,
    isLoading,
    refetch,
    isError,
    error
  } = useQuery({
    queryKey: ['languages'],
    queryFn: () => getLanguages(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
  const columns = useLanguagesColumns({ setReload: () => refetch() });

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
          Error loading languages: {error instanceof Error ? error.message : 'Unknown error'}
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
          data={languages?.result}
          rowSelection={true}
          onRowSelectionChange={handleRowSelection}
          pagination={{ size: 10 }}
          sorting={[{ id: 'id', desc: false }]}
          toolbar={<LanguagesToolbar setReload={() => refetch()} />}
          layout={{ card: true }}
        />
      )}
    </>
  );
};
