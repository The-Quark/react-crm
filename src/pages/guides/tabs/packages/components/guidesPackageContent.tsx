/* eslint-disable prettier/prettier */
import { DataGrid } from '@/components';
import { getLanguages } from '@/api';
import { useLanguagesColumns } from '@/pages/guides/tabs/languages/components/blocks/languagesColumns.tsx';
import { useQuery } from '@tanstack/react-query';
import { PackagesToolbar } from '@/pages/guides/tabs/packages/components/blocks/packagesToolbar.tsx';
import GuidesLoading from '@/pages/guides/components/guidesLoading.tsx';
import GuidesError from '@/pages/guides/components/guidesError.tsx';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';

export const GuidesPackagesContent = () => {
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['packages'],
    queryFn: () => getLanguages(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
  const columns = useLanguagesColumns({ setReload: () => refetch() });

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
          toolbar={<PackagesToolbar setReload={() => refetch()} />}
          layout={{ card: true }}
        />
      )}
    </>
  );
};
