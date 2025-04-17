/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { RowSelectionState } from '@tanstack/react-table';
import { DataGrid } from '@/components';
import { toast } from 'sonner';
import { CircularProgress } from '@mui/material';
import { Language } from '@/api/getLanguages/types.ts';
import { getLanguages } from '@/api/getLanguages';
import { useLanguagesColumns } from '@/pages/guides/languages/components/blocks/languagesColumns.tsx';
import { LanguagesToolbar } from '@/pages/guides/languages/components/blocks/languagesToolbar.tsx';

export const GuidesLanguagesContent = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const columns = useLanguagesColumns({ setReload });

  useEffect(() => {
    setIsLoading(true);
    getLanguages()
      .then((languages) => {
        setLanguages(languages.result);
      })
      .catch((error) => {
        console.error('Error fetching languages:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [reload]);

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

  return (
    <div className="grid gap-5 lg:gap-7.5">
      <DataGrid
        columns={columns}
        data={isLoading ? [] : languages}
        rowSelection={true}
        onRowSelectionChange={handleRowSelection}
        pagination={{ size: 10 }}
        sorting={[{ id: 'id', desc: false }]}
        toolbar={<LanguagesToolbar />}
        layout={{ card: true }}
        messages={{
          empty: (
            <div className="flex justify-center items-center p-5">
              <CircularProgress />
            </div>
          )
        }}
      />
    </div>
  );
};
