/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getLanguages } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { PackagesToolbar } from '@/pages/guides/tabs/packages/components/blocks/packagesToolbar.tsx';
import GuidesLoading from '@/pages/guides/components/guidesLoading.tsx';
import GuidesError from '@/pages/guides/components/guidesError.tsx';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';
import { usePackagesColumns } from '@/pages/guides/tabs/packages/components/blocks/packagesColumns.tsx';

export const GuidesPackagesContent = () => {
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['packages'],
    queryFn: () => getLanguages(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
  const columns = usePackagesColumns({ setReload: () => refetch() });

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
          toolbar={<PackagesToolbar setReload={() => refetch()} />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
