/* eslint-disable prettier/prettier */
import { DataGrid, Container } from '@/components';
import { getPackageMaterials } from '@/api';
import { useQuery } from '@tanstack/react-query';
import GuidesError from '@/pages/guides/components/guidesError.tsx';
import GuidesLoading from '@/pages/guides/components/guidesLoading.tsx';
import { handleRowSelection } from '@/pages/guides/components/guidesHandlers.ts';
import { usePackageMaterialsColumns } from '@/pages/guides/tabs/packageMaterials/components/blocks/packageMaterialsColumns.tsx';
import { PackageMaterialsToolbar } from '@/pages/guides/tabs/packageMaterials/components/blocks/packageMaterialsToolbar.tsx';

export const GuidesPackageMaterialsContent = () => {
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['packageMaterials'],
    queryFn: () => getPackageMaterials(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
  const columns = usePackageMaterialsColumns({ setReload: () => refetch() });

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
          toolbar={<PackageMaterialsToolbar setReload={() => refetch()} />}
          layout={{ card: true }}
        />
      )}
    </Container>
  );
};
